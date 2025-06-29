// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { exec } = require('child_process');

// This variable will hold the timer for the auto-sync feature
let syncTimer = null;

/**
 * This method is called when your extension is activated
 * Your extension is activated the very first time the command is executed
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

  console.log('Congratulations, your extension "auto-git-sync" is now active!');

  // This function will handle the Git synchronization
  const gitSync = () => {
    const workspaceFolder = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : null;

    if (!workspaceFolder) {
      vscode.window.showInformationMessage('No workspace folder open.');
      return;
    }

    // The command sequence is important:
    // 1. Add all changes to staging.
    // 2. Commit the changes. We use `( ... || true)` to prevent the command from failing if there's nothing to commit.
    // 3. Pull with --rebase to fetch remote changes and place our local commit on top of them.
    // 4. Push the changes to the remote repository.
    const command = 'git add . && (git commit -m "Auto-sync: file changes" || true) && git pull --rebase && git push';

    // Execute git commands
    exec(command, { cwd: workspaceFolder }, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        // Check for a specific rebase conflict message
        if (stderr.includes('git rebase --abort') || stderr.includes('git rebase --continue')) {
          vscode.window.showErrorMessage('Auto-sync failed due to a merge conflict. Please resolve it manually.');
        } else {
          vscode.window.showErrorMessage('Failed to auto-sync with Git repository. See console for details.');
        }
        return;
      } console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
      vscode.window.showInformationMessage('Successfully synced with Git repository!');
    });
  };

  // This function will reset the timer whenever a file is saved
  const resetTimer = () => {
    // Clear the existing timer
    if (syncTimer) {
      clearTimeout(syncTimer);
    }
    // Set a new timer for 5 minutes (300000 milliseconds)
    const minute = 2
    syncTimer = setTimeout(gitSync, minute * 60000);
    console.log(`Timer reset. Sync scheduled in ${minute} minutes.`);
  };

  // Listen for every time a text document is saved
  let disposable = vscode.workspace.onDidSaveTextDocument(() => {
    resetTimer();
  });

  context.subscriptions.push(disposable);

  // Initial timer start when the extension is activated
  resetTimer();
}

// This method is called when your extension is deactivated
function deactivate() {
  if (syncTimer) {
    clearTimeout(syncTimer);
  }
}

module.exports = {
  activate,
  deactivate
}
