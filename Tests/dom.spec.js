import { test, expect } from '@playwright/test';
import { installExtension, articleStates } from './helpers.js';
import { readPokeapiFixture } from './helpers.js';

const article = (pre, opts = {}) => {
    const item = opts.itemSrc ? `<img class="img-item" src="${opts.itemSrc}">` : '';
    return `<!DOCTYPE html><html><body><article><div class="img"><img class="img-pokemon" src="/img/pokemon/0-0.png">${item}</div><pre>${pre}</pre></article></body></html>`;
};

// -- getFirstLine --------------------------------------------------------- //

test.describe('getFirstLine', () => {
    test('plain text first line before newline', async ({ page }) => {
        const html = article('Garchomp @ Life Orb\nAbility: Rough Skin');
        await installExtension(page, { html });
        const result = await page.evaluate(() => {
            const pre = document.querySelector('pre');
            return window.ext.getFirstLine(pre);
        });
        expect(result).toBe('Garchomp @ Life Orb');
    });

    test('first line with embedded span elements', async ({ page }) => {
        const html = article('volc (<span class="type-bug">Volcarona</span>) @ Safety Goggles\nAbility: Flame Body');
        await installExtension(page, { html });
        const result = await page.evaluate(() => {
            const pre = document.querySelector('pre');
            return window.ext.getFirstLine(pre);
        });
        expect(result).toBe('volc (Volcarona) @ Safety Goggles');
    });

    test('first child is an element node', async ({ page }) => {
        const html = article('<span class="type-dragon">Garchomp</span> @ Life Orb\nAbility: Rough Skin');
        await installExtension(page, { html });
        const result = await page.evaluate(() => {
            const pre = document.querySelector('pre');
            return window.ext.getFirstLine(pre);
        });
        expect(result).toBe('Garchomp @ Life Orb');
    });

    test('single-line pre with no newline', async ({ page }) => {
        const html = article('Pikachu');
        await installExtension(page, { html });
        const result = await page.evaluate(() => {
            const pre = document.querySelector('pre');
            return window.ext.getFirstLine(pre);
        });
        expect(result).toBe('Pikachu');
    });
});

// -- createTypeSpan ------------------------------------------------------- //

test.describe('createTypeSpan', () => {
    test('creates span with correct class and text', async ({ page }) => {
        const html = article('x');
        await installExtension(page, { html });
        const result = await page.evaluate(() => {
            const s = window.ext.createTypeSpan('Garchomp', 'ground');
            return { tag: s.tagName, cls: s.className, text: s.textContent };
        });
        expect(result).toEqual({ tag: 'SPAN', cls: 'type-ground', text: 'Garchomp' });
    });
});

// -- wrapPokemonName ------------------------------------------------------ //

