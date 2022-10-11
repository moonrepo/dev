// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import vscode from 'vscode';
import path from 'path';
import { findWorkspaceRoot } from './moon';
import { ProjectsProvider } from './projectsView';

export function activate(context: vscode.ExtensionContext) {
	const config = vscode.workspace.getConfiguration('moon');
	const workingDir =
		vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
			? vscode.workspace.workspaceFolders[0].uri.fsPath
			: process.cwd();
	const workspaceRoot = findWorkspaceRoot(path.join(workingDir, config.get('workspaceRoot', '.')));

	console.log({ workingDir, workspaceRoot });

	vscode.window.registerTreeDataProvider(
		'moonProjects',
		new ProjectsProvider(context, workspaceRoot),
	);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('moon.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		void vscode.window.showInformationMessage('Hello World from moon!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
