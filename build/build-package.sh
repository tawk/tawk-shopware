#!/bin/bash

build_dir=$(dirname $0);

retrieve_version() {
	awk '/"version":/ { gsub(/.*"version": *"|",?/,""); print }' composer.json | xargs
}

echo "Create temporary directory"
rm -rf "$build_dir/TawktoWidget"
mkdir -p "$build_dir/TawktoWidget"

echo "Copy files"
cp -rt "$build_dir/TawktoWidget" composer.json src
release_version=$(retrieve_version);
cd "$build_dir"
if [ "$1" = "--marketplace" ]; then
	cd "TawktoWidget"
	zip -9 -rq "../TawktoWidget.zip" .
	cd ..
else
	zip -9 -rq "tawkto-shopware-$release_version.zip" . -i "./TawktoWidget/*"
fi

echo "Cleaning up"
rm -rf "TawktoWidget"

echo "Done building Shopware!"
