#!/bin/bash

build_dir=$(dirname $0);

retrieve_version() {
	awk '/"version":/ { gsub(/.*"version": *"|",?/,""); print }' composer.json | xargs
}

echo "Create temporary directory"
rm -rf "$build_dir/tawkto"
mkdir -p "$build_dir/tawkto"

echo "Copy files"
cp -rt "$build_dir/tawkto" composer.json src
release_version=$(retrieve_version);
cd "$build_dir"
zip -9 -rq "tawkto-shopware-$release_version.zip" "./tawkto"

echo "Cleaning up"
rm -rf "tawkto"

echo "Done building Shopware!"
