# eslint-config-moon

[![Build Status](https://github.com/moonrepo/dev/workflows/Pipeline/badge.svg)](https://github.com/moonrepo/dev/actions?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/eslint-config-moon.svg)](https://www.npmjs.com/package/eslint-config-moon)

A modern and strict ESLint configuration with optional presets and first-class TypeScript support.
Expands upon the amazing [Airbnb config](https://www.npmjs.com/package/eslint-config-airbnb-base) to
provide the latest ECMAScript features, enforce popular patterns, and align with the wider
community.

```bash
yarn install --dev eslint eslint-config-moon
```

## Setup

Extend the `moon` config in your root `.eslintrc.js`. Additional [presets](#presets) are available
for additional rules.

```js
module.exports = {
	root: true,
	extends: ['moon'],
};
```

### Presets

The following additional configs can also be extended, but are not enabled by default.

- `moon/browser` - Sets the environment to the browser/DOM and enables the
  [compat](https://www.npmjs.com/package/eslint-plugin-compat) plugin. Should _not_ be used with the
  `node` preset.
- `moon/node` - Sets the environment to Node.js and enables the
  [node](https://www.npmjs.com/package/eslint-plugin-node) plugin. Should _not_ be used with the
  `browser` preset.
- `moon/react` - Enables the [react](https://www.npmjs.com/package/eslint-plugin-react),
  [react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks),
  [react-perf](https://www.npmjs.com/package/eslint-plugin-react-perf), and
  [jsx-a11y](https://www.npmjs.com/package/eslint-plugin-jsx-a11y) plugins.
  - Only applies to `*.tsx` files and also extends the `browser` preset.
  - Enables automatic JSX runtime if `react` version is 17+.

## Features

- Extends the [airbnb-base](https://www.npmjs.com/package/eslint-config-airbnb-base) config and
  enables additional rules.
- Prefers named exports over default exports.
- Enforces async/await/promise best practices with the
  [promise](https://www.npmjs.com/package/eslint-plugin-promise) plugin.
- Sorts imports/exports in a logical way using the
  [simple-import-sort](https://www.npmjs.com/package/eslint-plugin-simple-import-sort) plugin.
- Encourages readable tests with the [jest](https://www.npmjs.com/package/eslint-plugin-jest)
  plugin. Only applies to [test](#requirements) files.
- Enables additional awesome rules from the
  [unicorn](https://www.npmjs.com/package/eslint-plugin-unicorn) plugin.
- Automatically sets `parserOptions.project` based on the root `tsconfig.json`.
- Avoids `any` type and unsafe operations.
- Uses tabs over spaces for accessibility compliance.

## Requirements

- Source files must be located in a `src` folder.
- Tests files must end in `*.test.*` and be located within a `tests` or `__tests__` folder.
- Relies on TypeScript for parsing files.
- Root `package.json` contains a Node.js `engine` for the target runtime.
