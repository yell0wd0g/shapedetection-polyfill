#!/bin/bash

# Originally from https://gist.github.com/domenic/ec8b0fc8ab45f39403dd, with my
# modifications for webpack.

SOURCE_BRANCH="master"
TARGET_BRANCH="gh-pages"

# Save some useful information
REPO=`git config remote.origin.url`
SSH_REPO=${REPO/https:\/\/github.com\//git@github.com:}
SHA=`git rev-parse --verify HEAD`

SUPER_REPO="https://$GH_TOKEN@github.com/yellowdoge/shapedetection-polyfill.git"

npm view qrcode-reader

# Run WebPack to generate a bundled client-side js file.
webpack --display-error-details

mkdir out
cd out

git init
git config user.name "Travis CI"
git config user.email "miguelecasassanchez@gmail.compiled"

cp -f ../demo/demo.bundle.* ./

git add .
git commit -m "Auto deploy ${SHA} to GitHub pages branch"
git push --force --quiet $SUPER_REPO master:gh-pages
