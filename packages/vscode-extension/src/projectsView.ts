import fs from 'fs';
import path from 'path';
import vscode, {
	Event,
	EventEmitter,
	TaskGroup,
	ThemeIcon,
	TreeItem,
	TreeItemCollapsibleState,
	Uri,
} from 'vscode';
import type { Project, ProjectLanguage, ProjectType, Task as ProjectTask } from '@moonrepo/types';
import { checkProject, runTarget } from './commands';
import { execMoon } from './moon';

const LANGUAGE_MANIFESTS: Record<ProjectLanguage, string> = {
	bash: '',
	batch: '',
	go: 'go.mod',
	javascript: 'package.json',
	php: 'composer.json',
	python: 'pyproject.toml',
	ruby: 'Gemfile',
	rust: 'Cargo.toml',
	typescript: 'tsconfig.json',
	unknown: '',
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
		super('No tasks in project', TreeItemCollapsibleState.None);

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

		switch (task.type) {
			case 'build':
				this.iconPath = new ThemeIcon('wrench');
				break;
			case 'run':
				this.iconPath = new ThemeIcon('terminal');
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
	projects?: Project[];
	workspaceRoot: string;

	onDidChangeTreeDataEmitter: EventEmitter<TreeItem | null>;
	onDidChangeTreeData: Event<TreeItem | null>;

	constructor(context: vscode.ExtensionContext, workspaceRoot: string) {
		this.context = context;
		this.workspaceRoot = workspaceRoot;
		this.onDidChangeTreeDataEmitter = new EventEmitter<TreeItem | null>();
		this.onDidChangeTreeData = this.onDidChangeTreeDataEmitter.event;

		const wsDir = vscode.workspace.workspaceFolders?.[0] ?? workspaceRoot;

		// When `.moon/*.yml` is changed, refresh projects
		const watcher1 = vscode.workspace.createFileSystemWatcher(
			new vscode.RelativePattern(wsDir, '.moon/*.yml'),
		);
		watcher1.onDidChange(this.refresh, this);

		// When `moon.yml` is changed, refresh projects
		const watcher2 = vscode.workspace.createFileSystemWatcher(
			new vscode.RelativePattern(wsDir, '**/moon.yml'),
		);
		watcher2.onDidChange(this.refresh, this);

		context.subscriptions.push(
			vscode.commands.registerCommand('moon.refreshProjects', this.refresh, this),
			vscode.commands.registerCommand('moon.runTarget', this.runTarget, this),
			vscode.commands.registerCommand('moon.checkProject', this.checkProject, this),
			vscode.commands.registerCommand('moon.viewProject', this.viewProject, this),
			watcher1,
			watcher2,
		);
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

		if (!this.projects) {
			const { projects } = JSON.parse(
				await execMoon(['query', 'projects'], this.workspaceRoot),
			) as {
				projects: Project[];
			};

			this.projects = projects.sort((a, d) => a.id.localeCompare(d.id));
		}

		const categories = [
			new ProjectCategoryItem(this.context, 'application', this.projects),
			new ProjectCategoryItem(this.context, 'library', this.projects),
			new ProjectCategoryItem(this.context, 'tool', this.projects),
			new ProjectCategoryItem(this.context, 'unknown', this.projects),
		].filter((cat) => cat.projects.length > 0);

		// If only 1 category, flatten the projects list
		if (categories.length === 1) {
			return categories[0].projects;
		}

		return categories;
	}

	getTreeItem(element: TreeItem): Thenable<TreeItem> | TreeItem {
		return element;
	}

	refresh() {
		this.projects = undefined;
		this.onDidChangeTreeDataEmitter.fire(null);
	}

	async runTarget(item: TaskItem) {
		await runTarget(item.task.target, this.workspaceRoot, (task) => {
			switch (item.task.type) {
				case 'build':
					task.group = TaskGroup.Build;
					break;
				default:
					task.group = TaskGroup.Test;
					break;
			}
		});
	}

	async checkProject(item: ProjectItem) {
		await checkProject(item.project.id, this.workspaceRoot);
	}

	async viewProject(item: ProjectItem) {
		await vscode.commands.executeCommand('workbench.view.explorer');

		const configUri = Uri.file(path.join(item.project.root, 'moon.yml'));

		await vscode.commands.executeCommand(
			'vscode.open',
			fs.existsSync(configUri.fsPath) ? configUri : item.resourceUri,
		);

		// await vscode.commands.executeCommand('vscode.openFolder', Uri.file(item.project.root));
	}
}
