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
    //"ogerpon-cornerstone",
    //"ogerpon-hearthflame",
    //"ogerpon-wellspring",
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
    "magearna-original",
    "magearna-mega",
    "magearna-original-mega",
    "greninja-battle-bond",
    "ogerpon-cornerstone-mask",
    "ogerpon-hearthflame-mask",
    "ogerpon-wellspring-mask",
    // Pokemon ZA/Champions additions
    "raichu-mega-x",
    "raichu-mega-y",    
    "clefable-mega",    
    "victreebel-mega",  
    "starmie-mega",     
    "dragonite-mega",   
    "meganium-mega",    
    "feraligatr-mega",  
    "skarmory-mega",    
    "chimecho-mega",    
    "absol-mega-z",     
    "staraptor-mega",   
    "garchomp-mega-z",  
    "lucario-mega-z",   
    "froslass-mega",    
    "heatran-mega",     
    "darkrai-mega",     
    "emboar-mega",      
    "excadrill-mega",   
    "scolipede-mega",   
    "scrafty-mega",     
    "eelektross-mega",  
    "chandelure-mega",  
    "golurk-mega",      
    "chesnaught-mega",  
    "delphox-mega",     
    "greninja-mega",    
    "pyroar-mega",      
    "floette-mega",
    "floette-eternal",
    "meowstic-mega",    
    //"meowstic-m-mega",    
    //"meowstic-f-mega",    
    "malamar-mega",     
    "barbaracle-mega",  
    "dragalge-mega",    
    "hawlucha-mega",    
    "zygarde-mega",     
    "crabominable-mega",
    "golisopod-mega",   
    "drampa-mega",      
    "magearna-mega",    
    //"magearna-original-mega",   
    "zeraora-mega",             
    "falinks-mega",             
    "scovillain-mega",          
    "glimmora-mega",            
    "tatsugiri-curly-mega",           
    "tatsugiri-droopy-mega",    
    "tatsugiri-stretchy-mega",  
    "baxcalibur-mega",
    "great-tusk",   
    "scream-tail",  
    "brute-bonnet", 
    "flutter-mane", 
    "slither-wing",
    "sandy-shocks", 
    "iron-treads",
    "iron-bundle",  
    "iron-hands",
    "iron-jugulis", 
    "iron-moth",
    "iron-thorns",
    "iron-boulder",
    "iron-crown",
    "iron-leaves",
    "raging-bolt",
    "gouging-fire",
    "walking-wake",
    "gouging-fire",
    "raging-bolt",
    "iron-leaves",
    "iron-boulder",
    "iron-crown",

];

// incorrectly spelled cases point to the correct spelling
const badnames = {
    //"great-tusk":     "great tusk",
    //"scream-tail":    "scream tail",
    //"brute-bonnet":   "brute bonnet",
    //"flutter-mane":   "flutter mane",
    //"slither-wing":   "slither wing",
    //"sandy-shocks":   "sandy shocks",
    //"iron-treads":    "iron treads",
    //"iron-bundle":    "iron bundle",
    //"iron-hands":     "iron hands",
    //"iron-jugulis":   "iron jugulis",
    //"iron-moth":      "iron moth",
    //"iron-thorns":    "iron thorns",
    //"iron-boulder":   "iron boulder",
    //"iron-crown":     "iron crown",
    //"iron-leaves":    "iron leaves",
    //"raging-bolt":    "raging bolt",
    //"gouging-fire":   "gouging fire",
    //"walking-wake":   "walking wake",
    //    
    "walking wake":             "walking-wake",
    "gouging fire":             "gouging-fire",
    "raging bolt":              "raging-bolt",
    "iron leaves":              "iron-leaves",
    "iron boulder":             "iron-boulder",
    "iron crown":               "iron-crown",
    "greninja-bond":            "greninja-battle-bond",
    "sinistcha-masterpiece":    "sinistcha",
    "cornerstone mask ogerpon": "ogerpon-cornerstone-mask",
    "hearthflame mask ogerpon": "ogerpon-hearthflame-mask",
    "wellspring mask ogerpon":  "ogerpon-wellspring-mask",
    "origin forme dialga":      "dialga-origin",
    "origin forme palkia":      "palkia-origin",
    "ogerpon-cornerstone":      "ogerpon-cornerstone-mask",
    "ogerpon-wellspring":       "ogerpon-wellspring-mask",
    "ogerpon-hearthflame":      "ogerpon-hearthflame-mask",
    "meowstic-m-mega":          "meowstic-mega",
    "meowstic-f-mega":          "meowstic-mega",
    //"magearna-original-mega": "magearna-original",
    "mega floette":             "floette-mega"
};

