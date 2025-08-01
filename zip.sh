#!/bin/bash

# script to zip extension package from folder contents
# get the location, set output file name
# navigate to dir and zip all files in there

dirExtension=$(dirname "$0")/Extension

zipfileExtension="pokepastefix_pkg.zip"

cd "$dirExtension"
zip -r "../$zipfileExtension" .
cd ..

