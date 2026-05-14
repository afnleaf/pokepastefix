// pokemon missing from pokepast.es
const replacements = new Set([
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
    "raging-bolt",
    "gouging-fire",
    "walking-wake",
    "iron-leaves",
    "iron-boulder",
    "iron-crown",
]);

// incorrectly spelled cases point to the correct spelling
const badnames = {
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
    // male symbol
    // accented e in Flabébé
    // question mark in Farfetch'd
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
    const url = `https://chiy.uk/${quality}/${route}`;
    // arceus forms encode their type in the suffix (e.g. arceus-fire → fire)
    let primaryType = null;
    if (route.startsWith("arceus-")) {
        primaryType = route.split("-")[1];
    }
    return { url, primaryType };
}

async function fetchPokeApiData(route) {
    let apiUrl = `https://pokeapi.co/api/v2/pokemon/${route}`;
    //console.log(`test: ${route}`);
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error(`PokeAPI error: ${response.status}`);
    }
    return await response.json();
}

function resolveHandDrawn(sprites, shiny) {
    const t = shiny ? "front_shiny" : "front_default";
    return sprites?.other?.["official-artwork"]?.[t] ||
           sprites?.other?.["home"]?.[t] ||
           sprites?.other?.["showdown"]?.[t] ||
           sprites?.[t];
}

function resolvePixelSprite(sprites, format, shiny) {
    const l = GEN_LOOKUP[format];
    const v = sprites.versions?.[l.gen]?.[l.sub];
    const node = l.subsub ? v?.[l.subsub] : v;
    const wantShiny = shiny && !l.noShiny;
    const primary = wantShiny
        ? (l.transparent ? "front_shiny_transparent" : "front_shiny")
        : (l.transparent ? "front_transparent"       : "front_default");
    const secondary = wantShiny ? "front_shiny" : "front_default";
    return node?.[primary] || node?.[secondary] || sprites?.[secondary];
}

async function getPokeApi(shiny, format, route) {
    let image = "";
    let primaryType = null;
    try {
        let data = await fetchPokeApiData(route);
        //if (data) is empty?
        //console.log(`data: ${data}`);
        // get the pokemon's primary type
        const slot1 = data?.types?.find(t => t.slot === 1);
        primaryType = slot1?.type?.name ?? null;
        // so now we have a response we can try to grab the art
        const sprites = data?.sprites;

        if(format !== null) {
            image = resolvePixelSprite(sprites, format, shiny);
        } else {
            image = resolveHandDrawn(sprites, shiny);
        }
            
        //console.log(`pokeapi url: ${r}`);
    } catch (error) {
        console.error(error.message);
    }
    return { url: image, primaryType };
}

// function that replaces the image sources
// also returns the pokemon type, could make that work better
// try primary url; on error fall back to backup url once.
function replaceImage(url, backupUrl, q, imgElement, pokemon_name) {
    // pokepast.es boxes .img-pokemon at 150x150; contain preserves the
    // natural aspect for non-square sources (e.g. gen-5 animated sprites)
    imgElement.style.objectFit = 'contain';
    imgElement.onload = () => {
        // pixel sprites scaled to 150px look blurry under default smoothing.
        // hand-drawn art (chiy.uk, or pokeapi /other/* = official-artwork/home/showdown)
        // is high-res and should keep default rendering.
        const isPixel = !/chiy\.uk|\/other\//.test(imgElement.currentSrc);
        imgElement.style.imageRendering = isPixel ? 'pixelated' : 'auto';
        console.log(`replaced: ${imgElement.src} ${pokemon_name} ${q}`);
    }
    imgElement.onerror = () => {
        if (backupUrl && imgElement.src !== backupUrl) {
            console.warn(`primary failed, trying backup: ${backupUrl}`);
            imgElement.src = backupUrl;
        } else {
            console.error('Image failed to load: ' + imgElement.src);
        }
    }
    imgElement.src = url;
}

async function replacePokemon(shiny, format, q, pokemon, pokemon_name) {
    const imgElement = pokemon.querySelector('.img-pokemon');

    let route = encodeName(pokemon_name);
    //console.log("encoded name: ", route);
    
    // arceus forms: chiy.uk has type-tinted art; 
    // pokeapi only has the default sprite.
    //(route in missingPokeApi)
    const preferChiyuk = missingPokeApi.includes(route);
    const pokeapi = preferChiyuk ? null : await getPokeApi(shiny, format, route);
    const chiyuk = await getImageUrlChiyuk(q, route);
    // need to add backup url, mainUrl, backupUrl
    const main = preferChiyuk ? chiyuk : (pokeapi?.url ? pokeapi : chiyuk);
    const backup = main === chiyuk ? pokeapi : chiyuk;

    replaceImage(main.url, backup?.url || null, q, imgElement, pokemon_name);
    wrapPokemonName(pokemon, main.primaryType || backup?.primaryType);
}

