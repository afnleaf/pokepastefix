function saveOptions(imageQuality, replaceAll) {
    chrome.storage.sync.set({
        imageQuality: imageQuality,
        replaceAll: replaceAll
    }, () => {
        console.log('Options saved:', { imageQuality, replaceAll });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // get the options elements
    const imageQualitySelect = document.getElementById('imageQuality');
    const replaceAllSelect = document.getElementById('replaceAll');

    // retrieve options from chrome storage
    chrome.storage.sync.get({
        // defaults
        imageQuality: 0,
        replaceAll: 0
    }, (options) => {
        // set option values in popup
        console.log('Retrieved options in popup.js:', options);
        imageQualitySelect.value = String(options.imageQuality);
        replaceAllSelect.value = String(options.replaceAll);
    });

    // event listeners
    imageQualitySelect.addEventListener('change', () => {
        const i = parseInt(imageQualitySelect.value);
        const r = parseInt(replaceAllSelect.value);
        saveOptions(i, r);
    });
    replaceAllSelect.addEventListener('change', () => {
        const i = parseInt(imageQualitySelect.value);
        const r = parseInt(replaceAllSelect.value);
        saveOptions(i, r);
    });
});
