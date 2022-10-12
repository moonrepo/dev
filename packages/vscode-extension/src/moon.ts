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

	return null;
}

export async function findWorkspaceRoot(startingDir: string): Promise<string | null> {
	// const baseRoot = vscode.workspace.getConfiguration('moon').get('workspaceRoot', '.');

	// const files = await workspace.findFiles('**/package.json');

	// console.log({ baseRoot, files });

	// if (files.length > 0 && files[0].scheme === 'file') {
	// 	return files[0].fsPath;
	// }

	// return null;

	const moonDir = path.join(startingDir, '.moon');

	if (fs.existsSync(moonDir)) {
		return startingDir;
	}

	const parent = path.dirname(startingDir);

	if (!parent || parent === '.' || parent === '/') {
		return null;
	}

	return findWorkspaceRoot(parent);
}

export async function execMoon(args: string[], workspaceRoot: string): Promise<string> {
	try {
		const result = await execa(findMoonBin(workspaceRoot)!, args, { cwd: workspaceRoot });

		return result.stdout;
	} catch (error: unknown) {
		console.error(error);

		throw error;
	}
}
