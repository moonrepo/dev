import fs from 'fs';
import type { CompilerOptions, ProjectReference } from 'typescript';
import { PACKAGE_JSON_PATH, TSCONFIG_JSON_PATH } from './constants';

export function parseJSON<T>(filePath: string): T {
	const content = fs
		.readFileSync(filePath, 'utf8')
		.split('\n')
		// Remove comments from JSON files
		.filter((line) => !/^\s*(#|\/)/.test(line))
		.join('\n');

	return JSON.parse(content) as T;
}

// PACKAGE.JSON

type PackageDeps = Record<string, string>;

interface PackageJSON {
	engines?: { node?: string };
	dependencies?: PackageDeps;
	devDependencies?: PackageDeps;
	peerDependencies?: PackageDeps;
}

let packageJson: PackageJSON;

export function getRootPackageJSON(): PackageJSON {
	if (packageJson === undefined) {
		packageJson = parseJSON(PACKAGE_JSON_PATH);
	}

	return packageJson;
}

// NODE.JS

let nodeVersion: number;

export function getTargetNodeRuntime(): number {
	if (nodeVersion !== undefined) {
		return nodeVersion;
	}

	try {
		const pkg = getRootPackageJSON();
		const version = pkg.engines?.node;

		if (version) {
			nodeVersion = Number.parseFloat(version.replace(/[^\d.]+/g, ''));
		}
	} catch {
		nodeVersion = 0;
	}

	return nodeVersion;
}

// PACKAGES

const versionCache: Record<string, number> = {};

export function getPackageVersion(pkgName: string): number {
	if (versionCache[pkgName] !== undefined) {
		return versionCache[pkgName];
	}

	try {
		const pkg = parseJSON<{ version: string }>(require.resolve(`${pkgName}/package.json`));

		versionCache[pkgName] = Number.parseFloat(pkg.version);

		return versionCache[pkgName];
	} catch {
		versionCache[pkgName] = 0;
	}

	try {
		const pkg = getRootPackageJSON();
		const version =
			pkg.dependencies?.[pkgName] ??
			pkg.devDependencies?.[pkgName] ??
			pkg.peerDependencies?.[pkgName];

		if (version) {
			versionCache[pkgName] = Number.parseFloat(version.replace(/[^\d.]+/g, ''));

			return versionCache[pkgName];
		}
	} catch {
		versionCache[pkgName] = 0;
	}

	return versionCache[pkgName];
}

// TSCONFIG.JSON

interface TSConfigJSON {
	compilerOptions?: CompilerOptions;
	references?: ProjectReference[];
}

let tsconfigJson: TSConfigJSON;

export function getRootTSConfig(): TSConfigJSON {
	if (tsconfigJson === undefined) {
		tsconfigJson = parseJSON(TSCONFIG_JSON_PATH);
	}

	return tsconfigJson;
}

// TYPESCRIPT

export function getRootProjectReferences(): ProjectReference[] | undefined {
	return getRootTSConfig().references;
}
