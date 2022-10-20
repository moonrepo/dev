/* eslint-disable sort-keys */

module.exports = {
	rules: {
		'max-classes-per-file': 'off',
		'no-console': 'off',
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
};
