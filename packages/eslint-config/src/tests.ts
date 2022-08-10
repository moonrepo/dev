import type eslint from 'eslint';
import { EXTENSIONS_PATTERN, TESTS_LIST } from '@moonrepo/dev';

const jestConfig: eslint.Linter.ConfigOverride = {
	files: TESTS_LIST,
	plugins: ['jest'],
	env: {
		jest: true,
		'jest/globals': true,
	},
	rules: {
		// Prefer `it` over `test`
		'jest/consistent-test-it': 'error',
		'jest/require-top-level-describe': 'error',
		'jest/valid-describe-callback': 'error',
		'jest/valid-expect': 'error',

		// Ensure we are expecting/asserting correctly
		'jest/expect-expect': 'error',
		'jest/no-conditional-in-test': 'error',
		'jest/no-if': 'off', // deprecated
		'jest/no-standalone-expect': 'error',
		'jest/prefer-expect-resolves': 'error',

		// Ensure our tests are deterministic
		'jest/no-interpolation-in-snapshots': 'error',
		'jest/no-large-snapshots': 'off',

		// Encourage readable titles and descriptions
		'jest/no-identical-title': 'error',
		'jest/prefer-lowercase-title': 'off',
		'jest/valid-title': 'error',

		// Prefer explicit APIs for better readability
		'jest/no-alias-methods': 'error',
		'jest/no-deprecated-functions': 'error',
		'jest/no-duplicate-hooks': 'error',
		'jest/no-jasmine-globals': 'error',
		'jest/no-restricted-matchers': 'off',
		'jest/no-test-prefixes': 'error',
		'jest/prefer-hooks-on-top': 'error',
		'jest/prefer-to-be': 'error',
		'jest/prefer-to-contain': 'error',
		'jest/prefer-to-have-length': 'error',
		'jest/prefer-todo': 'error',
		'jest/require-to-throw-message': 'error',

		// Prefer wrapping instead of mutating test subjects
		'jest/prefer-spy-on': 'error',

		// Prefer async/await/promises over callbacks (duh)
		'jest/no-done-callback': 'error',
		'jest/no-test-return-statement': 'error',
		'jest/valid-expect-in-promise': 'off',

		// Avoid invalid or skipped tests from being on master
		'jest/no-commented-out-tests': 'off',
		'jest/no-disabled-tests': 'error',
		'jest/no-focused-tests': 'error',

		// Use fixtures or helper files instead
		'jest/no-export': 'error',
		'jest/no-mocks-import': 'error',

		// Too abrasive and annoying
		'jest/prefer-expect-assertions': 'off',
		'jest/prefer-snapshot-hint': 'off',
		'jest/prefer-strict-equal': 'off',
		'jest/require-hook': 'off',
		'jest/unbound-method': 'off',

		// Hooks are nice / is shared state an issue? Revisit?
		'jest/no-hooks': 'off',

		// Sometimes we only want to check that its called... Revisit?
		'jest/prefer-called-with': 'off',

		// This is nice for catching and testing errors... Revisit?
		'jest/no-conditional-expect': 'off',
	},
};

const testsConfig: eslint.Linter.ConfigOverride = {
	files: TESTS_LIST,
	env: {
		node: true,
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
		'@typescript-eslint/no-implicit-any-catch': 'off',
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

const miscConfig: eslint.Linter.ConfigOverride = {
	files: [
		'**/{__mocks__,__fixtures__}/**/*',
		`**/{tests,__tests__}/**/{helpers,utils,setup}.{${EXTENSIONS_PATTERN}}`,
	],
	rules: {
		'import/no-commonjs': 'off',

		// Allow exports from these files
		'jest/no-export': 'off',

		// Allow composable / factoried unit tests
		'jest/require-top-level-describe': 'off',

		// Allow `any` in tests for convenience
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-unsafe-argument': 'off',
		'@typescript-eslint/no-unsafe-assignment': 'off',
		'@typescript-eslint/no-unsafe-call': 'off',
		'@typescript-eslint/no-unsafe-member-access': 'off',
		'@typescript-eslint/no-unsafe-return': 'off',
	},
};

// We only want to apply the Jest plugin and other testing rules
// when inside of a test specific file. Not the entire codebase.
const config: eslint.Linter.Config = {
	overrides: [jestConfig, testsConfig, miscConfig],
};

export default config;
