'use strict';

import * as path from 'path';
import * as fs from 'fs-extra';

import * as vscode from 'vscode';
import escapeRegExp = require('lodash.escaperegexp');

function pathExists(filepath: string): Promise<Boolean> {
	return new Promise((resolve) => {
		fs.stat(filepath, (err) => resolve(!err));
	});
}

function pathStat(filepath: string): Promise<fs.Stats> {
	return new Promise((resolve, reject) => {
		fs.stat(filepath, (err, stat) => {
			if (err) {
				return reject(err);
			}
			resolve(stat);
		});
	});
}

function copy(source: string, dest: string) {
	return new Promise((resolve, reject) => {
		fs.copy(source, dest, (err) => {
			if (err) {
				return reject(err);
			}
			resolve();
		});
	});
}

function promptName(filename: string) {
	return vscode.window.showInputBox({
		placeHolder: 'Enter the new path for the duplicate.',
		value: filename + '-copy'
	});
}

function promptOverwrite(filepath: string) {
	const message = `The path **${filepath}** alredy exists. Do you want to overwrite the existing path?`;
	const action = {
		title: 'OK',
		isCloseAffordance: false
	};

	return vscode.window.showWarningMessage(message, action);
}

async function duplicator(uri: vscode.Uri) {
	const oldParsedPath = path.parse(uri.fsPath);
	const oldPathStats = await pathStat(uri.fsPath);

	// Get a new name for the resource
	let newName = await promptName(oldParsedPath.name);
	if (!newName) {
		return;
	}

	// If the new path has no extension, then add it
	if (oldPathStats.isFile() && path.extname(newName) === '') {
		newName += oldParsedPath.ext;
	}

	// Get the new full path
	const newPath = path.join(oldParsedPath.dir, newName);

	// If a user tries to copy a file on the same path
	if (uri.fsPath === newPath) {
		vscode.window.showErrorMessage('You can\'t to copy a file or directory on the same path.');
		return;
	}

	// Check if the current path exists
	const newPathExists = await pathExists(newPath);
	if (newPathExists) {
		const userAnswer = await promptOverwrite(newPath);
		if (!userAnswer) {
			return;
		}
	}

	return copy(uri.fsPath, newPath).catch((err) => {
		const errMsgRegExp = new RegExp(escapeRegExp(oldParsedPath.dir), 'g');
		const errMsg = err.message
			.replace(errMsgRegExp, '')
			.replace(/[\\|\/]/g, '')
			.replace(/`|'/g, '**');

		vscode.window.showErrorMessage(`Error: ${errMsg}`);
	});
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

		duplicator(<vscode.Uri>uri);
	});

	context.subscriptions.push(command);
}
