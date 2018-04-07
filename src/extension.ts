import * as path from 'path';

import * as vscode from 'vscode';
import escapeRegExp = require('lodash.escaperegexp');

import * as filepaths from './managers/filepaths';
import * as fsUtils from './utils/fs';
import * as promptUtils from './utils/prompt';

import { IPluginSettings } from './types';

/**
 * Open file after duplicate action.
 */
async function openFile(filepath: string) {
	const document = await vscode.workspace.openTextDocument(filepath);

	return vscode.window.showTextDocument(document);
}

/**
 * Duplicate action.
 */
async function duplicator(uri: vscode.Uri, settings: IPluginSettings) {
	const oldPath = uri.fsPath;
	const oldPathParsed = path.parse(oldPath);
	const oldPathStats = await fsUtils.pathStat(oldPath);

	// Get a new name for the resource
	const newName = await promptUtils.name(oldPathParsed.name);
	if (!newName) {
		return;
	}

	// Get the new full path
	const newPath = filepaths.buildFilepath(oldPathParsed, oldPathStats, newName, settings);

	// If a user tries to copy a file on the same path
	if (uri.fsPath === newPath) {
		vscode.window.showErrorMessage('You can\'t copy a file or directory on the same path.');
		return;
	}

	// Check if the current path exists
	const newPathExists = await fsUtils.pathExists(newPath);
	if (newPathExists) {
		const userAnswer = await promptUtils.overwrite(newPath);
		if (!userAnswer) {
			return;
		}
	}

	try {
		await fsUtils.copy(uri.fsPath, newPath);

		if (settings.openFileAfterCopy && oldPathStats.isFile()) {
			return openFile(newPath);
		}
	} catch (err) {
		const errMsgRegExp = new RegExp(escapeRegExp(oldPathParsed.dir), 'g');
		const errMsg = err.message
			.replace(errMsgRegExp, '')
			.replace(/[\\|\/]/g, '')
			.replace(/`|'/g, '**');

		vscode.window.showErrorMessage(`Error: ${errMsg}`);
	}

	return;
}

export function activate(context: vscode.ExtensionContext) {
	const command = vscode.commands.registerCommand('duplicate.execute', (uri: vscode.TextDocument | vscode.Uri) => {
		if (!uri || !(<vscode.Uri>uri).fsPath) {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				return;
			}
			uri = editor.document.uri;
		}

		const settings = vscode.workspace.getConfiguration().get('duplicate') as IPluginSettings;

		duplicator(<vscode.Uri>uri, settings);
	});

	context.subscriptions.push(command);
}
