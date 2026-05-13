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
    // get the options elements
    const elements = {
        imageQuality:     document.getElementById('imageQuality'),
        replaceAll:       document.getElementById('replaceAll'),
        shiny:            document.getElementById('shiny'),
        sprites:          document.getElementById('sprites'),
    }

    // retrieve options from browser storage
    browser.storage.sync.get(DEFAULT_OPTIONS).then(options => {
        // set option values in popup
        for (const [k, e] of Object.entries(elements)) {
            e.value = String(options[k]);
        }
    }).catch((error) => {
        console.error('Error retrieving options:', error);
    });

    // event listeners
    // should be able to pass one value and have it update 
    for (const [k, e] of Object.entries(elements)) {
        e.addEventListener('change', () => {
            const v = parseInt(e.value);
            saveOption(k, v);
        });
    }
});
