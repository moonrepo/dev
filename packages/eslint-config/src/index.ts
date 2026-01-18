import type eslint from 'eslint';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';
import { ECMA_VERSION } from '@moonrepo/dev';
// @ts-expect-error Not typed
// eslint-disable-next-line import/no-unresolved
import * as tsParser from '@typescript-eslint/parser';
import asyncConfig from './async';
import baseConfig from './base';
import moduleConfig from './module';
import testsConfig from './tests';
import typescriptConfig from './typescript';
// import airbnbConfig from 'eslint-config-airbnb-base';
import unicornConfig from './unicorn';
// import { fixupConfigRules } from '@eslint/compat';

const config: eslint.Linter.Config = {
	name: 'moon:root',
	languageOptions: {
		globals: {
			...globals.browser,
			...globals.node,
			__DEV__: 'readonly',
			__PROD__: 'readonly',
			__TEST__: 'readonly',
		},
		parser: tsParser,
		parserOptions: {
			sourceType: 'module',
			ecmaVersion: ECMA_VERSION,
		},
	},
	linterOptions: {
		reportUnusedDisableDirectives: true,
	},
};

export default [
	// ...fixupConfigRules(airbnbConfig),
	config,
	...baseConfig,
	...typescriptConfig,
	...asyncConfig,
	...moduleConfig,
	...unicornConfig,
	...testsConfig,
	prettierConfig,
];
