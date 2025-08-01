function saveOptions(imageQuality, replaceAll) {
    browser.storage.sync.set({
        // defaults
        imageQuality: imageQuality,
        replaceAll: replaceAll
    }).then(() => {
        //console.log('Options saved:', { imageQuality, replaceAll });
    }).catch((error) => {
        console.error('Error saving options:', error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // get the options elements
    const imageQualitySelect = document.getElementById('imageQuality');
    const replaceAllSelect = document.getElementById('replaceAll');

    // retrieve options from browser storage
    browser.storage.sync.get({
        // defaults
        imageQuality: 0,
        replaceAll: 0
    }).then((options) => {
        // set option values in popup
        //console.log('Retrieved options in popup.js:', options);
        imageQualitySelect.value = String(options.imageQuality);
        replaceAllSelect.value = String(options.replaceAll);
    }).catch((error) => {
        console.error('Error retrieving options:', error);
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
