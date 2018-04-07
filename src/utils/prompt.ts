import * as vscode from 'vscode';

export function name(filename: string) {
	return vscode.window.showInputBox({
		placeHolder: 'Enter the new path for the duplicate.',
		value: filename.split('.').map((el, i) => i === 0 ? `${el}-copy` : el).join('.')
	});
}

export function overwrite(filepath: string) {
	const message = `The path **${filepath}** alredy exists. Do you want to overwrite the existing path?`;
	const action = {
		title: 'OK',
		isCloseAffordance: false
	};

	return vscode.window.showWarningMessage(message, action);
}
