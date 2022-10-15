import fs from 'fs';
import path from 'path';
import vscode from 'vscode';
import { formatDuration, prepareReportActions } from '@moonrepo/report';
import type { RunReport } from '@moonrepo/types';

const REPORT_PATH = '.moon/cache/runReport.json';
const SLOW_THRESHOLD_SECS = 120;

export class LastRunProvider implements vscode.WebviewViewProvider {
	context: vscode.ExtensionContext;
	view?: vscode.WebviewView;
	workspaceRoot: string;

	constructor(context: vscode.ExtensionContext, workspaceRoot: string) {
		this.context = context;
		this.workspaceRoot = workspaceRoot;

		// When `.moon/cache/runReport.json` is changed, refresh view
		const watcher = vscode.workspace.createFileSystemWatcher(
			new vscode.RelativePattern(
				vscode.workspace.workspaceFolders?.[0] ?? workspaceRoot,
				REPORT_PATH,
			),
		);
		watcher.onDidChange(this.renderView, this);
		watcher.onDidCreate(this.renderView, this);
		watcher.onDidDelete(this.renderView, this);

		context.subscriptions.push(watcher);
	}

	resolveWebviewView(webviewView: vscode.WebviewView): Thenable<void> | void {
		const workspaceUri = vscode.workspace.workspaceFolders?.[0].uri;

		webviewView.webview.options = {
			enableScripts: true,
			localResourceRoots: this.workspaceRoot.includes('moon-dev')
				? [workspaceUri!]
				: [this.context.extensionUri],
		};

		this.view = webviewView;
		this.renderView();
	}

	formatComments(comments: string[]): string {
		if (comments.length === 0) {
			return '';
		}

		const content = comments
			.map((comment) => comment.replace(/\*\*(\w+)\*\*/g, (_, match) => `<b>${match}</b>`))
			.join(', ');

		return `| ${content}`;
	}

	renderHtml(content: string) {
		const toolkitUri = this.view?.webview.asWebviewUri(
			vscode.Uri.joinPath(
				this.context.extensionUri,
				// Traverse upwards because of Yarn workspaces
				this.workspaceRoot.includes('moon-dev')
					? '../../node_modules/@vscode/webview-ui-toolkit/dist/toolkit.js'
					: 'node_modules/@vscode/webview-ui-toolkit/dist/toolkit.js',
			),
		);

		const cssUri = this.view?.webview.asWebviewUri(
			vscode.Uri.joinPath(this.context.extensionUri, 'assets/webview.css'),
		);

		return `<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>moon - Last run report</title>
					<script type="module" src="${toolkitUri}"></script>
					<link href="${cssUri}" rel="stylesheet">
				</head>
				<body>
					${content}
				</body>
			</html>`;
	}

	renderView() {
		if (!this.view) {
			return;
		}

		const runReportPath = path.join(this.workspaceRoot, REPORT_PATH);

		if (fs.existsSync(runReportPath)) {
			const report = JSON.parse(fs.readFileSync(runReportPath, 'utf8')) as RunReport;

			const tableRows = prepareReportActions(report, SLOW_THRESHOLD_SECS).map(
				(action, index) => `
					<tr>
						<td>
							<span class="action-icon">${action.icon}</span>
						</td>
						<td>
							<span class="action-label">${action.label}</span><br />
							${action.time} | ${report.actions[index].status} ${this.formatComments(action.comments)}
						</td>
					</tr>
				`,
			);

			this.view.webview.html = this.renderHtml(`
				Finished ${
					report.context.primaryTargets.length > 0
						? `<b>${report.context.primaryTargets.join(', ')}</b> `
						: ''
				}in ${formatDuration(report.duration)}.

				<br /><br />

				<table>
					${tableRows.join('\n')}
				</table>
			`);
		} else {
			this.view.webview.html = this.renderHtml(`
				No run report found. Run a target through the projects view, or pass <code>--report</code> on the command line.
			`);
		}
	}
}
