import execa from 'execa';

if (process.env.GITHUB_TOKEN) {
	process.env.GH_TOKEN = process.env.GITHUB_TOKEN;
}

if (!process.env.GH_TOKEN) {
	throw new Error('Release requires a GH_TOKEN environment variable.');
}

const changelogPreset = process.env.PRESET ?? 'beemo';
const graduatePrelease = process.argv.includes('--graduate');
const preid = graduatePrelease ? '' : process.env.PRERELEASE;

function runLerna(args: string[]) {
	return execa.sync('lerna', args, {
		preferLocal: true,
		stdio: 'inherit',
	});
}

// Version packages using conventional commits
// https://github.com/lerna/lerna/tree/master/commands/version#readme
const versionArgs = [
	'version',
	// Only run on master
	'--allow-branch',
	'master',
	// Create a GitHub release
	'--create-release',
	'github',
	// Push changes to git
	'--push',
	// Alter commit message to skip CI
	'--message',
	'Release',
	// Use conventional commits
	'--conventional-commits',
	'--changelog-preset',
	changelogPreset,
];

if (graduatePrelease) {
	versionArgs.push('--conventional-graduate');
} else if (preid) {
	versionArgs.push('--conventional-prerelease', '--preid', preid);
}

runLerna(versionArgs);

// Publish packages
const publishArgs = ['publish', 'from-git'];

if (preid) {
	publishArgs.push('--dist-tag', 'next', '--preid', preid);
}

runLerna(publishArgs);
