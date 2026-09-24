import { test, expect } from '@playwright/test';
import {
    readHtml,
    pokeapiFixtures,
    installExtension,
    runMain,
    articleStates,
} from './helpers.js';


// -- fixture-derived sprite accessors ------------------------------------

const GEN_SPRITE = {
    1: (s) =>
        s.versions['generation-i'].yellow.front_transparent,
    2: (s, shiny) =>
        s.versions['generation-ii'].crystal[
            shiny
                ? 'front_shiny_transparent'
                : 'front_transparent'
        ],
    3: (s, shiny) =>
        s.versions['generation-iii'].emerald[
            shiny ? 'front_shiny' : 'front_default'
        ],
    4: (s, shiny) =>
        s.versions['generation-iv'].platinum[
            shiny ? 'front_shiny' : 'front_default'
        ],
    5: (s, shiny) =>
        s.versions['generation-v']['black-white'].animated[
            shiny ? 'front_shiny' : 'front_default'
        ],
};

// -- edgecase -----------------------------------------------------------

test.describe('edgecase.html', () => {
    const html = readHtml('edgecase.html');

    test('shiny=follow [0,0,1,0]', async ({ page }) => {
        await installExtension(page, { html });
        await runMain(page, [0, 0, 1, 0]);
        const states = await articleStates(page);
        expect(states).toHaveLength(7);

        const ogerponF =
            pokeapiFixtures['ogerpon-cornerstone-mask'];
        expect(states[0].src).toBe(
            ogerponF.sprites.other['official-artwork']
                .front_default
        );
        // literal anchor
        expect(states[0].src).toBe(
            'https://raw.githubusercontent.com/PokeAPI/'
            + 'sprites/master/sprites/pokemon/other/'
            + 'official-artwork/10275.png'
        );
        expect(states[0].addedSpans).toEqual([
            { type: 'grass', text: 'Ogerpon-Cornerstone' },
        ]);
        expect(states[0].items).toEqual([
            'https://chiy.uk/items/cornerstone-mask',
        ]);

        // article.innerText only yields the set line here when
        // paste.css is applied; without it the img-item whitespace
        // becomes the first line
        const arcanineF =
            pokeapiFixtures['arcanine-hisui'];
        expect(states[1].src).toBe(
            arcanineF.sprites.other['official-artwork']
                .front_shiny
        );
        expect(states[1].src).toBe(
            'https://raw.githubusercontent.com/PokeAPI/'
            + 'sprites/master/sprites/pokemon/other/'
            + 'official-artwork/shiny/10230.png'
        );
        expect(states[1].addedSpans).toEqual([
            { type: 'fire', text: 'Arcanine-Hisui' },
        ]);
        expect(states[1].items).toEqual([
            '/img/items/238.png',
        ]);

        const volcaronaF = pokeapiFixtures['volcarona'];
        expect(states[2].src).toBe(
            volcaronaF.sprites.other['official-artwork']
                .front_shiny
        );
        expect(states[2].src).toBe(
            'https://raw.githubusercontent.com/PokeAPI/'
            + 'sprites/master/sprites/pokemon/other/'
            + 'official-artwork/shiny/637.png'
        );
        expect(states[2].addedSpans).toEqual([]);

        const ceruledgeF = pokeapiFixtures['ceruledge'];
        expect(states[3].src).toBe(
            ceruledgeF.sprites.other['official-artwork']
                .front_shiny
        );
        expect(states[3].addedSpans).toEqual([]);

        expect(states[4].src).toBe('/img/pokemon/876-0.png');
        expect(states[4].addedSpans).toEqual([]);

        expect(states[5].src).toBe('/img/pokemon/567-0.png');
        expect(states[5].addedSpans).toEqual([]);

        expect(states[6].src).toBe('/img/pokemon/373-0.png');
        expect(states[6].addedSpans).toEqual([]);

        const calls = await page.evaluate(
            () => window.__pokeapi.calls
        );
        expect(calls).toEqual([
            'ogerpon-cornerstone-mask',
            'arcanine-hisui',
            'volcarona',
            'ceruledge',
        ]);
        const missing = await page.evaluate(
            () => window.__pokeapi.missing
        );
        expect(missing).toEqual([]);
    });

    test(
        'replaceAll, shiny off [0,1,0,0]',
        async ({ page }) => {
            await installExtension(page, { html });
            await runMain(page, [0, 1, 0, 0]);
            const states = await articleStates(page);

            for (const s of states) {
                expect(s.src).not.toBeNull();
            }

            const oa = (route) =>
                pokeapiFixtures[route].sprites
                    .other['official-artwork'].front_default;

            expect(states[0].src).toBe(
                oa('ogerpon-cornerstone-mask')
            );
            expect(states[1].src).toBe(
                oa('arcanine-hisui')
            );
            expect(states[2].src).toBe(oa('volcarona'));
            expect(states[3].src).toBe(oa('ceruledge'));
            // Indeedee fixture is a 404 stub
            expect(states[4].src).toBe(
                'https://chiy.uk/256/indeedee'
            );
            expect(states[5].src).toBe(oa('archeops'));
            expect(states[6].src).toBe(oa('salamence'));

            expect(states[0].addedSpans).toEqual([
                { type: 'grass', text: 'Ogerpon-Cornerstone' },
            ]);
            expect(states[1].addedSpans).toEqual([
                { type: 'fire', text: 'Arcanine-Hisui' },
            ]);
            for (const i of [2, 3, 4, 5, 6]) {
                expect(states[i].addedSpans).toEqual([]);
            }
        },
    );

    test(
        'quality full, shiny forced [1,1,2,0]',
        async ({ page }) => {
            await installExtension(page, { html });
            await runMain(page, [1, 1, 2, 0]);
            const states = await articleStates(page);

            expect(states[4].src).toBe(
                'https://chiy.uk/full/indeedee'
            );

            for (const i of [0, 1, 2, 3, 5, 6]) {
                expect(states[i].src).toContain('/shiny/');
            }
        },
    );
});

