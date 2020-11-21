import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
    console.log(`Extention vscode-switch-wordwrap is now active!`);
    vscode.window.onDidChangeActiveTextEditor(editor => {
        handleWorkspace(suc => {});
    });
    vscode.workspace.onDidCloseTextDocument(document => {
        let fsPath = document.uri.fsPath;
        let openedFiles = getOpenedFiles();
        openedFiles[fsPath] = false;
    });
    handleWorkspace(suc => {});
}

function handleWorkspace(cb: (suc: boolean, reason?: any) => void): void {
    doSomething().then(v => {
        cb && cb(true);
    }, reason => {
        cb && cb(false, reason);
    });
}

let editorID2OpenedFiles: { [editorID: number]: {[fsPath: string]: any} } = {};

async function doSomething(): Promise<void> {
    if (!vscode.window.activeTextEditor) {
        return;
    }
    let document = vscode.window.activeTextEditor?.document;
    if (!document) {
        return;
    }
    let fsPath = document.uri.fsPath;
    if (!fsPath) {
        return;
    }
    let config = vscode.workspace.getConfiguration("vscode-switch-wordwrap", document);
    let applyLanguageIds: string[] = config.get("applyLanguageIds", []);
    if (applyLanguageIds.indexOf(document.languageId) == -1) {
        return;
    }
    let openedFiles = getOpenedFiles();
    let hasOpened = openedFiles[fsPath];
    openedFiles[fsPath] = true;
    if (!hasOpened) {
        await vscode.commands.executeCommand("editor.action.toggleWordWrap", true);
    }

}

function getOpenedFiles() {
    let editorID = (<any>vscode.window.activeTextEditor)['id'];
    let openedFiles = editorID2OpenedFiles[editorID];
    if (!openedFiles) {
        openedFiles = editorID2OpenedFiles[editorID] = {};
    }
    return openedFiles;
}

