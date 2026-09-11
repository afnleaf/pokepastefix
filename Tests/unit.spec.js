import { test, expect } from '@playwright/test';
import { installExtension, readPokeapiFixture } from './helpers.js';

// pure functions only: one page per worker instead of one per test
let page;
test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await installExtension(page);
});
test.afterAll(() => page.close());
// findFormat tests append their own aside
test.beforeEach(() => page.evaluate(() => {
    document.querySelectorAll('aside').forEach(a => a.remove());
}));

test.describe('encodeName', () => {
    const cases = [
        ['garchomp', 'garchomp'],
        ['Garchomp', 'garchomp'],
        ['Mr. Mime', 'mr-mime'],
        ['Type: Null', 'type-null'],
        ["Farfetch'd", 'farfetchd'],
        ['Nidoran\u2640', 'nidoran-f'],
        ['Nidoran\u2642', 'nidoran-m'],
        ['Flabebe', 'flabebe'],
        ['\u0046lab\u00e9b\u00e9', 'flabebe'],
        ['zygarde-10%', 'zygarde-10'],
        ["sirfetch'd", 'sirfetchd'],
        // unicode curly apostrophe
        ['sirfetch\u2019d', 'sirfetchd'],
        ['great tusk', 'great-tusk'],
        // double hyphens collapse
        ['a--b', 'a-b'],
        // leading/trailing hyphen stripped
        ['-leading', 'leading'],
        ['trailing-', 'trailing'],
        [' spaced ', 'spaced'],
    ];

    for (const [input, expected] of cases) {
        test(`${JSON.stringify(input)} -> ${expected}`, async () => {
            const result = await page.evaluate(
                (n) => window.ext.encodeName(n), input
            );
            expect(result).toBe(expected);
        });
    }
});

test.describe('parsePokemonInfo', () => {
    const cases = [
        ['garchomp', { name: 'garchomp', item: '' }],
        ['Garchomp', { name: 'garchomp', item: '' }],
        ['garchomp @ life orb', { name: 'garchomp', item: 'life orb' }],
        ['Fluffy (Garchomp)', { name: 'garchomp', item: '' }],
        ['Fluffy (Garchomp) (F)', { name: 'garchomp', item: '' }],
        ['Garchomp (M) @ Life Orb', { name: 'garchomp', item: 'life orb' }],
        ['Fluffy (Garchomp) (M) @ Life Orb', { name: 'garchomp', item: 'life orb' }],
        ['  garchomp  ', { name: 'garchomp', item: '' }],
    ];

    for (const [input, expected] of cases) {
        test(`${JSON.stringify(input)}`, async () => {
            const result = await page.evaluate(
                (l) => window.ext.parsePokemonInfo(l), input
            );
            expect(result).toEqual(expected);
        });
    }

    test('every badnames key maps to its value', async () => {
        const badnames = await page.evaluate(() => window.badnames);
        for (const [key, value] of Object.entries(badnames)) {
            const result = await page.evaluate(
                (k) => window.ext.parsePokemonInfo(k), key
            );
            expect(result.name).toBe(value);
        }
    });
});

test.describe('findShinyLine', () => {
    const cases = [
        ['ability: blaze\nshiny: yes\nevs: 4 hp', true],
        ['shiny: yes', true],
        ['shiny: no', false],
        ['ability: blaze\nshiny: no', false],
        ['ability: blaze\nevs: 4 hp', false],
        // shiny at end without trailing newline
        ['ability: blaze\nshiny: yes', true],
        // empty value after colon
        ['shiny: ', false],
        ['shiny:', false],
    ];

    for (const [input, expected] of cases) {
        test(`${JSON.stringify(input)} -> ${expected}`, async () => {
            const result = await page.evaluate(
                (t) => window.ext.findShinyLine(t), input
            );
            expect(result).toBe(expected);
        });
    }
});

