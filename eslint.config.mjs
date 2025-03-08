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
	{
		files: ['packages/vscode-extension/**/*'],
		rules: {
			'max-classes-per-file': 'off',
			'no-console': 'off',
			'no-nested-ternary': 'off',
			'no-param-reassign': 'off',
			// We want to use exhaustive checks
			'default-case': 'off',
			// Random version conditionals
			'no-magic-numbers': 'off',
			// The `vscode` import isn't real
			'import/no-unresolved': 'off',
			// It doesnt like our `@moonrepo/types` package
			'node/no-unpublished-import': 'off',
		},
	},
]);

// console.log(config);

export default config;
