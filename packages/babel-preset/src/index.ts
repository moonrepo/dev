// eslint-disable-next-line no-underscore-dangle
declare const __DEV__: boolean;

export type PluginItem = string | [string, object];

export interface BabelPresetMoonOptions {
	decorators?: boolean;
	loose?: boolean;
	modules?: boolean;
	react?: boolean | 'automatic' | 'classic';
	solid?: boolean | 'ssr';
	targets?: Record<string, string> | string[] | string;
}

export default function babelPresetMoon(
	api: unknown,
	{ decorators, loose, modules, react, solid, targets }: BabelPresetMoonOptions = {},
) {
	let looseMode = loose ?? false;

	const plugins: PluginItem[] = [
		'@babel/plugin-proposal-export-default-from',
		'@babel/plugin-proposal-export-namespace-from',
		'babel-plugin-conditional-invariant',
		'babel-plugin-env-constants',
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
				bugfixes: true,
				exclude: [
					'@babel/plugin-transform-regenerator',
					'@babel/plugin-transform-async-to-generator',
				],
				loose: looseMode,
				modules: modules ? false : 'auto',
				shippedProposals: true,
				// Only target node since this is for development
				// Revisit in Babel v8: https://babeljs.io/docs/en/options#no-targets
				targets: targets ?? { node: 'current' },
				useBuiltIns: false,
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

	if (solid) {
		presets.push([
			'babel-preset-solid',
			{ generate: solid === 'ssr' ? 'ssr' : 'dom', hydratable: true },
		]);
	}

	return {
		plugins,
		presets,
	};
}
