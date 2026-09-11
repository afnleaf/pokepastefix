import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const dataCode = fs.readFileSync(path.join(__dirname, '../Extension/data.js'), 'utf-8');
// drop the browser.storage entry point so main() only runs when a test calls it
export const contentCode = fs.readFileSync(path.join(__dirname, '../Extension/content.js'), 'utf-8')
    .replace(/browser\.storage\.sync\.get[\s\S]*?\}\);/, '');
export const backgroundCode = fs.readFileSync(path.join(__dirname, '../Extension/background.js'), 'utf-8');

export const htmlDir = path.join(__dirname, 'html');
export const pasteCss = fs.readFileSync(path.join(__dirname, 'fixtures', 'paste.css'), 'utf-8');
export const readHtml = (file) => fs.readFileSync(path.join(htmlDir, file), 'utf-8');

// fixtures/pokeapi/<route>.json: { id, name, types, sprites } or { error }
const fixtureDir = path.join(__dirname, 'fixtures', 'pokeapi');
export const pokeapiFixtures = Object.fromEntries(
    fs.readdirSync(fixtureDir)
        .filter(f => f.endsWith('.json'))
        .map(f => [f.slice(0, -5), JSON.parse(fs.readFileSync(path.join(fixtureDir, f), 'utf-8'))])
);
export const readPokeapiFixture = (route) => pokeapiFixtures[route];

const PNG_1x1 = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
    'base64'
);

// every function content.js defines at top level, exposed as window.ext
const EXPORTS = [
    'resolveHandDrawn', 'resolvePixelSprite', 'fetchPokeApiData', 'getPokeApi', 'getChiyukApi',
    'replaceImage', 'replacePokemon', 'findPokemonNameEnd', 'createTypeSpan', 'getFirstLine',
    'wrapPokemonName', 'appendItemImage', 'encodeName', 'parsePokemonInfo', 'findShinyLine',
    'findFormat', 'chooseImageQuality', 'chooseShiny', 'main',
];

/**
 * Loads html into the page, stubs the WebExtension `browser` API with the
 * PokeAPI fixtures, serves every remote image as a 1x1 PNG (or 404 for
 * urls in `failUrls`), and evals data.js + content.js.
 *
 * After this, in the page:
 *   window.ext.<fn>          every content.js function
 *   window.__pokeapi.calls   routes requested through browser.runtime.sendMessage
 *   window.__pokeapi.missing routes with no fixture file at all
 * Each `article pre` gets data-before = its innerHTML prior to main().
 */
export async function installExtension(page, { html, failUrls = [], pokeapi = pokeapiFixtures } = {}) {
    await page.route(/^https?:\/\//, route => {
        const url = route.request().url();
        if (failUrls.some(f => url.includes(f))) {
            return route.fulfill({ status: 404, body: '' });
        }
        return route.fulfill({ status: 200, contentType: 'image/png', body: PNG_1x1 });
    });
    // fixtures are ~2MB; serving them per route on request keeps the
    // per-test evaluate payload down to the two extension sources.
    // registered last so it takes precedence over the image catch-all
    await page.route(/^https:\/\/fixtures\.local\//, route => {
        const key = decodeURIComponent(new URL(route.request().url()).pathname.slice(1));
        const f = pokeapi[key];
        return f
            ? route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(f) })
            : route.fulfill({ status: 404, body: '' });
    });

    // the extension reads article.innerText, which depends on how
    // pokepaste lays out div.img, so the pages need the real stylesheet
    const styled = (html ?? '<!DOCTYPE html><html><body></body></html>')
        .replace('<link rel="stylesheet" href="/css/paste.css">', `<style>${pasteCss}</style>`);
    await page.setContent(styled);

    await page.evaluate(([data, content, names]) => {
        window.__pokeapi = { calls: [], missing: [] };
        window.browser = {
            runtime: {
                sendMessage: async (message) => {
                    if (message.type !== 'fetchPokeApiData') {
                        return { error: `unknown message type ${message.type}` };
                    }
                    window.__pokeapi.calls.push(message.route);
                    const res = await fetch(`https://fixtures.local/${encodeURIComponent(message.route)}`);
                    if (!res.ok) {
                        window.__pokeapi.missing.push(message.route);
                        return { error: 'PokeAPI error: 404' };
                    }
                    const f = await res.json();
                    if (f.error) return { error: f.error };
                    return { data: f };
                },
            },
            storage: { sync: { get: async (defaults) => defaults } },
        };
        document.querySelectorAll('article pre').forEach(pre => {
            pre.dataset.before = pre.innerHTML;
        });
        eval(data);
        eval(content);
        window.ext = {};
        for (const n of names) window.ext[n] = eval(n);
    }, [dataCode, contentCode, EXPORTS]);
}

// resolves once every .img-pokemon / .img-item has fired load or error
async function settleImages(page) {
    await page.evaluate(() => Promise.all(
        [...document.querySelectorAll('.img-pokemon, .img-item')].map(img =>
            img.complete ? null : new Promise(resolve => {
                img.addEventListener('load', resolve, { once: true });
                img.addEventListener('error', resolve, { once: true });
            })
        )
    ));
}

// options: [imageQuality, replaceAll, shiny, sprites]
export async function runMain(page, options) {
    await page.evaluate((opts) => window.ext.main(...opts), options);
    await settleImages(page);
}

/**
 * Per-article snapshot for assertions:
 *   { firstLine, src, items, addedSpans: [{ type, text }] }
 * addedSpans are span.type-* present now but not in data-before,
 * i.e. spans the extension inserted, ignoring pokepaste's own.
 */
export async function articleStates(page) {
    return page.evaluate(() => {
        const key = (s) => `${s.className}|${s.textContent}`;
        const spansOf = (html) => {
            const tpl = document.createElement('template');
            tpl.innerHTML = html;
            return [...tpl.content.querySelectorAll('span[class^="type-"]')].map(key);
        };
        return [...document.querySelectorAll('article')].map(article => {
            const pre = article.querySelector('pre');
            const before = spansOf(pre.dataset.before);
            const after = [...pre.querySelectorAll('span[class^="type-"]')];
            for (const k of before) {
                const i = after.findIndex(s => key(s) === k);
                if (i !== -1) after.splice(i, 1);
            }
            return {
                firstLine: pre.textContent.split('\n')[0].trim(),
                src: article.querySelector('.img-pokemon')?.getAttribute('src') ?? null,
                items: [...article.querySelectorAll('.img-item')].map(i => i.getAttribute('src')),
                addedSpans: after.map(s => ({ type: s.className.slice(5), text: s.textContent })),
            };
        });
    });
}
