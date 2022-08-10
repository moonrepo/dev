import fs from 'fs';
import path from 'path';
import {
	ALL_FILES_GLOB,
	ALL_JS_REGEX,
	EXTENSIONS_WITHOUT_DOT,
	IGNORE_LIST,
	NON_JS_REGEX,
	TEST_FILES_GLOB,
	WORKSPACE_ROOT,
} from '@moonrepo/dev';

const setupFilesAfterEnv: string[] = [];
const setupFilePath = path.join(WORKSPACE_ROOT, 'tests/setup.ts');

// Only include the file if it exists, otherwise Jest throws an error
if (fs.existsSync(setupFilePath)) {
	setupFilesAfterEnv.push(setupFilePath);
}

const config = {
	collectCoverage: false, // Enabled by consumers
	collectCoverageFrom: [ALL_FILES_GLOB],
	coverageDirectory: './coverage',
	coveragePathIgnorePatterns: [...IGNORE_LIST],
	coverageReporters: ['lcov', 'text-summary'],
	coverageThreshold: {
		global: {
			branches: 80,
			functions: 90,
			lines: 90,
			statements: 90,
		},
	},
	globals: {
		__DEV__: true,
		__PROD__: true,
		__TEST__: true,
	},
	moduleFileExtensions: [...EXTENSIONS_WITHOUT_DOT, 'json', 'node'],
	moduleNameMapper: {
		[NON_JS_REGEX]: require.resolve('./fileMock.js'),
	},
	setupFilesAfterEnv,
	testEnvironment: 'node',
	testMatch: [TEST_FILES_GLOB],
	testRunner: 'jest-circus/runner',
	transform: {
		// Support all the new file extensions
		[ALL_JS_REGEX]: ['babel-jest', { rootMode: 'upward' }],
	},
};

export default config;
