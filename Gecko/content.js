const replacements = {   
    "main": {
        "POLTCHAGEIST": "https://i.postimg.cc/HkXBkZSv/Poltchageist.png",
        "SINISTCHA": "https://i.postimg.cc/nz0dtXdH/Sinistcha.png",
        "SINISTCHA-MASTERPIECE": "https://i.postimg.cc/nz0dtXdH/Sinistcha.png",
        "URSALUNA-BLOODMOON": "https://i.postimg.cc/nzR1P6zr/Ursaluna-Bloodmoon.png",
        "OKIDOGI": "https://i.postimg.cc/YS78G6Zr/Okidogi.png",
        "MUNKIDORI": "https://i.postimg.cc/bNGmKN1h/Munkidori.png",
        "FEZANDIPITI": "https://i.postimg.cc/855RMtHS/Fezandipiti.png",
        "OGERPON": "https://i.postimg.cc/02LVxRCJ/Ogerpon.png",
        "OGERPON-CORNERSTONE": "https://i.postimg.cc/GpP7q7GT/Ogerpon-Cornerstone.png",
        "OGERPON-HEARTHFLAME": "https://i.postimg.cc/K8MsgvYN/Ogerpon-Hearthflame.png",
        "OGERPON-WELLSPRING": "https://i.postimg.cc/TPvNjMLX/Ogerpon-Wellspring.png",
        "GROWLITHE-HISUI": "https://i.postimg.cc/qB1FP5Y8/Growlithe-Hisui.png",
        "ARCANINE-HISUI": "https://i.postimg.cc/htW168SL/Arcanine-Hisui.png",
        "VOLTORB-HISUI": "https://i.postimg.cc/JhQxbyCb/Voltorb-Hisui.png",
        "ELECTRODE-HISUI": "https://i.postimg.cc/52BSVH0Z/Electrode-Hisui.png",
        "TYPHLOSION-HISUI": "https://i.postimg.cc/cH4mTsdP/Typhlosion-Hisui.png",
        "QWILFISH-HISUI": "https://i.postimg.cc/j5s89H4g/Qwilfish-Hisui.png",
        "OVERQWIL": "https://i.postimg.cc/X7hzJynq/Overqwil-Hisui.png",
        "SNEASEL-HISUI": "https://i.postimg.cc/XN12HyGL/Sneasel-Hisui.png",
        "SAMUROTT-HISUI": "https://i.postimg.cc/HnNBVfDR/Samurott-Hisui.png",
        "LILLIGANT-HISUI": "https://i.postimg.cc/VL5hmFQ2/Lilligant-Hisui.png",
        "ZORUA-HISUI": "https://i.postimg.cc/15NKv7ZR/Zorua-Hisui.png",
        "ZOROARK-HISUI": "https://i.postimg.cc/qqWxky2d/Zoroark-Hisui.png",
        "BRAVIARY-HISUI": "https://i.postimg.cc/5yXmdnY3/Braviary-Hisui.png",
        "SLIGGOO-HISUI": "https://i.postimg.cc/yxxL6750/Sliggoo-Hisui.png",
        "GOODRA-HISUI": "https://i.postimg.cc/CKJCRWb7/Goodra-Hisui.png",
        "AVALUGG-HISUI": "https://i.postimg.cc/h4YrbW63/Avalugg-Hisui.png",
        "DECIDUEYE-HISUI": "https://i.postimg.cc/KYmrvZ34/Decidueye-Hisui.png",
        "ARCHALUDON": "https://i.postimg.cc/qR1ZH3qK/Archaludon.png",
        "HYDRAPPLE": "https://i.postimg.cc/8zv3fcX8/Hydrapple.png",
        "IRON BOULDER": "https://i.postimg.cc/g0qT45PN/Iron-Boulder.png",
        "IRON CROWN": "https://i.postimg.cc/X7G1tXbZ/Iron-Crown.png",
        "RAGING BOLT": "https://i.postimg.cc/m2JJrCwN/Raging-Bolt.png",
        "GOUGING FIRE": "https://i.postimg.cc/ZqhQ8mXW/Gouging-Fire.png",
        "TERAPAGOS": "https://i.postimg.cc/5yG76WwN/Terapagos.png",
        "TERAPAGOS-TERASTAL": "https://i.postimg.cc/PJNVX5vR/Terapagos-Terastal.png",
        "TERAPAGOS-STELLAR": "https://i.postimg.cc/mDL6nwLR/Terapagos-Stellar.png",
        "WALKING WAKE": "https://i.postimg.cc/DyQgcCLg/Walking-Wake.png",
        "IRON LEAVES": "https://i.postimg.cc/MpWY3yY8/Iron-Leaves.png",
        "SIRFETCH’D": "https://i.postimg.cc/pVQQkhDH/Sirfetchd.png",
        "ZYGARDE-10%": "https://i.postimg.cc/sDVYLjcZ/Zygarde-10p.png",
        "ZYGARDE-COMPLETE": "https://i.postimg.cc/cLCQsFPx/Zygarde-Complete.png",
        "GRENINJA-ASH": "https://i.postimg.cc/Pr2Wsg3V/Greninja-Ash.png",
        "GRENINJA-BOND": "https://i.postimg.cc/Pr2Wsg3V/Greninja-Ash.png",
        "PECHARUNT": "https://i.postimg.cc/pLwqZSwk/Pecharunt.png",
        "ARCEUS-BUG": "https://i.postimg.cc/d1yWKgc6/Arceus-Bug.png",
        "ARCEUS-DARK": "https://i.postimg.cc/fTx6dtFC/Arceus-Dark.png",
        "ARCEUS-DRAGON": "https://i.postimg.cc/rwM7Ny2k/Arceus-Dragon.png",
        "ARCEUS-ELECTRIC": "https://i.postimg.cc/R0b8mc6S/Arceus-Electric.png",
        "ARCEUS-FAIRY": "https://i.postimg.cc/wBBPnWB4/Arceus-Fairy.png",
        "ARCEUS-FIGHTING": "https://i.postimg.cc/XJRzG4kt/Arceus-Fighting.png",
        "ARCEUS-FIRE": "https://i.postimg.cc/bJD5wskQ/Arceus-Fire.png",
        "ARCEUS-FLYING": "https://i.postimg.cc/x15hxr9b/Arceus-Flying.png",
        "ARCEUS-GHOST": "https://i.postimg.cc/nrqwqgdr/Arceus-Ghost.png",
        "ARCEUS-GRASS": "https://i.postimg.cc/59zGcQxJ/Arceus-Grass.png",
        "ARCEUS-GROUND": "https://i.postimg.cc/R0qsgNPj/Arceus-Ground.png",
        "ARCEUS-ICE": "https://i.postimg.cc/HkYP7SbW/Arceus-Ice.png",
        "ARCEUS-POISON": "https://i.postimg.cc/28FKypbX/Arceus-Poison.png",
        "ARCEUS-PSYCHIC": "https://i.postimg.cc/YqwPt29W/Arceus-Psychic.png",
        "ARCEUS-ROCK": "https://i.postimg.cc/CxcrCj4G/Arceus-Rock.png",
        "ARCEUS-STEEL": "https://i.postimg.cc/fbFHpDpk/Arceus-Steel.png"
    },
    "backup": {
        "POLTCHAGEIST": "https://i.postimg.cc/x8TVcZkQ/Poltchageist.png",
        "SINISTCHA": "https://i.postimg.cc/cLKZRPF4/Sinistcha.png",
        "SINISTCHA-MASTERPIECE": "https://i.postimg.cc/cLKZRPF4/Sinistcha.png",
        "URSALUNA-BLOODMOON": "https://i.postimg.cc/ncWfh0n8/Ursaluna-Bloodmoon.png",
        "OKIDOGI": "https://i.postimg.cc/1XCh6K6q/Okidogi.png",
        "MUNKIDORI": "https://i.postimg.cc/bNVp2qHB/Munkidori.png",
        "FEZANDIPITI": "https://i.postimg.cc/ncjw0Zf5/Fezandipiti.png",
        "OGERPON": "https://i.postimg.cc/bwKP3L50/Ogerpon.png",
        "OGERPON-CORNERSTONE": "https://i.postimg.cc/T3h2kK3x/Ogerpon-Cornerstone.png",
        "OGERPON-HEARTHFLAME": "https://i.postimg.cc/MTJWKtbZ/Ogerpon-Hearthflame.png",
        "OGERPON-WELLSPRING": "https://i.postimg.cc/zBwqLW0C/Ogerpon-Wellspring.png",
        "GROWLITHE-HISUI": "https://i.postimg.cc/kMF5Drp0/Growlithe-Hisui.png",
        "ARCANINE-HISUI": "https://i.postimg.cc/cC526Ly7/Arcanine-Hisui.png",
        "VOLTORB-HISUI": "https://i.postimg.cc/W1JLFg4d/Voltorb-Hisui.png",
        "ELECTRODE-HISUI": "https://i.postimg.cc/tCw8jJzp/Electrode-Hisui.png",
        "TYPHLOSION-HISUI": "https://i.postimg.cc/Yq0w7JKf/Typhlosion-Hisui.png",
        "QWILFISH-HISUI": "https://i.postimg.cc/v8zQbr1M/Qwilfish-Hisui.png",
        "OVERQWIL": "https://i.postimg.cc/yxVs0dbw/Overqwil-Hisui.png",
        "SNEASEL-HISUI": "https://i.postimg.cc/MTY8Zwpt/Sneasel-Hisui.png",
        "SAMUROTT-HISUI": "https://i.postimg.cc/28SC61vW/Samurott-Hisui.png",
        "LILLIGANT-HISUI": "https://i.postimg.cc/13Tmby8q/Lilligant-Hisui.png",
        "ZORUA-HISUI": "https://i.postimg.cc/LX2rbW3P/Zorua-Hisui.png",
        "ZOROARK-HISUI": "https://i.postimg.cc/5tdcwyHn/Zoroark-Hisui.png",
        "BRAVIARY-HISUI": "https://i.postimg.cc/c4rP2wwF/Braviary-Hisui.png",
        "SLIGGOO-HISUI": "https://i.postimg.cc/fLsNhyDJ/Sliggoo-Hisui.png",
        "GOODRA-HISUI": "https://i.postimg.cc/FKg63ZXH/Goodra-Hisui.png",
        "AVALUGG-HISUI": "https://i.postimg.cc/tRrLB2Z1/Avalugg-Hisui.png",
        "DECIDUEYE-HISUI": "https://i.postimg.cc/htm6PnCx/Decidueye-Hisui.png",
        "ARCHALUDON": "https://i.postimg.cc/SRjt0b2n/Archaludon.png",
        "HYDRAPPLE": "https://i.postimg.cc/MK6pQPkv/Hydrapple.png",
        "IRON BOULDER": "https://i.postimg.cc/Nfdf76Yb/Iron-Boulder.png",
        "IRON CROWN": "https://i.postimg.cc/3wH6kq6q/Iron-Crown.png",
        "RAGING BOLT": "https://i.postimg.cc/Rh8p4pKX/Raging-Bolt.png",
        "GOUGING FIRE": "https://i.postimg.cc/PxXR4wdz/Gouging-Fire.png",
        "TERAPAGOS": "https://i.postimg.cc/bYFBxrWk/Terapagos.png",
        "TERAPAGOS-TERASTAL": "https://i.postimg.cc/MKC3L4WG/Terapagos-Terastal.png",
        "TERAPAGOS-STELLAR": "https://i.postimg.cc/kMfdk7Zg/Terapagos-Stellar.png",
        "WALKING WAKE": "https://i.postimg.cc/43zDwGVZ/Walking-Wake.png",
        "IRON LEAVES": "https://i.postimg.cc/rprVk74Y/Iron-Leaves.png",
        "SIRFETCH’D": "https://i.postimg.cc/bvkhMkX7/Sirfetchd.png",
        "ZYGARDE-10%": "https://i.postimg.cc/Y9RJKxds/Zygarde-10p.png",
        "ZYGARDE-COMPLETE": "https://i.postimg.cc/yxN2VS5Y/Zygarde-Complete.png",
        "GRENINJA-ASH": "https://i.postimg.cc/XJsDDYJM/Greninja-Ash.png",
        "GRENINJA-BOND": "https://i.postimg.cc/XJsDDYJM/Greninja-Ash.png",
        "PECHARUNT": "https://i.postimg.cc/rsQcjT6z/Pecharunt.png"
    }
};

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
        // load in redundancy from images folder NOT WORKING
        //imgElement.src = "images/${pokemon_name}.png"
        //var localImgUrl = chrome.extension.getURL(`images/${pokemon_name}.png`);
        //var localImgUrl = chrome.runtime.getURL(`./images/${pokemon_name}.png`);
        //var localImgUrl = repl
        //imgElement.src = localImgUrl;

        // load in redundancy from bublagarden.
        replaceImage(imgElement, replacements["backup"][pokemon_name], pokemon_name);
    };
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
    pokemon_name = pokemon_name.toUpperCase();
    if(pokemon_name in replacements["main"]) {
        const imgElement = pokemon.querySelector('.img-pokemon');
        replaceImage(imgElement, replacements["main"][pokemon_name], pokemon_name);
    }
});

