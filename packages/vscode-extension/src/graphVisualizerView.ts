import { satisfies } from 'semver';
import vscode, { ViewColumn } from 'vscode';
import { execMoon, getMoonVersion } from './moon';

export type GraphType = 'dep-graph' | 'project-graph';

export class GraphVisualizerView {
	context: vscode.ExtensionContext;

	panel: vscode.WebviewPanel;

	type: GraphType;

	workspaceRoot: string;

	constructor(context: vscode.ExtensionContext, workspaceRoot: string, type: GraphType) {
		this.context = context;
		this.workspaceRoot = workspaceRoot;
		this.type = type;
		this.panel = vscode.window.createWebviewPanel(
			type === 'dep-graph' ? 'moonDepGraph' : 'moonProjectGraph',
			type === 'dep-graph' ? 'Dependency graph' : 'Project graph',
			ViewColumn.Active,
			{
				enableScripts: true,
				localResourceRoots: [context.extensionUri],
			},
		);
	}

	renderHtml(content: string) {
		const { title } = this.panel;
		const cssUri = this.panel.webview.asWebviewUri(
			vscode.Uri.joinPath(this.context.extensionUri, 'assets/webview.css'),
		);

		return `<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Moon visualizer | ${title}</title>
		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
		<link
			href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,500&display=swap"
			rel="stylesheet"
		/>
		<script type="module" src="https://unpkg.com/@vscode/webview-ui-toolkit@latest"></script>
		<script type="module" src="https://unpkg.com/@moonrepo/visualizer@latest"></script>
		<link href="${cssUri}" rel="stylesheet">
	</head>
	<body class="dark bg-slate-800 text-gray-50">
		<script>
		window.PAGE_TITLE = '${title}';
		</script>
		${content}
	</body>
</html>
`;
	}

	async renderPanel() {
		const version = await getMoonVersion(this.workspaceRoot);

		if (satisfies(version, '>=0.21.3')) {
			const data = await execMoon([this.type, '--json'], this.workspaceRoot);

			this.panel.webview.html = this.renderHtml(
				`<script>window.GRAPH_DATA = '${data}';</script><div id="app"></div>`,
			);
		} else {
			this.panel.webview.html = this.renderHtml(
				`Graph visualization not available for this version of moon. Requires >= 0.21.3, found ${version}.`,
			);
		}
	}
}
