# moon Development

[![Build Status](https://github.com/moonrepo/dev/workflows/Build/badge.svg)](https://github.com/moonrepo/dev/actions?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/%40moon%config-babel.svg)](https://www.npmjs.com/package/@moon/config-babel)
[![npm deps](https://david-dm.org/moonrepo/dev.svg?path=packages/config-babel)](https://www.npmjs.com/package/@moon/config-babel)

This repository is a collection of moon owned and maintained configurations and presets for common
developer tools -- primarily tools used by the moon project and its authors.

It aims to provide a modern, developer accessible, convention over configuration approach to
TypeScript (and React) only projects!

## Packages

The following packages are not tied to [moon](https://moon.dev) directly, and can be used
stand-alone within their respective tools.

- [babel-preset-moon](./packages/babel-preset) - Babel preset that utilizes `env`, `typescript`, and
  `react` presets.
- [eslint-config-moon](./packages/eslint-config) - ESLint config that extends `airbnb`, `unicorn`,
  `react`, and a handful of other plugins.
- [jest-preset-moon](./packages/jest-preset) - Jest preset that utilizes the circus runner, and
  provides code coverage.
- [prettier-config-moon](./packages/prettier-config) - Prettier config that aligns with community
  standards.
- [tsconfig-moon](./packages/tsconfig) - TypeScript configs for normal, react, and workspace based
  projects.

And last but not least, the `dev` package that pieces everything together to provide an official
moon [configuration module](https://moon.dev/docs/provider).

- [@moon/dev](./packages/dev) - Pre-packaged configuration module for general use (if you don't want
  to manage your own).

## Contributing

So... all these configs are personal preference and won't change drastically. You're welcome to use
them as-is, but changes are unlikely to land. Feel free to create an issue otherwise so that we can
discuss the intended change.

### Why tabs over spaces?

The JavaScript ecosystem heavily prefers spaces over tabs. However, tabs are more accessible as they
allow developers with vision impairments to control their indentation and improve its readability.
Preferring accessibility compliance over a stylistic choice is always the better option.
