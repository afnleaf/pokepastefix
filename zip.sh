#!/bin/bash

# Get the directories
dirBlink=$(dirname "$0")/Blink
dirGecko=$(dirname "$0")/Gecko

# Filenames
zipfileBlink="pokepastefix_blink.zip"
zipfileGecko="pokepastefix_gecko.zip"

# navigate to dir and zip all files in there
cd "$dirBlink"
zip -r "../$zipfileBlink" .

# cd out
cd ..

# again
cd "$dirGecko"
zip -r "../$zipfileGecko" .

cd ..
