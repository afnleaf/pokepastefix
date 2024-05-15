const quality = {
    LOW: 0,
    MED: 1,
    FULL: 2
};

function saveOptions(imageQuality, replaceAll) {
    chrome.storage.sync.set({
        imageQuality: imageQuality,
        replaceAll: replaceAll
    }, function() {
        console.log('Options saved:', { imageQuality, replaceAll });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // get the options elements
    const imageQualitySelect = document.getElementById('imageQuality');
    const replaceAllSelect = document.getElementById('replaceAll');
    // event listeners
    imageQualitySelect.addEventListener('change', function() {
        const i = parseInt(imageQualitySelect.value);
        const r = parseInt(replaceAllSelect.value);
        saveOptions(i, r);
    });
    replaceAllSelect.addEventListener('change', function() {
        const i = parseInt(imageQualitySelect.value);
        const r = parseInt(replaceAllSelect.value);
        saveOptions(i, r);
    });
});