test.describe('wrapPokemonName', () => {
    test('plain name with item gets wrapped', async ({ page }) => {
        const html = article('Garchomp @ Life Orb\nAbility: Rough Skin');
        await installExtension(page, { html });
        const result = await page.evaluate(() => {
            const art = document.querySelector('article');
            window.ext.wrapPokemonName(art, 'ground');
            const pre = art.querySelector('pre');
            const span = pre.querySelector('span.type-ground');
            return {
                spanText: span?.textContent,
                fullText: pre.textContent,
                spanCount: pre.querySelectorAll('span.type-ground').length,
            };
        });
        expect(result.spanText).toBe('Garchomp');
        expect(result.fullText).toBe('Garchomp @ Life Orb\nAbility: Rough Skin');
        expect(result.spanCount).toBe(1);
    });

    test('nickname (Species) (M) wraps only species', async ({ page }) => {
        const html = article('nick (Garchomp) (M) @ Life Orb\nAbility: Rough Skin');
        await installExtension(page, { html });
        const result = await page.evaluate(() => {
            const art = document.querySelector('article');
            window.ext.wrapPokemonName(art, 'ground');
            const span = art.querySelector('pre span.type-ground');
            return { text: span?.textContent, full: art.querySelector('pre').textContent };
        });
        expect(result.text).toBe('Garchomp');
        expect(result.full).toBe('nick (Garchomp) (M) @ Life Orb\nAbility: Rough Skin');
    });

    test('name (F) with no item wraps name', async ({ page }) => {
        const html = article('Garchomp (F)\nAbility: Rough Skin');
        await installExtension(page, { html });
        const result = await page.evaluate(() => {
            const art = document.querySelector('article');
            window.ext.wrapPokemonName(art, 'ground');
            const span = art.querySelector('pre span.type-ground');
            return span?.textContent;
        });
        expect(result).toBe('Garchomp');
    });

    test('type null causes no change', async ({ page }) => {
        const html = article('Garchomp @ Life Orb\nAbility: Rough Skin');
        await installExtension(page, { html });
        const result = await page.evaluate(() => {
            const art = document.querySelector('article');
            const before = art.querySelector('pre').innerHTML;
            window.ext.wrapPokemonName(art, null);
            return art.querySelector('pre').innerHTML === before;
        });
        expect(result).toBe(true);
    });

    test('pre absent leaves article DOM unchanged', async ({ page }) => {
        const noPreHtml = '<!DOCTYPE html><html><body><article><div class="img"><img class="img-pokemon" src="/img/pokemon/0-0.png"></div></article></body></html>';
        await installExtension(page, { html: noPreHtml });
        const unchanged = await page.evaluate(() => {
            const art = document.querySelector('article');
            const before = art.outerHTML;
            window.ext.wrapPokemonName(art, 'ground');
            return art.outerHTML === before;
        });
        expect(unchanged).toBe(true);
    });

    test('first child is element node -- no change', async ({ page }) => {
        const html = article('<span class="type-dragon">Garchomp</span> @ Life Orb\nAbility: Rough Skin');
        await installExtension(page, { html });
        const result = await page.evaluate(() => {
            const art = document.querySelector('article');
            const before = art.querySelector('pre').innerHTML;
            window.ext.wrapPokemonName(art, 'ground');
            return art.querySelector('pre').innerHTML === before;
        });
        expect(result).toBe(true);
    });

    // wrapPokemonName only walks text nodes; when pokepaste already wrapped
    // the species in a span, the loop skips it since it only checks
    // node.nodeType === TEXT_NODE. So no double-wrap occurs -- the name
    // is simply not found in any text node and nothing changes.
    test('species already in a pokepaste span is not double-wrapped', async ({ page }) => {
        // species is inside a span but there is a leading text node (nickname)
        const html = article('volc (<span class="type-bug">Volcarona</span>) @ Safety Goggles\nAbility: Flame Body');
        await installExtension(page, { html });
        const result = await page.evaluate(() => {
            const art = document.querySelector('article');
            window.ext.wrapPokemonName(art, 'fire');
            const spans = art.querySelector('pre').querySelectorAll('span[class^="type-"]');
            return {
                count: spans.length,
                classes: [...spans].map(s => s.className),
                texts: [...spans].map(s => s.textContent),
            };
        });
        expect(result.count).toBe(1);
        expect(result.classes[0]).toBe('type-bug');
    });

    test('multi-line pre: only first line affected', async ({ page }) => {
        const html = article('Garchomp @ Life Orb\nAbility: Rough Skin\nGarchomp leftover text');
        await installExtension(page, { html });
        const result = await page.evaluate(() => {
            const art = document.querySelector('article');
            window.ext.wrapPokemonName(art, 'ground');
            const pre = art.querySelector('pre');
            return pre.querySelectorAll('span.type-ground').length;
        });
        // wrapPokemonName searches from textNode (firstChild) through siblings;
        // the first text node contains "Garchomp @ Life Orb\nAbility:..." so
        // indexOf("Garchomp") finds it at index 0, wraps it, done. The second
        // "Garchomp" on line 3 is in the remaining text after the split but
        // found=true stops the loop.
        expect(result).toBe(1);
    });
});

// -- appendItemImage ------------------------------------------------------ //

