# moon development

[![Build Status](https://github.com/moonrepo/dev/workflows/Pipeline/badge.svg)](https://github.com/moonrepo/dev/actions?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/%40moonrepo%dev.svg)](https://www.npmjs.com/package/@moonrepo/dev)
[![npm deps](https://david-dm.org/moonrepo/dev.svg?path=packages/dev)](https://www.npmjs.com/package/@moon/dev)

This repository is a collection of moon owned and maintained configurations and presets for common
developer tools -- primarily tools used by moonrepo and its authors.

It aims to provide a strict, modern, developer accessible, convention over configuration approach to
JavaScript, TypeScript, and React projects!

## Packages

The following packages are not tied to [moon](https://github.com/moonrepo/moon) directly, and can be
used stand-alone within their respective tools.

- [babel-preset-moon](./packages/babel-preset) - Babel preset that utilizes `env`, `typescript`, and
  `react` presets.
- [eslint-config-moon](./packages/eslint-config) - ESLint config that extends `airbnb`, `unicorn`,
  `react`, and a handful of other plugins.
- [jest-preset-moon](./packages/jest-preset) - Jest preset that utilizes the circus runner, and
  provides code coverage.
- [prettier-config-moon](./packages/prettier-config) - Prettier config that aligns with
  accessibility and community standards.
- [tsconfig-moon](./packages/tsconfig) - TypeScript configs for normal, react, and reference based
  projects.

And last but not least, the [@moonrepo/dev](./packages/dev) package that provides helpers, constans,
and more. This should rarely be used directly!

## Contributing

So... all these configs are personal preference and won't change drastically. You're welcome to use
them as-is, but changes are unlikely to land. Feel free to create an issue otherwise so that we can
discuss the intended change.

### Why tabs over spaces?

The JavaScript ecosystem heavily prefers spaces over tabs. However, tabs are more accessible as they
allow developers with vision impairments to control their indentation and improve its readability.
Preferring accessibility compliance over a stylistic choice is always the better option.
