import fs from 'fs';
import path from 'path';
import execa from 'execa';
import vscode from 'vscode';

export function findMoonBin(workspaceRoot: string): string | null {
	let binPath = vscode.workspace.getConfiguration('moon').get('binPath', 'moon');

	if (process.platform === 'win32' && !binPath.endsWith('.exe')) {
		binPath += '.exe';
	}

	if (!path.isAbsolute(binPath)) {
		binPath = path.join(workspaceRoot, binPath);
	}

	if (fs.existsSync(binPath)) {
		return binPath;
	}

	try {
		const globalBin = execa.sync('which', ['moon']).stdout;

		if (globalBin && fs.existsSync(globalBin)) {
			return globalBin;
		}
	} catch {
		// Ignore
	}

	return null;
}

export function isRealBin(binPath: string): boolean {
	const stats = fs.statSync(binPath);

	// When in the moonrepo/moon repository, the binary is actually fake,
	// so we need to account for that!
	return stats.size > 100;
}
