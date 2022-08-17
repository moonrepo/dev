import type eslint from 'eslint';

const config: eslint.Linter.ConfigOverride = {
	files: ['*.ts', '*.tsx'],
	plugins: ['solid'],
	extends: [require.resolve('./browser.js'), 'plugin:solid/typescript'],
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
	},
};

export default config;