// -- genN sprites -----------------------------------------------------------

for (const gen of [1, 2, 3, 4, 5]) {
    test.describe(`gen${gen}.html`, () => {
        const html = readHtml(`gen${gen}.html`);

        test(
            `sprites mode [0,0,0,1]`,
            async ({ page }) => {
                await installExtension(page, { html });
                await runMain(page, [0, 0, 0, 1]);
                const states = await articleStates(page);
                expect(states.length).toBe(6);

                for (const s of states) {
                    const route = await page.evaluate(
                        (fl) => {
                            const info =
                                window.ext.parsePokemonInfo(
                                    fl.toLowerCase()
                                );
                            return window.ext.encodeName(
                                info.name
                            );
                        },
                        s.firstLine,
                    );
                    const fixture = pokeapiFixtures[route];
                    expect(fixture).toBeTruthy();
                    expect(fixture.error).toBeUndefined();

                    const want = GEN_SPRITE[gen](
                        fixture.sprites, false
                    );
                    expect(s.src).toBe(want);

                    expect(s.addedSpans).toEqual([]);
                }
            },
        );

        test(
            `sprites off, no changes [0,0,0,0]`,
            async ({ page }) => {
                await installExtension(page, { html });
                await runMain(page, [0, 0, 0, 0]);
                const states = await articleStates(page);

                // none of the gen pokemon are in
                // replacements, so nothing changes
                for (const s of states) {
                    expect(s.addedSpans).toEqual([]);
                    // src unchanged (pokepaste original)
                    expect(s.src).toMatch(
                        /^\/img\/pokemon\/\d+-\d+\.png$/
                    );
                }
            },
        );
    });
}

test(
    'gen1 shiny forced still uses non-shiny sprite '
    + '(gen1 predates shinies)',
    async ({ page }) => {
        const html = readHtml('gen1.html');
        await installExtension(page, { html });
        await runMain(page, [0, 0, 2, 1]);
        const states = await articleStates(page);

        // gen1 ignores shiny; GEN_SPRITE[1] has no shiny key
        for (const s of states) {
            const route = await page.evaluate(
                (fl) => {
                    const info =
                        window.ext.parsePokemonInfo(
                            fl.toLowerCase()
                        );
                    return window.ext.encodeName(info.name);
                },
                s.firstLine,
            );
            const fixture = pokeapiFixtures[route];
            const want = GEN_SPRITE[1](fixture.sprites);
            expect(s.src).toBe(want);
        }

        // literal anchor for Alakazam (first article)
        expect(states[0].src).toBe(
            'https://raw.githubusercontent.com/PokeAPI/'
            + 'sprites/master/sprites/pokemon/versions/'
            + 'generation-i/yellow/transparent/65.png'
        );
    },
);

// -- test-missing -----------------------------------------------------------

