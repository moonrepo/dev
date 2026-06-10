import { defineConfig, globalIgnores } from 'eslint/config';
import moonConfig from 'eslint-config-moon';
import moonNodeConfig from 'eslint-config-moon/node';

const config = defineConfig([
	globalIgnores([
		'**/cjs/',
		'**/coverage/',
		'**/esm/',
		'**/lib/',
		'**/mjs/',
		'**/node_modules/',
		'**/*.d.ts',
		'**/*.json',
		'packages/eslint-config/*.js',
		'packages/jest-preset/*.js',
	]),
	...moonConfig,
	...moonNodeConfig,
	{
		rules: {
			// Temporarily disabled
			'unicorn/no-empty-file': 'off',
			'unicorn/prefer-module': 'off',
			'unicorn/prefer-node-protocol': 'off',
		},
	},
	{
		files: ['packages/eslint-config/**/*'],
		rules: { 'no-magic-numbers': 'off', 'sort-keys': 'off', 'import/no-default-export': 'off' },
	},
]);

// console.log(config);

export default config;
