import type eslint from 'eslint';
// @ts-expect-error Not typed
import promisePlugin from 'eslint-plugin-promise';

const config: eslint.Linter.Config = {
	name: 'moon:async',
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	plugins: { promise: promisePlugin },
	rules: {
		'promise/param-names': 'error',
		'promise/valid-params': 'error',

		// Avoid complicated or problematic patterns
		'promise/no-promise-in-callback': 'error',
		'promise/no-new-statics': 'error',

		// Ensure proper control flow
		'promise/catch-or-return': 'error',
		'promise/no-return-wrap': ['error', { allowReject: true }],
		'promise/no-multiple-resolved': 'error',
		'promise/no-nesting': 'error',
		'promise/no-return-in-finally': 'error',

		// Returning isnt always necessary
		'promise/always-return': 'off',

		// Prefer modern APIs
		'promise/no-native': 'off',
		'promise/avoid-new': 'off',
		'promise/prefer-await-to-then': 'error',
		'promise/prefer-await-to-callbacks': 'error',

		// Useful for patching old Node.js APIs
		'promise/no-callback-in-promise': 'off',
	},
};

export default [config];
