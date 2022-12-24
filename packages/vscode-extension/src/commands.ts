import vscode, { ShellExecution, Task, TaskScope } from 'vscode';
import { findMoonBin, getMoonVersion } from './moon';

export async function checkProject(
	project: string,
	workspaceRoot: string,
	modifier?: (task: Task) => void,
) {
	const args = ['check', project];
	const version = await getMoonVersion(workspaceRoot);

	if (version >= 0.17) {
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
	const task = new Task(
		{ target, type: 'moon' },
		TaskScope.Workspace,
		`moon run ${target}`,
		'moon',
		new ShellExecution(findMoonBin(workspaceRoot)!, ['run', ...target.split(' '), '--report'], {
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

export async function viewProjectGraph(workspaceRoot: string) {
	const task = new Task(
		{ type: 'moon' },
		TaskScope.Workspace,
		'moon project-graph',
		'moon',
		new ShellExecution(findMoonBin(workspaceRoot)!, ['project-graph', '--dot'], {
			cwd: workspaceRoot,
		}),
	);

	await vscode.tasks.executeTask(task);
}
