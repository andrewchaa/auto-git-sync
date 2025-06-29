# Auto Git Sync VS Code Extension

This extension automatically detects file changes in your workspace. If there are no further changes for 5 minutes, it will automatically commit and push the changes to your remote Git repository.

## How it Works

The extension listens for file save events. Each time you save a file, a 5-minute timer is reset. If the timer completes without any other file saves, the extension will execute the following Git commands:

```shell
git add .
git commit -m "Auto-sync: file changes"
git push
```

## Prerequisites

- You must have Git installed and configured on your system.
- Your workspace must be a Git repository, and it must have a remote `origin` configured.
- You must be authenticated to push to the remote repository.

## Installation

1. Copy the files from this project into a new folder.
1. Open the folder in VS Code.
1. Run `npm install` in the terminal to install the dependencies.
1. Press `F5` to open a new Extension Development Host window that runs the extension.
1. Open a workspace that is a Git repository.
1. Make some changes to a file and save it. You should see a message in the console indicating the timer has started. After 5 minutes of inactivity, your changes will be pushed.