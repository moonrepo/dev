if (process.env.GITHUB_TOKEN) {
	process.env.GH_TOKEN = process.env.GITHUB_TOKEN;
}

if (!process.env.GH_TOKEN) {
	throw new Error('Release requires a GH_TOKEN environment variable.');
}
