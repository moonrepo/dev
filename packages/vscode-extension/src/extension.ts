import vscode from 'vscode';
import { runTargetByInput } from './commands';
import { findMoonBin, findWorkspaceRoot } from './moon';
import { ProjectsProvider } from './projectsView';

export async function activate(context: vscode.ExtensionContext) {
	const workingDir = vscode.workspace.workspaceFolders?.[0];
	const workspaceRoot = workingDir ? await findWorkspaceRoot(workingDir) : null;
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

	const projectsProvider = new ProjectsProvider(context, workspaceRoot);

	context.subscriptions.push(
		// Create a "moon run <target>" task
		vscode.commands.registerCommand('moon.runTargetByInput', () => {
			runTargetByInput(workspaceRoot);
		}),

		// Create a tree view for all moon projects
		vscode.window.createTreeView('moonProjects', {
			showCollapseAll: true,
			treeDataProvider: projectsProvider,
		}),
		vscode.window.createTreeView('moonProjectsExternal', {
			showCollapseAll: true,
			treeDataProvider: projectsProvider,
		}),
	);
}

export function deactivate() {}
