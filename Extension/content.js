// content.js
// the main extension script
// our data.js is set to window global mode cause we don't want to use modules
// replacements, badnames, missingPokeApi, items, GEN_LOOKUP

// API ----------------------------------------------------------------------- /
// https://pokeapi.co/api/v2/pokemon/1/ is a good example of the full response
// we are currently missing any kind of gendered resolution

// this is to grab the Ken Sugimori art, typically used for gens 6-9
function resolveHandDrawn(sprites, shiny) {
  const t = shiny ? "front_shiny" : "front_default";
  return sprites?.other?.["official-artwork"]?.[t] ||
    sprites?.other?.["home"]?.[t] ||
    sprites?.other?.["showdown"]?.[t] ||
    sprites?.[t];
}

// grabs the right url for the sprie image, used for gens 1-5
// gen 1 lacks shinies, so we have to branch the logic there
// see data.js:GEN_LOOKUP for the implementation of the lookup table
// we have gen (1-5), game, animated and other boolean properties
// each gen has diff sprite art, ex: Ruby/Sapphire, Emerald and FRLG
function resolvePixelSprite(sprites, format, shiny) {
  const l = GEN_LOOKUP[format];
  const v = sprites.versions?.[l.gen]?.[l.game];
  const node = l.animated ? v?.["animated"] : v;
  const wantShiny = shiny && !l.noShiny;
  const primary = wantShiny
    ? (l.transparent ? "front_shiny_transparent" : "front_shiny")
    : (l.transparent ? "front_transparent"       : "front_default");
  const secondary = wantShiny ? "front_shiny" : "front_default";
  return node?.[primary] || node?.[secondary] || sprites?.[secondary];
}

// we fetch via background.js because of firefox content security policy
async function fetchPokeApiData(route) {
  const r = await browser.runtime.sendMessage({
    type: "fetchPokeApiData",
    route
  });

  if (r.error) {
    throw new Error(r.error);
  }

  return r.data;
}

// our main API hosted at https://pokeapi.co/
async function getPokeApi(shiny, format, route) {
  let url = "";
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
      url = resolvePixelSprite(sprites, format, shiny);
    } else {
      url = resolveHandDrawn(sprites, shiny);
    }

    //console.log(`pokeapi url: ${r}`);
  } catch (error) {
    console.error(error.message);
  }
  return { url, primaryType };
}

// our fallback server, self-hosted at https://chiy.uk/
// also used for arceus formes
async function getChiyukApi(quality, route) {
  const url = `https://chiy.uk/${quality}/${route}`;
  // arceus forms encode their type in the suffix (e.g. arceus-fire → fire)
  let primaryType = null;
  if (route.startsWith("arceus-")) {
    primaryType = route.split("-")[1];
  }
  return { url, primaryType };
}

// DOM ----------------------------------------------------------------------- /

