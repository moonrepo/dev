import vscode from 'vscode';
import { runTaskByInput, viewActionGraph, viewProjectGraph } from './commands';
import { LastRunProvider } from './lastRunView';
import { ProjectsProvider } from './projectsView';
import { Workspace } from './workspace';

export function activate(context: vscode.ExtensionContext) {
	const workspace = new Workspace();
	const projectsProvider = new ProjectsProvider(context, workspace);

	context.subscriptions.push(
		vscode.commands.registerCommand('moon.openSettings', () =>
			vscode.commands.executeCommand('workbench.action.openSettings', '@ext:moonrepo.moon-console'),
		),

		// Create a "moon run <target>" task
		vscode.commands.registerCommand('moon.runTaskByInput', () => runTaskByInput(workspace)),

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
		vscode.commands.registerCommand('moon.viewActionGraph', () =>
			viewActionGraph(context, workspace),
		),
		vscode.commands.registerCommand('moon.viewProjectGraph', () =>
			viewProjectGraph(context, workspace),
		),

		// Create a webview for last run report
		vscode.window.registerWebviewViewProvider(
			'moonLastRun',
			new LastRunProvider(context, workspace),
		),
	);
}

export function deactivate() {}
