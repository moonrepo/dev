import vscode, {
	ShellExecution,
	Task,
	TaskGroup,
	TaskScope,
	ThemeIcon,
	tasks,
	TreeItem,
	TreeItemCollapsibleState,
	Uri,
} from 'vscode';
import { execMoon, findMoonBin } from './moon';
import type { Project, Task as ProjectTask, ProjectType } from '@moonrepo/types';
import path from 'path';

class NoTasks extends TreeItem {
	constructor() {
		super('No tasks in project.', TreeItemCollapsibleState.None);

		this.contextValue = 'noProjectTasks';
	}
}

class TaskItem extends TreeItem {
	task: ProjectTask;
	parent: ProjectItem;

	constructor(parent: ProjectItem, task: ProjectTask) {
		super(task.target.split(':')[1], TreeItemCollapsibleState.None);

		this.parent = parent;
		this.task = task;
		this.id = task.target;
		this.contextValue = 'projectTask';
		this.description = [task.command, ...task.args].join(' ');
		this.command = {
			title: 'Run task',
			command: 'moon.runTarget',
			arguments: [task.target],
		};

		switch (task.type) {
			case 'build':
				this.iconPath = new ThemeIcon('wrench');
				break;
			case 'run':
				this.iconPath = new ThemeIcon('run');
				break;
			case 'test':
				this.iconPath = new ThemeIcon('beaker');
				break;
		}
	}
}

class ProjectItem extends TreeItem {
	parent: ProjectCategoryItem;
	project: Project;
	tasks: TaskItem[];

	constructor(parent: ProjectCategoryItem, project: Project) {
		super(project.id, TreeItemCollapsibleState.Collapsed);

		this.parent = parent;
		this.project = project;
		this.id = project.id;
		this.iconPath = ThemeIcon.File;
		this.resourceUri = Uri.file(path.join(project.root, 'moon.yml'));
		this.contextValue = 'project';

		const metadata = project.config.project;

		if (metadata) {
			this.label = metadata.name;
			this.tooltip = metadata.description;
		}

		this.tasks = Object.values(project.tasks).map((task) => new TaskItem(this, task));

		switch (project.config.language) {
			case 'javascript':
				this.resourceUri = Uri.file(path.join(project.root, 'package.json'));
				break;
			case 'typescript':
				this.resourceUri = Uri.file(path.join(project.root, 'tsconfig.json'));
				break;
			default:
				break;
		}
	}
}

class ProjectCategoryItem extends TreeItem {
	projects: ProjectItem[] = [];

	constructor(type: ProjectType, projects: Project[]) {
		super(type, TreeItemCollapsibleState.Expanded);

		this.id = type;
		this.contextValue = 'projectCategory';
		this.projects = projects
			.filter(
				(project) => project.config.type === type || (type === 'unknown' && !project.config.type),
			)
			.map((project) => new ProjectItem(this, project));

		switch (type) {
			case 'application':
				this.label = 'Applications';
				break;
			case 'library':
				this.label = 'Libraries';
				break;
			case 'tool':
				this.label = 'Tools';
				break;
			case 'unknown':
				this.label = 'Other';
				break;
		}
	}
}

export class ProjectsProvider implements vscode.TreeDataProvider<TreeItem> {
	workspaceRoot: string;

	constructor(workspaceRoot: string) {
		this.workspaceRoot = workspaceRoot;
	}

	getParent(element: TreeItem): vscode.ProviderResult<TreeItem> {
		if (element instanceof TaskItem || element instanceof ProjectItem) {
			return element.parent;
		}

		return null;
	}

	async getChildren(element?: TreeItem | undefined): Promise<TreeItem[]> {
		if (element instanceof TaskItem) {
			return [];
		}

		if (element instanceof ProjectItem) {
			return element.tasks.length > 0 ? element.tasks : [new NoTasks()];
		}

		if (element instanceof ProjectCategoryItem) {
			return element.projects;
		}

		const { projects } = JSON.parse(await execMoon(['query', 'projects'], this.workspaceRoot)) as {
			projects: Project[];
		};

		return [
			new ProjectCategoryItem('application', projects),
			new ProjectCategoryItem('library', projects),
			new ProjectCategoryItem('tool', projects),
			new ProjectCategoryItem('unknown', projects),
		].filter((cat) => cat.projects.length > 0);
	}

	getTreeItem(element: TreeItem): TreeItem | Thenable<TreeItem> {
		return element;
	}

	async runTarget(item: TaskItem) {
		const { target } = item.task;

		const task = new Task(
			{ type: 'moon', target },
			TaskScope.Workspace,
			target,
			'moon',
			new ShellExecution(findMoonBin(this.workspaceRoot), ['run', target], {
				cwd: this.workspaceRoot,
			}),
		);

		switch (item.task.type) {
			case 'build':
				task.group = TaskGroup.Build;
				break;
			case 'run':
				task.group = TaskGroup.Test;
				break;
			case 'test':
				task.group = TaskGroup.Test;
				break;
		}

		await tasks.executeTask(task);
	}
}
