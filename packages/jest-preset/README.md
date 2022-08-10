# jest-preset-moon

[![Build Status](https://github.com/moonrepo/dev/workflows/Pipeline/badge.svg)](https://github.com/moonrepo/dev/actions?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/jest-preset-moon.svg)](https://www.npmjs.com/package/jest-preset-moon)
[![npm deps](https://david-dm.org/moonrepo/dev.svg?path=packages/babel-preset)](https://www.npmjs.com/package/jest-preset-moon)

A modern Jest preset that provides code coverage and performance out of the box.

```bash
yarn install --dev jest-preset-moon
```

## Setup

Add the preset to your root `jest.config.js`.

```js
module.exports = {
	preset: 'jest-preset-moon',
};
```

## Features

- Configured for Node.js environments by default.
- Defines an empty file mock for non-JS/TS files (like CSS).
- Requires 90% code coverage of all source files.
- Improved performance through the Jest Circus runner.
- Supports `__DEV__`, `__PROD__`, and `__TEST__` globals.

## Requirements

- Source files must be located in a `src` folder.
- Tests files must end in `*.test.*` and be located within a `tests` or `__tests__` folder.
- Includes a setup file at `<rootDir>/tests/setup.ts` (if exists).
- Relies on Babel, the TypeScript plugin, and the default `babel-jest` package.