test.describe('test-missing.html', () => {
    const html = readHtml('test-missing.html');

    test(
        'all replacements resolved [0,0,0,0]',
        async ({ page }) => {
            await installExtension(page, { html });
            await runMain(page, [0, 0, 0, 0]);
            const states = await articleStates(page);

            const pokeapiCalls = await page.evaluate(
                () => window.__pokeapi.calls
            );
            const pokeapiMissing = await page.evaluate(
                () => window.__pokeapi.missing
            );
            expect(pokeapiMissing).toEqual([]);

            const missingPokeApi = await page.evaluate(
                () => window.missingPokeApi
            );

            for (const s of states) {
                const species = s.firstLine.trim()
                    .split(' @ ')[0];
                const { name, route } = await page.evaluate(
                    (fl) => {
                        const info =
                            window.ext.parsePokemonInfo(
                                fl.toLowerCase()
                            );
                        const r = window.ext.encodeName(
                            info.name
                        );
                        return { name: info.name, route: r };
                    },
                    s.firstLine,
                );

                const isMissing = await page.evaluate(
                    (n) => window.replacements.has(n),
                    name,
                );

                if (!isMissing) {
                    expect(s.src).toBe(
                        '/img/pokemon/0-0.png'
                    );
                    expect(s.addedSpans).toEqual([]);
                    continue;
                }

                expect(s.src).not.toBe(
                    '/img/pokemon/0-0.png'
                );

                const fixture = pokeapiFixtures[route];
                const is404 = fixture?.error;

                if (missingPokeApi.includes(route)) {
                    expect(s.src).toBe(
                        `https://chiy.uk/256/${route}`
                    );
                    expect(
                        pokeapiCalls
                    ).not.toContain(route);
                    // arceus forms: type = suffix
                    const arcType = route.split('-')[1];
                    expect(s.addedSpans).toEqual([
                        {
                            type: arcType,
                            text: species,
                        },
                    ]);
                } else if (is404) {
                    expect(s.src).toBe(
                        `https://chiy.uk/256/${route}`
                    );
                    expect(s.addedSpans).toEqual([]);
                } else {
                    const oa = fixture.sprites
                        .other['official-artwork'];
                    // pokeapi has no official artwork for these two
                    // yet, so the home render is expected instead
                    const noArtwork = {
                        'tatsugiri-curly-mega':
                            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/10322.png',
                        'tatsugiri-droopy-mega':
                            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/10323.png',
                    };
                    expect(s.src).toBe(
                        noArtwork[route] ?? oa.front_default
                    );
                    const slot1 = fixture.types
                        ?.find(t => t.slot === 1);
                    const type = slot1?.type?.name ?? null;
                    if (type) {
                        expect(s.addedSpans).toEqual([
                            {
                                type,
                                text: species,
                            },
                        ]);
                    }
                }
            }
        },
    );
});

// -- item images ------------------------------------------------------------

test.describe('item images', () => {
    test(
        'edgecase items appended correctly',
        async ({ page }) => {
            const html = readHtml('edgecase.html');
            await installExtension(page, { html });
            await runMain(page, [0, 0, 1, 0]);
            const states = await articleStates(page);

            // Ogerpon: Cornerstone Mask is in items
            expect(states[0].items).toEqual([
                'https://chiy.uk/items/cornerstone-mask',
            ]);
            // Arcanine-Hisui: Hard Stone not in items,
            // pokepaste already had an img-item
            expect(states[1].items).toEqual([
                '/img/items/238.png',
            ]);

            // articles 2-4 have pokepaste items,
            // their item names not in items map
            expect(states[2].items).toEqual([
                '/img/items/650.png',
            ]);
            expect(states[3].items).toEqual([
                '/img/items/275.png',
            ]);
            expect(states[4].items).toEqual([
                '/img/items/270.png',
            ]);

            // Archeops, Salamence: no items
            expect(states[5].items).toEqual([]);
            expect(states[6].items).toEqual([]);
        },
    );

    test(
        'test-missing items for pokemon with mapped items',
        async ({ page }) => {
            const html = readHtml('test-missing.html');
            await installExtension(page, { html });
            await runMain(page, [0, 0, 0, 0]);
            const states = await articleStates(page);

            // get the items map from the page
            const itemsMap = await page.evaluate(
                () => window.items
            );

            for (const s of states) {
                const firstLine = s.firstLine.toLowerCase();
                let item = '';
                if (firstLine.includes('@')) {
                    item = firstLine.split('@')[1].trim();
                }
                if (item && itemsMap[item]) {
                    const expectedRoute = await page.evaluate(
                        (it) => window.ext.encodeName(it),
                        item
                    );
                    expect(s.items).toEqual([
                        `https://chiy.uk/items/${expectedRoute}`,
                    ]);
                }
            }
        },
    );
});
