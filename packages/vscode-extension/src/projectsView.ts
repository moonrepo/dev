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
import type { Project, Task as ProjectTask, ProjectType, ProjectLanguage } from '@moonrepo/types';
import path from 'path';

const LANGUAGE_MANIFESTS: Partial<Record<ProjectLanguage, string>> = {
	javascript: 'package.json',
	typescript: 'tsconfig.json',
};

// https://devicon.dev
function createLangIcon(context: vscode.ExtensionContext, name: ProjectLanguage) {
	const icon = context.asAbsolutePath(path.join(`assets/langs/${name}.svg`));

	return {
		dark: icon,
		light: icon,
	};
}

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
				this.iconPath = new ThemeIcon('run-all');
				break;
			case 'test':
				this.iconPath = new ThemeIcon('beaker');
				break;
		}
	}
}

class ProjectItem extends TreeItem {
	context: vscode.ExtensionContext;
	parent: ProjectCategoryItem;
	project: Project;
	tasks: TaskItem[];

	constructor(context: vscode.ExtensionContext, parent: ProjectCategoryItem, project: Project) {
		super(project.id, TreeItemCollapsibleState.Collapsed);

		this.context = context;
		this.parent = parent;
		this.project = project;
		this.id = project.id;
		this.contextValue = 'project';

		const { language, project: metadata } = project.config;

		if (metadata) {
			this.tooltip = `${metadata.name} - ${metadata.description}`;
		}

		this.tasks = Object.values(project.tasks).map((task) => new TaskItem(this, task));
		this.resourceUri = Uri.file(
			path.join(project.root, LANGUAGE_MANIFESTS[language] || 'moon.yml'),
		);
		this.iconPath =
			language === 'unknown' ? new ThemeIcon('question') : createLangIcon(this.context, language);
	}
}

class ProjectCategoryItem extends TreeItem {
	context: vscode.ExtensionContext;
	projects: ProjectItem[] = [];

	constructor(context: vscode.ExtensionContext, type: ProjectType, projects: Project[]) {
		super(type, TreeItemCollapsibleState.Expanded);

		this.context = context;
		this.id = type;
		this.contextValue = 'projectCategory';
		this.projects = projects
			.filter(
				(project) => project.config.type === type || (type === 'unknown' && !project.config.type),
			)
			.map((project) => new ProjectItem(context, this, project));

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
	context: vscode.ExtensionContext;
	workspaceRoot: string;

	constructor(context: vscode.ExtensionContext, workspaceRoot: string) {
		this.context = context;
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

		const categories = [
			new ProjectCategoryItem(this.context, 'application', projects),
			new ProjectCategoryItem(this.context, 'library', projects),
			new ProjectCategoryItem(this.context, 'tool', projects),
			new ProjectCategoryItem(this.context, 'unknown', projects),
		].filter((cat) => cat.projects.length > 0);

		// If only 1 category, flatten the projects list
		if (categories.length === 1) {
			return categories[0].projects;
		}

		return categories;
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
			new ShellExecution(findMoonBin(this.workspaceRoot)!, ['run', target], {
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
