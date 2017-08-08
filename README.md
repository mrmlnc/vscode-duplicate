# vscode-duplicate

> Ability to duplicate files and directories in VS Code.

## Donate

If you want to thank me, or promote your Issue.

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://paypal.me/mrmlnc)

> Sorry, but I have work and support for plugins and modules requires some time after work. I will be glad of your support or PR's.

## Install

  * Press <kbd>F1</kbd> and `select Extensions: Install Extensions`.
  * Search for and select `duplicate`.

See the [extension installation guide](https://code.visualstudio.com/docs/editor/extension-gallery) for details.

## Usage

> If you do not specify a new extension, the previous **will be saved**.

The first option:

  1. Hover on a file or directory name in explorer.
  2. Right-click and select `Duplicate file`.
  3. Enter the new path for the duplicate.

The second option:

  1. Open the file.
  2. Press `F1` and select `Duplicate file`.
  3. Enter the new path for the duplicate.

## Keyboard shortcuts

For changes keyboard shortcuts, create a new rule in `File -> Preferences -> Keyboard Shortcuts`:

```json
{
  "key": "ctrl+shift+d",
  "command": "duplicate.execute"
}
```

## Changelog

See the [Releases section of our GitHub project](https://github.com/mrmlnc/vscode-duplicate/releases) for changelogs for each release version.

## License

This software is released under the terms of the MIT license.
