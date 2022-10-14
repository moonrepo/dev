import vscode from 'vscode';
import path from 'path';
import fs from 'fs';
import type { RunReport } from '@moonrepo/types';
import { formatDuration, prepareReportActions } from '@moonrepo/report';

export class LastRunProvider implements vscode.WebviewViewProvider {
	context: vscode.ExtensionContext;
	view?: vscode.WebviewView;
	workspaceRoot: string;

	constructor(context: vscode.ExtensionContext, workspaceRoot: string) {
		this.context = context;
		this.workspaceRoot = workspaceRoot;
	}

	resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext<unknown>,
		token: vscode.CancellationToken,
	): void | Thenable<void> {
		this.view = webviewView;

		webviewView.webview.options = {
			enableScripts: true,
			// localResourceRoots: [this.context.extensionUri],
		};

		const runReportPath = path.join(this.workspaceRoot, '.moon/cache/runReport.json');

		if (fs.existsSync(runReportPath)) {
			const report = JSON.parse(fs.readFileSync(runReportPath, 'utf8')) as RunReport;
			const tableRows = prepareReportActions(report, 120).map(
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

			webviewView.webview.html = this.renderHtml(`
				Run report for <b>${report.context.primaryTargets.join(', ')}</b>.
				Finished in ${formatDuration(report.duration)}.

				<br /><br />

				<table>
					${tableRows.join('\n')}
				</table>
			`);
		} else {
			webviewView.webview.html = this.renderHtml(`
				No run report found. Run a target through the projects view above, or pass <vscode-tag>--report</vscode-tag> on the command line.
			`);
		}
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
		// Traverse upwards because of Yarn workspaces
		const toolkitUri = this.view?.webview.asWebviewUri(
			vscode.Uri.joinPath(
				this.context.extensionUri,
				'../../node_modules/@vscode/webview-ui-toolkit/dist/toolkit.js',
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
}
