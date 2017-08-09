import * as fs from 'fs-extra';

export function pathExists(filepath: string): Promise<Boolean> {
	return new Promise((resolve) => {
		fs.stat(filepath, (err) => resolve(!err));
	});
}

export function pathStat(filepath: string): Promise<fs.Stats> {
	return new Promise((resolve, reject) => {
		fs.stat(filepath, (err, stat) => {
			if (err) {
				return reject(err);
			}
			resolve(stat);
		});
	});
}

export function copy(source: string, dest: string): Promise<void> {
	return new Promise((resolve, reject) => {
		fs.copy(source, dest, (err) => {
			if (err) {
				return reject(err);
			}
			resolve();
		});
	});
}