// for art we need to use chiy.uk for because it is missing from PokeAPI
const missingPokeApi = [
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
    "arceus-water"
];

const items = {
    "cornerstone mask": "https://www.serebii.net/itemdex/sprites/sv/cornerstonemask.png",
    "hearthflame mask": "https://www.serebii.net/itemdex/sprites/sv/hearthflamemask.png",
    "wellspring mask": "https://www.serebii.net/itemdex/sprites/sv/wellspringmask.png",
    "fairy feather": "https://www.serebii.net/itemdex/sprites/sv/fairyfeather.png",
    "lustrous globe": "https://www.serebii.net/itemdex/sprites/sv/lustrousglobe.png",
    "adamant crystal": "https://www.serebii.net/itemdex/sprites/sv/adamantcrystal.png",
    "griseous core": "https://www.serebii.net/itemdex/sprites/sv/griseouscore.png",
    // new mega stones
    "raichunite x": "https://www.serebii.net/pokedex-sv/evoicon/mega26x.png",
    "raichunite y": "https://www.serebii.net/pokedex-sv/evoicon/mega26y.png",
    "clefablite": "https://www.serebii.net/pokedex-sv/evoicon/mega36.png",
    "victreebelite": "https://www.serebii.net/pokedex-sv/evoicon/mega71.png",
    "starminite": "https://www.serebii.net/pokedex-sv/evoicon/mega121.png",
    "dragoninite": "https://www.serebii.net/pokedex-sv/evoicon/mega149.png",
    "meganiumite": "https://www.serebii.net/pokedex-sv/evoicon/mega154.png",
    "feraligite": "https://www.serebii.net/pokedex-sv/evoicon/mega160.png",
    "skarmorite": "https://www.serebii.net/pokedex-sv/evoicon/mega227.png",
    "chimechite": "https://www.serebii.net/pokedex-sv/evoicon/mega358.png",
    "absolite z": "https://www.serebii.net/pokedex-sv/evoicon/mega359z.png",
    "staraptite": "https://www.serebii.net/pokedex-sv/evoicon/mega398.png",
    "garchompite z": "https://www.serebii.net/pokedex-sv/evoicon/mega445z.png",
    "lucarionite z": "https://www.serebii.net/pokedex-sv/evoicon/mega448z.png",
    "froslassite": "https://www.serebii.net/pokedex-sv/evoicon/mega478.png",
    "heatranite": "https://www.serebii.net/pokedex-sv/evoicon/mega485.png",
    "darkranite": "https://www.serebii.net/pokedex-sv/evoicon/mega491.png",
    "emboarite": "https://www.serebii.net/pokedex-sv/evoicon/mega500.png",
    "excadrite": "https://www.serebii.net/pokedex-sv/evoicon/mega530.png",
    "scolipite": "https://www.serebii.net/pokedex-sv/evoicon/mega545.png",
    "scraftinite": "https://www.serebii.net/pokedex-sv/evoicon/mega560.png",
    "eelektrossite": "https://www.serebii.net/pokedex-sv/evoicon/mega604.png",
    "chandelurite": "https://www.serebii.net/pokedex-sv/evoicon/mega609.png",
    "golurkite": "https://www.serebii.net/pokedex-sv/evoicon/mega623.png",
    "delphoxite": "https://www.serebii.net/pokedex-sv/evoicon/mega655.png",
    "chesnaughtite": "https://www.serebii.net/pokedex-sv/evoicon/mega652.png",
    "greninjite": "https://www.serebii.net/pokedex-sv/evoicon/mega658.png",
    "pyroarite": "https://www.serebii.net/pokedex-sv/evoicon/mega668.png",
    "floettite": "https://www.serebii.net/pokedex-sv/evoicon/mega670.png",
    "meowsticite": "https://www.serebii.net/pokedex-sv/evoicon/mega678.png",
    "malamarite": "https://www.serebii.net/pokedex-sv/evoicon/mega687.png",
    "barbaracite": "https://www.serebii.net/pokedex-sv/evoicon/mega689.png",
    "dragalgite": "https://www.serebii.net/pokedex-sv/evoicon/mega691.png",
    "hawluchanite": "https://www.serebii.net/pokedex-sv/evoicon/mega701.png",
    "zygardite": "https://www.serebii.net/pokedex-sv/evoicon/mega718.png",
    "crabominite": "https://www.serebii.net/pokedex-sv/evoicon/mega740.png",
    "golisopite": "https://www.serebii.net/pokedex-sv/evoicon/mega768.png",
    "drampanite": "https://www.serebii.net/pokedex-sv/evoicon/mega780.png",
    "magearnite": "https://www.serebii.net/pokedex-sv/evoicon/mega801.png",
    "zeraorite": "https://www.serebii.net/pokedex-sv/evoicon/mega807.png",
    "falinksite": "https://www.serebii.net/pokedex-sv/evoicon/mega870.png",
    "scovillainite": "https://www.serebii.net/pokedex-sv/evoicon/mega952.png",
    "glimmoranite": "https://www.serebii.net/pokedex-sv/evoicon/mega970.png",
    "tatsugirinite": "https://www.serebii.net/pokedex-sv/evoicon/mega978.png",
    "baxcalibrite": "https://www.serebii.net/pokedex-sv/evoicon/mega998.png",
};