// function that replaces the image sources
// also returns the pokemon type, could make that work better
// try primary url; on error fall back to backup url once.
const chiyukRegex = /chiy\.uk|\/other\//;
function replaceImage(url, backupUrl, imgElement, pokemon_name, quality) {
  // pokepast.es boxes .img-pokemon at 150x150
  // contain preserves the natural aspect for non-square sources like sprites
  imgElement.style.objectFit = 'contain';
  imgElement.onload = () => {
    // pixel sprites look blurry when scaled, so we use pixelated rendering.
    // non pixel art should not use pixelated scaling
    const isPixelSprite = !chiyukRegex.test(imgElement.currentSrc);
    imgElement.style.imageRendering = isPixelSprite ? 'pixelated' : 'auto';
    console.log(`replaced: ${imgElement.src} ${pokemon_name} ${quality}`);
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

async function replacePokemon(
  isMissing, 
  shiny, 
  format, 
  pokemon, 
  pokemon_name, 
  quality
) {
  let route = encodeName(pokemon_name);
  //console.log("encoded name: ", route);

  // arceus forms: chiy.uk has type-tinted art; 
  // pokeapi only has the default sprite.
  //(route in missingPokeApi)
  const preferChiyuk = missingPokeApi.includes(route);
  // get both api results
  const pokeapi = preferChiyuk 
    ? null 
    : await getPokeApi(shiny, format, route);
  const chiyuk = await getChiyukApi(quality, route);

  // decide what is the main url and what is the backup
  let main, backup;
  if (preferChiyuk) {
    main = chiyuk;
    backup = null;
  } else if (pokeapi?.url) {
    main = pokeapi;
    backup = chiyuk;
  } else {
    main = chiyuk;
    backup = pokeapi;
  }

  const imgElement = pokemon.querySelector('.img-pokemon');

  replaceImage(
    main.url, 
    backup?.url || null, 
    imgElement, 
    pokemon_name,
    quality
  );

  if (isMissing) {
    wrapPokemonName(
      pokemon, 
      main.primaryType || backup?.primaryType
    );
  }   
}

// find the index where the pokemon name ends so we can apply a type span to it
function findPokemonNameEnd(text) {
  // boundary precedence: " @" (item), " (" (gender/nickname), or trim before newline
  // basically decide where to start span
  // a name can be either: pokemon_name @ item or nickname (pokemon_name) @ item
  // or even nickname (pokemon_name) (gender f or m) @ item
  const at = text.indexOf(' @');
  const paren = text.indexOf(' (');

  // if @ exists and (parentheses don't or @ is before first parenthese)
  if (at !== -1 && (paren === -1 || at < paren)) {
    return at;
  }
  // if parenthese exists
  if (paren !== -1) {
    return paren;
  }
  // end of the line is to the next newline or the end of the text
  const end = text.indexOf('\n') === -1
    ? text.length
    : text.indexOf('\n');
  // then get the first line
  // pretty sure we already have code that does this somewhere lol
  // and lets be real grab the substring from the start of the text to "end"
  // then, trim it? THEN get the length? HHAHHAHAHA this is hot garbage
  return text.substring(0, end).trimEnd().length;
}

function createTypeSpan(text, type) {
  const span = document.createElement('span');
  span.className = `type-${type}`;
  span.textContent = text;
  return span;
}

function getFirstLine(pre) {
  let line = "";
  let node = pre.firstChild;

  while (node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.nodeValue;
      const newlineIndex = text.indexOf('\n');
      if (newlineIndex !== -1) {
        line += text.substring(0, newlineIndex);
        break;
      }
      line += text;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      line += node.textContent;
    }
    node = node.nextSibling;
  }

  return line;
}

// wrap the pokemon name in <span class="type-X"> if pokepaste didn't
// pokepaste already styles .type-* classes, so no extra css needed
function wrapPokemonName(pokemon, type) {
  //console.log(`WRAP: ${pokemon}, ${type}`);
  // early returns
  // requires a type to add the correct color
  if (!type) return;
  // pokemon text is inside the pre tag of the pokemon article
  const pre = pokemon.querySelector('pre');
  if (!pre || !pre.firstChild) return;
  // we operate on the first child of the pre node
  const textNode = pre.firstChild;
  // expect text, not <span> or anything else
  if (textNode.nodeType !== Node.TEXT_NODE) return;

  // extract the full first line to get complete species info
  const firstLine = getFirstLine(pre);
  let species = firstLine.trim();

  // check if item exists
  if (species.includes("@")) {
    species = species.split("@")[0].slice(0, -1);
  }

  // check if there is (F) or (M) in the name
  const hasGender = genderRegex.test(species);
  if (hasGender) {
    species = species.replace(genderRegex, "").slice(0, -1);
  }

  // check if the pokemon has a nickname
  const hasBothParentheses = species.includes("(") && species.includes(")");
  if (hasBothParentheses) {
    species = species.match(nicknameRegex)[0];
    species = species.substring(1, species.length - 1);
  }

  if (!species) return;

  // find and wrap the species in the DOM
  let node = textNode;
  let found = false;

  while (node && !found) {
    if (node.nodeType === Node.TEXT_NODE) {
      const idx = node.nodeValue.indexOf(species);
      if (idx !== -1) {
        const before = node.nodeValue.substring(0, idx);
        const after = node.nodeValue.substring(idx + species.length);

        node.nodeValue = before;
        const speciesSpan = createTypeSpan(species, type);
        pre.insertBefore(speciesSpan, node.nextSibling);
        if (after) {
          pre.insertBefore(document.createTextNode(after), speciesSpan.nextSibling);
        }
        found = true;
      }
    }
    node = node.nextSibling;
  }
}

function appendItemImage(pokemon, itemKey) {
  // use third party servers as primary
  let itemUrl = items[itemKey]; 
  // create the image element
  let imgElement = document.createElement('img');
  imgElement.className = 'img-item';
  // needed to protect from 403 errors
  imgElement.referrerPolicy = 'no-referrer';
  // set backup callback
  imgElement.onerror = () => {
    if (!imgElement.src.includes('chiy.uk')) {
      imgElement.src = `https://chiy.uk/items/${itemKey}`;
    }
  }
  imgElement.src = `${itemUrl}`;

  // find the div to append it to
  const imgContainer = pokemon.querySelector("div.img");
  if(imgContainer) {
    imgContainer.appendChild(imgElement);
  }
}


// utils --------------------------------------------------------------------- /
// encode pokemon name as route
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

// parse --------------------------------------------------------------------- /
const genderRegex = /\(F\)|\(M\)/i;
const nicknameRegex = /\(([^)]+)\)/;

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

// options ------------------------------------------------------------------- /
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

// main ---------------------------------------------------------------------- /
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
        appendItemImage(pokemon, item);
      }

      const isMissing = replacements.has(name);
      if(
        isMissing ||                // if missing
          replaceAll ||               // or replace all
          s ||                        // if shiny
          (g && f !== null)           // or if gen is true
      ) {
        await replacePokemon(isMissing, s, f, pokemon, name, q);
      }
    })
  );
}

// entry point
// retrieve options from browser storage
browser.storage.sync.get({
  // defaults
  imageQuality: 0,
  replaceAll: 0,
  shiny: 1,
  sprites: 0,
}).then(async options => {
    // run script using option values
    //console.log('Retrieved options:', options);
    // we should resolve the options here?
    await main(
      options.imageQuality, 
      options.replaceAll, 
      options.shiny, 
      options.sprites
    );
  }).catch((error) => {
    console.error('Error retrieving options:', error);
  });
