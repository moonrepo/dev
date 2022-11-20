import fs from 'fs';
import path from 'path';
import type { CompilerOptions, ProjectReference } from 'typescript';
import { PROJECT_ROOT, WORKSPACE_ROOT } from './constants';

export function parseJson<T>(filePath: string): T {
	const content = fs
		.readFileSync(filePath, 'utf8')
		.split('\n')
		// Remove comments from JSON files
		.filter((line) => !/^\s*(#|\/)/.test(line))
		.join('\n');

	return JSON.parse(content) as T;
}

export function parseVersion(version: string): number {
	return Number.parseFloat(version.replace(/[^\d.]+/g, ''));
}

// PACKAGE.JSON

type PackageDeps = Record<string, string>;

interface PackageJson {
	name: string;
	version: string;
	engines?: { node?: string };
	dependencies?: PackageDeps;
	devDependencies?: PackageDeps;
	peerDependencies?: PackageDeps;
}

const packageJsonCache: Record<string, PackageJson> = {};

export function loadPackageJson(file: string): PackageJson | null {
	if (!packageJsonCache[file] && fs.existsSync(file)) {
		packageJsonCache[file] = parseJson(file);
	}

	return packageJsonCache[file] ?? null;
}

export function getRootPackageJson(): PackageJson {
	return loadPackageJson(path.join(WORKSPACE_ROOT, 'package.json'))!;
}

export function getProjectPackageJson(file?: string): PackageJson | null {
	return loadPackageJson(file ?? path.join(PROJECT_ROOT, 'package.json'));
}

export function getClosestPackageJson(startingDir: string): PackageJson {
	const packagePath = path.join(startingDir, 'package.json');

	if (fs.existsSync(packagePath)) {
		return loadPackageJson(packagePath)!;
	}

	return getClosestPackageJson(path.dirname(startingDir));
}

// NODE.JS

let nodeVersion: number;

export function getTargetNodeRuntime(): number {
	if (nodeVersion !== undefined) {
		return nodeVersion;
	}

	try {
		const pkg = getRootPackageJson();
		const version = pkg.engines?.node;

		if (version) {
			nodeVersion = parseVersion(version);
		}

		const nvmrcPath = path.join(WORKSPACE_ROOT, '.nvmrc');

		if (!nodeVersion && fs.existsSync(nvmrcPath)) {
			nodeVersion = parseVersion(fs.readFileSync(nvmrcPath, 'utf8'));
		}
	} catch {
		nodeVersion = 0;
	}

	return nodeVersion;
}

export function getParentNodeRuntime(): number {
	const pkg = getClosestPackageJson(process.cwd());
	const version = pkg.engines?.node;

	if (version) {
		return parseVersion(version);
	}

	return getTargetNodeRuntime();
}

// PACKAGES

export function getPackageVersion(pkgName: string): number {
	const pkg = loadPackageJson(require.resolve(`${pkgName}/package.json`));

	if (pkg) {
		return parseVersion(pkg.version);
	}

	const rootPackage = getRootPackageJson();
	const version =
		rootPackage.dependencies?.[pkgName] ??
		rootPackage.devDependencies?.[pkgName] ??
		rootPackage.peerDependencies?.[pkgName];

	if (version) {
		return parseVersion(version);
	}

	return 0;
}

// TSCONFIG.JSON

interface TsConfigJson {
	compilerOptions?: CompilerOptions;
	references?: ProjectReference[];
}

const tsconfigJsonCache: Record<string, TsConfigJson> = {};

export function loadTsConfig(file: string): TsConfigJson | null {
	if (!tsconfigJsonCache[file] && fs.existsSync(file)) {
		tsconfigJsonCache[file] = parseJson(file);
	}

	return tsconfigJsonCache[file] ?? null;
}

export function getRootTsConfig(): TsConfigJson {
	return loadTsConfig(path.join(WORKSPACE_ROOT, 'tsconfig.json'))!;
}

export function getProjectTsConfig(file?: string): TsConfigJson | null {
	return loadTsConfig(file ?? path.join(PROJECT_ROOT, 'tsconfig.json'));
}

export function getClosestTsConfig(startingDir: string): TsConfigJson {
	const packagePath = path.join(startingDir, 'tsconfig.json');

	if (fs.existsSync(packagePath)) {
		return loadTsConfig(packagePath)!;
	}

	return getClosestTsConfig(path.dirname(startingDir));
}

export function getTsProjectForEslint(): string[] {
	// Some very large projects will run out of memory when using project references,
	// so we support a custom tsconfig to work around this issue
	const tsConfigEslintPath = path.join(process.cwd(), 'tsconfig.eslint.json');

	if (!fs.existsSync(tsConfigEslintPath)) {
		return [tsConfigEslintPath];
	}

	// When running on the command line, we only want to use types from the local config
	const tsConfigProjectPath = path.join(PROJECT_ROOT, 'tsconfig.json');

	if (fs.existsSync(tsConfigProjectPath)) {
		return [tsConfigProjectPath];
	}

	// Otherwise, if the consumer is using project references, we need to include a path
	// to every tsconfig.json in the graph
	const tsConfigRoot = getRootTsConfig();

	if (tsConfigRoot.references && tsConfigRoot.references.length > 0) {
		return tsConfigRoot.references.map((ref) =>
			path.join(WORKSPACE_ROOT, ref.path, 'tsconfig.json'),
		);
	}

	return [path.join(WORKSPACE_ROOT, 'tsconfig.json')];
}
