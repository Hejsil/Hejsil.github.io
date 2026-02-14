#!/bin/sh
fd -e png --type f -X oxipng -o max --strip safe
rdfind -makesymlinks true -makeresultsfile false .
symlinks -cr .
