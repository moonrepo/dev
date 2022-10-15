# moon README

This is the README for your extension "moon". After writing up a brief description, we recommend
including the following sections.

## Features

Describe specific features of your extension including screenshots of your extension in action.
Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your
> extension! We recommend short, focused animations that are easy to follow.

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and
configure them.

## Settings

- `moon.workspaceRoot` - Relative path from the opened folder to moon's workspace root. Defaults to
  "`.`". This is useful if moon is initialized in a sub-folder.
- `moon.binPath` - Relative path from moon's workspace root to the moon binary. Defaults to
  `node_modules/@moonrepo/cli/moon`.

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
