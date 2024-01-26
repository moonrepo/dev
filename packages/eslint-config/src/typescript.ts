import type eslint from 'eslint';
import { getTsProjectForEslint } from '@moonrepo/dev';

const config: eslint.Linter.Config = {
	plugins: ['@typescript-eslint'],
	parserOptions: {
		project: getTsProjectForEslint(),
	},
	rules: {
		// Disabled by Prettier: https://github.com/prettier/eslint-config-prettier/blob/main/index.js#L95
		// We duplicate and keep track of this here so that we dont configure them
		'@typescript-eslint/brace-style': 'off',
		'@typescript-eslint/comma-dangle': 'off',
		'@typescript-eslint/comma-spacing': 'off',
		'@typescript-eslint/func-call-spacing': 'off',
		'@typescript-eslint/indent': 'off',
		'@typescript-eslint/keyword-spacing': 'off',
		'@typescript-eslint/member-delimiter-style': 'off',
		'@typescript-eslint/no-extra-parens': 'off',
		'@typescript-eslint/no-extra-semi': 'off',
		'@typescript-eslint/object-curly-spacing': 'off',
		'@typescript-eslint/semi': 'off',
		'@typescript-eslint/space-before-function-paren': 'off',
		'@typescript-eslint/space-infix-ops': 'off',
		'@typescript-eslint/type-annotation-spacing': 'off',

		// Expands upon base config to handle type annotations
		'default-param-last': 'off',
		'dot-notation': 'off',
		'key-spacing': 'off',
		'lines-between-class-members': 'off',
		'no-array-constructor': 'off',
		'no-dupe-class-members': 'off',
		'no-duplicate-imports': 'off',
		'no-implied-eval': 'off',
		'no-invalid-this': 'off',
		'no-loop-func': 'off',
		'no-loss-of-precision': 'off',
		'no-redeclare': 'off',
		'no-shadow': 'off',
		'no-throw-literal': 'off',
		'no-undef': 'off', // Doesnt find namespaces
		'no-unused-expressions': 'off',
		'no-unused-vars': 'off',
		'no-use-before-define': 'off',
		'no-useless-constructor': 'off',
		'prefer-promise-reject-errors': 'off',
		quotes: 'off',
		'require-await': 'off',
		'no-return-await': 'off',
		'@typescript-eslint/default-param-last': 'error',
		'@typescript-eslint/dot-notation': 'error',
		'@typescript-eslint/key-spacing': 'error',
		'@typescript-eslint/lines-between-class-members': 'error',
		'@typescript-eslint/no-array-constructor': 'error',
		'@typescript-eslint/no-dupe-class-members': 'error',
		'@typescript-eslint/no-duplicate-imports': 'off', // Prefer import plugin
		'@typescript-eslint/no-implied-eval': 'error',
		'@typescript-eslint/no-invalid-this': 'error',
		'@typescript-eslint/no-loop-func': 'error',
		'@typescript-eslint/no-loss-of-precision': 'error',
		'@typescript-eslint/no-redeclare': ['error', { ignoreDeclarationMerge: true }],
		'@typescript-eslint/no-shadow': [
			'error',
			{ ignoreOnInitialization: true, ignoreTypeValueShadow: true },
		],
		'@typescript-eslint/no-throw-literal': 'error',
		'@typescript-eslint/no-unused-expressions': 'error',
		'@typescript-eslint/no-unused-vars': [
			'error',
			{ vars: 'all', args: 'none', caughtErrors: 'all', ignoreRestSiblings: true },
		],
		'@typescript-eslint/no-use-before-define': [
			'error',
			{ classes: true, enums: true, functions: true, typedefs: true, variables: true },
		],
		'@typescript-eslint/no-useless-constructor': 'error',
		'@typescript-eslint/quotes': ['error', 'single', { avoidEscape: true }],
		'@typescript-eslint/require-await': 'error',
		'@typescript-eslint/return-await': ['error', 'in-try-catch'],

		// Overloads should be stacked on top of the original signature
		'@typescript-eslint/adjacent-overload-signatures': 'error',

		// Prefer shorthand and utility types as much as possible
		'@typescript-eslint/array-type': ['error', { default: 'array' }],
		'@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
		'@typescript-eslint/method-signature-style': 'error',
		'@typescript-eslint/no-inferrable-types': [
			'error',
			{ ignoreParameters: true, ignoreProperties: true }, // Vars only
		],
		'@typescript-eslint/prefer-function-type': 'error',

		// Prefer compact and readable code
		'@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
		'@typescript-eslint/no-redundant-type-constituents': 'error',
		'@typescript-eslint/sort-type-constituents': 'error',
		'@typescript-eslint/strict-boolean-expressions': 'off',

		// Prefer interfaces as extending and composition syntax is much nicer
		'@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
		'@typescript-eslint/no-empty-interface': ['error', { allowSingleExtends: true }],

		// Allow all types (except `any`) as they each serve a specific purpose
		'@typescript-eslint/ban-types': 'off',
		'@typescript-eslint/no-invalid-void-type': 'off',

		// Avoid `any` type as much as possible
		'@typescript-eslint/no-explicit-any': ['error', { ignoreRestArgs: true }],
		'@typescript-eslint/no-unsafe-argument': 'error',
		'@typescript-eslint/no-unsafe-assignment': 'error',
		'@typescript-eslint/no-unsafe-call': 'error',
		'@typescript-eslint/no-unsafe-member-access': 'error',
		'@typescript-eslint/no-unsafe-return': 'error',

		// Await is designed to auto wrap with promises for convenience, so avoid this
		'@typescript-eslint/await-thenable': 'off',

		// Require comments when using ts directives
		'@typescript-eslint/ban-ts-comment': [
			'error',
			{
				'ts-expect-error': 'allow-with-description',
				'ts-ignore': true,
				'ts-nocheck': true,
				'ts-check': false,
				minimumDescriptionLength: 3,
			},
		],
		'@typescript-eslint/ban-tslint-comment': 'error',
		'@typescript-eslint/prefer-ts-expect-error': 'error',
		'@typescript-eslint/triple-slash-reference': [
			'error',
			{ path: 'never', types: 'never', lib: 'never' },
		],

		// Too abrasive or controversial
		'@typescript-eslint/class-literal-property-style': 'off',
		'@typescript-eslint/consistent-type-imports': 'off',
		'@typescript-eslint/naming-convention': 'off',
		'@typescript-eslint/no-dynamic-delete': 'off',
		'@typescript-eslint/no-magic-numbers': 'off',
		'@typescript-eslint/no-require-imports': 'off',
		'@typescript-eslint/no-type-alias': 'off',
		'@typescript-eslint/no-unnecessary-condition': 'off', // Fails on index checks
		'@typescript-eslint/no-var-requires': 'off',
		'@typescript-eslint/prefer-enum-initializers': 'off',
		'@typescript-eslint/prefer-readonly-parameter-types': 'off',
		'@typescript-eslint/prefer-readonly': 'off',
		'@typescript-eslint/prefer-regexp-exec': 'off',
		'@typescript-eslint/require-array-sort-compare': 'off',
		'@typescript-eslint/restrict-template-expressions': 'off',
		'@typescript-eslint/typedef': 'off',
		'@typescript-eslint/unbound-method': ['off', { ignoreStatic: true }],

		// Enforce readable assertion patterns
		'@typescript-eslint/consistent-type-assertions': [
			'error',
			{
				assertionStyle: 'as',
				objectLiteralTypeAssertions: 'allow-as-parameter',
			},
		],
		'@typescript-eslint/no-confusing-non-null-assertion': 'error',
		'@typescript-eslint/no-extra-non-null-assertion': 'error',
		'@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
		'@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/non-nullable-type-assertion-style': 'error',
		'@typescript-eslint/prefer-as-const': 'error',

		// Inference is powerful so allow it
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',

		// Require modifiers when not public
		'@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],

		// Enforce explicit members for readability
		'@typescript-eslint/member-ordering': 'error',
		'@typescript-eslint/parameter-properties': 'error',

		// Prefer basic type casting like String()
		'@typescript-eslint/no-base-to-string': 'error',

		// Ensure promises are handled every time, even with void
		'no-void': 'off',
		'@typescript-eslint/no-confusing-void-expression': ['error', { ignoreVoidOperator: true }],
		'@typescript-eslint/no-floating-promises': [
			'error',
			{
				ignoreIIFE: true,
				ignoreVoid: true,
			},
		],
		'@typescript-eslint/no-misused-promises': ['error', { checksConditionals: true }],
		'@typescript-eslint/promise-function-async': [
			'error',
			{
				allowedPromiseNames: ['Awaitable', 'PromiseLike', 'Thenable'],
				allowAny: true, // Because of unknown
				checkArrowFunctions: false,
			},
		],
		'@typescript-eslint/prefer-promise-reject-errors': 'error',

		// Encourage encapsulation and modular exports
		'@typescript-eslint/no-extraneous-class': 'error',
		'@typescript-eslint/no-namespace': [
			'error',
			{
				allowDeclarations: true,
				allowDefinitionFiles: true,
			},
		],

		// Avoid problematic or unnecessary patterns
		'@typescript-eslint/no-array-delete': 'error',
		'@typescript-eslint/no-duplicate-enum-values': 'error',
		'@typescript-eslint/no-for-in-array': 'error',
		'@typescript-eslint/no-misused-new': 'error',
		'@typescript-eslint/no-this-alias': ['error', { allowDestructuring: true }],
		'@typescript-eslint/no-unnecessary-qualifier': 'error',
		'@typescript-eslint/no-unnecessary-type-assertion': 'error',
		'@typescript-eslint/no-unnecessary-type-constraint': 'error',
		'@typescript-eslint/no-unsafe-unary-minus': 'error',
		'@typescript-eslint/prefer-for-of': 'error',
		'@typescript-eslint/prefer-literal-enum-member': 'error',
		'@typescript-eslint/prefer-reduce-type-parameter': 'error',
		'@typescript-eslint/restrict-plus-operands': ['error', { skipCompoundAssignments: true }],
		'@typescript-eslint/unified-signatures': ['error', { ignoreDifferentlyNamedParameters: true }],

		// Sometimes we need to be explicit because the inference is wrong
		'@typescript-eslint/no-unnecessary-type-arguments': 'off',

		// Sometimes we define empty functions in base/abstract classes
		'no-empty-function': 'off',
		'@typescript-eslint/no-empty-function': 'off',

		// Sometimes necessary because of isolated modules
		'@typescript-eslint/no-useless-empty-export': 'off',

		// Prefer modern syntax
		'@typescript-eslint/prefer-includes': 'error',
		'@typescript-eslint/prefer-namespace-keyword': 'off',
		'@typescript-eslint/prefer-nullish-coalescing': 'error',
		'@typescript-eslint/prefer-optional-chain': 'error',
		'@typescript-eslint/prefer-string-starts-ends-with': 'error',
		'@typescript-eslint/switch-exhaustiveness-check': 'error',
	},
};

export default config;
