// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { lifeLineAPI, LifeLineParams } from './lifeLineService';

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
    vscode.debug.activeDebugConsole.appendLine('LifeLine extension is active and ready to use!');
    vscode.debug.activeDebugConsole.appendLine('Use the Command Palette (Cmd+Shift+P) and search for "Call LifeLine API" to start.');
    vscode.debug.activeDebugConsole.appendLine('-------------------');

    // Register the lifeLine function for direct use
    const disposable = vscode.commands.registerCommand('lifeline.callLifeLine', async (prompt?: string, systemPrompt?: string) => {
        try {
            let userPrompt = prompt;
            let userSystemPrompt = systemPrompt;

            // If no prompt is provided (i.e., command called from UI), ask for input
            if (!userPrompt) {
                userPrompt = await vscode.window.showInputBox({
                    prompt: 'Enter your prompt for LifeLine',
                    placeHolder: 'Describe your task or question...',
                    ignoreFocusOut: true
                });
            }

            // If prompt was cancelled or empty
            if (!userPrompt) {
                return;
            }

            // If no system prompt is provided and command called from UI, optionally ask for it
            if (!userSystemPrompt && !systemPrompt) {
                userSystemPrompt = await vscode.window.showInputBox({
                    prompt: 'Enter system context (optional)',
                    placeHolder: 'Additional context or instructions for the AI...',
                    ignoreFocusOut: true
                });
            }

            // Call the LifeLine API
            const result = await lifeLineAPI({
                prompt: userPrompt,
                systemPrompt: userSystemPrompt || undefined
            });

            // Show the result in a new editor
            const document = await vscode.workspace.openTextDocument({
                content: result,
                language: 'markdown'
            });
            await vscode.window.showTextDocument(document);

            return result;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            vscode.window.showErrorMessage(`LifeLine API Error: ${errorMessage}`);
            throw error;
        }
    });

    context.subscriptions.push(disposable);

    // Create a FileSystemWatcher to monitor the _lifeline folder
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders) {
        // Create watchers for each workspace folder
        workspaceFolders.forEach(folder => {
            // Create the _lifeline directory if it doesn't exist
            const lifelinePath = vscode.Uri.joinPath(folder.uri, '_lifeline');
            vscode.workspace.fs.createDirectory(lifelinePath).then(() => {
                console.log(`Created or verified _lifeline directory in workspace: ${folder.name}`);
            }).then(undefined, (err: Error) => {
                console.error(`Error creating _lifeline directory in workspace ${folder.name}:`, err);
            });

            // Create a watcher that works with the _lifeline folder in this workspace
            const watcher = vscode.workspace.createFileSystemWatcher(
                new vscode.RelativePattern(folder, '**/_lifeline/*.md')
            );

            // Watch for new files being created
            watcher.onDidCreate(async (uri) => {
                console.log(`New lifeline file detected: ${uri.fsPath}`);
                try {
                    // Read the content of the newly created file
                    const document = await vscode.workspace.openTextDocument(uri);
                    const fileContent = document.getText();
                    
                    // Skip processing if this is a response file
                    if (uri.fsPath.includes('_lifeline-response-')) {
                        console.log('Skipping response file:', uri.fsPath);
                        return;
                    }

                    // Get the file name and create the response file name
                    const fileName = uri.fsPath.split('/').pop() || '';
                    const responseFileName = fileName.replace('.md', '').replace('_lifeline-', '_lifeline-response-') + '.md';
                    const responseUri = vscode.Uri.file(uri.fsPath.replace(fileName, responseFileName));

                    // Show status message
                    const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
                    statusBar.text = "$(sync~spin) Processing LifeLine request...";
                    statusBar.show();

                    try {
                        // Call the LifeLine API with the file content and predefined system prompt
                        const systemPrompt = `You are an expert software engineer. Review the project and problem specs and suggest an efficient strategy for achieving the goals. Your solution should hopefully not require too many major changes. Your output should be a markdown file with step by step instructions for a mid-level engineer to accomplish your instructions.`;
                        
                        const result = await lifeLineAPI({
                            prompt: fileContent,
                            systemPrompt: systemPrompt
                        });

                        // Create the response file with the API result
                        await vscode.workspace.fs.writeFile(responseUri, Buffer.from(result));

                        // Open the response file in the editor
                        const responseDocument = await vscode.workspace.openTextDocument(responseUri);
                        await vscode.window.showTextDocument(responseDocument);

                        // Show success message
                        vscode.window.showInformationMessage('LifeLine response generated successfully!');
                    } finally {
                        statusBar.dispose();
                    }

                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                    console.error('LifeLine Processing Error:', errorMessage);
                    vscode.window.showErrorMessage(`LifeLine Processing Error: ${errorMessage}`);
                }
            });

            // Watch for changes to existing files
            watcher.onDidChange(uri => {
                console.log(`Lifeline file changed: ${uri.fsPath}`);
                // Optionally handle file changes
            });

            // Watch for file deletions
            watcher.onDidDelete(uri => {
                console.log(`Lifeline file deleted: ${uri.fsPath}`);
                // Optionally handle file deletions
            });

            // Add the watcher to subscriptions
            context.subscriptions.push(watcher);
            console.log(`File watcher registered for workspace: ${folder.name}`);
        });
    } else {
        console.warn('No workspace folders found. LifeLine requires a workspace to function.');
        vscode.window.showWarningMessage('LifeLine requires a workspace to function. Please open a folder or workspace.');
    }
}

// This method is called when your extension is deactivated
export function deactivate() {}

// Export the lifeLine function for use by Cascade
export async function lifeLine(params: LifeLineParams): Promise<string> {
    try {
        return await lifeLineAPI(params);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        vscode.debug.activeDebugConsole.appendLine('LifeLine function error:');
        vscode.debug.activeDebugConsole.appendLine(errorMessage);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('An unknown error occurred');
    }
}
