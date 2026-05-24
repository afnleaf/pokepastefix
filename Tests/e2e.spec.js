import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test.describe('pokepasteFix E2E', () => {
    const htmlDir = path.join(__dirname, 'html');
    const testFiles = fs.readdirSync(htmlDir)
        .filter(f => f.endsWith('.html'))
        .map(file => ({ file }))
        .sort((a, b) => a.file.localeCompare(b.file));

    const optionsMap = {
        'edgecase.html': [0, 0, 1, 0],
        'gen1.html': [0, 0, 0, 1],
        'gen2.html': [0, 0, 0, 1],
        'gen3.html': [0, 0, 0, 1],
        'gen4.html': [0, 0, 0, 1],
        'gen5.html': [0, 0, 0, 1],
        'test-missing.html': [0, 0, 0, 0],
    };

    const getOptions = (file) => optionsMap[file] || [0, 0, 0, 0];

    const dataCode = fs.readFileSync(path.join(__dirname, '../Extension/data.js'), 'utf-8');
    const contentCode = fs.readFileSync(path.join(__dirname, '../Extension/content.js'), 'utf-8');
    const contentWithoutBrowser = contentCode.replace(/browser\.storage\.sync\.get[\s\S]*?\}\);/, '');

    for (const testCase of testFiles) {
        test.describe(testCase.file, () => {
            test('extension runs without error', async ({ page }) => {
                const htmlPath = path.join(htmlDir, testCase.file);
                const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

                await page.setContent(htmlContent);

                await page.evaluate(([data, content]) => {
                    eval(data);
                    eval(content);
                    if (typeof main !== 'undefined') {
                        window.main = main;
                    }
                }, [dataCode, contentWithoutBrowser]);

                await page.evaluate((opts) => {
                    return window.main(...opts);
                }, getOptions(testCase.file));
            });

            test('images are replaced', async ({ page }) => {
                const htmlPath = path.join(htmlDir, testCase.file);
                const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

                await page.setContent(htmlContent);

                await page.evaluate(([data, content]) => {
                    eval(data);
                    eval(content);
                    if (typeof main !== 'undefined') {
                        window.main = main;
                    }
                }, [dataCode, contentWithoutBrowser]);

                await page.evaluate((opts) => {
                    return window.main(...opts);
                }, getOptions(testCase.file));

                const images = await page.locator('.img-pokemon').all();
                let replacedCount = 0;

                for (const img of images) {
                    const src = await img.getAttribute('src');
                    if (src && src !== '/img/pokemon/0-0.png') {
                        replacedCount++;
                    }
                }

                expect(replacedCount).toBeGreaterThan(0);
            });

            test('type spans are present', async ({ page }) => {
                // Skip for gen1-5 sprite tests (sprites only change images, not type spans)
                if (testCase.file.match(/^gen[1-5]\.html$/)) {
                    test.skip();
                    return;
                }

                const htmlPath = path.join(htmlDir, testCase.file);
                const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

                await page.setContent(htmlContent);

                await page.evaluate(([data, content]) => {
                    eval(data);
                    eval(content);
                    if (typeof main !== 'undefined') {
                        window.main = main;
                    }
                }, [dataCode, contentWithoutBrowser]);

                await page.evaluate((opts) => {
                    return window.main(...opts);
                }, getOptions(testCase.file));

                const typeSpans = await page.locator('span[class^="type-"]').all();
                expect(typeSpans.length).toBeGreaterThan(0);
            });

            test('pokemon articles are processed', async ({ page }) => {
                const htmlPath = path.join(htmlDir, testCase.file);
                const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

                await page.setContent(htmlContent);

                await page.evaluate(([data, content]) => {
                    eval(data);
                    eval(content);
                    if (typeof main !== 'undefined') {
                        window.main = main;
                    }
                }, [dataCode, contentWithoutBrowser]);

                await page.evaluate((opts) => {
                    return window.main(...opts);
                }, getOptions(testCase.file));

                const articles = await page.locator('article').all();
                expect(articles.length).toBeGreaterThan(0);
            });
        });
    }
});
