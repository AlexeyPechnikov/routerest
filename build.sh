#!/bin/sh
set -e

npm run build

rm -f deb/usr/share/routerest/server.js
mkdir -p deb/usr/share/routerest
cp -r ./build/* deb/usr/share/routerest
# build the package
dpkg-deb --build deb ../routerest.deb

zip -r ../routerest.zip \
    deb src \
    build.sh \
    routerest.dev.sh \
    package.json webpack.common.js webpack.dev.js webpack.prod.js

echo "OK"
