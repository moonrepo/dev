import type eslint from 'eslint';
import nodePlugin from 'eslint-plugin-n';
import compatPlugin from 'eslint-plugin-compat';
import globals from 'globals';

const config: eslint.Linter.Config = {
	name: 'moon:node',
	languageOptions: {
		globals: {
			...globals.node,
		},
	},
	plugins: { node: nodePlugin, compat: compatPlugin },
	rules: {
		// Ensure proper error handling
		'node/no-callback-literal': 'error',

		// Ensure NPM packages are valid and can be published to the target engine
		'node/no-deprecated-api': 'error',
		'node/no-unpublished-bin': 'error',
		'node/no-unpublished-import': 'error',
		'node/no-unsupported-features/es-builtins': 'error',
		'node/no-unsupported-features/node-builtins': 'error',
		'node/shebang': 'error',

		// Prefer exitCode instead of exit as it doesnt abort the script
		'no-process-exit': 'error',
		'node/process-exit-as-throw': 'error',

		// Prefer globals when available
		'node/prefer-global/buffer': 'error',
		'node/prefer-global/console': 'error',
		'node/prefer-global/process': 'error',
		'node/prefer-global/text-decoder': 'error',
		'node/prefer-global/text-encoder': 'error',
		'node/prefer-global/url': 'error',
		'node/prefer-global/url-search-params': 'error',

		// Prefer promises APIs when they are available
		'node/prefer-promises/dns': 'error',
		'node/prefer-promises/fs': 'error',

		// We use TypeScript/ES modules instead
		'node/exports-style': 'off',
		'node/no-exports-assign': 'off',
		'node/no-unsupported-features/es-syntax': 'off',

		// Handled by the import plugin
		'node/file-extension-in-import': 'off',
		'node/no-extraneous-import': 'off',
		'node/no-extraneous-require': 'off',
		'node/no-missing-import': 'off',
		'node/no-missing-require': 'off',
		'node/no-unpublished-require': 'off',

		// This is a common occurrence in node scripts
		'global-require': 'off',
		'import/no-dynamic-require': 'off',

		// May be enabled from the browser/react presets, so explicitly disable
		'compat/compat': 'off',
	},
};

export default [config];
