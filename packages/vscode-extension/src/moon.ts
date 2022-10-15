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

export async function findWorkspaceRoot(
	workingDir: vscode.WorkspaceFolder,
): Promise<string | null> {
	const baseRoot = vscode.workspace.getConfiguration('moon').get('workspaceRoot', '.');

	const files = await vscode.workspace.findFiles(
		new vscode.RelativePattern(workingDir, path.join(baseRoot, '.moon/*.yml')),
	);

	// Return folder containing the `.moon` folder
	if (files.length > 0 && files[0].scheme === 'file') {
		return path.dirname(path.dirname(files[0].fsPath));
	}

	return null;
}

export function isRealBin(binPath: string): boolean {
	const stats = fs.statSync(binPath);

	// When in the moonrepo/moon repository, the binary is actually fake,
	// so we need to account for that!
	return stats.size > 70;
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
