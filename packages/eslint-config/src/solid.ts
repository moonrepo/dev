import type eslint from 'eslint';
import solidPlugin from 'eslint-plugin-solid';
import browserConfig from './browser';

const solidConfig: eslint.Linter.Config = {
	name: 'moon:solid',
	files: ['**/*.ts', '**/*.tsx'],
	// @ts-expect-error Not typed
	plugins: { solid: solidPlugin },
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
	},
};

export default [browserConfig, solidPlugin.configs.typescript, solidConfig];
