import fs from 'fs';
import path from 'path';
import vscode, {
	Disposable,
	type Event,
	EventEmitter,
	TaskGroup,
	ThemeIcon,
	TreeItem,
	TreeItemCollapsibleState,
	Uri,
} from 'vscode';
import type {
	LanguageType,
	Project,
	ProjectStack,
	ProjectType,
	Task as ProjectTask,
} from '@moonrepo/types';
import { checkProject, runTask } from './commands';
import type { Workspace } from './workspace';

const UNTAGGED = '__untagged__';
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

	const unknown = context.asAbsolutePath(path.join('assets/langs/unknown.svg'));

	return {
		dark: unknown,
		light: unknown,
	};
}

function canShowTask(target: string, hideTasks: Set<string>): boolean {
	if (hideTasks.size === 0) {
		return true;
	}

	if (hideTasks.has(':') || hideTasks.has('*:*')) {
		return false;
	}

	for (const hideTarget of hideTasks) {
		if (target === hideTarget) {
			return false;
		}

		const [scope = '', task = ''] = hideTarget.split(':', 2);
		const scopePattern = scope === '' || scope === '*' ? '^[^:]+' : `^${scope}`;
		const taskPattern = task === '' || task === '*' ? '[^:]+$' : `${task}$`;
		const pattern = new RegExp(`${scopePattern}:${taskPattern}`, 'i');

		if (pattern.test(target)) {
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
		this.id = `${parent.id}-task-${task.id}`;
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

	parent: ProjectCategoryItem | ProjectTagItem;

	project: Project;

	tasks: TaskItem[];

	constructor(
		context: vscode.ExtensionContext,
		parent: ProjectCategoryItem | ProjectTagItem,
		project: Project,
	) {
		super(project.id, TreeItemCollapsibleState.Collapsed);

		this.context = context;
		this.parent = parent;
		this.project = project;
		this.id = `${parent.id}-project-${project.id}`;
		this.contextValue = 'project';

		const { language } = project;
		const { project: metadata } = project.config;

		if (metadata) {
			this.tooltip = `${metadata.name} - ${metadata.description}`;
		}

		this.tasks = Object.values(project.tasks)
			.filter((task) => canShowTask(task.target, this.parent.hideTasks))
			.map((task) => new TaskItem(this, task));

		this.tasks.sort((a, d) => a.id!.localeCompare(d.id!));

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

	// eslint-disable-next-line complexity
	constructor(context: vscode.ExtensionContext, category: string, projects: Project[]) {
		super(category, TreeItemCollapsibleState.Expanded);

		this.context = context;
		this.id = `category-${category}`;
		this.contextValue = 'projectCategory';

		this.hideTasks = new Set(vscode.workspace.getConfiguration('moon').get('hideTasks', []));
		this.projects = projects.map((project) => new ProjectItem(context, this, project));

		let stack: ProjectStack = 'unknown';
		let type: ProjectType = 'unknown';
		let label = '';

		// moon >= v1.22
		if (category.includes('+')) {
			[stack, type] = category.split('+') as [ProjectStack, ProjectType];
		}
		// moon < v1.22
		else {
			type = category as ProjectType;
		}

		if (stack === 'unknown' && type === 'unknown') {
			label = 'other';
		} else {
			if (stack !== 'unknown') {
				switch (stack) {
					case 'backend':
						label += 'backend';
						break;
					case 'frontend':
						label += 'frontend';
						break;
					case 'infrastructure':
						label += 'infrastructure';
						break;
					case 'systems':
						label += 'systems';
						break;
				}

				label += ' ';
			}

			switch (type) {
				case 'application':
					label += 'applications';
					break;
				case 'automation':
					label += 'automations';
					break;
				case 'configuration':
					label += 'configuration';
					break;
				case 'library':
					label += 'libraries';
					break;
				case 'scaffolding':
					label += 'scaffolding';
					break;
				case 'tool':
					label += 'tools';
					break;
				case 'unknown':
					label += 'other';
					break;
			}
		}

		// Capitalize first letter
		this.label = label.at(0)!.toUpperCase() + label.slice(1);
	}
}

class ProjectTagItem extends TreeItem {
	context: vscode.ExtensionContext;

	projects: ProjectItem[] = [];

	hideTasks: Set<string>;

	constructor(context: vscode.ExtensionContext, tag: string, projects: Project[]) {
		super(tag, TreeItemCollapsibleState.Collapsed);

		this.context = context;
		this.id = `tag-${tag}`;
		this.contextValue = 'projectTag';

		this.hideTasks = new Set(vscode.workspace.getConfiguration('moon').get('hideTasks', []));
		this.projects = projects.map((project) => new ProjectItem(context, this, project));

		this.label = tag === UNTAGGED ? 'Untagged' : `#${tag}`;
	}
}

export type ProjectsType = 'category' | 'tag';

export class ProjectsProvider implements vscode.TreeDataProvider<TreeItem> {
	context: vscode.ExtensionContext;

	projects?: Project[];

	type: ProjectsType;

	workspace: Workspace;

	onDidChangeTreeDataEmitter: EventEmitter<TreeItem | null>;

	onDidChangeTreeData: Event<TreeItem | null>;

	constructor(context: vscode.ExtensionContext, workspace: Workspace, type: ProjectsType) {
		this.context = context;
		this.workspace = workspace;
		this.type = type;
		this.onDidChangeTreeDataEmitter = new EventEmitter<TreeItem | null>();
		this.onDidChangeTreeData = this.onDidChangeTreeDataEmitter.event;

		const commandPrefix = type === 'category' ? 'projectCategory' : 'projectTag';

		context.subscriptions.push(
			vscode.commands.registerCommand(`moon.${commandPrefix}.refreshProjects`, this.refresh, this),
			vscode.commands.registerCommand(`moon.${commandPrefix}.runTask`, this.runTask, this),
			vscode.commands.registerCommand(
				`moon.${commandPrefix}.checkProject`,
				this.checkProject,
				this,
			),
			vscode.commands.registerCommand(`moon.${commandPrefix}.viewProject`, this.viewProject, this),
		);

		workspace.onDidChangeWorkspace((folder) => {
			this.refresh();

			if (!folder) {
				return undefined;
			}

			// When `.moon/**/*.yml` is changed, refresh projects
			const watcher1 = vscode.workspace.createFileSystemWatcher(
				new vscode.RelativePattern(folder.uri, workspace.getMoonDirPath('**/*.yml')),
			);

			// When `moon.yml` is changed, refresh projects
			const watcher2 = vscode.workspace.createFileSystemWatcher(
				new vscode.RelativePattern(folder.uri, '**/moon.yml'),
			);

			watcher1.onDidChange(this.refresh, this);
			watcher2.onDidChange(this.refresh, this);

			return Disposable.from(watcher1, watcher2);
		});
	}

	getParent(element: TreeItem): vscode.ProviderResult<TreeItem> {
		if (element instanceof TaskItem || element instanceof ProjectItem) {
			return element.parent;
		}

		return null;
	}

	async getChildren(element?: TreeItem | undefined): Promise<TreeItem[]> {
		if (!this.workspace.root) {
			return [];
		}

		if (element instanceof TaskItem) {
			return [];
		}

		if (element instanceof ProjectItem) {
			return element.tasks.length > 0 ? element.tasks : [new NoTasks()];
		}

		if (element instanceof ProjectCategoryItem) {
			return element.projects;
		}

		if (element instanceof ProjectTagItem) {
			return element.projects;
		}

		if (!this.projects) {
			const { projects } = JSON.parse(
				await this.workspace.execMoon(['query', 'projects', '--json']),
			) as {
				projects: Project[];
			};

			this.projects = projects.sort((a, d) => a.id.localeCompare(d.id));
		}

		const sections = (
			this.type === 'category' ? this.getCategoryChildren() : this.getTagChildren()
		).filter((section) => section.projects.length > 0);

		// If only 1 section, flatten the projects list
		if (this.type === 'category' && sections.length === 1) {
			return sections[0].projects;
		}

		return sections;
	}

	getCategoryChildren(): ProjectCategoryItem[] {
		const categories: Record<string, Project[]> = {};
		const uncategorized: Project[] = [];

		this.projects!.forEach((project) => {
			const stack: string = project.config.stack || 'unknown';
			const type: string = project.config.type || 'unknown';
			const key = `${stack}+${type}`;

			if (key === 'unknown+unknown') {
				uncategorized.push(project);
			} else {
				categories[key] ||= [];
				categories[key].push(project);
			}
		});

		const sections = Object.entries(categories).map(
			([key, projects]) => new ProjectCategoryItem(this.context, key, projects),
		);

		sections.push(new ProjectCategoryItem(this.context, 'unknown', uncategorized));

		return sections;
	}

	getTagChildren(): ProjectTagItem[] {
		const tags: Record<string, Project[]> = {};
		const untagged: Project[] = [];

		this.projects!.forEach((project) => {
			if (project.config.tags.length === 0) {
				untagged.push(project);
			} else {
				project.config.tags.forEach((tag) => {
					tags[tag] ||= [];
					tags[tag].push(project);
				});
			}
		});

		const sections = Object.entries(tags).map(
			([tag, projects]) => new ProjectTagItem(this.context, tag, projects),
		);

		sections.push(new ProjectTagItem(this.context, UNTAGGED, untagged));

		return sections;
	}

	getTreeItem(element: TreeItem): Thenable<TreeItem> | TreeItem {
		return element;
	}

	refresh() {
		this.projects = undefined;
		this.onDidChangeTreeDataEmitter.fire(null);
	}

	async runTask(item: TaskItem) {
		await runTask(item.task.target, this.workspace, (task) => {
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
		await checkProject(item.project.id, this.workspace);
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
