import type eslint from 'eslint';
import { getTargetNodeRuntime } from '@beemo/config-constants';

const nodeVersion = getTargetNodeRuntime();

const config: eslint.Linter.Config = {
	plugins: ['node', 'compat'],
	env: {
		browser: false,
		node: true,
	},
	rules: {
		// Ensure proper error handling
		'node/no-callback-literal': 'error',

		// Ensure NPM packages are valid and can be published to the target engine
		'node/no-deprecated-api': 'error',
		'node/no-unpublished-bin': 'error',
		'node/no-unpublished-import': 'error',
		'node/no-unpublished-require': 'error',
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
		'node/prefer-promises/dns': nodeVersion >= 15 ? 'error' : 'off',
		'node/prefer-promises/fs': nodeVersion >= 14 ? 'error' : 'off',

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

		// This is a common occurrence in node scripts
		'global-require': 'off',
		'import/no-dynamic-require': 'off',

		// May be enabled from the browser/react presets, so explicitly disable
		'compat/compat': 'off',
	},
};

export default config;
