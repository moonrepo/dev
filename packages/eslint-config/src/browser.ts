import type eslint from 'eslint';
import { TESTS_LIST } from '@beemo/config-constants';

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
			env: {
				browser: false,
			},
			rules: {
				// Disable within tests as its noisy
				'compact/compat': 'off',
			},
		},
	],
};

export default config;