// encode as route
function encodeName(name) {
    //if (!name) return "unknown";
    
    // Convert to lowercase for consistency
    // Instead of URL encoding, replace problematic characters with hyphens
    // This is more route-friendly and prevents double-encoding issues
    // Handle Type: Null and other colon-containing names
    // Replace spaces with hyphens instead of %20
    // Replace apostrophes with empty string or hyphen
    // Replace other problematic characters
    // female symbol
    // male symbol                name = name.replaceAll(":", "-");
    // accented e in Flabébé
    // question mark in Farfetch'dname = name.replaceAll(" ", "-");
    // Remove any remaining unsafe URL characters
    // Avoid double-hyphens and clean up
    //console.log(`name1: ${name}`);
    name = name.toLowerCase()
        .replaceAll(" ", "-")
        .replaceAll(":", "-")
        .replaceAll("'", "")
        .replaceAll(".", "")
        .replaceAll("♀", "-f")
        .replaceAll("♂", "-m") 
        .replaceAll("é", "e")  
        .replaceAll("?", "")   
        .replace(/[^a-z0-9\-]/g, "")
        .replace(/\-+/g, "-")
        .replace(/^\-|\-$/g, "");
    
    //console.log(`name2: ${name}`);
    return name;
}

async function getImageUrlChiyuk(quality, route) {
    return `https://chiy.uk/${quality}/${route}`;
}

async function getImageUrlPokeApi(shiny, route) {
    let url = `https://pokeapi.co/api/v2/pokemon/${route}`;
    let r = "";
    try {
        //console.log(`test: ${route}`);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`PokeAPI error: ${response.status}`);
        }
        const data = await response.json();
        //console.log(`result: ${result}`);
        // so now we have a response we can try to grab the art
        //r = result["sprites"]["official-artwork"]["front_default"];
        // fallback chain
        // can do this smarter, get to right before front_ -> branch on shiny
        // this doesn't work
        //let art = data?.sprites?.other?.["official-artwork"]? ||
        //          data?.sprites?.other?.["home"]? ||
        //          data?.sprites?.other?.["showdown"]? ||
        //          data?.sprites?;

        //r = (shiny)
        //    ? art.front_shiny 
        //    : art.front_default;


        if(shiny) {
            r = data?.sprites?.other?.["official-artwork"]?.front_shiny ||
                data?.sprites?.other?.["home"]?.front_shiny ||
                data?.sprites?.other?.["showdown"]?.front_shiny ||
                data?.sprites?.front_shiny;
        } else {
            r = 
                data?.sprites?.other?.["official-artwork"]?.front_default ||
                data?.sprites?.other?.["home"]?.front_default ||
                data?.sprites?.other?.["showdown"]?.front_default ||
                data?.sprites?.front_default;
        }

        //console.log(`pokeapi url: ${r}`);
    } catch (error) {
        console.error(error.message);
    }
    return r;
}

