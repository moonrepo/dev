# prettier-config-moon

[![Build Status](https://github.com/moonrepo/dev/workflows/Pipeline/badge.svg)](https://github.com/moonrepo/dev/actions?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/prettier-config-moon.svg)](https://www.npmjs.com/package/prettier-config-moon)

A modern and accessibility forward Prettier config that aligns with the community.

```bash
yarn install --dev prettier-config-moon
```

## Setup

Extend the config from your root `prettier.config.js` or `.prettierrc.js`.

```js
module.exports = 'prettier-config-moon';
```

## Features

- Uses tabs over spaces for accessibility compliance.
- Displays arrow parenthesis and trailing commas.
- Includes semi colons and avoids ASI.
- Prefers single quoted strongs and spaces for indentation.
