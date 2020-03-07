# vscode-duplicate

Duplicate files and directories in VS Code.

## Support and PRs welcome

I'm currently busy with work and don't have time to support plugins and modules. I will be glad of your support or PRs.

If you'd like to thank me, or promote your issue, you can donate to my PayPal.

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://paypal.me/mrmlnc)

## Install

  * Press <kbd>F1</kbd> and `select Extensions: Install Extensions`.
  * Search for and select `duplicate`.

See the [extension installation guide](https://code.visualstudio.com/docs/editor/extension-gallery) for details.

## Usage

Method one:

  1. Hover on a file or directory name in explorer
  2. Right-click and select `Duplicate file`
  3. Enter the new path for the duplicate

Methond two:

  1. Open a file
  2. Press `F1` and select `Duplicate file`
  3. Enter the new path for the duplicate

## Setting a file extension

When setting the name of the new file, you can specify a file extension by three methods:

  * Don't set anything - the previous will be preserved
  * `!!ext` – don't preserve original extension
  * `&&ext` – preserve original extension (override with `duplicate.keepOriginalExtension`)

For example:

  * `nameOfFile` - create filepath with original extension
  * `nameOfFile!!ext` – create filepath without original extension
  * `nameOfFile&&ext` – create filepath with original extension

## Supported settings

#### duplicate.openFileAfterCopy

  * Type: `Boolean`
  * Default: `true`

Automatically open newly copied files.

#### duplicate.keepOriginalExtension

  * Type: `Boolean`
  * Default: `true`

Keep original extension if it not specified.

## Keyboard shortcuts

To change keyboard shortcuts, create a new rule in `File -> Preferences -> Keyboard Shortcuts`:

```json
{
  "key": "ctrl+shift+d",
  "command": "duplicate.execute"
}
```

## Changelog

The [Releases section of our GitHub project](https://github.com/mrmlnc/vscode-duplicate/releases) has a changelog for each release.

## License

[MIT](https://github.com/mrmlnc/vscode-duplicate/blob/master/LICENSE)
