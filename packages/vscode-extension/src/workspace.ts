import path from 'path';
import execa from 'execa';
import vscode from 'vscode';
import { findMoonBin, isRealBin } from './moon';

export type ChangeWorkspaceListener = (folder: vscode.WorkspaceFolder) => vscode.Disposable[];

export class Workspace {
	// Current moon binary path
	binPath: string | null = null;

	// Current vscode workspace folder
	folder: vscode.WorkspaceFolder | null = null;

	// Channel for logging
	logger: vscode.LogOutputChannel;

	// Current moon workspace root
	root: string | null = null;

	onDidChangeWorkspaceEmitter: vscode.EventEmitter<vscode.WorkspaceFolder>;

	disposables: vscode.Disposable[] = [];

	constructor() {
		this.logger = vscode.window.createOutputChannel('moon', { log: true });
		this.onDidChangeWorkspaceEmitter = new vscode.EventEmitter<vscode.WorkspaceFolder>();

		// Find moon workspace from default editor
		if (vscode.window.activeTextEditor) {
			void this.findRoot(vscode.window.activeTextEditor.document.uri);
		}

		// When an editor is changed, attempt to find the moon workspace
		vscode.window.onDidChangeActiveTextEditor((editor) => {
			if (editor) {
				this.logger.appendLine('Opened a file, checking for workspace changes');
				void this.findRoot(editor.document.uri);
			}
		});
	}

	onDidChangeWorkspace(listener: (folder: vscode.WorkspaceFolder) => vscode.Disposable | void) {
		this.onDidChangeWorkspaceEmitter.event((folder) => {
			const disposable = listener(folder);

			if (disposable) {
				this.disposables.push(disposable);
			}
		});
	}

	fireDidChangeWorkspace() {
		if (!this.folder) {
			return;
		}

		// Remove previous watchers
		this.disposables.forEach((disposable) => {
			disposable.dispose();
		});

		// Emit and add new watchers
		this.onDidChangeWorkspaceEmitter.fire(this.folder);
	}

	async findRoot(openUri: vscode.Uri) {
		if (openUri.fsPath === 'moonrepo.moon-console.moon') {
			return;
		}

		if (this.root && openUri.fsPath.startsWith(this.root)) {
			this.logger.appendLine('Already in a workspace, skipping');
			return;
		}

		this.folder = null;
		this.root = null;
		this.binPath = null;

		this.logger.appendLine(`Attempting to find a VSC workspace folder for ${openUri.fsPath}`);

		const workspaceFolder = vscode.workspace.getWorkspaceFolder(openUri);

		if (workspaceFolder) {
			this.folder = workspaceFolder;

			this.logger.appendLine(`Found workspace folder ${workspaceFolder.uri.fsPath}`);
			this.logger.appendLine('Attempting to find a moon installation');

			const files = await vscode.workspace.findFiles(
				new vscode.RelativePattern(workspaceFolder.uri, this.getMoonDirPath('*.yml')),
			);

			if (files.length > 0) {
				this.root = workspaceFolder.uri.fsPath;
				this.binPath = findMoonBin(this.root);

				this.logger.appendLine(`Found moon workspace root at ${this.root}`);

				if (this.binPath) {
					this.logger.appendLine(`Found moon binary at ${this.binPath}`);
				}

				this.fireDidChangeWorkspace();
			} else {
				this.logger.appendLine('Did not find a moon installation, disabling');
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

	getMoonDirPath(file: string): string {
		const rootPrefix = vscode.workspace.getConfiguration('moon').get('workspaceRoot', '.');

		return path.join(rootPrefix, '.moon', file);
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
