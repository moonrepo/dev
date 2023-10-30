import fs from 'fs';
import path from 'path';
import { satisfies } from 'semver';
import vscode, {
	type Event,
	EventEmitter,
	TaskGroup,
	ThemeIcon,
	TreeItem,
	TreeItemCollapsibleState,
	Uri,
} from 'vscode';
import type { LanguageType, Project, ProjectType, Task as ProjectTask } from '@moonrepo/types';
import { checkProject, runTask } from './commands';
import { execMoon, getMoonVersion } from './moon';

const LANGUAGE_MANIFESTS: Record<LanguageType, string> = {
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
function createLangIcon(context: vscode.ExtensionContext, name: LanguageType) {
	const icon = context.asAbsolutePath(path.join(`assets/langs/${name}.svg`));

	if (fs.existsSync(icon)) {
		return {
			dark: icon,
			light: icon,
		};
	}

	const unknown = context.asAbsolutePath(path.join(`assets/langs/unknown.svg`));

	return {
		dark: unknown,
		light: unknown,
	};
}

function canShowTask(id: string, hideTasks: Set<string>): boolean {
	if (hideTasks.size === 0 || !hideTasks.has(id)) {
		return true;
	}

	if (hideTasks.has(':') || hideTasks.has('*:*')) {
		return false;
	}

	for (const target of hideTasks) {
		const [scope = '', task = ''] = target.split(':', 2);
		const scopePattern = scope === '' || scope === '*' ? '^[^:]+' : `^${scope}`;
		const taskPattern = task === '' || task === '*' ? '[^:]+$' : `${task}$`;
		const pattern = new RegExp(`${scopePattern}:${taskPattern}`, 'i');

		if (pattern.test(id)) {
			return false;
		}
	}

	return true;
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
		super(task.target.split(':', 2)[1], TreeItemCollapsibleState.None);

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

		const { language } = project;
		const { project: metadata } = project.config;

		if (metadata) {
			this.tooltip = `${metadata.name} - ${metadata.description}`;
		}

		this.tasks = Object.entries(project.tasks)
			.filter(([id, _]) => canShowTask(id, this.parent.hideTasks))
			.map(([_, task]) => new TaskItem(this, task));

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

	hideTasks: Set<string>;

	constructor(context: vscode.ExtensionContext, type: ProjectType, projects: Project[]) {
		super(type, TreeItemCollapsibleState.Expanded);

		this.context = context;
		this.id = type;
		this.contextValue = 'projectCategory';

		this.hideTasks = new Set(vscode.workspace.getConfiguration('moon').get('hideTasks', []));
		this.projects = projects
			.filter(
				(project) => project.config.type === type || (type === 'unknown' && !project.config.type),
			)
			.map((project) => new ProjectItem(context, this, project));

		switch (type) {
			case 'application':
				this.label = 'Applications';
				break;
			case 'automation':
				this.label = 'Automations';
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
			new vscode.RelativePattern(wsDir, '.moon/**/*.yml'),
		);
		watcher1.onDidChange(this.refresh, this);

		// When `moon.yml` is changed, refresh projects
		const watcher2 = vscode.workspace.createFileSystemWatcher(
			new vscode.RelativePattern(wsDir, '**/moon.yml'),
		);
		watcher2.onDidChange(this.refresh, this);

		context.subscriptions.push(
			vscode.commands.registerCommand('moon.refreshProjects', this.refresh, this),
			vscode.commands.registerCommand('moon.runTask', this.runTask, this),
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
			const version = await getMoonVersion(this.workspaceRoot);

			const { projects } = JSON.parse(
				await execMoon(
					satisfies(version, '>=0.24.0') ? ['query', 'projects', '--json'] : ['query', 'projects'],
					this.workspaceRoot,
				),
			) as {
				projects: Project[];
			};

			this.projects = projects.sort((a, d) => a.id.localeCompare(d.id));
		}

		const categories = [
			new ProjectCategoryItem(this.context, 'application', this.projects),
			new ProjectCategoryItem(this.context, 'automation', this.projects),
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

	async runTask(item: TaskItem) {
		await runTask(item.task.target, this.workspaceRoot, (task) => {
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
