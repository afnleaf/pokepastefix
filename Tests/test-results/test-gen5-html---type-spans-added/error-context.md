# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: test.spec.js >> gen5.html - type spans added
- Location: test.spec.js:60:5

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - article [ref=e2]:
    - generic [ref=e3]:
      - img
    - generic [ref=e4]: "Format: gen5ou Kyurem-Black @ Choice Band Ability: Teravolt Shiny: Yes - Outrage - Sleep Talk Garchomp @ Choice Band Ability: Sand Veil - Outrage - Sleep Talk Haxorus @ Life Orb Ability: Rivalry - Outrage Kingdra @ Life Orb Ability: Swift Swim IVs: 0 Atk - Draco Meteor Latios (M) @ Choice Specs Ability: Levitate IVs: 0 Atk - Draco Meteor Dragonite @ Choice Band Ability: Multiscale Shiny: Yes - Outrage - Sleep Talk"
  - complementary [ref=e5]:
    - heading "gen5" [level=1] [ref=e6]
    - heading "by pokepastefix-test" [level=2] [ref=e7]
    - checkbox "Columns Mode" [ref=e8]
    - text: Columns Mode /
    - checkbox "Stat Colours" [ref=e9]
    - text: Stat Colours /
    - checkbox "Light Mode" [ref=e10]
    - text: Light Mode
    - paragraph [ref=e11]: "Format: GEN5OU"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import fs from 'fs';
  3  | import path from 'path';
  4  | import { fileURLToPath } from 'url';
  5  | 
  6  | const __dirname = path.dirname(fileURLToPath(import.meta.url));
  7  | 
  8  | // Read extension code
  9  | const dataCode = fs.readFileSync(path.join(__dirname, '../Extension/data.js'), 'utf-8');
  10 | const contentCode = fs.readFileSync(path.join(__dirname, '../Extension/content.js'), 'utf-8');
  11 | 
  12 | // Remove browser.storage code since we'll mock it
  13 | const contentWithoutBrowser = contentCode
  14 |     .replace(/browser\.storage\.sync\.get[\s\S]*?\}\);/, '');
  15 | 
  16 | const testFiles = [
  17 |     { file: 'edgecase.html', options: [0, 0, 1, 0] },
  18 |     { file: 'gen5.html', options: [0, 0, 1, 0] }
  19 | ];
  20 | 
  21 | for (const testCase of testFiles) {
  22 |     test(`${testCase.file} - extension runs`, async ({ page }) => {
  23 |         const htmlPath = path.join(__dirname, 'html', testCase.file);
  24 |         const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
  25 | 
  26 |         // Set content
  27 |         await page.setContent(htmlContent);
  28 | 
  29 |         // Inject and run extension code
  30 |         await page.evaluate(([data, content, opts]) => {
  31 |             // Execute data.js to set up globals
  32 |             eval(data);
  33 | 
  34 |             // Execute content.js (without browser.storage part)
  35 |             eval(content);
  36 | 
  37 |             // Assign main to window so it's accessible
  38 |             if (typeof main !== 'undefined') {
  39 |                 window.main = main;
  40 |             }
  41 | 
  42 |             // Call main with options
  43 |             return window.main(...opts);
  44 |         }, [dataCode, contentWithoutBrowser, testCase.options]);
  45 | 
  46 |         // Check images are replaced
  47 |         const images = await page.locator('.img-pokemon').all();
  48 |         let replacedCount = 0;
  49 | 
  50 |         for (const img of images) {
  51 |             const src = await img.getAttribute('src');
  52 |             if (src && src !== '/img/pokemon/0-0.png') {
  53 |                 replacedCount++;
  54 |             }
  55 |         }
  56 | 
  57 |         expect(replacedCount).toBeGreaterThan(0);
  58 |     });
  59 | 
  60 |     test(`${testCase.file} - type spans added`, async ({ page }) => {
  61 |         const htmlPath = path.join(__dirname, 'html', testCase.file);
  62 |         const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
  63 | 
  64 |         // Set content
  65 |         await page.setContent(htmlContent);
  66 | 
  67 |         // Inject and run extension code
  68 |         await page.evaluate(([data, content, opts]) => {
  69 |             eval(data);
  70 |             eval(content);
  71 |             if (typeof main !== 'undefined') {
  72 |                 window.main = main;
  73 |             }
  74 |             return window.main(...opts);
  75 |         }, [dataCode, contentWithoutBrowser, testCase.options]);
  76 | 
  77 |         // Check type spans exist
  78 |         const typeSpans = await page.locator('span[class^="type-"]').all();
> 79 |         expect(typeSpans.length).toBeGreaterThan(0);
     |                                  ^ Error: expect(received).toBeGreaterThan(expected)
  80 |     });
  81 | }
  82 | 
```