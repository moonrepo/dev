# jest-preset-moon

![build status](https://img.shields.io/github/workflow/status/moonrepo/dev/Pipeline)
![npm version](https://img.shields.io/npm/v/jest-preset-moon)
![npm license](https://img.shields.io/npm/l/jest-preset-moon)

A modern Jest preset that provides code coverage and performance out of the box.

```bash
yarn add --dev jest-preset-moon
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
