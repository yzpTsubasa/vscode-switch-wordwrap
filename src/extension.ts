import * as vscode from "vscode";

import * as pkg from '../package.json';

export function activate(context: vscode.ExtensionContext) {
    console.log(`Extention ${pkg.name} is now active!`);
}