// wrap the pokemon name in <span class="type-X"> when pokepast.es didn't.
// pokepast.es already styles .type-* classes, so no extra css needed.
function wrapPokemonName(pokemon, primaryType) {
    if (!primaryType) return;
    // pokemon text is inside the pretag of the pokemon article
    const pre = pokemon.querySelector('pre');
    if (!pre || !pre.firstChild) return;
    const first = pre.firstChild;
    // already wrapped (firstChild is a <span>), or unexpected node — skip
    if (first.nodeType !== Node.TEXT_NODE) return;

    const text = first.nodeValue;
    // boundary precedence: " @" (item), " (" (gender/nickname), or trim before newline
    const at = text.indexOf(' @');
    const paren = text.indexOf(' (');
    let boundary;
    if (at !== -1 && (paren === -1 || at < paren)) {
        boundary = at;
    } else if (paren !== -1) {
        boundary = paren;
    } else {
        const nl = text.indexOf('\n');
        const end = nl === -1 ? text.length : nl;
        boundary = text.substring(0, end).trimEnd().length;
    }
    if (boundary <= 0) return;

    const displayName = text.substring(0, boundary);
    const rest = text.substring(boundary);

    const nameSpan = document.createElement('span');
    nameSpan.className = `type-${primaryType}`;
    nameSpan.textContent = displayName;

    // pokepast.es also colors the parenthesized species after a nickname
    // (e.g. "volc (Volcarona)"). Detect " (Species)..." and wrap species too.
    // Gender markers (F)/(M) live in a <span class="gender-*">, not the text node,
    // so they won't match here.
    const speciesMatch = rest.match(/^(\s*\()([^)]+)(\)[\s\S]*)$/);
    if (speciesMatch) {
        const [, prefix, species, tail] = speciesMatch;
        const speciesSpan = document.createElement('span');
        speciesSpan.className = `type-${primaryType}`;
        speciesSpan.textContent = species;

        first.nodeValue = tail;
        pre.insertBefore(nameSpan, first);
        pre.insertBefore(document.createTextNode(prefix), first);
        pre.insertBefore(speciesSpan, first);
    } else {
        first.nodeValue = rest;
        pre.insertBefore(nameSpan, first);
    }
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

const genderRegex = /\(F\)|\(M\)/gi;
const nicknameRegex = /\(([^)]+)\)/gi;

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
    //return replaceAll || replacements.includes(name);
    return (replaceAll || replacements.has(name));
}

// already lowercase
function findShinyLine(text) {
    let i = text.indexOf("shiny:")
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

// simple lookup table to match what is found in sprites.version{}
// transparent: prefer front_transparent / front_shiny_transparent (gens 1-2 bake a white bg into front_default)
// noShiny: generation predates shinies — ignore shiny request rather than serving a non-gen sprite
const GEN_LOOKUP = {
    1: { 
        gen: "generation-i",
        sub: "yellow",
        transparent: true, 
        noShiny: true 
    },
    2: { 
        gen: "generation-ii",
        sub: "crystal",
        transparent: true 
    },
    3: { 
        gen: "generation-iii",
        sub: "emerald"
    },
    4: { 
        gen: "generation-iv",
        sub: "platinum"
    },
    5: { 
        gen: "generation-v",
        sub: "black-white", 
        subsub: "animated" 
    },
    // decided against the non sprite generations
    //6: { gen: "generation-vi",      sub: "x-y" },
    //7: { gen: "generation-vii",     sub: "ultra-sun-ultra-moon" },
    //8: { gen: "generation-viii",    sub: ""
    //9: { gen: "generation-ix",      sub: "scarlet"
};

function findFormat() {
    const aside = document.querySelector("aside");
    const text = aside ? aside.innerText.toLowerCase() : "";
    //console.log(text);
    let gen = null;
    if(text !== "") {
        const i = text.indexOf("format:");
        if (i === -1) return null;
        //console.log(text[i]);

        // search for newline from index i
        let j = text.indexOf("\n", i);
        j = j === -1 ? text.length : j;
        //console.log(text[j]);

        const line = text.substring(i, j);
        //console.log("line", line);
        const k = line.indexOf(":");
        const format = line.substring(k, j).trim();
        //console.log(format);

        const match = format.match(/gen(\d+)/);
        // parseInt stops at the first non number
        gen = match ? parseInt(match[1], 10) : null;
        if (gen !== null && !(gen in GEN_LOOKUP)) {
            gen = null;
        }
        //console.log(gen);
    }
    return gen;
}

function chooseShiny(shiny, rest) {
    let s = false;
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
    return s;
}

async function main(imageQuality, replaceAll, shiny, sprites) {

    // --- OPTIONS ---
    // this is whack for variable names
    // set image quality based on option
    const q = chooseImageQuality(imageQuality)
    // find generation from format for sprites
    let g = sprites !== 0;
    let f = g ? findFormat() : null;
    //if(sprites !== 0) {
    //    g = true;
    //}

    // --- READ ---
    // get all articles that contain a pokemon
    const pokemonArticles = document.querySelectorAll("article");
    // concurrency replace all images async
    await Promise.all(
        // --- PARSE ---
        Array.from(pokemonArticles).map(async pokemon => {
            const text = pokemon.innerText.toLowerCase();
            //let firstLine = text.split("\n")[0].trim();
            // get first line
            let firstNewLine = text.indexOf("\n");
            let firstLine = text.substring(0, firstNewLine).trim();
            // everything after first line
            let rest = text.substring(firstNewLine + 1);
            
            // decide if this pokemon needs to be shiny or not
            let s = chooseShiny(shiny, rest);

            // get pokemon name and item
            const { name, item } = parsePokemonInfo(firstLine);

            // --- TRANSFORM ---

            // handle item image if it is missing
            if(item && items[item]) {
                appendItemImage(pokemon, items[item]);
            }

            // handle pokemon replacement if missing
            // also if we have shiny set to true
            // or if gen is true
            if(shouldReplacePokemon(name, replaceAll) || s || g) {
                await replacePokemon(s, f, q, pokemon, name);
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
    sprites: 0,
}).then(async options => {
    // run script using option values
    //console.log('Retrieved options:', options);
    /// we should resolve the options here?
    await main(
        options.imageQuality, 
        options.replaceAll, 
        options.shiny, 
        options.sprites
    );
}).catch((error) => {
    console.error('Error retrieving options:', error);
});

