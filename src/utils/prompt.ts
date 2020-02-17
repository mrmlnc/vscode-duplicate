import * as vscode from 'vscode';

export function name(filename: string): Promise<string | undefined> {
	const value = filename.replace(/(\.[^.]+)$/, '-copy.$1');
	return vscode.window.showInputBox({
		value,
		placeHolder: 'Enter the new path for the duplicate.',
	}) as Promise<string | undefined>;
}

export function overwrite(filepath: string): Promise<vscode.MessageItem | undefined> {
	const message = `The path **${filepath}** already exists. Do you want to overwrite the existing path?`;
	const action = {
		title: 'OK',
		isCloseAffordance: false
	};

	return vscode.window.showWarningMessage(message, action) as Promise<vscode.MessageItem | undefined>;
}
