function saveOptions(imageQuality, replaceAll, shiny, gens) {
    browser.storage.sync.set({
        // defaults
        imageQuality:   imageQuality,
        replaceAll:     replaceAll,
        shiny:          shiny,
        gens:           gens
    }).then(() => {
        //console.log('Options saved:', { imageQuality, replaceAll });
    }).catch((error) => {
        console.error('Error saving options:', error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // get the options elements
    const imageQualitySelect =  document.getElementById('imageQuality');
    const replaceAllSelect =    document.getElementById('replaceAll');
    const shinySelect =         document.getElementById('shiny');
    const gensSelect =          document.getElementById('gens');

    // retrieve options from browser storage
    browser.storage.sync.get({
        // defaults
        imageQuality:   0,
        replaceAll:     0,
        shiny:          1,
        gens:           0
    }).then((options) => {
        // set option values in popup
        //console.log('Retrieved options in popup.js:', options);
        imageQualitySelect.value =  String(options.imageQuality);
        replaceAllSelect.value =    String(options.replaceAll);
        shinySelect.value =         String(options.shiny);
        gensSelect.value =          String(options.gens);
    }).catch((error) => {
        console.error('Error retrieving options:', error);
    });

    // event listeners
    // should be able to pass one value and have it update 
    // checking each seems bad, so an update function for each one?
    // IMAGE QUALITY
    imageQualitySelect.addEventListener('change', () => {
        const i = parseInt(imageQualitySelect.value);
        const r = parseInt(replaceAllSelect.value);
        const s = parseInt(shinySelect.value);
        const g = parseInt(gensSelect.value);
        saveOptions(i, r, s, g);
    });
    // REPLACE
    replaceAllSelect.addEventListener('change', () => {
        const i = parseInt(imageQualitySelect.value);
        const r = parseInt(replaceAllSelect.value);
        const s = parseInt(shinySelect.value);
        const g = parseInt(gensSelect.value);
        saveOptions(i, r, s, g);
    });
    // SHINY
    shinySelect.addEventListener('change', () => {
        const i = parseInt(imageQualitySelect.value);
        const r = parseInt(replaceAllSelect.value);
        const s = parseInt(shinySelect.value);
        const g = parseInt(gensSelect.value);
        saveOptions(i, r, s, g);
    });
    // GENERATIONS
    gensSelect.addEventListener('change', () => {
        const i = parseInt(imageQualitySelect.value);
        const r = parseInt(replaceAllSelect.value);
        const s = parseInt(shinySelect.value);
        const g = parseInt(gensSelect.value);
        saveOptions(i, r, s, g);
    });
});
