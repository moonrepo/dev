import execa from 'execa';
import vscode from 'vscode';
import { findMoonBin, isRealBin } from './moon';

export class Workspace {
	// Current moon binary path
	binPath: string | null = null;

	// Current vscode workspace folder
	folder: vscode.WorkspaceFolder | null = null;

	// Current moon workspace root
	root: string | null = null;

	constructor() {
		// When a file is opened, attempt to find the moon workspace
		vscode.workspace.onDidOpenTextDocument((text) => {
			void this.findRoot(text.uri);
		});
		vscode.workspace.onDidCloseTextDocument((text) => {
			void this.findRoot(text.uri);
		});
	}

	async findRoot(openUri: vscode.Uri) {
		if (this.root && openUri.fsPath.startsWith(this.root)) {
			return;
		}

		const workspaceFolder = vscode.workspace.getWorkspaceFolder(openUri);

		if (workspaceFolder) {
			const files = await vscode.workspace.findFiles(
				new vscode.RelativePattern(workspaceFolder.uri, '.moon/*.yml'),
			);

			this.folder = workspaceFolder;
			this.root = files.length > 0 ? workspaceFolder.uri.fsPath : null;
			this.binPath = this.root ? findMoonBin(this.root) : null;
		} else {
			this.folder = null;
			this.root = null;
			this.binPath = null;
		}

		// Update context
		void vscode.commands.executeCommand('setContext', 'moon.inWorkspaceRoot', this.root !== null);
		void vscode.commands.executeCommand(
			'setContext',
			'moon.hasBinary',
			this.binPath !== null && isRealBin(this.binPath),
		);
	}

	async execMoon(args: string[]): Promise<string> {
		try {
			const result = await execa(this.binPath ?? 'moon', args, {
				cwd: this.root ?? process.cwd(),
			});

			return result.stdout;
		} catch (error: unknown) {
			console.error(error);

			throw error;
		}
	}

	async getMoonVersion(): Promise<string> {
		try {
			const result = await this.execMoon(['--version']);

			// Output is: moon 0.0.0
			const parts = result.split(' ');

			return parts[parts.length - 1];
		} catch {
			return '0.0.0';
		}
	}
}
