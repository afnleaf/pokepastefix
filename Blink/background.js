// enum
const quality = {
    LOW: 0,
    MED: 1,
    FULL: 2
};


chrome.runtime.onStartup.addListener(() => {
    // idk
});

/*

// global variables to store options
// low med full
let imageQuality = quality.LOW;
let replaceAll = false;

// listen for messages from content.js
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log("Message received in background.js:", message);
    
    // check for the the type of message sent from content.js
    // when setting data paste must be init
    if (message.type === "") {
        //console.log("Received a setData message");
        //console.log("Data received:", message.data);
    // getData coming from pokebin
    } else if (message.type === "") {
        //console.log("Received a getData message");
    // cover for unknown message
    } else {
        console.log("Unknown message type:", message.type);
    }

    // sendResponse will be called asynchronously
    return true;
});
*/