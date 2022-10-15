# moon

This is the README for your extension "moon". After writing up a brief description, we recommend
including the following sections.

## Features

Enjoy all the awesome features of moon!

### Projects view

The backbone of moon is the projects view. In this view, all moon configured projects will be
listed, categorized by their `type`.

Each project can then be expanded to view all available tasks. Tasks can be ran by clicking the ">"
icon, or using the command palette.

![Screenshot of projects view]()

## Requirements

This extension requires moon itself to be installed within the opened VS Code workspace. Learn more
about [installing and configuring moon](https://moonrepo.dev/docs/install)!

## Settings

The following settings are available for this extension.

- `moon.workspaceRoot` - Relative path from the opened folder to moon's workspace root. Defaults to
  "`.`". This is useful if moon is initialized in a sub-folder.
- `moon.binPath` - Relative path from moon's workspace root to the moon binary. Defaults to
  `node_modules/@moonrepo/cli/moon`. _Windows will auto-suffix with `.exe`!_

## Commands

The following commands are available in the command palette (typically `cmd + shift + p`), and are
prefixed with "moon".

- **Open settings** - Opens the settings page and filters to all moon applicable settings.
- **Run target** - Prompts the user for a target(s) and runs it in the terminal.
- **Refresh projects** - Refreshes the projects view. _This happens automatically when
  `.moon/workspace.yml` changes!_

## Roadmap

- [x] Projects view
  - [x] Categorize projects based on type
  - [x] List tasks
  - [x] Categorize tasks based on type
  - [x] Run a task
- [x] Last run view
- [x] Commands and command palette
- [x] Watches and reacts to file system changes.
- [ ] Schema validation for YAML configs
- [ ] moon language server
- [ ] Auto-completion
