# prettier-config-moon

![build status](https://img.shields.io/github/workflow/status/moonrepo/dev/Pipeline)
![npm version](https://img.shields.io/npm/v/prettier-config-moon)
![npm license](https://img.shields.io/npm/l/prettier-config-moon)

A modern and accessibility forward Prettier config that aligns with the community.

```bash
yarn add --dev prettier-config-moon
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
