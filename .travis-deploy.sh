#!/bin/bash

# Originally from https://gist.github.com/domenic/ec8b0fc8ab45f39403dd, with my
# modifications for webpack.

SOURCE_BRANCH="master"
TARGET_BRANCH="gh-pages"

# Save some useful information
REPO=`git config remote.origin.url`
SSH_REPO=${REPO/https:\/\/github.com\//git@github.com:}
SHA=`git rev-parse --verify HEAD`

mkdir out
cd out

git init
git config user.name "Travis CI"
git config user.email "miguelecasassanchez@gmail.compiled"

git remote add upstream "https://$GH_TOKEN@github.com/miguelao/shapedetection-polyfill.git"
git fetch upstream -v
REV=$(git rev-parse --short HEAD)

# If there are no changes to the compiled out (e.g. this is a README update) then just bail.
if [ -z `git diff --exit-code` ]; then
    echo "No changes to the output on this push; exiting."
    exit 0
fi

# Run WebPack to generate a bundled client-side js file.
webpack --display-error-details
