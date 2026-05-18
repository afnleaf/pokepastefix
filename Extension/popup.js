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

function popup() {
    // pull version from manifest so it stays in sync with manifest.json
    const versionEl = document.querySelector('.version');
    if (versionEl) versionEl.textContent = `v${browser.runtime.getManifest().version}`;

    // retrieve options from browser storage
    browser.storage.sync.get(DEFAULT_OPTIONS).then(options => {
        // set option values in popup
        // key value pairs
        for (const [k, v] of Object.entries(options)) {
            const radio = document.querySelector(`input[name="${k}"][value="${v}"]`);
            if (radio) radio.checked = true;
        }
    }).catch((error) => {
        console.error('Error retrieving options:', error);
    });

    // event listeners
    // should be able to pass one value and have it update
    // main.options is a bit weird in case we change from <header><main><footer>
    // e = element
    document.querySelector('main.options').addEventListener('change', (e) => {
        const type = e.target;
        if (type.matches('input[type="radio"]') && type.checked) {
            saveOption(type.name, parseInt(type.value));
        }
    });
}

document.addEventListener('DOMContentLoaded', popup);
