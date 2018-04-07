import * as fs from 'fs-extra';
import * as path from 'path';

import escapeRegExp = require('lodash.escaperegexp');
import * as vscode from 'vscode';

import * as filepaths from './managers/filepaths';
import * as promptUtils from './utils/prompt';

import { IPluginSettings } from './types';

/**
 * Open file after duplicate action.
 */
async function openFile(filepath: string): Promise<vscode.TextEditor> {
	const document = await (vscode.workspace.openTextDocument(filepath) as Promise<vscode.TextDocument>);

	return vscode.window.showTextDocument(document);
}

/**
 * Duplicate action.
 */
async function duplicator(uri: vscode.Uri, settings: IPluginSettings): Promise<vscode.TextEditor | undefined> {
	const oldPath = uri.fsPath;
	const oldPathParsed = path.parse(oldPath);
	const oldPathStats = await fs.stat(oldPath);

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
	const newPathExists = await fs.pathExists(newPath);
	if (newPathExists) {
		const userAnswer = await promptUtils.overwrite(newPath);
		if (!userAnswer) {
			return;
		}
	}

	try {
		await fs.copy(uri.fsPath, newPath);

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

export function activate(context: vscode.ExtensionContext): void {
	const command = vscode.commands.registerCommand('duplicate.execute', (uri: vscode.TextDocument | vscode.Uri) => {
		const settings = vscode.workspace.getConfiguration().get('duplicate') as IPluginSettings;

		if (!uri || !(<vscode.Uri>uri).fsPath) {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				return;
			}

			return duplicator(<vscode.Uri>editor.document.uri, settings);
		}

		return duplicator(<vscode.Uri>uri, settings);
	});

	context.subscriptions.push(command);
}
