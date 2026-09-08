
// setup event listener so that we can call functions defined in this file
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  let r = false;
  
  // this way we can more easily add other message types if needed
  if (message.type == "fetchPokeApiData") {
    fetchPokeApiData(message.route).then(
      data => sendResponse({ data }),
      error => sendResponse({ error: error.message })
    );
    r = true;
  }
  
  return r;
});

// purely a fetching function for pokeapi
// we need the full response to access all the art urls and the pokemon type
async function fetchPokeApiData(route) {
    let apiUrl = `https://pokeapi.co/api/v2/pokemon/${route}`;
    //console.log(`test: ${route}`);
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error(`PokeAPI error: ${response.status}`);
    }
    //return await response.json();
    return response.json();
}

