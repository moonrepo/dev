import { satisfies } from 'semver';
import vscode, { ShellExecution, Task, TaskScope } from 'vscode';
import { GraphVisualizerView } from './graphVisualizerView';
import { findMoonBin, getMoonVersion } from './moon';

export async function checkProject(
	project: string,
	workspaceRoot: string,
	modifier?: (task: Task) => void,
) {
	const args = ['check', project];
	const version = await getMoonVersion(workspaceRoot);

	if (satisfies(version, '>=0.17.0 && <0.22.0')) {
		args.push('--report');
	}

	const task = new Task(
		{ project, type: 'moon' },
		TaskScope.Workspace,
		`moon check ${project}`,
		'moon',
		new ShellExecution(findMoonBin(workspaceRoot)!, args, {
			cwd: workspaceRoot,
		}),
	);

	modifier?.(task);

	await vscode.tasks.executeTask(task);
}

export async function runTarget(
	target: string,
	workspaceRoot: string,
	modifier?: (task: Task) => void,
) {
	const args = ['run', ...target.split(' ')];
	const version = await getMoonVersion(workspaceRoot);

	if (satisfies(version, '<0.22.0')) {
		args.push('--report');
	}

	const task = new Task(
		{ target, type: 'moon' },
		TaskScope.Workspace,
		`moon run ${target}`,
		'moon',
		new ShellExecution(findMoonBin(workspaceRoot)!, args, {
			cwd: workspaceRoot,
		}),
	);

	modifier?.(task);

	await vscode.tasks.executeTask(task);
}

export async function runTargetByInput(workspaceRoot: string) {
	const target = await vscode.window.showInputBox({
		prompt: 'In the format of "project:task" or ":task".',
		title: 'Target(s)',
	});

	if (target) {
		await runTarget(target, workspaceRoot);
	}
}

export async function viewDepGraph(context: vscode.ExtensionContext, workspaceRoot: string) {
	await new GraphVisualizerView(context, workspaceRoot, 'dep-graph').renderPanel();
}

export async function viewProjectGraph(context: vscode.ExtensionContext, workspaceRoot: string) {
	await new GraphVisualizerView(context, workspaceRoot, 'project-graph').renderPanel();
}
