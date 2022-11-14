import type eslint from 'eslint';
import { CASE_SENSITIVE, getParentNodeRuntime } from '@moonrepo/dev';

const nodeVersion = getParentNodeRuntime();

// The following rules are either overriding Airbnb's defaults,
// or they are enabling new rules that aren't in Airbnb yet.
const config: eslint.Linter.Config = {
	rules: {
		// Use tabs instead of spaces for accessibility
		indent: ['error', 'tab'],
		'no-tabs': 'off',

		// Annoying as some class methods are nice to not be static
		'class-methods-use-this': 'off',

		// Encourage breaking up code when applicable
		complexity: ['error', 11],

		// Allow either kind of comments (docblocks vs inline)
		'multiline-comment-style': 'off',

		// Always prefer object destructuring, but array is optional
		'prefer-destructuring': [
			'error',
			{
				object: true,
				array: false,
			},
		],

		// Always sort object members for better readability
		'sort-keys': [
			'error',
			'asc',
			{
				caseSensitive: CASE_SENSITIVE,
				natural: true,
			},
		],

		// Avoid bad or problematic syntax/patterns
		'no-constant-binary-expression': 'error',
		'no-constant-condition': 'error',
		'no-constructor-return': 'error',
		'no-div-regex': 'error',
		'no-dupe-else-if': 'error',
		'no-empty-static-block': 'error',
		'no-import-assign': 'error',
		'no-native-reassign': 'error',
		'no-promise-executor-return': 'error',
		'no-setter-return': 'error',
		'no-unreachable-loop': 'error',
		'no-unsafe-optional-chaining': ['error', { disallowArithmeticOperators: true }],
		'no-unused-private-class-members': 'error',
		'no-useless-call': 'error',
		'require-atomic-updates': 'error',

		// Prefer compact syntax when applicable
		'logical-assignment-operators': 'error',
		'prefer-exponentiation-operator': 'error',
		'prefer-regex-literals': ['error', { disallowRedundantWrapping: true }],

		// Prefer explicitness for readability
		'no-implicit-coercion': 'error',

		// Encourage reusable constants with descriptive comments
		'no-magic-numbers': [
			'error',
			{
				ignore: [-3, -2, -1, 0, 1, 2, 3],
				ignoreArrayIndexes: true,
				enforceConst: true,
			},
		],

		// Sounds good in practice but is overkill
		'require-unicode-regexp': 'off',

		// Doesnt scope correctly with `this` in arrow functions
		'no-invalid-this': 'off',

		// Allow modern APIs
		'no-restricted-syntax': 'off',

		// Not available on enough platforms yet
		'prefer-object-has-own': nodeVersion >= 16.9 ? 'error' : 'off',
	},
};

export default config;
