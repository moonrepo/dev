import { builtinModules } from 'module';
import type eslint from 'eslint';
// @ts-expect-error Not typed
import * as importPlugin from 'eslint-plugin-import';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import {
	CONFIGS_LIST,
	EXTENSIONS,
	IGNORE_LIST,
	NON_JS_REGEX,
	TS_PATH_PREFIX_REGEX,
} from '@moonrepo/dev';

const config: eslint.Linter.Config = {
	name: 'moon:module',
	plugins: {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		import: importPlugin,
		'simple-import-sort': simpleImportSortPlugin,
	},
	settings: {
		'import/extensions': EXTENSIONS,
		'import/ignore': [...IGNORE_LIST, NON_JS_REGEX],
		'import/resolver': {
			node: {
				extensions: [...EXTENSIONS, '.json'],
			},
		},
		'import/parsers': {
			'@typescript-eslint/parser': EXTENSIONS.slice(0, 4),
		},
	},
	// Inherits default import rules from Airbnb config. Will only override differences.
	// https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/imports.js
	rules: {
		// Doesnt play nice with TypeScript
		// https://typescript-eslint.io/docs/linting/troubleshooting#eslint-plugin-import
		'import/default': 'off',
		'import/named': 'off',
		'import/namespace': 'off',
		'import/no-cycle': 'off',
		'import/no-deprecated': 'off',
		'import/no-named-as-default': 'off',
		'import/no-named-as-default-member': 'off',

		// Too controversial / abrasive
		'import/max-dependencies': 'off',
		'import/no-namespace': 'off',
		'import/no-relative-parent-imports': 'off',

		// Ensure import paths are succinct as possible
		'import/no-relative-packages': 'error',
		'import/no-useless-path-segments': [
			'error',
			{
				noUselessIndex: true,
				commonjs: false,
			},
		],

		// Always require an extension for non-JS/TS files
		'import/extensions': [
			'error',
			'ignorePackages',
			{
				cjs: 'always',
				cts: 'always',
				js: 'never',
				jsx: 'never',
				json: 'always',
				mjs: 'always',
				mts: 'always',
				ts: 'never',
				tsx: 'never',
			},
		],

		// Dont resolve custom TS paths, but do others
		'import/no-unresolved': [
			'error',
			{
				commonjs: true,
				caseSensitiveStrict: true,
				ignore: [TS_PATH_PREFIX_REGEX],
			},
		],

		// Prefer modern ESM and MJS code
		'import/no-amd': 'error',
		'import/no-commonjs': [
			'error',
			{
				allowRequire: true,
				allowConditionalRequire: true,
			},
		],
		'import/no-import-module-exports': 'error',

		// Prefer named exports (over default) as they provide a better experience
		'import/no-anonymous-default-export': 'off',
		'import/no-default-export': 'error',
		'import/no-named-export': 'off',
		'import/prefer-default-export': 'off',

		// Sort imports and exports deterministicly
		'sort-imports': 'off',
		'import/order': 'off',
		'simple-import-sort/exports': 'error',
		'simple-import-sort/imports': [
			'error',
			{
				groups: [
					[
						// Side-effects
						String.raw`^\u0000`,
						// Node built-ins
						`^node:`,
						`^(${builtinModules.join('|')})$`,
						// React/Solid NPM packages
						'^react',
						'^@react',
						'^solid',
						// NPM packages
						'^[a-z]',
						// Scoped NPM packages
						'^@[a-z]',
						// Aliased modules
						'^:[a-z]',
						// Parent files
						String.raw`^\.\./`,
						// Sibling files
						String.raw`^\./`,
						// Index file
						String.raw`^\.$`,
						// Everything else
						String.raw`\*`,
					],
				],
			},
		],
	},
};

export default [
	config,
	// Allow default exports from package indexes
	{
		files: ['**/index.*'],
		rules: {
			'import/no-default-export': 'off',
		},
	},
	// Config files have different semantics
	{
		files: CONFIGS_LIST,
		rules: {
			'import/no-commonjs': 'off',
		},
	},
];