test.describe('appendItemImage', () => {
    test('appends img.img-item with correct src', async ({ page }) => {
        const html = article('Ogerpon @ Cornerstone Mask\nAbility: Water Absorb');
        await installExtension(page, { html });
        const result = await page.evaluate(() => {
            const art = document.querySelector('article');
            window.ext.appendItemImage(art, 'cornerstone mask');
            const img = art.querySelector('div.img > .img-item');
            const totalImgs = art.querySelectorAll('.img-item').length;
            return { src: img?.getAttribute('src'), cls: img?.className, count: totalImgs };
        });
        expect(result.src).toBe('https://chiy.uk/items/cornerstone-mask');
        expect(result.cls).toBe('img-item');
        expect(result.count).toBe(1);
    });

    test('no div.img -- nothing appended, no throw', async ({ page }) => {
        const noDivHtml = '<!DOCTYPE html><html><body><article><pre>Garchomp</pre></article></body></html>';
        await installExtension(page, { html: noDivHtml });
        const result = await page.evaluate(() => {
            try {
                const art = document.querySelector('article');
                window.ext.appendItemImage(art, 'cornerstone mask');
                return { threw: false, imgCount: art.querySelectorAll('.img-item').length };
            } catch { return { threw: true, imgCount: 0 }; }
        });
        expect(result.threw).toBe(false);
        expect(result.imgCount).toBe(0);
    });
});

// -- replaceImage --------------------------------------------------------- //

test.describe('replaceImage', () => {
    test('primary loads: src set, pixelated for non-chiy.uk, objectFit contain', async ({ page }) => {
        const html = article('Garchomp');
        await installExtension(page, { html });
        const result = await page.evaluate(() => new Promise(resolve => {
            const img = document.querySelector('.img-pokemon');
            window.ext.replaceImage('https://example.com/primary.png', 'https://chiy.uk/256/backup', img, 'garchomp', 256);
            img.addEventListener('load', () => {
                setTimeout(() => resolve({
                    src: img.getAttribute('src'),
                    rendering: img.style.imageRendering,
                    fit: img.style.objectFit,
                }), 0);
            }, { once: true });
        }));
        expect(result.src).toBe('https://example.com/primary.png');
        expect(result.rendering).toBe('pixelated');
        expect(result.fit).toBe('contain');
    });

    test('chiy.uk url gets auto rendering', async ({ page }) => {
        const html = article('Garchomp');
        await installExtension(page, { html });
        const result = await page.evaluate(() => new Promise(resolve => {
            const img = document.querySelector('.img-pokemon');
            window.ext.replaceImage('https://chiy.uk/256/garchomp', null, img, 'garchomp', 256);
            img.addEventListener('load', () => {
                setTimeout(() => resolve(img.style.imageRendering), 0);
            }, { once: true });
        }));
        expect(result).toBe('auto');
    });

    test('/other/ url gets auto rendering', async ({ page }) => {
        const html = article('Garchomp');
        await installExtension(page, { html });
        const result = await page.evaluate(() => new Promise(resolve => {
            const img = document.querySelector('.img-pokemon');
            window.ext.replaceImage('https://example.com/other/garchomp.png', null, img, 'garchomp', 256);
            img.addEventListener('load', () => {
                setTimeout(() => resolve(img.style.imageRendering), 0);
            }, { once: true });
        }));
        expect(result).toBe('auto');
    });

    test('primary fails -- falls back to backup', async ({ page }) => {
        const html = article('Garchomp');
        await installExtension(page, { html, failUrls: ['primary.example'] });
        const result = await page.evaluate(() => new Promise(resolve => {
            const img = document.querySelector('.img-pokemon');
            // backup will succeed (not in failUrls)
            img.addEventListener('load', () => {
                resolve(img.getAttribute('src'));
            }, { once: true });
            // error fires first, triggers backup, then load fires
            window.ext.replaceImage('https://primary.example/garchomp.png', 'https://backup.example/garchomp.png', img, 'garchomp', 256);
        }));
        expect(result).toBe('https://backup.example/garchomp.png');
    });

    test('primary fails, backup null -- src stays primary', async ({ page }) => {
        const html = article('Garchomp');
        await installExtension(page, { html, failUrls: ['primary.example'] });
        const result = await page.evaluate(() => new Promise(resolve => {
            const img = document.querySelector('.img-pokemon');
            img.addEventListener('error', () => {
                // after error handler runs, src should still be primary (backup is null, so no reassignment)
                resolve(img.getAttribute('src'));
            }, { once: true });
            window.ext.replaceImage('https://primary.example/garchomp.png', null, img, 'garchomp', 256);
        }));
        expect(result).toBe('https://primary.example/garchomp.png');
    });

    test('both fail -- src ends on backup, error logged', async ({ page }) => {
        const html = article('Garchomp');
        await installExtension(page, { html, failUrls: ['primary.example', 'backup.example'] });
        const errors = [];
        page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
        const result = await page.evaluate(() => new Promise(resolve => {
            const img = document.querySelector('.img-pokemon');
            let errorCount = 0;
            const origOnerror = null;
            img.addEventListener('error', () => {
                errorCount++;
                // first error: backup set; second error: final state
                if (errorCount >= 2) {
                    setTimeout(() => resolve(img.getAttribute('src')), 50);
                }
            });
            window.ext.replaceImage('https://primary.example/garchomp.png', 'https://backup.example/garchomp.png', img, 'garchomp', 256);
        }));
        expect(result).toBe('https://backup.example/garchomp.png');
        expect(errors.some(e => e.includes('Image failed to load'))).toBe(true);
    });
});

