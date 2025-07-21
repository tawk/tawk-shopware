#!/bin/bash

build_dir=$(dirname $0);

retrieve_version() {
	awk '/"version":/ { gsub(/.*"version": *"|",?/,""); print }' composer.json | xargs
}

echo "Create temporary directory"
rm -rf "$build_dir/TawkWidget"
mkdir -p "$build_dir/TawkWidget"

echo "Copy files"
cp -rt "$build_dir/TawkWidget" composer.json src
release_version=$(retrieve_version);
cd "$build_dir"
if [ "$1" = "--marketplace" ]; then
	cd "TawkWidget"
	zip -9 -rq "../TawkWidget.zip" .
	cd ..
else
	zip -9 -rq "tawkto-shopware-$release_version.zip" . -i "./TawkWidget/*"
fi

echo "Cleaning up"
rm -rf "TawkWidget"

echo "Done building Shopware!"