// function that replaces the image sources
async function replaceImage(shiny, q, imgElement, pokemon_name) {
    const img = new Image();
    let route = encodeName(pokemon_name);
    //console.log("encoded name: ", route);
    //const imageUrl = `https://chiy.uk/${q}/${route}`;
    // lets try pokeapi, hopefully our encoded name is what works
    // have chiyuk as fallback for some missing art
    //(route in missingPokeApi) 
    let imageUrl = 
        missingPokeApi.includes(route)
        ? await getImageUrlChiyuk(q, route)  
        : await getImageUrlPokeApi(shiny, route);

    if (imageUrl === "") {
        imageUrl = getImageUrlChiyuk(q, route);
    }
    //console.log(`imageUrl: ${imageUrl}`);
    img.src = imageUrl;
    img.onload = function() {
        // the image loaded successfully
        imgElement.src = imageUrl;
        console.log(`replaced: ${imageUrl} ${pokemon_name} ${q}`);
    };
    img.onerror = function() {
        // an error occurred while loading the image (e.g., 403 Forbidden)
        console.error('Image failed to load: ' + imageUrl);
    };
}

async function replacePokemon(shiny, q, pokemon, pokemon_name) {
    const imgElement = pokemon.querySelector('.img-pokemon');
    await replaceImage(shiny, q, imgElement, pokemon_name);
}

function appendItemImage(pokemon, itemUrl) {
    // create the image element
    let imgElement = document.createElement('img');
    imgElement.className = 'img-item';
    imgElement.src = `${itemUrl}`;
    // have to add custom styles to our appended images
    // the new mega stone art from serebii.net was getting squished
    imgElement.style.width = 'auto';
    imgElement.style.height = 'auto';
    imgElement.style.maxWidth = '40px';
    imgElement.style.maxHeight = '40px';

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
        //case 1:
        //    q = "1024";
        //    break;
        case 1:
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
        //console.log(`badname: ${name}`)
        name = badnames[name];
        //console.log(`fixed: ${name}`)
    }

    return { name, item };
}

function shouldReplacePokemon(name, replaceAll) {
    return replaceAll || replacements.includes(name);
}

// already lowercase
function findShinyLine(text) {
    let i = text.indexOf("shiny")
    if(i !== -1) {
        // find next line from i to j
        let j = text.indexOf("\n", i);
        if(j === -1) {
            j = text.length;
        }
        const line = text.substring(i, j);
        const parts = line.split(":");

        if (parts.length < 2) return false;

        // split shiny: yes on colon, get 2nd part
        let b = parts[1].trim();
        return b === "yes";
    }
    return false;
}

async function main(imageQuality, replaceAll, shiny, gens) {
    // set image quality based on option
    let quality = chooseImageQuality(imageQuality)
    //let shinyEnabled = setShinyBool(shiny);
    let s = false;
    // get all articles that contain a pokemon
    const pokemonArticles = document.querySelectorAll("article");

    // concurrency replace all images async
    await Promise.all(
        Array.from(pokemonArticles).map(async pokemon => {
            // get first line
            const text = pokemon.innerText.toLowerCase();
            //let firstLine = text.split("\n")[0].trim();
            let firstNewLine = text.indexOf("\n");
            let firstLine = text.subString(0, firstNewLine).trim();
            let rest = text.subString(firstNewLine + 1);
            const { name, item } = parsePokemonInfo(firstLine);

            switch (shiny) {
                case 0:
                    s = false;
                    break;
                case 1:
                    s = findShinyLine(rest);
                    break;
                case 2:
                    s = true;
                    break;
                default:
                    s = false;
                    break;
            }

            // handle item image if it is missing
            if(item && items[item]) {
                appendItemImage(pokemon, items[item]);
            }

            // handle pokemon replacement if missing
            // also if we have shiny set to true
            if(shouldReplacePokemon(name, replaceAll) || s) {
                await replacePokemon(s, quality, pokemon, name);
            }
        })
    );
}

// retrieve options from browser storage
browser.storage.sync.get({
    // defaults
    imageQuality: 0,
    replaceAll: 0,
    shiny: 0,
    gens: 0,
}).then(async options => {
    // run script using option values
    //console.log('Retrieved options:', options);
    await main(
        options.imageQuality, 
        options.replaceAll, 
        options.shiny, 
        options.gens
    );
}).catch((error) => {
    console.error('Error retrieving options:', error);
});

