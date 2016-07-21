'use strict';

const path = require('path');
const fs = require('fs');

const co = require('co');
const copyFile = require('cp-file');
const escapeRegExp = require('lodash.escaperegexp');
const vscode = require('vscode');

function pathsExists(filepath) {
  return new Promise((resolve) => {
    fs.stat(filepath, (err) => resolve(!err));
  });
}

function promptFileName(oldFileInfo) {
  return vscode.window.showInputBox({
    placeHolder: 'Enter the new path for the duplicate.',
    value: `${oldFileInfo.name}-copy`
  });
}

function duplicate(document) {
  if (!document || !document.fsPath) {
    const editor = vscode.editor || vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    document = editor.document.uri;
  }

  const oldFileInfo = path.parse(document.fsPath);

  co(function* () {
    let newFileName = yield promptFileName(oldFileInfo);
    if (!newFileName) {
      return;
    }

    if (!path.extname(newFileName)) {
      newFileName += oldFileInfo.ext;
    }

    const newFilePath = path.join(oldFileInfo.dir, newFileName);
    const newFileExists = yield pathsExists(newFilePath);
    if (newFileExists) {
      const userQuestionMessage = `File **${newFileName}** already exists. Do you want to overwrite the existing file?`;
      const buttonOk = {
        title: 'OK',
        isCloseAffordance: false
      };

      const userAnswer = yield vscode.window.showWarningMessage(userQuestionMessage, buttonOk);
      if (!userAnswer) {
        return;
      }
    }

    return copyFile(document.fsPath, newFilePath);
  }).catch((err) => {
    if (err.code === 'EISDIR') {
      err.message = 'you can duplicate only files.';
    }

    const errMsgRegExp = new RegExp(escapeRegExp(oldFileInfo.dir), 'g');
    const errMsg = err.message
      .replace(errMsgRegExp, '')
      .replace(/[\\|\/]/g, '')
      .replace(/`|'/g, '**');

    vscode.window.showErrorMessage(`Error: ${errMsg}`);
  });
}

function activate(context) {
  const disposable = vscode.commands.registerCommand('duplicate.execute', duplicate);

  context.subscriptions.push(disposable);
}

exports.activate = activate;
