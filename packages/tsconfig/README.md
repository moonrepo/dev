# tsconfig-moon

![build status](https://img.shields.io/github/workflow/status/moonrepo/dev/Pipeline)
![npm version](https://img.shields.io/npm/v/tsconfig-moon)
![npm license](https://img.shields.io/npm/l/tsconfig-moon)

Pre-packaged, strict, and modern TypeScript `tsconfig.json`s. Each config assumes that TypeScript
will _only_ be used as a type checker and _not_ a compiler.

```bash
yarn add --dev tsconfig-moon
```

## Setup

Extend the config from your root `tsconfig.json`.

```json
{
	"extends": "tsconfig-moon/tsconfig.json",
	"include": ["src/**/*"]
}
```

> Configs only define `compilerOptions` and not `include`, `exclude`, `references`, etc.

## Features

- First-class support for ECMAScript modules and their syntax.
  - Supports synthetic default exports.
  - Enables ES interoperability and isolation.
  - Enables the `esnext` lib.
  - Targets `es2022` (since we only type check).
- Supports project references through the `tsconfig.projects.json` config.
  - Enables declaration emitting.
- Supports React through the `tsconfig.react.json` config.
  - Enables the `dom` lib.
  - Sets JSX transform to `react`.
- Supports Solid.js through the `tsconfig.solid.json` config.
- Strict and performant by default (of course).
- Does _not_ check JavaScript files.
