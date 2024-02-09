import type eslint from 'eslint';
import { ECMA_VERSION } from '@moonrepo/dev';

const config: eslint.Linter.Config = {
	parser: '@typescript-eslint/parser',
	extends: [
		'airbnb-base',
		// Order is important!
		require.resolve('./base.js'),
		require.resolve('./typescript.js'),
		require.resolve('./async.js'),
		require.resolve('./module.js'),
		require.resolve('./unicorn.js'),
		require.resolve('./tests.js'),
		// Add prettier last so it properly turns off rules
		'prettier',
	],
	env: {
		[`es${ECMA_VERSION}`]: true,
	},
	globals: {
		__DEV__: 'readonly',
		__PROD__: 'readonly',
		__TEST__: 'readonly',
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: ECMA_VERSION,
	},
	reportUnusedDisableDirectives: true,
	// We cant define rules here otherwise they override the ones
	// in the extending configs above. This is bad for actual `overrides`!
	rules: {},
};

export default config;
