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
	return Number.parseFloat(version.replaceAll(/[^\d.]+/g, ''));
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
	let dir = process.cwd();
	let tsConfigPath;

	while (dir) {
		// Some very large projects will run out of memory when using project references,
		// so we support a custom tsconfig for eslint to work around this issue. If found,
		// abort early and avoid injesting project references!
		const tsConfigEslintPath = path.join(dir, 'tsconfig.eslint.json');

		if (fs.existsSync(tsConfigEslintPath)) {
			return [tsConfigEslintPath];
		}

		// Otherwise, use the normal tsconfig if available
		tsConfigPath = path.join(dir, 'tsconfig.json');

		if (fs.existsSync(tsConfigPath)) {
			break;
		}

		dir = path.dirname(dir);
	}

	// Nothing found? Weird, just assume a config exists in the root...
	if (!tsConfigPath) {
		tsConfigPath = path.join(WORKSPACE_ROOT, 'tsconfig.json');
		dir = WORKSPACE_ROOT;
	}

	// Load the found tsconfig and include any project references
	const tsConfig = loadTsConfig(tsConfigPath);
	const project = [tsConfigPath];

	if (tsConfig?.references && tsConfig.references.length > 0) {
		project.push(
			...tsConfig.references.map((ref) =>
				ref.path.endsWith('.json')
					? path.join(dir, ref.path)
					: path.join(dir, ref.path, 'tsconfig.json'),
			),
		);
	}

	return project;
}
