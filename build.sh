#!/bin/bash
npx vite build
mkdir -p dist/app
mv dist/assets dist/app/assets
mv dist/index.html dist/app/index.html
cp public/landing.html dist/index.html
cp public/docs.html dist/docs.html
cp public/brand.html dist/brand.html
cp public/ping-types.html dist/ping-types.html
cp public/manifest.json dist/app/
cp public/sw.js dist/app/
cp public/icon-192.png dist/
cp public/icon-512.png dist/
cp public/favicon.svg dist/
cp public/favicon.png dist/
cp public/apple-touch-icon.png dist/
echo "Build complete"
