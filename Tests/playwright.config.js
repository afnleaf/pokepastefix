import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: '.',
    reporter: 'line',
    projects: [
        {
            name: 'offline',
            testIgnore: /live\.spec\.js/,
        },
        {
            name: 'live',
            testMatch: /live\.spec\.js/,
            retries: 1,
            timeout: 30_000,
        },
    ],
});
