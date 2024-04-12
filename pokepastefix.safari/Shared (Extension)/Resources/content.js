const wrongerpons = {
    "CORNERSTONE MASK OGERPON": "Ogerpon-Cornerstone (F) @ Cornerstone Mask",
    "HEARTHFLAME MASK OGERPON": "Ogerpon-Hearthflame (F) @ Hearthflame Mask",
    "WELLSPRING MASK OGERPON": "Ogerpon-Wellspring (F) @ Wellspring Mask"
};

console.log("hello from content");

// Collect data from the DOM if the current page is pokepast.es
if (window.location.href.includes("pokepast.es")) {
    console.log("hello pokepaste");
    
    // capture the pokemon paste string
    let paste = "";
    const pokemons = document.querySelectorAll("article");
    pokemons.forEach(pokemon => {
        //console.log(pokemon.innerText);
        // get first line
        let pokemonLines = pokemon.innerText.split("\n");
        let firstLine = pokemonLines[0];
        let pokemonName = firstLine.trim();
        // check if item exists
        if(firstLine.includes("@")) {
            // get pokemon name by splitting before @ and removing space character on end
            pokemonName = firstLine.split("@")[0].slice(0, -1);
        }
        if (pokemonName.toUpperCase() in wrongerpons) {
            pokemonLines[0] = wrongerpons[pokemonName.toUpperCase()];
        }

        pokemonLines.forEach(line => {
            paste += line;
            paste += "\n";
        });
        //paste += pokemon.innerText;
        paste += "\n";
    });
    // capture title
    const titleElement = document.querySelector('h1');
    const title = titleElement.textContent.trim();
    // capture author
    const authorElement = document.querySelector('h2');
    const author = authorElement.textContent.trim();

    // put data in json
    const data = {
        title: title,
        author: author,
        paste: paste
    }
    const message = {
        type: "setData",
        data: data
    }

    // send to background.js
    browser.runtime.sendMessage(message);

    /*
    chrome.runtime.sendMessage(message, function(response) {
        console.log("Response from background.js:", response);
    });
    */
}

// pokebin only
if (window.location.href.includes("pokebin.com")) {
    console.log("hello pokebin");

    const message = {
        type: "getData"
    }
    // get data from background
    browser.runtime.sendMessage(message, function(response) {
        //console.log("Response from background script:", response);

        // set paste
        const textarea = document.getElementById("paste");
        textarea.value = response.data.paste;
        // set title
        const titleInput = document.getElementById('title');
        titleInput.value = response.data.title;
        // set author
        const authorInput = document.getElementById('author');
        authorInput.value = response.data.author;

        // click the button to submit paste
        const button = document.querySelector(".bg-indigo-700");
        button.click();
    });
}
