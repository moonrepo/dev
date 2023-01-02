import vscode from 'vscode';
import { runTargetByInput, viewDepGraph, viewProjectGraph } from './commands';
import { LastRunProvider } from './lastRunView';
import { findMoonBin, findWorkspaceRoot, isRealBin } from './moon';
import { ProjectsProvider } from './projectsView';

export async function activate(context: vscode.ExtensionContext) {
	const workingDir = vscode.workspace.workspaceFolders?.[0];
	const workspaceRoot = workingDir ? await findWorkspaceRoot(workingDir) : null;
	const binPath = workspaceRoot ? findMoonBin(workspaceRoot) : null;

	// Define contexts used for empty views
	void vscode.commands.executeCommand('setContext', 'moon.inWorkspaceRoot', workspaceRoot !== null);
	void vscode.commands.executeCommand(
		'setContext',
		'moon.hasBinary',
		binPath !== null && isRealBin(binPath),
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('moon.openSettings', () =>
			vscode.commands.executeCommand('workbench.action.openSettings', '@ext:moonrepo.moon-console'),
		),
	);

	if (!workspaceRoot || !binPath) {
		return;
	}

	const projectsProvider = new ProjectsProvider(context, workspaceRoot);

	context.subscriptions.push(
		// Create commands:
		// moon run <target>"
		vscode.commands.registerCommand('moon.runTargetByInput', () => runTargetByInput(workspaceRoot)),

		// Create a tree view for all moon projects
		vscode.window.createTreeView('moonProjects', {
			showCollapseAll: true,
			treeDataProvider: projectsProvider,
		}),
		vscode.window.createTreeView('moonProjectsExternal', {
			showCollapseAll: true,
			treeDataProvider: projectsProvider,
		}),

		// Create graph visualizers
		vscode.commands.registerCommand('moon.viewDepGraph', () =>
			viewDepGraph(context, workspaceRoot),
		),
		vscode.commands.registerCommand('moon.viewProjectGraph', () =>
			viewProjectGraph(context, workspaceRoot),
		),

		// Create a webview for last run report
		vscode.window.registerWebviewViewProvider(
			'moonLastRun',
			new LastRunProvider(context, workspaceRoot),
		),
	);
}

export function deactivate() {}
