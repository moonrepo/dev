import type eslint from 'eslint';
import globals from 'globals';
import { EXTENSIONS_PATTERN, TESTS_LIST } from '@moonrepo/dev';

const testsConfig: eslint.Linter.Config = {
	name: 'moon:tests',
	files: TESTS_LIST,
	languageOptions: {
		globals: {
			...globals.node,
			...globals.jest,
			...globals.vitest,
		},
	},
	rules: {
		// Disable these as it makes writing tests much easier
		'max-classes-per-file': 'off',
		'no-console': 'off',
		'no-magic-numbers': 'off',
		'sort-keys': 'off',
		'promise/prefer-await-to-callbacks': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/no-extraneous-class': 'off',
		'@typescript-eslint/no-useless-constructor': 'off',
		'@typescript-eslint/promise-function-async': 'off',

		// Some imports are dev dependencies
		'import/no-extraneous-dependencies': 'off',

		// Allow `any` in tests for convenience
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-unsafe-argument': 'off',
		'@typescript-eslint/no-unsafe-assignment': 'off',
		'@typescript-eslint/no-unsafe-call': 'off',
		'@typescript-eslint/no-unsafe-member-access': 'off',
		'@typescript-eslint/no-unsafe-return': 'off',

		// Allow relative import paths
		'import/no-relative-packages': 'off',
		'node/no-unpublished-import': 'off',
	},
};

const miscConfig: eslint.Linter.Config = {
	files: [
		'**/{__mocks__,__fixtures__}/**/*',
		`**/{tests,__tests__}/**/{helpers,utils,setup}.{${EXTENSIONS_PATTERN}}`,
	],
	rules: {
		'import/no-commonjs': 'off',

		// Allow `any` in tests for convenience
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-unsafe-argument': 'off',
		'@typescript-eslint/no-unsafe-assignment': 'off',
		'@typescript-eslint/no-unsafe-call': 'off',
		'@typescript-eslint/no-unsafe-member-access': 'off',
		'@typescript-eslint/no-unsafe-return': 'off',
	},
};

// We only want to apply the tests plugin and other testing rules
// when inside of a test specific file. Not the entire codebase.
export default [testsConfig, miscConfig];
