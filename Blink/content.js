// pokemon missing from pokepast.es
const replacements = [
    "poltchageist",
    "sinistcha",
    "sinistcha-masterpiece",
    "ursaluna-bloodmoon",
    "okidogi",
    "munkidori",
    "fezandipiti",
    "ogerpon",
    "ogerpon-cornerstone",
    "ogerpon-hearthflame",
    "ogerpon-wellspring",
    "growlithe-hisui",
    "arcanine-hisui",
    "voltorb-hisui",
    "electrode-hisui",
    "typhlosion-hisui",
    "qwilfish-hisui",
    "overqwil",
    "sneasel-hisui",
    "samurott-hisui",
    "lilligant-hisui",
    "zorua-hisui",
    "zoroark-hisui",
    "braviary-hisui",
    "sliggoo-hisui",
    "goodra-hisui",
    "avalugg-hisui",
    "decidueye-hisui",
    "archaludon",
    "hydrapple",
    "iron boulder",
    "iron crown",
    "raging bolt",
    "gouging fire",
    "terapagos",
    "terapagos-terastal",
    "terapagos-stellar",
    "walking wake",
    "iron leaves",
    "sirfetch’d",
    "zygarde-10%",
    "zygarde-complete",
    "greninja-ash",
    "greninja-bond",
    "pecharunt",
    "arceus-bug",
    "arceus-dark",
    "arceus-dragon",
    "arceus-electric",
    "arceus-fairy",
    "arceus-fighting",
    "arceus-fire",
    "arceus-flying",
    "arceus-ghost",
    "arceus-grass",
    "arceus-ground",
    "arceus-ice",
    "arceus-poison",
    "arceus-psychic",
    "arceus-rock",
    "arceus-steel",
    "dialga-origin",
    "palkia-origin",
];

// incorrectly spelled cases point to the correct spelling
const badnames = {
    "great-tusk": "great tusk",
    "scream-tail": "scream tail",
    "brute-bonnet": "brute bonnet",
    "flutter-mane": "flutter mane",
    "slither-wing": "slither wing",
    "sandy-shocks": "sandy shocks",
    "iron-treads": "iron treads",
    "iron-bundles": "iron bundle",
    "iron-hands": "iron hands",
    "iron-jugulis": "iron jugulis",
    "iron-moth": "iron moth",
    "iron-thorns": "iron thorns",
    "iron-boulder": "iron boulder",
    "iron-crown": "iron crown",
    "iron-leaves": "iron leaves",
    "raging-bolt": "raging bolt",
    "gouging-fire": "gouging fire",
    "walking-wake": "walking wake",
    "cornerstone mask ogerpon": "ogerpon-cornerstone",
    "hearthflame mask ogerpon": "ogerpon-hearthflame",
    "wellspring mask ogerpon": "ogerpon-wellspring",
    "origin forme dialga": "dialga-origin",
    "origin forme palkia": "palkia-origin"
};

// retrieve options from chrome storage
chrome.storage.sync.get({
    // defaults
    imageQuality: 0,
    replaceAll: 0
}).then((options) => {
    // run script using option values
    //console.log('Retrieved options:', options);
    main(options.imageQuality, options.replaceAll);
}).catch((error) => {
    console.error('Error retrieving options:', error);
});

// encode as route
function encodeName(pokemon_name) {
    let route = pokemon_name;
    if(route.includes(" ")) {
        route = route.replace(" ", "%20");
    }
    if(route.includes("'")) {
        route = route.replace("'", "%27");
    }
    if(route.includes("’")) {
        route = route.replace("’", "%27");
    }
    return route;
}

// function that replaces the image sources
function replaceImage(q, imgElement, pokemon_name) {
    const img = new Image();
    let route = encodeName(pokemon_name);
    const imageUrl = `https://chiy.uk/${q}/${route}`;
    img.src = imageUrl;
    img.onload = function() {
        // the image loaded successfully
        imgElement.src = imageUrl;
    };
    img.onerror = function() {
        // an error occurred while loading the image (e.g., 403 Forbidden)
        console.error('Image failed to load: ' + imageUrl);
    };
}

function replacePokemon(q, pokemon, pokemon_name) {
    const imgElement = pokemon.querySelector('.img-pokemon');
    replaceImage(q, imgElement, pokemon_name);
}

function main(imageQuality, replaceAll) {
    // set imageQuality based on option
    let q = "256"; 
    switch(imageQuality) {
        case 0:
            q = "256";
            break;
        case 1:
            q = "1024";
            break;
        case 2:
            q = "full"; 
            break;
        default:
            q = "256"    
    }
    // get all articles that contain a pokemon
    const pokemons = document.querySelectorAll("article");
    // loop through all the pokemon
    pokemons.forEach(pokemon => {
        // get first line
        var first_line = pokemon.innerText.split("\n")[0];
        var pokemon_name = first_line.trim();
        // check if item exists
        if(first_line.includes("@")) {
            // get pokemon name by splitting before @ and removing space character on end
            pokemon_name = first_line.split("@")[0].slice(0, -1);
        }
        // check if there is (F) or (M) in the nickname
        const genderRegex = /\(F\)|\(M\)/g;
        const hasGender = genderRegex.test(pokemon_name);
        if(hasGender) {
            pokemon_name = pokemon_name.replace(genderRegex, "").slice(0, -1);
        }
        // check if the pokemon has a nickname
        const hasBothParentheses = pokemon_name.includes("(") && pokemon_name.includes(")");
        if(hasBothParentheses) {
            pokemon_name = pokemon_name.match(/\(([^)]+)\)/g)[0]
            pokemon_name = pokemon_name.substring(1, pokemon_name.length - 1);
        }
        // check if pokemon is in the dictionary
        pokemon_name = pokemon_name.toLowerCase();
        // check for weird names
        if(pokemon_name in badnames) {
            pokemon_name = badnames[pokemon_name];
        }
        // depends on replaceAll option
        //console.log(pokemon_name);
        if(replaceAll) {
            replacePokemon(q, pokemon, pokemon_name);
        } else {
            if(replacements.includes(pokemon_name)) {
                replacePokemon(q, pokemon, pokemon_name);
            }
        }
    });
}
