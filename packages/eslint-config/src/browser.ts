import type eslint from 'eslint';
import { CONFIGS_LIST, TESTS_LIST } from '@moonrepo/dev';

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
			files: [...CONFIGS_LIST, ...TESTS_LIST],
			rules: {
				// Disable within tests as its noisy
				'compact/compat': 'off',
			},
		},
	],
};

export default config;
