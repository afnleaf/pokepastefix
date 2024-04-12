// global variables to store paste data
let paste = "init";
let title = "";
let author = "";

browser.runtime.onStartup.addListener(() => {
    paste = "init";
    title = "";
    author = "";
});

// listen for messages from content.js
browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log("Message received in background.js:", message);
    console.log(paste);
    console.log(title);
    console.log(author);
    
    // check for the the type of message sent from content.js
    // when setting data paste must be init
    if (message.type === "setData" && paste === "init") {
        //console.log("Received a setData message");
        //console.log("Data received:", message.data);

        // set global variables
        title = message.data.title;
        author = message.data.author;
        paste = message.data.paste;
        
        console.log(paste);
        console.log(title);
        console.log(author);
        
        // redirect
        browser.tabs.update({ url: "https://pokebin.com" }, function() {});

    // getData coming from pokebin
    } else if (message.type === "getData" && paste != "init") {
        //console.log("Received a getData message");

        const data = {
            paste: paste,
            title: title,
            author: author
        }

        sendResponse({ data: data });

        // reset
        paste = "init";
        title = "";
        author = "";
    
    // cover for unknown message
    } else {
        console.log("Unknown message type:", message.type);
        // reset variables
        paste == "init";
        title = "";
        author = "";
    }

    // sendResponse will be called asynchronously
    return true;
});
