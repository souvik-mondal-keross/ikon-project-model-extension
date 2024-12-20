import * as vscode from 'vscode';
import { JsonCustomEditor } from './JsonCustomEditor';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(JsonCustomEditor.register(context));
}
