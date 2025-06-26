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
    "arceus-water",
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

const items = {
    "cornerstone mask": "https://www.serebii.net/itemdex/sprites/sv/cornerstonemask.png",
    "hearthflame mask": "https://www.serebii.net/itemdex/sprites/sv/hearthflamemask.png",
    "wellspring mask": "https://www.serebii.net/itemdex/sprites/sv/wellspringmask.png",
    "fairy feather": "https://www.serebii.net/itemdex/sprites/sv/fairyfeather.png",
    "lustrous globe": "https://www.serebii.net/itemdex/sprites/sv/lustrousglobe.png",
    "adamant crystal": "https://www.serebii.net/itemdex/sprites/sv/adamantcrystal.png",
    "griseous core": "https://www.serebii.net/itemdex/sprites/sv/griseouscore.png",
    "custap berry": "https://www.serebii.net/itemdex/sprites/sv/custapberry.png",
};

// encode as route
function encodeName(name) {
    //if (!name) return "unknown";
    
    // Convert to lowercase for consistency
    name = name.toLowerCase();
    
    // Instead of URL encoding, replace problematic characters with hyphens
    // This is more route-friendly and prevents double-encoding issues
    
    // Handle Type: Null and other colon-containing names
    name = name.replaceAll(":", "-");
    
    // Replace spaces with hyphens instead of %20
    name = name.replaceAll(" ", "-");
    
    // Replace apostrophes with empty string or hyphen
    name = name.replaceAll("'", "");
    name = name.replaceAll("'", "");
    
    // Replace other problematic characters
    name = name.replaceAll(".", "");
    name = name.replaceAll("♀", "-f"); // female symbol
    name = name.replaceAll("♂", "-m"); // male symbol
    name = name.replaceAll("é", "e");  // accented e in Flabébé
    name = name.replaceAll("?", "");   // question mark in Farfetch'd
    
    // Remove any remaining unsafe URL characters
    name = name.replace(/[^a-z0-9\-]/g, "");
    
    // Avoid double-hyphens and clean up
    name = name.replace(/\-+/g, "-");
    name = name.replace(/^\-|\-$/g, "");
    
    return name;
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

function appendItemImage(pokemon, itemUrl) {
    // create the image element
    let imgElement = document.createElement('img');
    imgElement.className = 'img-item';
    imgElement.src = `${itemUrl}`;

    // find the div to append it to
    const imgContainer = pokemon.querySelector("div.img");
    if(imgContainer) {
        imgContainer.appendChild(imgElement);
    }
}

function chooseImageQuality(imageQuality) {
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
    return q;
}

const genderRegex = /\(F\)|\(M\)/g;
const nicknameRegex = /\(([^)]+)\)/g;

function parsePokemonInfo(line) {
    let name = line.trim();
    let item = "";

    // check if item exists
    if(line.includes("@")) {
        // get pokemon name by splitting before @ 
        // and removing space character on end
        const split = line.split("@");
        name = split[0].slice(0, -1);
        // for missing items
        item = split[1].trim().toLowerCase();
    }
        
    // check if there is (F) or (M) in the nickname
    const hasGender = genderRegex.test(name);
    if(hasGender) {
        name = name.replace(genderRegex, "").slice(0, -1);
    }

    // check if the pokemon has a nickname
    const hasBothParentheses = name.includes("(") && name.includes(")");
    if(hasBothParentheses) {
        name = name.match(nicknameRegex)[0]
        name = name.substring(1, name.length - 1);
    }

    // check if pokemon is in the dictionary
    name = name.toLowerCase();
    // check for weird names
    if(name in badnames) {
        name = badnames[pokemon_name];
    }

    return { name, item };
}

function shouldReplacePokemon(name, replaceAll) {
    return replaceAll || replacements.includes(name);
}

function main(imageQuality, replaceAll) {
    // set image quality based on option
    let quality = chooseImageQuality(imageQuality);
    // get all articles that contain a pokemon
    const pokemonArticles = document.querySelectorAll("article");

    // loop through all the pokemon
    pokemonArticles.forEach(pokemon => {
        // get first line
        let firstLine = pokemon.innerText.split("\n")[0].trim();
        const { name, item } = parsePokemonInfo(firstLine);

        // handle item image if it is missing
        if(item && items[item]) {
            appendItemImage(pokemon, items[item]);
        }

        // handle pokemon replacement if missing
        if(shouldReplacePokemon(name, replaceAll)) {
            replacePokemon(quality, pokemon, name);
        }
    });
}

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
