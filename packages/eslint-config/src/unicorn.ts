import type eslint from 'eslint';
import unicornPlugin from 'eslint-plugin-unicorn';
import { CONFIGS_LIST } from '@moonrepo/dev';

const config: eslint.Linter.Config = {
	name: 'moon:unicorn',
	plugins: { unicorn: unicornPlugin },
	rules: {
		// Disabled by Prettier: https://github.com/prettier/eslint-config-prettier/blob/main/index.js#L142
		// We need to do this as they may be re-enabled based on config extending order.
		'unicorn/empty-brace-spaces': 'off',
		'unicorn/no-nested-ternary': 'off',
		'unicorn/number-literal-case': 'off',

		// Improve readability
		'unicorn/better-regex': 'error',
		'unicorn/escape-case': 'error',
		'unicorn/no-console-spaces': 'error',
		'unicorn/no-empty-file': 'error',
		'unicorn/no-hex-escape': 'error',
		'unicorn/no-negated-condition': 'error',
		'unicorn/no-typeof-undefined': 'error',
		'unicorn/no-unreadable-iife': 'error',
		'unicorn/no-unsafe-regex': 'error',
		'unicorn/no-zero-fractions': 'error',
		'unicorn/prefer-math-min-max': 'error',
		'unicorn/prefer-native-coercion-functions': 'error',
		'unicorn/prefer-string-raw': 'error',
		'unicorn/prefer-structured-clone': 'error',
		'unicorn/prefer-switch': 'error',
		'unicorn/string-content': 'error',
		'unicorn/relative-url-style': ['error', 'always'],
		'unicorn/text-encoding-identifier-case': 'error',

		// Better error handling and implementation
		'unicorn/catch-error-name': 'error',
		'unicorn/custom-error-definition': 'error',
		'unicorn/error-message': 'error',
		'unicorn/no-thenable': 'error',
		'unicorn/no-useless-promise-resolve-reject': 'error',
		'unicorn/prefer-type-error': 'error',

		// Too abrasive / too many false positives
		'unicorn/consistent-destructuring': 'off',
		'unicorn/consistent-function-scoping': 'off',
		'unicorn/no-keyword-prefix': 'off',
		'unicorn/no-unused-properties': 'off',
		'unicorn/prefer-set-has': 'off',
		'unicorn/prevent-abbreviations': 'off',
		'unicorn/template-indent': 'off',

		// Ensure consistent and correct syntax
		'unicorn/consistent-empty-array-spread': 'error',
		'unicorn/new-for-builtins': 'error',
		'unicorn/no-anonymous-default-export': 'error',
		'unicorn/no-await-in-promise-methods': 'error',
		'unicorn/no-instanceof-array': 'error',
		'unicorn/no-invalid-remove-event-listener': 'error',
		'unicorn/no-negation-in-equality-check': 'error',
		'unicorn/no-new-array': 'error',
		'unicorn/no-new-buffer': 'error',
		'unicorn/no-single-promise-in-promise-methods': 'error',
		'unicorn/no-this-assignment': 'error',
		'unicorn/no-useless-spread': 'error',
		'unicorn/no-useless-switch-case': 'error',
		'unicorn/numeric-separators-style': 'error',
		'unicorn/switch-case-braces': ['error', 'avoid'],
		'unicorn/throw-new-error': 'error',

		// Ensure todo's are finished
		// 'unicorn/expiring-todo-comments': 'error',

		// Be explicit and avoid edge cases
		'unicorn/explicit-length-check': 'error',
		'unicorn/import-style': 'off',
		'unicorn/no-abusive-eslint-disable': 'error',
		'unicorn/no-array-method-this-argument': 'error',
		'unicorn/no-unnecessary-await': 'error',
		'unicorn/no-useless-fallback-in-spread': 'error',
		'unicorn/no-useless-length-check': 'error',
		'unicorn/no-useless-undefined': 'off',
		'unicorn/prefer-negative-index': 'error',
		'unicorn/prefer-prototype-methods': 'error',
		'unicorn/require-array-join-separator': 'error',
		'unicorn/require-number-to-fixed-digits-argument': 'error',
		'unicorn/require-post-message-target-origin': 'error',

		// Doesnt cover the naming requirements I want
		'unicorn/filename-case': 'off',

		// Use compact code when applicable
		'unicorn/no-array-push-push': 'error',
		'unicorn/no-lonely-if': 'error',
		'unicorn/no-static-only-class': 'error',
		'unicorn/prefer-optional-catch-binding': 'error',
		'unicorn/prefer-ternary': 'error',

		// Allow any API
		'unicorn/no-array-for-each': 'off',
		'unicorn/no-array-reduce': 'off',
		'unicorn/no-for-loop': 'off',
		'unicorn/no-null': 'off',
		'unicorn/prefer-regexp-test': 'off',

		// Prefer default parameter values
		'unicorn/prefer-default-parameters': 'error',

		// Prefer object destructuring
		'unicorn/no-object-as-default-parameter': 'error',

		// Avoid array destructuring
		'unicorn/no-unreadable-array-destructuring': 'error',

		// Better handling of Node.js exit
		'unicorn/no-process-exit': 'error',

		// Prefer modern APIs
		'unicorn/no-document-cookie': 'error',
		'unicorn/prefer-add-event-listener': 'error',
		'unicorn/prefer-array-find': 'error',
		'unicorn/prefer-array-flat': 'error',
		'unicorn/prefer-array-flat-map': 'error',
		'unicorn/prefer-array-index-of': 'error',
		'unicorn/prefer-array-some': 'error',
		'unicorn/prefer-code-point': 'error',
		'unicorn/prefer-date-now': 'error',
		'unicorn/prefer-dom-node-append': 'error',
		'unicorn/prefer-dom-node-dataset': 'error',
		'unicorn/prefer-dom-node-remove': 'error',
		'unicorn/prefer-dom-node-text-content': 'error',
		'unicorn/prefer-includes': 'error',
		'unicorn/prefer-keyboard-event-key': 'error',
		'unicorn/prefer-math-trunc': 'error',
		'unicorn/prefer-modern-dom-apis': 'error',
		'unicorn/prefer-modern-math-apis': 'error',
		'unicorn/prefer-module': 'error',
		'unicorn/prefer-node-protocol': 'error',
		'unicorn/prefer-number-properties': 'error',
		'unicorn/prefer-object-from-entries': 'error',
		'unicorn/prefer-query-selector': 'error',
		'unicorn/prefer-reflect-apply': 'error',
		'unicorn/prefer-set-size': 'error',
		'unicorn/prefer-spread': 'error',
		'unicorn/prefer-string-slice': 'error',
		'unicorn/prefer-string-starts-ends-with': 'error',
		'unicorn/prefer-string-trim-start-end': 'error',
		'unicorn/prefer-top-level-await': 'error',

		// Autofixing is abrasive
		'unicorn/prefer-export-from': 'off',

		// Is caught/handled/conflicts by TypeScript instead
		'unicorn/no-array-callback-reference': 'off',
		'unicorn/prefer-json-parse-buffer': 'off',

		// Not available on enough platforms yet
		// TODO: Enable in the future!
		'unicorn/prefer-at': 'error',
		'unicorn/prefer-string-replace-all': 'error',
	},
};

const testConfig: eslint.Linter.Config = {
	files: CONFIGS_LIST,
	rules: {
		'unicorn/prefer-module': 'off',
	},
};

export default [config, testConfig];
