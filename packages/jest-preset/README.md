# jest-preset-beemo

[![Build Status](https://github.com/beemojs/dev/workflows/Build/badge.svg)](https://github.com/beemojs/dev/actions?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/jest-preset-beemo.svg)](https://www.npmjs.com/package/jest-preset-beemo)
[![npm deps](https://david-dm.org/beemojs/dev.svg?path=packages/babel-preset)](https://www.npmjs.com/package/jest-preset-beemo)

A modern TypeScript-only Jest preset. Provides code coverage and performance out of the box.

```bash
yarn install --dev jest-preset-beemo
```

## Setup

Add the preset to your root `jest.config.js`.

```js
module.exports = {
	preset: 'jest-preset-beemo',
};
```

## Features

- Configured for Node.js environments.
- Defines an empty file mock for non-TS files (like CSS).
- Requires 90% code coverage of all source files.
- Improved performance through the Jest Circus runner.
- Supports `__DEV__` and `__PROD__` globals.

## Requirements

- Source files must be located in a `src` folder.
- Tests files must end in `*.test.*` and be located within a `tests` or `__tests__` folder.
- Includes a setup file at `<rootDir>/tests/setup.ts` (if exists).
- Relies on Babel, the TypeScript plugin, and the default `babel-jest` package.
