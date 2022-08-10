export type PluginItem = string | [string, object];

export interface BabelPresetBeemoOptions {
	decorators?: boolean;
	loose?: boolean;
	modules?: boolean;
	react?: boolean | 'automatic' | 'classic';
	targets?: Record<string, string> | string[] | string;
}

export default function babelPresetBeemo(
	api: unknown,
	{ decorators, loose, modules, react, targets }: BabelPresetBeemoOptions = {},
) {
	let looseMode = loose ?? false;

	const plugins: PluginItem[] = [
		'@babel/plugin-proposal-export-default-from',
		'@babel/plugin-proposal-export-namespace-from',
		['babel-plugin-transform-dev', { evaluate: false }],
	];

	// When using decorators, we must apply loose to explicit plugins
	// https://babeljs.io/docs/en/babel-plugin-proposal-decorators#legacy
	if (decorators) {
		looseMode = true;

		plugins.unshift(
			['@babel/plugin-proposal-decorators', { legacy: true }],
			['@babel/plugin-proposal-class-properties', { loose: true }],
			['@babel/plugin-proposal-private-methods', { loose: true }],
		);
	}

	const presets: PluginItem[] = [
		[
			'@babel/preset-env',
			{
				// Always use async/await
				exclude: [
					'@babel/plugin-transform-regenerator',
					'@babel/plugin-transform-async-to-generator',
				],
				loose: looseMode,
				modules: modules ? false : 'auto',
				useBuiltIns: false,
				bugfixes: true,
				shippedProposals: true,
				// Only target node since this is for development
				// Revisit in Babel v8: https://babeljs.io/docs/en/options#no-targets
				targets: targets ?? { node: 'current' },
			},
		],
		['@babel/preset-typescript', { allowDeclareFields: true }],
	];

	if (react) {
		presets.push([
			'@babel/preset-react',
			{
				development: __DEV__,
				runtime: react === 'automatic' ? 'automatic' : 'classic',
			},
		]);
	}

	return {
		plugins,
		presets,
	};
}
