import { test, expect } from '@playwright/test';
import { backgroundCode } from './helpers.js';

// Evaluates background.js in the page with a chrome.runtime stub,
// returns a helper to invoke the listener and capture sendResponse.
async function setupBackground(page) {
    await page.route('https://pokeapi.co/**', route => route.abort());

    await page.goto('about:blank');
    await page.evaluate((code) => {
        window.chrome = {
            runtime: {
                onMessage: {
                    addListener(fn) { window.__listener = fn; }
                }
            }
        };
        eval(code);
    }, backgroundCode);
}

// Sends a message to the listener and resolves with { returned, response }.
// `returned` is the synchronous return value; `response` is what sendResponse got.
function sendMessage(page, message, { timeout = 5000 } = {}) {
    return page.evaluate(({ message, timeout }) => {
        return new Promise((resolve, reject) => {
            let responded = false;
            const timer = setTimeout(() => {
                if (!responded) resolve({ returned, response: null });
            }, timeout);
            let returned;
            const sendResponse = (value) => {
                responded = true;
                clearTimeout(timer);
                resolve({ returned, response: value });
            };
            returned = window.__listener(message, {}, sendResponse);
        });
    }, { message, timeout });
}

test.describe('background.js message listener', () => {

    test('fetchPokeApiData returns fulfilled JSON and uses correct URL', async ({ page }) => {
        const payload = { id: 445, name: 'garchomp', types: [{ slot: 1, type: { name: 'dragon' } }] };
        await page.route('https://pokeapi.co/**', route => {
            expect(route.request().url()).toBe('https://pokeapi.co/api/v2/pokemon/garchomp');
            return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(payload) });
        });
        await page.goto('about:blank');
        await page.evaluate((code) => {
            window.chrome = {
                runtime: { onMessage: { addListener(fn) { window.__listener = fn; } } }
            };
            eval(code);
        }, backgroundCode);

        const { returned, response } = await sendMessage(page, { type: 'fetchPokeApiData', route: 'garchomp' });
        expect(returned).toBe(true);
        expect(response).toEqual({ data: payload });
    });

    test('fetchPokeApiData 404 returns error string', async ({ page }) => {
        await page.route('https://pokeapi.co/**', route =>
            route.fulfill({ status: 404, body: 'Not Found' })
        );
        await page.goto('about:blank');
        await page.evaluate((code) => {
            window.chrome = {
                runtime: { onMessage: { addListener(fn) { window.__listener = fn; } } }
            };
            eval(code);
        }, backgroundCode);

        const { returned, response } = await sendMessage(page, { type: 'fetchPokeApiData', route: 'giratina' });
        expect(returned).toBe(true);
        expect(response.error).toBe('PokeAPI error: 404');
    });

    test('fetchPokeApiData network failure returns error', async ({ page }) => {
        await page.route('https://pokeapi.co/**', route => route.abort());
        await page.goto('about:blank');
        await page.evaluate((code) => {
            window.chrome = {
                runtime: { onMessage: { addListener(fn) { window.__listener = fn; } } }
            };
            eval(code);
        }, backgroundCode);

        const { returned, response } = await sendMessage(page, { type: 'fetchPokeApiData', route: 'garchomp' });
        expect(returned).toBe(true);
        expect(response.error).toBeTruthy();
        expect(typeof response.error).toBe('string');
    });

    test('unknown message type returns false, sendResponse not called', async ({ page }) => {
        await setupBackground(page);

        const { returned, response } = await sendMessage(page, { type: 'somethingElse' }, { timeout: 1000 });
        expect(returned).toBe(false);
        expect(response).toBeNull();
    });
});
