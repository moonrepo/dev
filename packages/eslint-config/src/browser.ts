import type eslint from 'eslint';
import { CONFIGS_LIST, TESTS_LIST } from '@moonrepo/dev';
import compatPlugin from 'eslint-plugin-compat';
import globals from 'globals';

const config: eslint.Linter.Config = {
	name: 'moon:browser',
	languageOptions: {
		globals: {
			...globals.browser,
		},
	},
	plugins: { compat: compatPlugin },
	rules: {
		// Warn about invalid API usage but do not fail the build
		'compat/compat': 'warn',
	},
};

export default [
	config,
	{
		files: [...CONFIGS_LIST, ...TESTS_LIST],
		rules: {
			// Disable within tests as its noisy
			'compact/compat': 'off',
		},
	},
];
