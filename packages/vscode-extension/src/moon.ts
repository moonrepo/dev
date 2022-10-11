import vscode, { Task } from 'vscode';
import fs from 'fs';
import path from 'path';
import os from 'os';
import execa from 'execa';

export function findMoonBin(workspaceRoot: string): string {
	const config = vscode.workspace.getConfiguration('moon');
	const binPath = path.join(
		workspaceRoot,
		config.get('binPath') ||
			`node_modules/@moonrepo/cli/${os.platform() === 'win32' ? 'moon.exe' : 'moon'}`,
	);

	console.log({ binPath });

	if (fs.existsSync(binPath)) {
		return binPath;
	}

	throw new Error('TODO');
}

export function findWorkspaceRoot(startingDir: string): string | null {
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
		const result = await execa(findMoonBin(workspaceRoot), args, { cwd: workspaceRoot });

		return result.stdout;
	} catch (error) {
		console.error(error);

		throw error;
	}
}
