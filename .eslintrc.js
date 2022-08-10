module.exports = {
	root: true,
	extends: ['beemo/node', 'beemo'],
	globals: {
		BeemoSettings: 'readonly',
	},
	rules: {
		// We import packages from each other
		'global-require': 'off',

		// Rules are ordered in random groups, not alphabetical
		'sort-keys': 'off',

		// Used mainly for version numbers within configs
		'no-magic-numbers': 'off',

		// Config packages are typically a default export
		'import/no-default-export': 'off',
	},
};
