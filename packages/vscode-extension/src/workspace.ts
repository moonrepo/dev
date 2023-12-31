import execa from 'execa';
import vscode from 'vscode';
import { findMoonBin, isRealBin } from './moon';

export class Workspace {
	// Current moon binary path
	binPath: string | null = null;

	// Current vscode workspace folder
	folder: vscode.WorkspaceFolder | null = null;

	// Channel for logging
	logger: vscode.LogOutputChannel;

	// Current moon workspace root
	root: string | null = null;

	constructor() {
		this.logger = vscode.window.createOutputChannel('moon', { log: true });

		// When a file is opened, attempt to find the moon workspace
		vscode.workspace.onDidOpenTextDocument((text) => {
			this.logger.appendLine('Opened a file, checking for workspace changes');
			void this.findRoot(text.uri);
		});

		vscode.workspace.onDidCloseTextDocument((text) => {
			this.logger.appendLine('Closed a file, checking for workspace changes');
			void this.findRoot(text.uri);
		});
	}

	async findRoot(openUri: vscode.Uri) {
		if (this.root && openUri.fsPath.startsWith(this.root)) {
			return;
		}

		this.folder = null;
		this.root = null;
		this.binPath = null;

		this.logger.appendLine(`Attempting to find a VSC workspace folder for ${openUri.fsPath}`);

		const workspaceFolder = vscode.workspace.getWorkspaceFolder(openUri);

		if (workspaceFolder) {
			this.logger.appendLine(
				`Found workspace folder ${workspaceFolder.uri.fsPath} (${workspaceFolder.name})`,
			);

			this.logger.appendLine('Attempting to find a moon installation');

			const files = await vscode.workspace.findFiles(
				new vscode.RelativePattern(workspaceFolder.uri, '.moon/*.yml'),
			);

			this.folder = workspaceFolder;

			if (files.length > 0) {
				this.root = workspaceFolder.uri.fsPath;
				this.binPath = findMoonBin(this.root);

				this.logger.appendLine(`Found workspace root at ${this.root}`);

				if (this.binPath) {
					this.logger.appendLine(`Found moon binary at ${this.binPath}`);
				}
			}
		} else {
			this.logger.appendLine('Did not find a workspace folder, disabling moon');
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
