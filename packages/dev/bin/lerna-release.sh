#!/usr/bin/bash

GITHUB_TOKEN="${GITHUB_TOKEN:-""}"
GH_TOKEN="${GH_TOKEN:-$GITHUB_TOKEN}"

echo "GITHUB_TOKEN=$GITHUB_TOKEN"
echo "GH_TOKEN=$GH_TOKEN"

# Check for required env vars
if [[ -z "${GH_TOKEN}" ]]; then
	echo "Release requires a GH_TOKEN environment variable."
  exit 1
fi

# Version packages using conventional commits
# yarn lerna version --conventional-commits --changelog-preset conventional-changelog-beemo
--create-release github --push

# Publish packages
# yarn lerna publish from-git
