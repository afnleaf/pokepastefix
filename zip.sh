#!/bin/bash

# script to zip extension package from folder contents
# get the location, set output file name
# navigate to dir and zip all files in there

dirExtension=$(dirname "$0")/Extension

zipfileExtension="pokepastefix_pkg.zip"

cd "$dirExtension"
# -FS = filesync (archive mirrors source; removes stale entries)
# -r  = recurse into subdirectories
# -x  = exclude patterns (macOS metadata)
zip -FSr "../$zipfileExtension" . -x "*.DS_Store" -x "__MACOSX/*"
cd ..

echo "saved to : $(pwd)/$zipfileExtension"

