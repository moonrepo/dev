import vscode, { ShellExecution, Task, TaskScope } from 'vscode';
import { GraphVisualizerView } from './graphVisualizerView';
import type { Workspace } from './workspace';

export async function checkProject(
	project: string,
	workspace: Workspace,
	modifier?: (task: Task) => void,
) {
	if (!workspace.root || !workspace.binPath) {
		return;
	}

	const task = new Task(
		{ project, type: 'moon' },
		TaskScope.Workspace,
		`moon check ${project}`,
		'moon',
		new ShellExecution(
			workspace.binPath,
			[
				'check',
				project,
				'--log',
				vscode.workspace.getConfiguration('moon').get('logLevel', 'info'),
			],
			{
				cwd: workspace.root,
			},
		),
	);

	modifier?.(task);

	await vscode.tasks.executeTask(task);
}

export async function runTask(
	target: string,
	workspace: Workspace,
	modifier?: (task: Task) => void,
) {
	if (!workspace.root || !workspace.binPath) {
		return;
	}

	const task = new Task(
		{ target, type: 'moon' },
		TaskScope.Workspace,
		`moon run ${target}`,
		'moon',
		new ShellExecution(
			workspace.binPath,
			[
				'run',
				...target.split(' '),
				'--log',
				vscode.workspace.getConfiguration('moon').get('logLevel', 'info'),
			],
			{
				cwd: workspace.root,
			},
		),
	);

	modifier?.(task);

	await vscode.tasks.executeTask(task);
}

export async function runTaskByInput(workspace: Workspace) {
	if (!workspace.root || !workspace.binPath) {
		return;
	}

	const target = await vscode.window.showInputBox({
		prompt: 'In the format of "scope:task" or ":task".',
		title: 'Target(s)',
	});

	if (target) {
		await runTask(target, workspace);
	}
}

export async function viewActionGraph(context: vscode.ExtensionContext, workspace: Workspace) {
	await new GraphVisualizerView(context, workspace, 'action-graph').renderPanel();
}

export async function viewProjectGraph(context: vscode.ExtensionContext, workspace: Workspace) {
	await new GraphVisualizerView(context, workspace, 'project-graph').renderPanel();
}
