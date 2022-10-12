import vscode, { ShellExecution, Task, TaskScope } from 'vscode';
import { findMoonBin } from './moon';

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
		new ShellExecution(findMoonBin(workspaceRoot)!, ['run', target], {
			cwd: workspaceRoot,
		}),
	);

	modifier?.(task);

	await vscode.tasks.executeTask(task);
}

export async function runTargetByInput(workspaceRoot: string) {
	const target = await vscode.window.showInputBox({
		title: 'Target',
		prompt: 'In the format of "project:task".',
	});

	if (target) {
		await runTarget(target, workspaceRoot);
	}
}
