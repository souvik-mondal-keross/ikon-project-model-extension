import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { diffLines, Change } from 'diff';


export class JsonCustomEditor implements vscode.CustomTextEditorProvider {

    private isApplyingEdit = false;

    public static register(context: vscode.ExtensionContext): vscode.Disposable {
        const provider = new JsonCustomEditor(context);
        const providerRegistration = vscode.window.registerCustomEditorProvider(
            JsonCustomEditor.viewType,
            provider
        );
        return providerRegistration;
    }

    private static readonly viewType = 'jsonCustomEditor.processModelEditor';
    private _documentChangeEmitter = new vscode.EventEmitter<void>();

    // Event to notify VSCode of changes
    public readonly onDidChange = this._documentChangeEmitter.event;

    constructor(private readonly context: vscode.ExtensionContext) { }

    public async resolveCustomTextEditor(
        document: vscode.TextDocument,
        webviewPanel: vscode.WebviewPanel,
        _token: vscode.CancellationToken
    ): Promise<void> {
        // Set webview options
        webviewPanel.webview.options = {
            enableScripts: true,
        };

        // Load your custom HTML content
        webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

        // Synchronize document content
        webviewPanel.webview.onDidReceiveMessage((e) => {
            if (e.command === 'update') {
                document.save()
            }

            else if (e.command === 'modified') {
                this._documentChangeEmitter.fire();
                this.updateTextDocument(document, e.text);
            }
        });

        // Reflect updates to the webview
        const updateWebview = () => {

            webviewPanel.webview.postMessage({
                type: 'update',
                text: document.getText(),
            });
        };

        const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument((e) => {
            if (e.document.uri.toString() === document.uri.toString()) {
                if (this.isApplyingEdit) {
                    return;
                }
                updateWebview();
            }
        });

        webviewPanel.onDidDispose(() => {
            changeDocumentSubscription.dispose();
        });

        updateWebview();
    }

    private getHtmlForWebview(webview: vscode.Webview): string {
        // Custom UI: Load a local HTML file or inline HTML
        const editorScriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this.context.extensionUri, 'media', 'processModelEditor.js')
        );

        const helperScriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this.context.extensionUri, 'media', 'modelEditorHelpers.js')
        );
        
        const extensionStyleSheetUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this.context.extensionUri, 'media', 'extensionStyleSheet.css')
        );
        // Load the HTML file dynamically from the media folder
        const htmlFilePath = vscode.Uri.file(
            path.join(this.context.extensionPath, 'media', 'processModelEditor.html')
        );

        // Read HTML file content
        const htmlContent = fs.readFileSync(htmlFilePath.fsPath, 'utf8');
        const finalHtmlContent = htmlContent
            .replace('${editorScriptUri}', editorScriptUri.toString())
            .replace('${helperScriptUri}', helperScriptUri.toString())
            .replace('${extensionStyleSheet}', extensionStyleSheetUri.toString());

        return finalHtmlContent;


    }

    private async updateTextDocument(document: vscode.TextDocument, content: string): Promise<boolean> {

        this.isApplyingEdit = true;
        const edit = new vscode.WorkspaceEdit();

        // Just replace the entire document every time for this example extension.
        // A more complete extension should compute minimal edits instead.
        edit.replace(
            document.uri,
            new vscode.Range(0, 0, document.lineCount, 0),
            JSON.stringify(JSON.parse(content), null, 4)
        );

        const editPromise = await vscode.workspace.applyEdit(edit);
        this.isApplyingEdit = false;

        return editPromise;
    }

}
