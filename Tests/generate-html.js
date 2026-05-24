import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createPaste(testFile, format = null) {
    const filePath = path.join(__dirname, 'cases', testFile);

    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        process.exit(1);
    }

    let content = fs.readFileSync(filePath, 'utf-8');

    // Prepend format metadata if provided
    if (format) {
        content = `Format: ${format}\n\n${content}`;
    }

    const params = new URLSearchParams();
    params.append('paste', content);
    params.append('author', 'pokepastefix-test');
    params.append('title', testFile.replace('.txt', ''));

    try {
        console.log(`Creating paste from ${testFile}...`);
        const response = await fetch('https://pokepast.es/create', {
            method: 'POST',
            body: params.toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow',
        });

        console.log(`Response status: ${response.status}`);
        console.log(`Response URL: ${response.url}`);

        const text = await response.text();
        console.log(`Response length: ${text.length} bytes`);

        if (!response.ok) {
            console.log(`Response preview: ${text.substring(0, 500)}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const pasteUrl = response.url;
        console.log(`Paste created: ${pasteUrl}`);

        // Download the HTML of the paste
        const htmlResponse = await fetch(pasteUrl);
        let html = await htmlResponse.text();

        // Inject format into aside if provided
        if (format) {
            const formatLabel = format.replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase();
            const asideInject = `<p>Format: ${formatLabel}</p>`;
            html = html.replace('</aside>', `${asideInject}\n\t\t</aside>`);
        }

        // Save HTML to file
        const htmlDir = path.join(__dirname, 'html');
        if (!fs.existsSync(htmlDir)) {
            fs.mkdirSync(htmlDir, { recursive: true });
        }

        const htmlFileName = `${testFile.replace('.txt', '')}.html`;
        const htmlPath = path.join(htmlDir, htmlFileName);
        fs.writeFileSync(htmlPath, html);

        console.log(`HTML saved to: ${htmlPath}`);
        return pasteUrl;
    } catch (error) {
        console.error('Error creating paste:', error);
        process.exit(1);
    }
}

// Map files to formats
const formatMap = {
    'gen1.txt': 'gen1ou',
    'gen2.txt': 'gen2ou',
    'gen3.txt': 'gen3ou',
    'gen4.txt': 'gen4ou',
    'gen5.txt': 'gen5ou',
};

// Get all test files or specific file from command line argument
const casesDir = path.join(__dirname, 'cases');
const testFiles = process.argv[2]
    ? [process.argv[2]]
    : fs.readdirSync(casesDir)
        .filter(f => f.endsWith('.txt'))
        .sort();

console.log(`Processing ${testFiles.length} test file(s)...\n`);

for (const testFile of testFiles) {
    const format = formatMap[testFile] || null;
    await createPaste(testFile, format);
    console.log();
}