test.describe('findFormat', () => {
    test('no aside -> null', async () => {
        const result = await page.evaluate(() => window.ext.findFormat());
        expect(result).toBeNull();
    });

    test('aside without format -> null', async () => {
        await page.evaluate(() => {
            const aside = document.createElement('aside');
            aside.innerText = 'Some random text';
            document.body.appendChild(aside);
        });
        const result = await page.evaluate(() => window.ext.findFormat());
        expect(result).toBeNull();
    });

    for (const gen of [1, 2, 3, 4, 5]) {
        test(`gen${gen}ou -> ${gen}`, async () => {
            await page.evaluate((g) => {
                const aside = document.createElement('aside');
                aside.innerHTML = `<p>Format: gen${g}ou</p>`;
                document.body.appendChild(aside);
            }, gen);
            const result = await page.evaluate(() => window.ext.findFormat());
            expect(result).toBe(gen);
        });
    }

    test('gen9ou -> null (not in GEN_LOOKUP)', async () => {
        await page.evaluate(() => {
            const aside = document.createElement('aside');
            aside.innerHTML = '<p>Format: gen9ou</p>';
            document.body.appendChild(aside);
        });
        const result = await page.evaluate(() => window.ext.findFormat());
        expect(result).toBeNull();
    });

    test('[Gen 4] OU -> null', async () => {
        await page.evaluate(() => {
            const aside = document.createElement('aside');
            aside.innerHTML = '<p>Format: [Gen 4] OU</p>';
            document.body.appendChild(aside);
        });
        // regex /gen(\d+)/ matches "gen4" inside "[Gen 4]" after lowercase
        // "[gen 4] ou" -> no, "gen" is followed by space then "4"
        // actually: "[gen 4] ou" -- /gen(\d+)/ won't match "gen 4" (space)
        const result = await page.evaluate(() => window.ext.findFormat());
        expect(result).toBeNull();
    });

    test('format line followed by other lines', async () => {
        await page.evaluate(() => {
            const aside = document.createElement('aside');
            aside.innerHTML = '<p>Format: gen3uu</p><p>Other info</p>';
            document.body.appendChild(aside);
        });
        const result = await page.evaluate(() => window.ext.findFormat());
        expect(result).toBe(3);
    });
});

test.describe('chooseImageQuality', () => {
    const cases = [
        [0, '256'],
        [1, 'full'],
        [7, '256'],
        [undefined, '256'],
    ];

    for (const [input, expected] of cases) {
        test(`${input} -> ${expected}`, async () => {
            const result = await page.evaluate(
                (q) => window.ext.chooseImageQuality(q), input
            );
            expect(result).toBe(expected);
        });
    }
});

test.describe('chooseShiny', () => {
    test('shiny=0 ignores paste shiny:yes', async () => {
        const result = await page.evaluate(
            () => window.ext.chooseShiny(0, 'shiny: yes')
        );
        expect(result).toBe(false);
    });

    test('shiny=1 follows paste shiny:yes', async () => {
        const result = await page.evaluate(
            () => window.ext.chooseShiny(1, 'shiny: yes')
        );
        expect(result).toBe(true);
    });

    test('shiny=1 follows paste shiny:no', async () => {
        const result = await page.evaluate(
            () => window.ext.chooseShiny(1, 'shiny: no')
        );
        expect(result).toBe(false);
    });

    test('shiny=1 absent shiny line -> false', async () => {
        const result = await page.evaluate(
            () => window.ext.chooseShiny(1, 'ability: blaze')
        );
        expect(result).toBe(false);
    });

    test('shiny=2 always true', async () => {
        const result = await page.evaluate(
            () => window.ext.chooseShiny(2, 'shiny: no')
        );
        expect(result).toBe(true);
    });
});

test.describe('findPokemonNameEnd', () => {
    const cases = [
        ['garchomp @ life orb', 8],
        ['nick (garchomp)', 4],
        ['garchomp (m) @ item', 8],
        ['garchomp  \nability', 8],
        ['garchomp', 8],
    ];

    for (const [input, expected] of cases) {
        test(`${JSON.stringify(input)} -> ${expected}`, async () => {
            const result = await page.evaluate(
                (t) => window.ext.findPokemonNameEnd(t), input
            );
            expect(result).toBe(expected);
        });
    }
});

test.describe('resolveHandDrawn', () => {
    test('prefers official-artwork', async () => {
        const result = await page.evaluate(() => {
            return window.ext.resolveHandDrawn({
                front_default: 'top',
                other: {
                    'official-artwork': { front_default: 'oa' },
                    home: { front_default: 'hm' },
                    showdown: { front_default: 'sd' },
                },
            }, false);
        });
        expect(result).toBe('oa');
    });

    test('falls back home -> showdown -> top-level', async () => {
        const r1 = await page.evaluate(() => {
            return window.ext.resolveHandDrawn({
                front_default: 'top',
                other: {
                    'official-artwork': {},
                    home: { front_default: 'hm' },
                },
            }, false);
        });
        expect(r1).toBe('hm');

        const r2 = await page.evaluate(() => {
            return window.ext.resolveHandDrawn({
                front_default: 'top',
                other: {
                    'official-artwork': {},
                    home: {},
                    showdown: { front_default: 'sd' },
                },
            }, false);
        });
        expect(r2).toBe('sd');

        const r3 = await page.evaluate(() => {
            return window.ext.resolveHandDrawn({
                front_default: 'top',
                other: {},
            }, false);
        });
        expect(r3).toBe('top');
    });

    test('shiny picks front_shiny', async () => {
        const result = await page.evaluate(() => {
            return window.ext.resolveHandDrawn({
                front_shiny: 'top-shiny',
                other: {
                    'official-artwork': { front_shiny: 'oa-shiny' },
                },
            }, true);
        });
        expect(result).toBe('oa-shiny');
    });

    test('missing intermediate objects do not throw', async () => {
        const result = await page.evaluate(() => {
            return window.ext.resolveHandDrawn({}, false);
        });
        expect(result).toBeUndefined();
    });
});

