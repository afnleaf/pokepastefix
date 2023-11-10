(() => {
    // when new tab is loaded this should run
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        //const {type, value, teamId, replacements} = obj;
        const {type, replacements} = obj;

        if (type === "NEW") {
            //currentTeam = teamId;
            newTeamLoaded(obj.replacements);
        }
    });


    // function that checks each pokemon in the team list
    const newTeamLoaded = (replacements) => {
        // get all articles that contain a pokemon
        const pokemons = document.querySelectorAll("article");
        // loop through all the pokemon
        pokemons.forEach(pokemon => {
            // get first line
            var first_line = pokemon.innerText.split("\n")[0];
            var pokemon_name = first_line.trim();

            // check if item exists
            if (first_line.includes("@")) {
                // get pokemon name by splitting before @ and removing space character on end
                pokemon_name = first_line.split("@")[0].slice(0, -1);
            }

            // check if there is (F) or (M) in the nickname
            const genderRegex = /\(F\)|\(M\)/g;
            const hasGender = genderRegex.test(pokemon_name);
            if (hasGender) {
                pokemon_name = pokemon_name.replace(genderRegex, "").slice(0, -1);
            }
            
            // check if the pokemon has a nickname
            const hasBothParentheses = pokemon_name.includes("(") && pokemon_name.includes(")");
            if (hasBothParentheses) {
                pokemon_name = pokemon_name.match(/\(([^)]+)\)/g)[0]
                pokemon_name = pokemon_name.substring(1, pokemon_name.length - 1);
            }
            
            // check if pokemon is in the dictionary
            if (pokemon_name in replacements) {
                const imgElement = pokemon.querySelector('.img-pokemon');
                //imgElement.src = replacements[pokemon_name];
                replaceImage(imgElement, replacements[pokemon_name], pokemon_name);
            }
        });
    }

    // function that replaces the image sources
    const replaceImage = (imgElement, imageUrl, pokemon_name) => {
        const img = new Image();
        img.src = imageUrl;

        img.onload = function() {
            // The image loaded successfully
            imgElement.src = imageUrl;
        };

        img.onerror = function() {
            // An error occurred while loading the image (e.g., 403 Forbidden)
            console.error('Image failed to load: ' + imageUrl);
            // load in redundancy from images folder
            //imgElement.src = "images/${pokemon_name}.png"
            var localImgUrl = chrome.extension.getURL(`images/${pokemon_name}.png`);
            //var localImgUrl = chrome.runtime.getURL(`./images/${pokemon_name}.png`);
            imgElement.src = localImgUrl;
        };
    }


})();


