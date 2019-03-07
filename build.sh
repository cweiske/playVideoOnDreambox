#!/bin/sh
set -e

version=$(jq -r .version < src/manifest.json)

filename="dist/playVideoOnDreambox-browser-$version.zip"
test -d dist || mkdir dist

if [ -f "$filename" ]; then
    echo "File exists already: $filename" >&2
    exit 10
fi

cd src
zip -r "../$filename" *

echo "File created: $filename"
