# moon development configs

![build status](https://img.shields.io/github/workflow/status/moonrepo/dev/Pipeline)
![npm version](https://img.shields.io/npm/v/@moonrepo/dev)
![npm license](https://img.shields.io/npm/l/@moonrepo/dev)

This repository is a collection of moon owned and maintained configurations and presets for common
developer tools -- primarily tools used by moonrepo and its authors.

It aims to provide a strict, modern, developer accessible, convention over configuration approach to
JavaScript, TypeScript (first), and React/Solid projects! All of these configs have been designed
for local and developer tooling based development!

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

## FAQ

### Can I contribute changes?

All these configs are personal preference and won't change drastically. You're welcome to use them
as-is, but major changes are unlikely to land. Feel free to create an issue otherwise so that we can
discuss any intended change.

### Why tabs over spaces?

The JavaScript ecosystem heavily prefers spaces over tabs. However, tabs are more accessible as they
allow developers with vision impairments to control their indentation and improve its readability.
Preferring accessibility compliance over a stylistic choice is always the better option.

### How are packages versioned?

To start, this repo utilizes [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/)
for versioning and publishing. We achieve this by requiring a
[specific prefix](https://github.com/beemojs/conventional-changelog-beemo#type) in pull request
titles. With that being said, the versioning strategy is as follows:

- Patch
  - Dependency upgrades.
  - Bug fixes.
- Minor
  - Enabling or disabling settings or lint rules.
  - Adding new dependencies (like babel plugins).
  - Adding new features.
- Major
  - Node.js minimum requirements / upgraes.
  - Major version upgrades for tools (e.g., eslint 7 -> 8).
