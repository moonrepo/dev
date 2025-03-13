import type eslint from 'eslint';
// @ts-expect-error Not typed
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
// @ts-expect-error Not typed
import reactPerfPlugin from 'eslint-plugin-react-perf';
import { CASE_SENSITIVE, getPackageVersion } from '@moonrepo/dev';
import browserConfig from './browser';

const reactVersion = getPackageVersion('react');

const reactConfig: eslint.Linter.Config = {
	name: 'moon:react',
	files: ['**/*.tsx'],
	languageOptions: {
		parserOptions: {
			ecmaFeatures: {
				jsx: true,
			},
		},
	},
	plugins: {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		'jsx-a11y': jsxA11yPlugin,
		react: reactPlugin,
		'react-hooks': reactHooksPlugin,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		'react-perf': reactPerfPlugin,
	},
	settings: {
		react: {
			version: 'detect',
		},
		linkComponents: ['Link', { name: 'Link', linkAttribute: 'to' }],
	},
	rules: {
		// Conflicts with CSS-in-JS solutions
		'sort-keys': 'off',

		// Disabled by Prettier: https://github.com/prettier/eslint-config-prettier/blob/main/index.js#L122
		// We need to do this since React is an override and these might be re-enabled.
		'react/jsx-child-element-spacing': 'off',
		'react/jsx-closing-bracket-location': 'off',
		'react/jsx-closing-tag-location': 'off',
		'react/jsx-curly-newline': 'off',
		'react/jsx-curly-spacing': 'off',
		'react/jsx-equals-spacing': 'off',
		'react/jsx-first-prop-new-line': 'off',
		'react/jsx-indent': 'off',
		'react/jsx-indent-props': 'off',
		'react/jsx-max-props-per-line': 'off',
		'react/jsx-newline': 'off',
		'react/jsx-one-expression-per-line': 'off',
		'react/jsx-props-no-multi-spaces': 'off',
		'react/jsx-tag-spacing': 'off',
		'react/jsx-wrap-multilines': 'off',

		// Support the new JSX runtime when available
		'react/react-in-jsx-scope': reactVersion >= 17 ? 'off' : 'error',
		'react/jsx-uses-react': reactVersion >= 17 ? 'off' : 'error',

		// Align with the DOM instead, avoid "is" prefix
		'react/boolean-prop-naming': 'off',
		'react/jsx-boolean-value': ['error', 'never'],

		// Destructure to avoid references
		'react/destructuring-assignment': 'error',

		// Display name is inferred from function declarations
		'react/display-name': 'off',

		// Always use function declarations for components
		'react/function-component-definition': [
			'error',
			{
				namedComponents: 'function-declaration',
				unnamedComponents: 'arrow-function',
			},
		],
		'react/prefer-es6-class': 'off',
		'react/prefer-stateless-function': 'error',
		'react/jsx-pascal-case': ['error', { allowAllCaps: true, allowNamespace: true }],

		// Allow multiple components in a file
		'react/no-multi-comp': 'off',

		// Always self-close when applicable
		'react/self-closing-comp': [
			'error',
			{
				component: true,
				html: true,
			},
		],
		'react/void-dom-elements-no-children': 'error',

		// Allow component level state
		'react/no-set-state': 'off',
		'react/no-unused-state': 'error',

		// Use alternatives instead of danger
		'react/no-danger': 'error',
		'react/no-danger-with-children': 'error',

		// Avoid deprecated APIs
		'react/no-deprecated': 'error',
		'react/no-find-dom-node': 'error',
		'react/no-is-mounted': 'error',
		'react/no-unsafe': ['error', { checkAliases: true }],

		// Dont restrict prop/element usage (is an app concern)
		'react/forbid-component-props': 'off',
		'react/forbid-dom-props': 'off',
		'react/forbid-elements': 'off',
		'react/no-adjacent-inline-elements': 'off',

		// Dont use prop types since were using TypeScript
		'react/default-props-match-prop-types': 'off',
		'react/forbid-foreign-prop-types': 'off',
		'react/forbid-prop-types': 'off',
		'react/no-unused-prop-types': 'off',
		'react/prefer-exact-props': 'off',
		'react/prefer-read-only-props': 'off',
		'react/prop-types': 'off',
		'react/require-default-props': 'off',
		'react/sort-prop-types': 'off',

		// Avoid bad or problematic patterns
		'react/jsx-uses-vars': 'error',
		'react/no-access-state-in-setstate': 'error',
		'react/no-array-index-key': 'error',
		'react/no-arrow-function-lifecycle': 'error',
		'react/no-children-prop': 'error',
		'react/no-did-mount-set-state': 'error',
		'react/no-did-update-set-state': 'error',
		'react/no-direct-mutation-state': 'error',
		'react/no-namespace': 'error',
		'react/no-redundant-should-component-update': 'error',
		'react/no-render-return-value': 'error',
		'react/no-string-refs': 'error',
		'react/no-this-in-sfc': 'error',
		'react/no-typos': 'error',
		'react/no-unescaped-entities': 'error',
		'react/no-unknown-property': 'error',
		'react/no-unstable-nested-components': 'error',
		'react/no-unused-class-component-methods': 'error',
		'react/no-will-update-set-state': 'error',
		'react/require-optimization': 'off',
		'react/style-prop-object': 'error',

		// Accessibility requirements
		'react/button-has-type': 'error',
		'react/no-invalid-html-attribute': 'error',

		// Security requirements
		'react/jsx-no-script-url': 'error',
		'react/jsx-no-target-blank': 'error',

		// Performance requirements
		'react/jsx-no-constructed-context-values': 'error',
		'react-perf/jsx-no-jsx-as-prop': 'off',
		'react-perf/jsx-no-new-array-as-prop': 'error',
		'react-perf/jsx-no-new-function-as-prop': 'error',
		'react-perf/jsx-no-new-object-as-prop': 'error',

		// Ensure JSX is returned
		'react/require-render-return': 'error',

		// Initialization should happen anywhere
		'react/state-in-constructor': 'off',

		// Enforce consistent JSX spacing and syntax
		'react/jsx-no-comment-textnodes': 'error',
		'react/jsx-no-duplicate-props': 'error',
		'react/jsx-no-undef': 'error',
		'react/jsx-space-before-closing': 'off',

		// Avoid interpolation as much as possible
		'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],

		// Allow either extension for JSX code, since some components may return null
		'react/jsx-filename-extension': ['error', { allow: 'as-needed', extensions: ['.tsx'] }],

		// Always use shorthand fragments when applicable
		'react/jsx-fragments': ['error', 'syntax'],
		'react/jsx-no-useless-fragment': 'error',

		// Ensure keys are used correctly
		'react/jsx-key': [
			'error',
			{
				checkFragmentShorthand: true,
				checkKeyMustBeforeSpread: true,
			},
		],

		// Allow any level of nesting
		'react/jsx-max-depth': 'off',

		// Avoid inline function props
		'react/jsx-no-bind': [
			'error',
			{
				ignoreDOMComponents: true,
				ignoreRefs: true,
				allowArrowFunctions: false,
				allowFunctions: false,
				allowBind: false,
			},
		],

		// Encourage the use of i18n libraries
		'react/jsx-no-literals': [
			'error',
			{
				noStrings: true,
				ignoreProps: true,
				noAttributeStrings: false,
			},
		],

		// Allow spreading of props since it allows better composition,
		// and TypeScript will catch any issues regardless
		'react/jsx-props-no-spreading': 'off',

		// Always sort props for better readability
		'react/jsx-sort-default-props': 'off', // Handled by sort-keys
		'react/jsx-sort-props': [
			'error',
			{
				callbacksLast: true,
				shorthandFirst: true,
				shorthandLast: false,
				ignoreCase: !CASE_SENSITIVE,
				noSortAlphabetically: false,
				reservedFirst: true,
			},
		],

		// Encourage on & handle event naming
		'react/jsx-handler-names': [
			'error',
			{
				eventHandlerPrefix: 'handle',
				eventHandlerPropPrefix: 'on',
			},
		],

		// Sort component using React instead of TypeScript
		'@typescript-eslint/member-ordering': 'off',
		'react/static-property-placement': 'error',
		'react/sort-comp': [
			'error',
			{
				order: ['statics', 'properties', 'lifecycle', 'everything-else', 'handlers', 'renderers'],
				groups: {
					statics: ['propTypes', 'defaultProps'],
					properties: [
						'/^(?!on).+$/',
						'/^(?!handle).+$/',
						'/^(?!render).+$/',
						'/^.+Ref$/',
						'state',
					],
					lifecycle: [
						'constructor',
						'getDerivedStateFromProps',
						'componentDidMount',
						'shouldComponentUpdate',
						'getSnapshotBeforeUpdate',
						'componentDidUpdate',
						'componentDidCatch',
						'componentWillUnmount',
					],
					handlers: ['/^on.+$/', '/^handle.+$/'],
					renderers: ['/^render.+$/', 'render'],
				},
			},
		],
	},
};

const hooksConfig: eslint.Linter.Config = {
	files: ['**/*.ts', '**/*.tsx'],
	plugins: { 'react-hooks': reactHooksPlugin },
	rules: {
		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': 'error',
	},
};

const testsConfig: eslint.Linter.Config = {
	files: ['**/*.test.tsx'],
	rules: {
		'react/jsx-no-bind': 'off',
		'react-perf/jsx-no-new-array-as-prop': 'off',
		'react-perf/jsx-no-new-function-as-prop': 'off',
		'react-perf/jsx-no-new-object-as-prop': 'off',
	},
};

// We only want to apply the React plugin and rules
// to TSX files. Not the entire codebase.
export default [
	browserConfig,
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	jsxA11yPlugin.flatConfigs.recommended,
	reactConfig,
	hooksConfig,
	testsConfig,
];
