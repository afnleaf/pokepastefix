import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from '@playwright/test';

// Snapshots the PokeAPI responses the offline suite needs into
// fixtures/pokeapi/<route>.json. Routes are derived by running the
// extension's own parser over html/*.html so the set stays in sync with
// the pastes. Only the fields content.js reads are kept.
// Usage: node fetch-pokeapi.js [route ...]

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, 'fixtures', 'pokeapi');
fs.mkdirSync(outDir, { recursive: true });

async function collectRoutes() {
    const dataCode = fs.readFileSync(path.join(__dirname, '../Extension/data.js'), 'utf-8');
    const contentCode = fs.readFileSync(path.join(__dirname, '../Extension/content.js'), 'utf-8')
        .replace(/browser\.storage\.sync\.get[\s\S]*?\}\);/, '');
    const htmlDir = path.join(__dirname, 'html');
    const files = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html'));

    const browser = await chromium.launch();
    const page = await browser.newPage();
    const routes = new Set();
    for (const f of files) {
        await page.setContent(fs.readFileSync(path.join(htmlDir, f), 'utf-8'));
        const found = await page.evaluate(([d, c]) => {
            eval(d); eval(c);
            return [...document.querySelectorAll('article pre')].map(pre =>
                encodeName(parsePokemonInfo(getFirstLine(pre).toLowerCase()).name));
        }, [dataCode, contentCode]);
        found.forEach(r => routes.add(r));
    }
    await browser.close();
    return [...routes].filter(r => r && !r.startsWith('arceus-')).sort();
}

async function snapshot(route) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${route}`);
    let body;
    if (res.ok) {
        const { id, name, types, sprites } = await res.json();
        body = { id, name, types, sprites };
    } else {
        body = { error: `PokeAPI error: ${res.status}` };
    }
    fs.writeFileSync(path.join(outDir, `${route}.json`), JSON.stringify(body, null, 1) + '\n');
    console.log(`${res.status} ${route}`);
}

const routes = process.argv.length > 2 ? process.argv.slice(2) : await collectRoutes();
console.log(`Snapshotting ${routes.length} route(s)...`);
for (let i = 0; i < routes.length; i += 4) {
    await Promise.all(routes.slice(i, i + 4).map(snapshot));
}
