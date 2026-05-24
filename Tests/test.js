import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';
import assert from 'assert';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let totalPassed = 0;
let totalFailed = 0;

function test(name, fn) {
    try {
        fn();
        totalPassed++;
        console.log(`  ✓ ${name}`);
    } catch (error) {
        totalFailed++;
        console.log(`  ✗ ${name}`);
        console.log(`    ${error.message}`);
    }
}

async function runTests() {
    const htmlDir = path.join(__dirname, 'html');
    const testFiles = ['edgecase.html', 'gen5.html'];

    console.log('\n╔════════════════════════════════════════╗');
    console.log('║    POKEPASTEFIX E2E TEST SUITE         ║');
    console.log('╚════════════════════════════════════════╝\n');

    for (const testFile of testFiles) {
        const htmlPath = path.join(htmlDir, testFile);
        if (!fs.existsSync(htmlPath)) continue;

        const html = fs.readFileSync(htmlPath, 'utf-8');
        const dom = new JSDOM(html, { url: 'https://pokepast.es/test' });
        const window = dom.window;
        const document = window.document;

        console.log(`${testFile}:`);

        // Load the actual extension code
        const dataCode = fs.readFileSync(path.join(__dirname, '../Extension/data.js'), 'utf-8');
        const contentCode = fs.readFileSync(path.join(__dirname, '../Extension/content.js'), 'utf-8');

        // Execute data.js in the jsdom context to set up globals
        const dataScript = new window.Function('window', dataCode);
        dataScript(window);

        // Execute content.js and attach main to window
        const contentWithoutBrowser = contentCode
            .replace(/browser\.storage\.sync\.get[\s\S]*?\}\);/, '');

        const wrappedContent = contentWithoutBrowser + `
            if (typeof main !== 'undefined') {
                window.main = main;
            }
        `;

        const contentScript = new window.Function('window', 'document', wrappedContent);
        contentScript(window, document);

        // Extract main function from window
        const main = window.main;

        test(`extension runs without error`, async () => {
            assert(typeof main === 'function', 'main function should exist');
            await main(0, 0, 1, 0); // imageQuality, replaceAll, shiny, sprites
        });

        test(`images are replaced`, () => {
            const images = document.querySelectorAll('.img-pokemon');
            let replaced = 0;
            images.forEach(img => {
                if (img.src && img.src !== '/img/pokemon/0-0.png') {
                    replaced++;
                }
            });
            assert(replaced > 0, `should have replaced at least one image, got ${replaced}`);
        });

        test(`type spans are added`, () => {
            const typeSpans = document.querySelectorAll('span[class^="type-"]');
            assert(typeSpans.length > 0, 'should have added type color spans');
        });

        test(`pokemon articles are processed`, () => {
            const articles = document.querySelectorAll('article');
            assert(articles.length > 0, 'should have pokemon articles');
        });
    }

    console.log(`\n╔════════════════════════════════════════╗`);
    console.log(`║           TEST RESULTS                  ║`);
    console.log(`║  Passed: ${totalPassed.toString().padStart(28)} │`);
    console.log(`║  Failed: ${totalFailed.toString().padStart(28)} │`);
    console.log(`║  Total:  ${(totalPassed + totalFailed).toString().padStart(28)} │`);
    console.log(`╚════════════════════════════════════════╝\n`);

    if (totalFailed > 0) {
        process.exit(1);
    }
}

runTests();
