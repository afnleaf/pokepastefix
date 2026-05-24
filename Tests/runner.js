import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';
import assert from 'assert';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Test harness
let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        passed++;
        console.log(`✓ ${name}`);
    } catch (error) {
        failed++;
        console.log(`✗ ${name}`);
        console.log(`  ${error.message}`);
    }
}

// Mock pokemon data for testing
const mockPokemonData = {
    pikachu: {
        sprites: {
            other: {
                'official-artwork': {
                    front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/other/official-artwork/25.png',
                    front_shiny: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/other/official-artwork/shiny/25.png'
                }
            },
            versions: {
                'generation-v': {
                    'black-white': {
                        animated: {
                            front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/pokemon/versions/generation-v/black-white/animated/25.gif'
                        }
                    }
                }
            }
        },
        types: [{ slot: 1, type: { name: 'electric' } }]
    }
};

// Data from data.js
const replacements = new Set([
    "poltchageist", "sinistcha", "ogerpon", "growlithe-hisui", "arcanine-hisui",
    "arceus-bug", "arceus-dark", "arceus-electric", "dialga-origin"
]);

const badnames = {
    "walking wake": "walking-wake",
    "greninja-bond": "greninja-battle-bond",
    "sinistcha-masterpiece": "sinistcha",
};

const items = {
    "cornerstone mask": "https://www.serebii.net/itemdex/sprites/sv/cornerstonemask.png",
    "fairy feather": "https://www.serebii.net/itemdex/sprites/sv/fairyfeather.png",
};

const missingPokeApi = [
    "arceus-bug", "arceus-dark", "arceus-dragon", "arceus-electric",
    "arceus-fairy", "arceus-fighting", "arceus-fire", "arceus-flying"
];

const GEN_LOOKUP = {
    1: { gen: "generation-i", game: "yellow", transparent: true, noShiny: true },
    2: { gen: "generation-ii", game: "crystal", transparent: true },
    3: { gen: "generation-iii", game: "emerald" },
    4: { gen: "generation-iv", game: "platinum" },
    5: { gen: "generation-v", game: "black-white", animated: true },
};

const genderRegex = /\(F\)|\(M\)/gi;
const nicknameRegex = /\(([^)]+)\)/gi;

// Extension functions
function encodeName(name) {
    name = name.toLowerCase()
        .replaceAll(" ", "-")
        .replaceAll(":", "-")
        .replaceAll("'", "")
        .replaceAll(".", "")
        .replaceAll("♀", "-f")
        .replaceAll("♂", "-m")
        .replaceAll("é", "e")
        .replaceAll("?", "")
        .replace(/[^a-z0-9\-]/g, "")
        .replace(/\-+/g, "-")
        .replace(/^\-|\-$/g, "");
    return name;
}

function parsePokemonInfo(line) {
    let name = line.trim();
    let item = "";
    if(line.includes("@")) {
        const split = line.split("@");
        name = split[0].slice(0, -1);
        item = split[1].trim().toLowerCase();
    }
    const hasGender = genderRegex.test(name);
    if(hasGender) {
        name = name.replace(genderRegex, "").slice(0, -1);
    }
    const hasBothParentheses = name.includes("(") && name.includes(")");
    if(hasBothParentheses) {
        name = name.match(nicknameRegex)[0];
        name = name.substring(1, name.length - 1);
    }
    name = name.toLowerCase();
    if(name in badnames) {
        name = badnames[name];
    }
    return { name, item };
}

function findFormat() {
    const aside = document.querySelector("aside");
    const text = aside ? (aside.innerText || aside.textContent || "").toLowerCase() : "";
    let gen = null;
    if(text !== "") {
        const i = text.indexOf("format:");
        if (i === -1) return null;
        let j = text.indexOf("\n", i);
        j = j === -1 ? text.length : j;
        const line = text.substring(i, j);
        const k = line.indexOf(":");
        const format = line.substring(k, j).trim();
        const match = format.match(/gen(\d+)/);
        gen = match ? parseInt(match[1], 10) : null;
        if (gen !== null && !(gen in GEN_LOOKUP)) {
            gen = null;
        }
    }
    return gen;
}

function chooseImageQuality(imageQuality) {
    let q = "256";
    switch(imageQuality) {
        case 0: q = "256"; break;
        case 1: q = "full"; break;
        default: q = "256";
    }
    return q;
}

function chooseShiny(shiny, rest) {
    let s = false;
    switch (shiny) {
        case 0: s = false; break;
        case 1: s = findShinyLine(rest); break;
        case 2: s = true; break;
        default: s = false;
    }
    return s;
}

function findShinyLine(text) {
    let i = text.indexOf("shiny:");
    if(i !== -1) {
        let j = text.indexOf("\n", i);
        if(j === -1) j = text.length;
        const line = text.substring(i, j);
        const parts = line.split(":");
        if (parts.length < 2) return false;
        let b = parts[1].trim();
        return b === "yes";
    }
    return false;
}

async function runTests() {
    const htmlDir = path.join(__dirname, 'html');
    const testFiles = fs.readdirSync(htmlDir)
        .filter(f => f.endsWith('.html'))
        .sort();

    console.log(`Running tests on ${testFiles.length} HTML file(s)...\n`);

    for (const testFile of testFiles) {
        const htmlPath = path.join(htmlDir, testFile);
        const html = fs.readFileSync(htmlPath, 'utf-8');
        const dom = new JSDOM(html, { url: 'https://pokepast.es/test' });
        const document = dom.window.document;
        global.document = document;

        console.log(`\n=== ${testFile} ===`);

        test(`loads without error`, () => {
            assert(document !== null);
            assert(document.querySelector('article') !== null);
        });

        test(`has pokemon articles`, () => {
            const articles = document.querySelectorAll('article');
            assert(articles.length > 0, 'should have at least one article');
        });

        test(`has pokemon images`, () => {
            const images = document.querySelectorAll('.img-pokemon');
            assert(images.length > 0, 'should have pokemon images');
        });

        test(`has aside metadata`, () => {
            const aside = document.querySelector('aside');
            assert(aside !== null, 'should have aside element');
        });

        test(`format detection works`, () => {
            const format = findFormat();
            if (testFile.startsWith('gen')) {
                const match = testFile.match(/gen(\d)/);
                if (match) {
                    const genNum = parseInt(match[1]);
                    assert(format === genNum, `format should be ${genNum}, got ${format}`);
                }
            }
        });

        test(`pokemon parsing works`, () => {
            const article = document.querySelector('article');
            const pre = article?.querySelector('pre');
            if (pre && pre.textContent) {
                const firstLine = pre.textContent.split('\n')[0];
                const { name, item } = parsePokemonInfo(firstLine);
                assert(name && name.length > 0, 'should parse pokemon name');
            }
        });

        test(`name encoding works`, () => {
            const encoded = encodeName('Pikachu');
            assert(encoded === 'pikachu', 'should encode names to lowercase');
        });
    }

    console.log(`\n\n=== Test Results ===`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Total: ${passed + failed}`);

    if (failed > 0) {
        process.exit(1);
    }
}

runTests();