// -- replacePokemon ------------------------------------------------------- //

test.describe('replacePokemon', () => {
    const ceruledge = readPokeapiFixture('ceruledge');
    const ceruledgeArtwork = ceruledge.sprites.other['official-artwork'].front_default;
    const ceruledgeShiny = ceruledge.sprites.other['official-artwork'].front_shiny;

    test('normal pokeapi hit, isMissing=true wraps with type span', async ({ page }) => {
        const html = article('Ceruledge @ Life Orb\nAbility: Flash Fire');
        await installExtension(page, { html });
        const result = await page.evaluate(() => new Promise(resolve => {
            const art = document.querySelector('article');
            const img = art.querySelector('.img-pokemon');
            img.addEventListener('load', () => {
                const span = art.querySelector('pre span.type-fire');
                resolve({
                    src: img.getAttribute('src'),
                    spanText: span?.textContent ?? null,
                });
            }, { once: true });
            window.ext.replacePokemon(true, false, null, art, 'ceruledge', 256);
        }));
        expect(result.src).toBe(ceruledgeArtwork);
        expect(result.spanText).toBe('Ceruledge');
    });

    test('normal pokeapi hit, isMissing=false -- no span added', async ({ page }) => {
        const html = article('Ceruledge @ Life Orb\nAbility: Flash Fire');
        await installExtension(page, { html });
        const result = await page.evaluate(() => new Promise(resolve => {
            const art = document.querySelector('article');
            const img = art.querySelector('.img-pokemon');
            img.addEventListener('load', () => {
                const spans = art.querySelector('pre').querySelectorAll('span[class^="type-"]');
                resolve({ src: img.getAttribute('src'), spanCount: spans.length });
            }, { once: true });
            window.ext.replacePokemon(false, false, null, art, 'ceruledge', 256);
        }));
        expect(result.src).toBe(ceruledgeArtwork);
        expect(result.spanCount).toBe(0);
    });

    test('arceus-fire -- no pokeapi call, chiy.uk url, type-fire wrap', async ({ page }) => {
        const html = article('Arceus-Fire @ Flame Plate\nAbility: Multitype');
        await installExtension(page, { html });
        const result = await page.evaluate(() => new Promise(resolve => {
            const art = document.querySelector('article');
            const img = art.querySelector('.img-pokemon');
            img.addEventListener('load', () => {
                const span = art.querySelector('pre span.type-fire');
                resolve({
                    src: img.getAttribute('src'),
                    spanText: span?.textContent ?? null,
                    calls: window.__pokeapi.calls.slice(),
                });
            }, { once: true });
            window.ext.replacePokemon(true, false, null, art, 'arceus-fire', 256);
        }));
        expect(result.calls).toEqual([]);
        expect(result.src).toBe('https://chiy.uk/256/arceus-fire');
        expect(result.spanText).toBe('Arceus-Fire');
    });

    test('pokeapi 404 route (giratina) -- chiy.uk fallback, no type span', async ({ page }) => {
        const html = article('Giratina @ Griseous Orb\nAbility: Pressure');
        await installExtension(page, { html });
        const result = await page.evaluate(() => new Promise(resolve => {
            const art = document.querySelector('article');
            const img = art.querySelector('.img-pokemon');
            img.addEventListener('load', () => {
                const spans = art.querySelector('pre').querySelectorAll('span[class^="type-"]');
                resolve({ src: img.getAttribute('src'), spanCount: spans.length });
            }, { once: true });
            window.ext.replacePokemon(true, false, null, art, 'giratina', 256);
        }));
        expect(result.src).toBe('https://chiy.uk/256/giratina');
        expect(result.spanCount).toBe(0);
    });

    test('pokeapi image fails -- falls back to chiy.uk, type span still added', async ({ page }) => {
        const html = article('Ceruledge @ Life Orb\nAbility: Flash Fire');
        await installExtension(page, { html, failUrls: ['githubusercontent'] });
        const result = await page.evaluate(() => new Promise(resolve => {
            const art = document.querySelector('article');
            const img = art.querySelector('.img-pokemon');
            // primary (githubusercontent) fails, backup (chiy.uk) loads
            img.addEventListener('load', () => {
                const span = art.querySelector('pre span.type-fire');
                resolve({
                    src: img.getAttribute('src'),
                    spanText: span?.textContent ?? null,
                });
            }, { once: true });
            window.ext.replacePokemon(true, false, null, art, 'ceruledge', 256);
        }));
        expect(result.src).toBe('https://chiy.uk/256/ceruledge');
        expect(result.spanText).toBe('Ceruledge');
    });

    test('shiny=true -- shiny artwork url', async ({ page }) => {
        const html = article('Ceruledge\nAbility: Flash Fire');
        await installExtension(page, { html });
        const result = await page.evaluate(() => new Promise(resolve => {
            const art = document.querySelector('article');
            const img = art.querySelector('.img-pokemon');
            img.addEventListener('load', () => resolve(img.getAttribute('src')), { once: true });
            window.ext.replacePokemon(false, true, null, art, 'ceruledge', 256);
        }));
        expect(result).toBe(ceruledgeShiny);
    });

    test('format=1 -- gen1 sprite url (falls back to front_default)', async ({ page }) => {
        // ceruledge has no gen1 sprites, so resolvePixelSprite falls back to sprites.front_default
        const html = article('Ceruledge\nAbility: Flash Fire');
        await installExtension(page, { html });
        const result = await page.evaluate(() => new Promise(resolve => {
            const art = document.querySelector('article');
            const img = art.querySelector('.img-pokemon');
            img.addEventListener('load', () => resolve(img.getAttribute('src')), { once: true });
            window.ext.replacePokemon(false, false, 1, art, 'ceruledge', 256);
        }));
        expect(result).toBe(ceruledge.sprites.front_default);
    });

    test('quality full reflected in chiy.uk url', async ({ page }) => {
        const html = article('Arceus-Fire @ Flame Plate\nAbility: Multitype');
        await installExtension(page, { html });
        const result = await page.evaluate(() => new Promise(resolve => {
            const art = document.querySelector('article');
            const img = art.querySelector('.img-pokemon');
            img.addEventListener('load', () => resolve(img.getAttribute('src')), { once: true });
            window.ext.replacePokemon(false, false, null, art, 'arceus-fire', 'full');
        }));
        expect(result).toBe('https://chiy.uk/full/arceus-fire');
    });
});
