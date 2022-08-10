# Beemo Development

[![Build Status](https://github.com/beemojs/dev/workflows/Build/badge.svg)](https://github.com/beemojs/dev/actions?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/%40beemo%config-babel.svg)](https://www.npmjs.com/package/@beemo/config-babel)
[![npm deps](https://david-dm.org/beemojs/dev.svg?path=packages/config-babel)](https://www.npmjs.com/package/@beemo/config-babel)

This repository is a collection of Beemo owned and maintained configurations and presets for common
developer tools -- primarily tools used by the Beemo project and its authors.

It aims to provide a modern, developer accessible, convention over configuration approach to
TypeScript (and React) only projects!

## Packages

The following packages are not tied to [Beemo](https://beemo.dev) directly, and can be used
stand-alone within their respective tools.

- [babel-preset-beemo](./packages/babel-preset) - Babel preset that utilizes `env`, `typescript`,
  and `react` presets.
- [eslint-config-beemo](./packages/eslint-config) - ESLint config that extends `airbnb`, `unicorn`,
  `react`, and a handful of other plugins.
- [jest-preset-beemo](./packages/jest-preset) - Jest preset that utilizes the circus runner, and
  provides code coverage.
- [prettier-config-beemo](./packages/prettier-config) - Prettier config that aligns with community
  standards.
- [tsconfig-beemo](./packages/tsconfig) - TypeScript configs for normal, react, and workspace based
  projects.

The following packages are configurations meant for
[Beemo drivers](https://beemo.dev/docs/provider), and are based on the packages above.

- [@beemo/config-babel](./packages/config-babel) - Config for the Babel driver.
- [@beemo/config-eslint](./packages/config-eslint) - Config for the ESLint driver.
- [@beemo/config-jest](./packages/config-jest) - Config for the Jest driver.
- [@beemo/config-prettier](./packages/config-prettier) - Config for the Prettier driver.
- [@beemo/config-typescript](./packages/config-typescript) - Config for the TypeScript driver.

And last but not least, the `dev` package that pieces everything together to provide an official
Beemo [configuration module](https://beemo.dev/docs/provider).

- [@beemo/dev](./packages/dev) - Pre-packaged configuration module for general use (if you don't
  want to manage your own).

## Contributing

So... all these configs are personal preference and won't change drastically. You're welcome to use
them as-is, but changes are unlikely to land. Feel free to create an issue otherwise so that we can
discuss the intended change.

### Why tabs over spaces?

The JavaScript ecosystem heavily prefers spaces over tabs. However, tabs are more accessible as they
allow developers with vision impairments to control their indentation and improve its readability.
Preferring accessibility compliance over a stylistic choice is always the better option.
