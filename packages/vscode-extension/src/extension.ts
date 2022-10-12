import path from 'path';
import vscode, { Task, TaskScope, ShellExecution } from 'vscode';
import { runTargetByInput } from './commands';
import { findMoonBin, findWorkspaceRoot } from './moon';
import { ProjectsProvider } from './projectsView';

export async function activate(context: vscode.ExtensionContext) {
	const config = vscode.workspace.getConfiguration('moon');
	const workingDir =
		// vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
		// 	? vscode.workspace.workspaceFolders[0].uri.fsPath :
		process.cwd();
	const workspaceRoot = await findWorkspaceRoot(
		path.join(workingDir, config.get('workspaceRoot', '.')),
	);
	const binPath = workspaceRoot ? findMoonBin(workspaceRoot) : null;

	console.log({ binPath, workingDir, workspaceRoot });

	// Define contexts used for empty views
	void vscode.commands.executeCommand('setContext', 'moon.inWorkspaceRoot', workspaceRoot !== null);
	void vscode.commands.executeCommand('setContext', 'moon.hasBinary', binPath !== null);

	context.subscriptions.push(
		// For convenience, open the moon settings page
		vscode.commands.registerCommand('moon.openSettings', () => {
			void vscode.commands.executeCommand('workbench.action.openSettings', 'moon');
		}),
	);

	if (!workspaceRoot || !binPath) {
		return;
	}

	context.subscriptions.push(
		// Create a "moon run <target>" task
		vscode.commands.registerCommand('moon.runTargetByInput', () => {
			runTargetByInput(workspaceRoot);
		}),

		// Create a tree view for all moon projects
		vscode.window.createTreeView('moonProjects', {
			showCollapseAll: true,
			treeDataProvider: new ProjectsProvider(context, workspaceRoot),
		}),
	);
}

export function deactivate() {}
