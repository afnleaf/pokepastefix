// popup.js
// handles option setting
const DEFAULT_OPTIONS = {
    imageQuality: 0,
    replaceAll: 0,
    shiny: 1,
    sprites: 0,
}

function saveOption(k, v) {
    browser.storage.sync.set({ [k]: v });
}

document.addEventListener('DOMContentLoaded', () => {
    // pull version from manifest so it stays in sync with manifest.json
    const versionEl = document.querySelector('.version');
    if (versionEl) versionEl.textContent = `v${browser.runtime.getManifest().version}`;

    // retrieve options from browser storage
    browser.storage.sync.get(DEFAULT_OPTIONS).then(options => {
        // set option values in popup
        for (const [k, v] of Object.entries(options)) {
            const radio = document.querySelector(`input[name="${k}"][value="${v}"]`);
            if (radio) radio.checked = true;
        }
    }).catch((error) => {
        console.error('Error retrieving options:', error);
    });

    // event listeners
    // should be able to pass one value and have it update
    document.querySelector('main.options').addEventListener('change', (e) => {
        const t = e.target;
        if (t.matches('input[type="radio"]') && t.checked) {
            saveOption(t.name, parseInt(t.value));
        }
    });
});
