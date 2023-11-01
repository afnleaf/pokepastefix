// function for loading json file
function loadJSON(url) {
    return fetch(url)
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
            return null;
        });
}

// check to see if new tab opened has pokepaste in it
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        // the tab has finished loading
        if (tab.url && tab.url.includes("pokepast.es/")) {
            // use regex to match the desired part of the URL
            const regex = /\/([^/]+)$/;
            const match = tab.url.match(regex);
            if (match) {
                // when match is found load the json with the dictionary
                try {
                    // load replacement urls from file
                    const url = "replacements.json";
                    const data = await loadJSON(url);
                    // send message to content.js when a pokepaste tab is opened
                    chrome.tabs.sendMessage(tabId, {
                        type: "NEW",
                        replacements: data,
                    })
                } catch (error) {
                    console.error('Error:', error);
                }
            } /*else {
                console.log("No match found in the URL");
            }*/
        }
    }
});
