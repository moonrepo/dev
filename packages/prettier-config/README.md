# prettier-config-beemo

[![Build Status](https://github.com/beemojs/dev/workflows/Build/badge.svg)](https://github.com/beemojs/dev/actions?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/prettier-config-beemo.svg)](https://www.npmjs.com/package/prettier-config-beemo)
[![npm deps](https://david-dm.org/beemojs/dev.svg?path=packages/prettier-config)](https://www.npmjs.com/package/prettier-config-beemo)

A modern Prettier config that aligns with the community.

```bash
yarn install --dev prettier-config-beemo
```

## Setup

Extend the config from your root `prettier.config.js`.

```js
module.exports = 'prettier-config-beemo';
```

## Features

- Uses tabs over spaces for accessibility compliance.
- Displays arrow parenthesis and trailing commas.
- Includes semi colons and avoids ASI.
- Prefers single quoted strongs and spaces for indentation.
