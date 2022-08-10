# babel-preset-beemo

[![Build Status](https://github.com/beemojs/dev/workflows/Build/badge.svg)](https://github.com/beemojs/dev/actions?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/babel-preset-beemo.svg)](https://www.npmjs.com/package/babel-preset-beemo)
[![npm deps](https://david-dm.org/beemojs/dev.svg?path=packages/babel-preset)](https://www.npmjs.com/package/babel-preset-beemo)

A modern Babel preset with built-in TypeScript support. Is designed for unit testing, linting, and
local development only -- it _should not_ be used for package building, use
[Packemon](https://packemon.dev) instead.

```bash
yarn install --dev babel-preset-beemo
```

## Setup

Add the preset to your root `babel.config.js`.

```js
module.exports = {
	presets: ['beemo'],
};
```

## Features

- Configures the `env` preset for the current Node.js version.
- Enables the `typescript` preset by default. TypeScript everywhere!
- Enables native `async`/`await` and avoids Regenerator.
- Enables `export` default and namespace from syntax.
- Supports the `react` preset and both JSX runtimes.
- Converts `__DEV__` conditionals to `process.env` checks.

## Options

The following options can be passed to the preset.

- `decorators` (`boolean`) - Enable TypeScript decorators. If true, will toggle Babel into loose
  mode. Defaults to `false`.
- `loose` (`boolean`) - Turn on Babel loose mode for all plugins. Defaults to `false`.
- `modules` (`boolean`) - Force transpilation to use ECMA script module syntax. Defaults to `false`
  (`auto` modules).
- `react` (`boolean | classic | automatic`) - Enable the React plugin and the defined JSX runtime.
  Defaults to `false`.
- `targets` (`Record<string, string> | string[] | string`) - Override the target environment.
  Defaults to Node.js `current`.

```js
module.exports = {
	presets: [['beemo', { decorators: true, react: 'automatic' }]],
};
```
