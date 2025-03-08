export const WORKSPACE_ROOT = process.env.MOON_WORKSPACE_ROOT ?? process.cwd();
export const PROJECT_ROOT = process.env.MOON_PROJECT_ROOT ?? process.cwd();

// Support consistent sorting across the board
// Its off since simple-import-sort doesnt support it!
export const CASE_SENSITIVE = false;

// Latest ECMA version and syntax to support
export const ECMA_VERSION = 2022;

// Files and folders to always ignore
export const IGNORE_LIST = [
	'node_modules/',
	'build/',
	'cjs/',
	'coverage/',
	'dist/',
	'dts/',
	'esm/',
	'lib/',
	'mjs/',
	'umd/',
];

// Supported file extensions
export const EXTENSIONS = ['.ts', '.tsx', '.cts', '.mts', '.js', '.jsx', '.cjs', '.mjs'];
export const EXTENSIONS_WITHOUT_DOT = EXTENSIONS.map((ext) => ext.slice(1));
export const EXTENSIONS_PATTERN = EXTENSIONS_WITHOUT_DOT.join(',');

// Globs for finding source files, test files, and test utility files
export const ALL_FILES_GLOB = `**/*.{${EXTENSIONS_PATTERN}}`;
export const SOURCE_FILES_GLOB = `**/src/**/*.{${EXTENSIONS_PATTERN}}`;
export const TEST_FILES_GLOB = `**/{tests,__tests__}/**/*.test.{${EXTENSIONS_PATTERN}}`;
export const TEST_UTILS_GLOB = `**/{tests,__tests__}/**/*.{${EXTENSIONS_PATTERN}}`;

// List of globs to find all test related files
export const TESTS_LIST = [TEST_FILES_GLOB, TEST_UTILS_GLOB, `**/test.{${EXTENSIONS_PATTERN}}`];

// List of globs to find config related files
export const CONFIGS_LIST = [
	`**/.*.{${EXTENSIONS_PATTERN}}`,
	`**/*.config.{${EXTENSIONS_PATTERN}}`,
];

// Pattern of file extensions
export const NON_JS_REGEX = String.raw`\.(css|sass|scss|less|gif|png|jpg|jpeg|svg|gql|graphql|yml|yaml)$`;
export const ALL_JS_REGEX = `\\.(${EXTENSIONS_WITHOUT_DOT.join('|')})$`;

// Pattern to find all custom TypeScript paths
export const TS_PATH_PREFIX_REGEX = '^:[a-z]';
