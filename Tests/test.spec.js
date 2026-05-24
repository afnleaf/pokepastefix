import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read extension code
const dataCode = fs.readFileSync(path.join(__dirname, '../Extension/data.js'), 'utf-8');
const contentCode = fs.readFileSync(path.join(__dirname, '../Extension/content.js'), 'utf-8');

// Remove browser.storage code since we'll mock it
const contentWithoutBrowser = contentCode
    .replace(/browser\.storage\.sync\.get[\s\S]*?\}\);/, '');

const testFiles = [
    { file: 'edgecase.html', options: [0, 0, 1, 0] },
    { file: 'gen5.html', options: [0, 0, 1, 0] }
];

for (const testCase of testFiles) {
    test(`${testCase.file} - extension runs`, async ({ page }) => {
        const htmlPath = path.join(__dirname, 'html', testCase.file);
        const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

        // Set content
        await page.setContent(htmlContent);

        // Inject and run extension code
        await page.evaluate(([data, content, opts]) => {
            // Execute data.js to set up globals
            eval(data);

            // Execute content.js (without browser.storage part)
            eval(content);

            // Assign main to window so it's accessible
            if (typeof main !== 'undefined') {
                window.main = main;
            }

            // Call main with options
            return window.main(...opts);
        }, [dataCode, contentWithoutBrowser, testCase.options]);

        // Check images are replaced
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

    test(`${testCase.file} - type spans added`, async ({ page }) => {
        const htmlPath = path.join(__dirname, 'html', testCase.file);
        const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

        // Set content
        await page.setContent(htmlContent);

        // Inject and run extension code
        await page.evaluate(([data, content, opts]) => {
            eval(data);
            eval(content);
            if (typeof main !== 'undefined') {
                window.main = main;
            }
            return window.main(...opts);
        }, [dataCode, contentWithoutBrowser, testCase.options]);

        // Check type spans exist
        const typeSpans = await page.locator('span[class^="type-"]').all();
        expect(typeSpans.length).toBeGreaterThan(0);
    });
}
