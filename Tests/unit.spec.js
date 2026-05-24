import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test.describe('Helper Functions', () => {
    const dataCode = fs.readFileSync(path.join(__dirname, '../Extension/data.js'), 'utf-8');
    const contentCode = fs.readFileSync(path.join(__dirname, '../Extension/content.js'), 'utf-8');
    const contentWithoutBrowser = contentCode.replace(/browser\.storage\.sync\.get[\s\S]*?\}\);/, '');

    test('encodeName: converts to lowercase', async ({ page }) => {
        await page.setContent('<!DOCTYPE html><html><body></body></html>');
        const result = await page.evaluate(([data, content]) => {
            eval(data);
            eval(content);
            return encodeName('Pikachu');
        }, [dataCode, contentWithoutBrowser]);
        expect(result).toBe('pikachu');
    });

    test('encodeName: replaces spaces with hyphens', async ({ page }) => {
        await page.setContent('<!DOCTYPE html><html><body></body></html>');
        const result = await page.evaluate(([data, content]) => {
            eval(data);
            eval(content);
            return encodeName('King Ra');
        }, [dataCode, contentWithoutBrowser]);
        expect(result).toBe('king-ra');
    });

    test('parsePokemonInfo: parses simple pokemon name', async ({ page }) => {
        await page.setContent('<!DOCTYPE html><html><body></body></html>');
        const result = await page.evaluate(([data, content]) => {
            eval(data);
            eval(content);
            return parsePokemonInfo('Pikachu');
        }, [dataCode, contentWithoutBrowser]);
        expect(result.name).toBe('pikachu');
        expect(result.item).toBe('');
    });

    test('parsePokemonInfo: parses pokemon with item', async ({ page }) => {
        await page.setContent('<!DOCTYPE html><html><body></body></html>');
        const result = await page.evaluate(([data, content]) => {
            eval(data);
            eval(content);
            return parsePokemonInfo('Pikachu @ Light Ball');
        }, [dataCode, contentWithoutBrowser]);
        expect(result.name).toBe('pikachu');
        expect(result.item).toBe('light ball');
    });

    test('chooseImageQuality: returns 256 for quality 0', async ({ page }) => {
        await page.setContent('<!DOCTYPE html><html><body></body></html>');
        const result = await page.evaluate(([data, content]) => {
            eval(data);
            eval(content);
            return chooseImageQuality(0);
        }, [dataCode, contentWithoutBrowser]);
        expect(result).toBe('256');
    });

    test('chooseImageQuality: returns full for quality 1', async ({ page }) => {
        await page.setContent('<!DOCTYPE html><html><body></body></html>');
        const result = await page.evaluate(([data, content]) => {
            eval(data);
            eval(content);
            return chooseImageQuality(1);
        }, [dataCode, contentWithoutBrowser]);
        expect(result).toBe('full');
    });

    test('chooseShiny: returns false for shiny 0', async ({ page }) => {
        await page.setContent('<!DOCTYPE html><html><body></body></html>');
        const result = await page.evaluate(([data, content]) => {
            eval(data);
            eval(content);
            return chooseShiny(0, '');
        }, [dataCode, contentWithoutBrowser]);
        expect(result).toBe(false);
    });

    test('chooseShiny: returns true for shiny 2', async ({ page }) => {
        await page.setContent('<!DOCTYPE html><html><body></body></html>');
        const result = await page.evaluate(([data, content]) => {
            eval(data);
            eval(content);
            return chooseShiny(2, '');
        }, [dataCode, contentWithoutBrowser]);
        expect(result).toBe(true);
    });

    test('findShinyLine: finds shiny: yes', async ({ page }) => {
        await page.setContent('<!DOCTYPE html><html><body></body></html>');
        const result = await page.evaluate(([data, content]) => {
            eval(data);
            eval(content);
            return findShinyLine('shiny: yes');
        }, [dataCode, contentWithoutBrowser]);
        expect(result).toBe(true);
    });

    test('findShinyLine: returns false for shiny: no', async ({ page }) => {
        await page.setContent('<!DOCTYPE html><html><body></body></html>');
        const result = await page.evaluate(([data, content]) => {
            eval(data);
            eval(content);
            return findShinyLine('shiny: no');
        }, [dataCode, contentWithoutBrowser]);
        expect(result).toBe(false);
    });
});
