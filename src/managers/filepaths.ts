import * as fs from 'fs';
import * as path from 'path';

import { IPluginSettings } from '../types';

export function buildFilepath(oldPath: path.ParsedPath, oldStat: fs.Stats, newName: string, settings: IPluginSettings): string {
	const newPath = path.parse(newName);

	// Check ability to add original extension
	const needAddExtension = (settings.keepOriginalExtension && !newName.endsWith('!!ext')) || newName.endsWith('&&ext');

	// Clean the new name from special characters
	let newStripedName = newName.replace(/(!!|&&)ext$/, '');

	// The new path has no extension and we must save original extension
	if (oldStat.isFile() && newPath.ext === '' && needAddExtension) {
		newStripedName += oldPath.ext;
	}

	return path.join(oldPath.dir, newStripedName);
}
