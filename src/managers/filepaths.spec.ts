import * as assert from 'assert';
import * as path from 'path';

import * as manager from './filepaths';

function getBuildedFilepath(oldName: string, newName: string, isFile: boolean, keep: boolean) {
	const oldPath = path.parse(`/Users/name/Documents/${oldName}`);

	return manager.buildFilepath(
		oldPath,
		<any>{ isFile: () => isFile },
		newName,
		{ keepOriginalExtension: keep, openFileAfterCopy: false }
	);
}

describe('Managers → Filepaths', () => {

	describe('.buildFilepath', () => {
		it('should build path to file', () => {
			const expected = '/Users/name/Documents/test.ts';

			const actual = getBuildedFilepath('test.js', 'test.ts', true, true);

			assert.equal(actual, expected);
		});

		it('should build path to directory', () => {
			const expected = '/Users/name/Documents/test-copy';

			const actual = getBuildedFilepath('test', 'test-copy', false, true);

			assert.equal(actual, expected);
		});

		it('should add original extension for new path of non-dot file', () => {
			const expected = '/Users/name/Documents/test.js';

			const actual = getBuildedFilepath('test.js', 'test', true, true);

			assert.equal(actual, expected);
		});

		it('should not add original extension for new path of non-dot file', () => {
			const expected = '/Users/name/Documents/test';

			const actual = getBuildedFilepath('test.js', 'test', false, true);

			assert.equal(actual, expected);
		});

		it('should add original extension for new path of dot file', () => {
			const expected = '/Users/name/Documents/.env.sample';

			const actual = getBuildedFilepath('.env.sample', '.env', true, true);

			assert.equal(actual, expected);
		});

		it('should not add original extension for new path of dot file', () => {
			const expected = '/Users/name/Documents/.env';

			const actual = getBuildedFilepath('.env.sample', '.env', true, false);

			assert.equal(actual, expected);
		});

		it('should not add original extension for new path of dot file with !!ext marker', () => {
			const expected = '/Users/name/Documents/.env';

			const actual = getBuildedFilepath('.env.sample', '.env!!ext', true, true);

			assert.equal(actual, expected);
		});

		it('should add original extension for new path of dot file with &&ext marker', () => {
			const expected = '/Users/name/Documents/.env.sample';

			const actual = getBuildedFilepath('.env.sample', '.env&&ext', true, false);

			assert.equal(actual, expected);
		});
	});

});
