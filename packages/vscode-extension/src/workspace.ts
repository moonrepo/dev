import fs from 'fs';
import path from 'path';
import execa from 'execa';
import vscode from 'vscode';

export function isRealBin(binPath: string): boolean {
	const stats = fs.statSync(binPath);

	// When in the moonrepo/moon repository, the binary is actually fake,
	// so we need to account for that!
	return stats.size > 100;
}

export class Workspace {
	// Current moon binary path
	binPath: string | null = null;

	// Current vscode workspace folder
	folder: vscode.WorkspaceFolder | null = null;

	// Channel for logging
	logger: vscode.LogOutputChannel;

	// Current moon workspace root
	root: string | null = null;

	rootPrefix: string = '';

	onDidChangeWorkspaceEmitter: vscode.EventEmitter<vscode.WorkspaceFolder | null>;

	disposables: vscode.Disposable[] = [];

	constructor() {
		this.logger = vscode.window.createOutputChannel('moon', { log: true });
		this.onDidChangeWorkspaceEmitter = new vscode.EventEmitter<vscode.WorkspaceFolder>();

		// Find moon workspace from default editor
		if (vscode.window.activeTextEditor) {
			this.findRoot(vscode.window.activeTextEditor.document.uri);
		} else {
			this.findDefaultRoot();
		}

		// When an editor is changed, attempt to find the moon workspace
		vscode.window.onDidChangeActiveTextEditor((editor) => {
			if (editor && editor.document.uri.scheme === 'file') {
				this.findRoot(editor.document.uri);
			}
		});
	}

	onDidChangeWorkspace(
		listener: (folder: vscode.WorkspaceFolder | null) => vscode.Disposable | void,
	) {
		this.onDidChangeWorkspaceEmitter.event((folder) => {
			const disposable = listener(folder);

			if (disposable) {
				this.disposables.push(disposable);
			}
		});
	}

	fireDidChangeWorkspace() {
		// Remove previous watchers
		this.disposables.forEach((disposable) => {
			disposable.dispose();
		});

		// Emit and add new watchers
		const { folder } = this;

		// Run in a timeout to ensure listeners have been registered,
		// otherwise this does nothing and the editor feels broken
		setTimeout(() => {
			this.onDidChangeWorkspaceEmitter.fire(folder);
		}, 0);
	}

	findDefaultRoot() {
		for (const folder of vscode.workspace.workspaceFolders ?? []) {
			this.findRoot(folder.uri);

			if (this.root) {
				break;
			}
		}
	}

	findRoot(openUri: vscode.Uri) {
		if (openUri.fsPath === 'moonrepo.moon-console.moon') {
			return;
		}

		if (this.root && openUri.fsPath.startsWith(this.root)) {
			return;
		}

		this.folder = null;
		this.root = null;
		this.rootPrefix = '';
		this.binPath = null;

		this.logger.appendLine(`Attempting to find a VSC workspace folder for ${openUri.fsPath}`);

		const workspaceFolder = vscode.workspace.getWorkspaceFolder(openUri);

		if (workspaceFolder) {
			this.folder = workspaceFolder;

			this.logger.appendLine(`Found workspace folder ${workspaceFolder.uri.fsPath}`);
			this.logger.appendLine('Attempting to find a moon installation');

			const rootPrefixes = vscode.workspace
				.getConfiguration('moon')
				.get('rootPrefixes', [] as string[]);
			rootPrefixes.push('.');

			let foundRoot = false;

			for (const prefix of rootPrefixes) {
				const moonDir = path.join(workspaceFolder.uri.fsPath, prefix, '.moon');

				if (fs.existsSync(moonDir)) {
					this.root = path.dirname(moonDir);
					this.rootPrefix = prefix;
					this.binPath = this.findMoonBin();

					this.logger.appendLine(`Found moon workspace root at ${this.root}`);

					if (this.binPath) {
						this.logger.appendLine(`Found moon binary at ${this.binPath}`);
					}

					foundRoot = true;
					break;
				}
			}

			this.fireDidChangeWorkspace();

			if (!foundRoot) {
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

	findMoonBin(): string | null {
		if (!this.root) {
			return null;
		}

		let binPath = vscode.workspace.getConfiguration('moon').get('binPath', 'moon');

		if (process.platform === 'win32' && !binPath.endsWith('.exe')) {
			binPath += '.exe';
		}

		if (!path.isAbsolute(binPath)) {
			binPath = path.join(this.root, binPath);
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

	async execMoon(args: string[]): Promise<string> {
		if (!args.includes('--json')) {
			args.push('--log', vscode.workspace.getConfiguration('moon').get('logLevel', 'info'));
		}

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

	getMoonDirPath(file: string, withPrefix: boolean = true): string {
		return path.join(withPrefix ? this.rootPrefix : '.', '.moon', file);
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
