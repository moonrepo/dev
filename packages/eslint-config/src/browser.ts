import type eslint from 'eslint';
import { TESTS_LIST } from '@moonrepo/dev';

const config: eslint.Linter.Config = {
	plugins: ['compat'],
	env: {
		browser: true,
	},
	rules: {
		// Warn about invalid API usage but do not fail the build
		'compat/compat': 'warn',
	},
	overrides: [
		{
			files: TESTS_LIST,
			rules: {
				// Disable within tests as its noisy
				'compact/compat': 'off',
			},
		},
	],
};

export default config;
