# babel-preset-moon

![build status](https://img.shields.io/github/workflow/status/moonrepo/dev/Pipeline)
![npm version](https://img.shields.io/npm/v/babel-preset-moon)
![npm license](https://img.shields.io/npm/l/babel-preset-moon)

A modern Babel preset with built-in TypeScript support. Is designed for unit testing, linting, and
local development only -- it _should not_ be used for web applications or package building (use
[Packemon](https://packemon.dev) instead).

```bash
yarn add --dev babel-preset-moon
```

## Setup

Add the preset to your root `babel.config.js`.

```js
module.exports = {
	presets: ['moon'],
};
```

## Features

- Configures the `env` preset for the current Node.js version.
- Enables the `typescript` preset by default. TypeScript everywhere!
- Enables native `async`/`await` and avoids Regenerator.
- Enables `export` default and namespace from syntax.
- Supports the `react` preset and both JSX runtimes.
- Converts `__DEV__`, `__PROD__`, and `__TEST__` to `process.env` checks.
- Wraps `invariant()` in `process.env` conditionals.

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
	presets: [['moon', { decorators: true, react: 'automatic' }]],
};
```
