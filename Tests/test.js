import { spawn } from 'child_process';

function runCommand(command, args) {
    return new Promise((resolve, reject) => {
        const proc = spawn(command, args, { stdio: 'inherit' });
        proc.on('close', code => {
            resolve(code);
        });
        proc.on('error', reject);
    });
}

async function runTests() {
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║       POKEPASTEFIX TEST SUITE           ║');
    console.log('╚════════════════════════════════════════╝\n');

    const code = await runCommand('npx', ['playwright', 'test']);

    if (code !== 0) {
        process.exit(1);
    }

    console.log('\n╔════════════════════════════════════════╗');
    console.log('║     ✅ ALL TESTS PASSED                 ║');
    console.log('╚════════════════════════════════════════╝\n');
}

runTests().catch(error => {
    console.error('Test suite error:', error);
    process.exit(1);
});
