import type eslint from 'eslint';
import solidPlugin from 'eslint-plugin-solid';
// import { type FixupPluginDefinition,fixupPluginRules } from '@eslint/compat';
import browserConfig from './browser';

const solidConfig: eslint.Linter.Config = {
	name: 'moon:solid',
	files: ['**/*.ts', '**/*.tsx'],
	languageOptions: {
		parserOptions: {
			ecmaFeatures: {
				jsx: true,
			},
		},
	},
};

export default [...browserConfig, solidPlugin.configs['flat/typescript'], solidConfig];
