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


    // function that replaces the image sources
    const newTeamLoaded = (replacements) => {
        // get all articles that contain a pokemon
        const pokemons = document.querySelectorAll("article");
        // loop through all the pokemon
        pokemons.forEach(pokemon => {
            // get pokemon name by splitting before @ and removing space character on end
            var pokemon_name = pokemon.innerText.split("@")[0].slice(0, -1);
            // check if the pokemon has a nickname
            const hasBothParentheses = pokemon_name.includes("(") && pokemon_name.includes(")");
            if (hasBothParentheses) {
                pokemon_name = pokemon_name.match(/\(([^)]+)\)/g)[0]
                pokemon_name = pokemon_name.substring(1, pokemon_name.length - 1);
            }
            // check if pokemon is in the dictionary
            if (pokemon_name in replacements) {
                const imgElement = pokemon.querySelector('.img-pokemon');
                imgElement.src = replacements[pokemon_name];
            }
        });
    }


})();
