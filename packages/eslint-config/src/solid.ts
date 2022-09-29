import type eslint from 'eslint';

const solidConfig: eslint.Linter.ConfigOverride = {
	files: ['*.ts', '*.tsx'],
	plugins: ['solid'],
	extends: [require.resolve('./browser.js'), 'plugin:solid/typescript'],
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
	},
};

// We only want to apply the React plugin and rules
// to TSX files. Not the entire codebase.
const config: eslint.Linter.Config = {
	overrides: [solidConfig],
};

export default config;