test.describe('resolvePixelSprite', () => {
    const alakazam = readPokeapiFixture('alakazam');
    const sprites = alakazam.sprites;

    test('gen 1 -> yellow front_transparent', async () => {
        const result = await page.evaluate(
            (s) => window.ext.resolvePixelSprite(s, 1, false), sprites
        );
        expect(result).toBe(sprites.versions['generation-i'].yellow.front_transparent);
        expect(result).toContain('generation-i/yellow/transparent');
    });

    test('gen 1 shiny -> front_transparent (noShiny)', async () => {
        const result = await page.evaluate(
            (s) => window.ext.resolvePixelSprite(s, 1, true), sprites
        );
        expect(result).toBe(sprites.versions['generation-i'].yellow.front_transparent);
    });

    test('gen 2 -> crystal front_transparent', async () => {
        const result = await page.evaluate(
            (s) => window.ext.resolvePixelSprite(s, 2, false), sprites
        );
        expect(result).toBe(sprites.versions['generation-ii'].crystal.front_transparent);
        expect(result).toContain('generation-ii/crystal/transparent');
    });

    test('gen 2 shiny -> crystal front_shiny_transparent', async () => {
        const result = await page.evaluate(
            (s) => window.ext.resolvePixelSprite(s, 2, true), sprites
        );
        expect(result).toBe(sprites.versions['generation-ii'].crystal.front_shiny_transparent);
    });

    test('gen 3 -> emerald front_default', async () => {
        const result = await page.evaluate(
            (s) => window.ext.resolvePixelSprite(s, 3, false), sprites
        );
        expect(result).toBe(sprites.versions['generation-iii'].emerald.front_default);
        expect(result).toContain('generation-iii/emerald');
    });

    test('gen 4 -> platinum front_default', async () => {
        const result = await page.evaluate(
            (s) => window.ext.resolvePixelSprite(s, 4, false), sprites
        );
        expect(result).toBe(sprites.versions['generation-iv'].platinum.front_default);
        expect(result).toContain('generation-iv/platinum');
    });

    test('gen 5 -> black-white animated front_default', async () => {
        const result = await page.evaluate(
            (s) => window.ext.resolvePixelSprite(s, 5, false), sprites
        );
        expect(result).toBe(sprites.versions['generation-v']['black-white'].animated.front_default);
        expect(result).toContain('generation-v/black-white/animated');
    });

    test('no versions -> top-level front_default', async () => {
        const result = await page.evaluate(() => {
            return window.ext.resolvePixelSprite(
                { front_default: 'fallback' }, 3, false
            );
        });
        expect(result).toBe('fallback');
    });
});

test.describe('getChiyukApi', () => {
    test('returns url and null primaryType', async () => {
        const result = await page.evaluate(
            () => window.ext.getChiyukApi('256', 'garchomp')
        );
        expect(result).toEqual({
            url: 'https://chiy.uk/256/garchomp',
            primaryType: null,
        });
    });

    test('arceus form extracts type', async () => {
        const result = await page.evaluate(
            () => window.ext.getChiyukApi('full', 'arceus-fire')
        );
        expect(result).toEqual({
            url: 'https://chiy.uk/full/arceus-fire',
            primaryType: 'fire',
        });
    });
});

test.describe('getPokeApi', () => {
    test('ceruledge -> fire type, official-artwork url', async () => {
        const result = await page.evaluate(
            () => window.ext.getPokeApi(false, null, 'ceruledge')
        );
        expect(result.primaryType).toBe('fire');
        expect(result.url).toBe(
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/937.png'
        );
    });

    test('ceruledge shiny -> front_shiny artwork', async () => {
        const result = await page.evaluate(
            () => window.ext.getPokeApi(true, null, 'ceruledge')
        );
        expect(result.url).toBe(
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/937.png'
        );
    });

    test('ceruledge format 3 -> emerald sprite', async () => {
        const result = await page.evaluate(
            () => window.ext.getPokeApi(false, 3, 'ceruledge')
        );
        expect(result.primaryType).toBe('fire');
        // ceruledge has no gen3 sprite data, falls back to top-level
        expect(result.url).toBe(
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/937.png'
        );
    });

    test('404 fixture route -> empty url, null type', async () => {
        const result = await page.evaluate(
            () => window.ext.getPokeApi(false, null, 'giratina')
        );
        expect(result).toEqual({ url: '', primaryType: null });
    });

    test('missing fixture route -> empty url, null type, tracked in missing', async () => {
        const result = await page.evaluate(
            () => window.ext.getPokeApi(false, null, 'nonexistent-mon')
        );
        expect(result).toEqual({ url: '', primaryType: null });
        const missing = await page.evaluate(() => window.__pokeapi.missing);
        expect(missing).toContain('nonexistent-mon');
    });
});
