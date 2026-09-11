import { test, expect } from '@playwright/test';
import { dataCode, pokeapiFixtures, installExtension } from './helpers.js';

const isLive = () =>
    process.env.LIVE === '1' || test.info().project.name === 'live';

// data.js assigns onto window; evaluate it against a plain object
const dataCtx = {};
new Function(dataCode.replace(/window\./g, 'this.')).call(dataCtx);
const { badnames, replacements, missingPokeApi } = dataCtx;
const missingSet = new Set(missingPokeApi);

// every route the extension can build from its own tables, minus the
// ones it deliberately sends to chiy.uk
async function pokeapiRoutes(page) {
    await installExtension(page);
    const routes = await page.evaluate((names) =>
        names.map(n => window.ext.encodeName(n)),
        [...Object.values(badnames), ...replacements]);
    return [...new Set(routes)].filter(r => !missingSet.has(r));
}

// Throttled concurrent fetch
async function batchFetch(items, fn, concurrency = 4) {
    const results = [];
    let i = 0;
    async function worker() {
        while (i < items.length) {
            const idx = i++;
            results[idx] = await fn(items[idx]);
        }
    }
    await Promise.all(Array.from({ length: concurrency }, worker));
    return results;
}

test.describe('live upstream contracts', () => {
    test.beforeEach(({ }, testInfo) => {
        if (!isLive()) test.skip();
    });

    test.describe('PokeAPI shape', () => {
        const sampleRoutes = ['garchomp', 'ceruledge', 'arcanine-hisui', 'alakazam'];

        for (const route of sampleRoutes) {
            test(`${route} has expected shape`, async () => {
                const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${route}`);
                expect(res.ok).toBe(true);
                const data = await res.json();

                // types array with slot and type.name
                for (const t of data.types) {
                    expect(typeof t.slot).toBe('number');
                    expect(typeof t.type.name).toBe('string');
                }

                // official artwork
                const oa = data.sprites.other['official-artwork'];
                expect(typeof oa.front_default).toBe('string');
                expect(typeof oa.front_shiny).toBe('string');
            });
        }

        test('alakazam has all GEN_LOOKUP version paths', async ({ page }) => {
            // Extract GEN_LOOKUP from data.js in a page to stay in sync
            await page.goto('about:blank');
            const genLookup = await page.evaluate((code) => {
                eval(code);
                return window.GEN_LOOKUP;
            }, dataCode);

            const res = await fetch('https://pokeapi.co/api/v2/pokemon/alakazam');
            const data = await res.json();

            // gen 1: yellow.front_transparent
            const g1 = genLookup[1];
            expect(data.sprites.versions[g1.gen][g1.game].front_transparent).toBeTruthy();

            // gen 2: crystal.front_shiny_transparent
            const g2 = genLookup[2];
            expect(data.sprites.versions[g2.gen][g2.game].front_shiny_transparent).toBeTruthy();

            // gen 3: emerald.front_default
            const g3 = genLookup[3];
            expect(data.sprites.versions[g3.gen][g3.game].front_default).toBeTruthy();

            // gen 4: platinum.front_default
            const g4 = genLookup[4];
            expect(data.sprites.versions[g4.gen][g4.game].front_default).toBeTruthy();

            // gen 5: black-white.animated.front_default
            const g5 = genLookup[5];
            const g5sprites = data.sprites.versions[g5.gen][g5.game];
            expect(g5.animated ? g5sprites.animated.front_default : g5sprites.front_default).toBeTruthy();
        });
    });

    test.describe('fixture drift', () => {
        const nonErrorFixtures = Object.entries(pokeapiFixtures)
            .filter(([, data]) => !data.error);

        test(`all ${nonErrorFixtures.length} fixtures match upstream`, async () => {
            test.setTimeout(120_000);
            const failures = [];

            await batchFetch(nonErrorFixtures, async ([route, fixture]) => {
                try {
                    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${route}`);
                    if (!res.ok) {
                        failures.push(`${route}: HTTP ${res.status} (rerun: node fetch-pokeapi.js)`);
                        return;
                    }
                    const data = await res.json();

                    // types must deep-equal
                    const typesMatch = JSON.stringify(data.types) === JSON.stringify(fixture.types);
                    if (!typesMatch) {
                        failures.push(`${route}: types changed (rerun: node fetch-pokeapi.js)`);
                    }

                    // official artwork front_default must match
                    const oa = data.sprites?.other?.['official-artwork'];
                    if (oa?.front_default !== fixture.sprites?.other?.['official-artwork']?.front_default) {
                        failures.push(`${route}: front_default artwork changed (rerun: node fetch-pokeapi.js)`);
                    }
                } catch (e) {
                    failures.push(`${route}: ${e.message} (rerun: node fetch-pokeapi.js)`);
                }
            }, 4);

            expect(failures, failures.join('\n')).toEqual([]);
        });
    });

    test.describe('route validity', () => {
        // upstream availability as of authoring; a change here means the
        // extension's data tables or fallbacks need a look
        const KNOWN_404 = [
            'greninja-bond',
            'meowstic-mega',
            'sinistcha-masterpiece',
        ];

        test('404 set matches known list', async ({ page }) => {
            test.setTimeout(120_000);
            const routes = await pokeapiRoutes(page);
            const got404 = [];

            await batchFetch(routes, async (route) => {
                const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${route}`, { method: 'HEAD' });
                if (res.status === 404) got404.push(route);
            }, 4);

            expect(got404.sort()).toEqual(KNOWN_404);
        });
    });

    test.describe('chiy.uk', () => {
        for (const [desc, url] of [
            ['256/garchomp', 'https://chiy.uk/256/garchomp'],
            ['256/arceus-fire', 'https://chiy.uk/256/arceus-fire'],
            ['full/garchomp', 'https://chiy.uk/full/garchomp'],
        ]) {
            test(`HEAD ${desc} returns 200 image`, async () => {
                const res = await fetch(url, { method: 'HEAD' });
                expect(res.status).toBe(200);
                expect(res.headers.get('content-type')).toMatch(/^image\//);
            });
        }
    });

    test.describe('pokepast.es', () => {
        test('POST paste returns html with articles and format', async () => {
            const paste = [
                'Garchomp @ Life Orb',
                'Ability: Rough Skin',
                'EVs: 252 Atk / 4 SpD / 252 Spe',
                'Jolly Nature',
                '- Earthquake',
                '- Outrage',
                '- Swords Dance',
                '- Stone Edge',
                '',
                'Ceruledge @ Focus Sash',
                'Ability: Weak Armor',
                'EVs: 252 Atk / 4 SpD / 252 Spe',
                'Adamant Nature',
                '- Bitter Blade',
                '- Shadow Sneak',
                '- Swords Dance',
                '- Close Combat',
            ].join('\r\n');

            const params = new URLSearchParams();
            params.append('paste', paste);
            params.append('author', 'pokepastefix-test');
            params.append('title', 'live-spec');
            params.append('notes', 'Format: gen1ou');

            const res = await fetch('https://pokepast.es/create', {
                method: 'POST',
                body: params.toString(),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                redirect: 'follow',
            });
            expect(res.ok).toBe(true);

            const html = await res.text();
            // two pokemon = two articles
            const articleCount = (html.match(/<article>/g) || []).length;
            expect(articleCount).toBe(2);
            // aside contains the format
            expect(html).toContain('<p>Format: gen1ou</p>');
        });
    });
});
