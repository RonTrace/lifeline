// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { lifeLineAPI, LifeLineParams, copyToClipboard } from './lifeLineService';

// Create output channel
const outputChannel = vscode.window.createOutputChannel('LifeLine Debug');

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
    outputChannel.appendLine('LifeLine extension is active and ready to use!');
    outputChannel.appendLine('Use the Command Palette (Cmd+Shift+P) and search for "Call LifeLine API" to start.');
    outputChannel.appendLine('-------------------');

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

    // Register command to test Cascade commands
    const testCascadeCommand = vscode.commands.registerCommand('lifeline.testCascadeCommands', async () => {
        try {
            // Get all available commands
            const allCommands = await vscode.commands.getCommands(true);

            // Filter for cascade and windsurf related commands
            const cascadeCommands = allCommands.filter(cmd => 
                cmd.toLowerCase().includes('cascade') || 
                cmd.toLowerCase().includes('windsurf')
            );

            // Clear the output channel and write the commands
            outputChannel.clear();
            outputChannel.appendLine('--- Cascade/Windsurf Commands ---');
            cascadeCommands.forEach(cmd => {
                outputChannel.appendLine(`- ${cmd}`);
            });
            outputChannel.appendLine('--- End of List ---');
            outputChannel.show();

            // Show information message
            if (cascadeCommands.length > 0) {
                vscode.window.showInformationMessage(`Found ${cascadeCommands.length} Cascade/Windsurf commands. Check 'LifeLine Debug' output channel.`);
            } else {
                vscode.window.showInformationMessage('No Cascade/Windsurf commands found.');
            }

            // Try calling a potential cascade.sendMessage command
            try {
                await vscode.commands.executeCommand('cascade.sendMessage', 'Testing from LifeLine');
                outputChannel.appendLine('\nSuccessfully called cascade.sendMessage!');
            } catch (err) {
                outputChannel.appendLine(`\nFailed to call cascade.sendMessage: ${String(err)}`);
            }
        } catch (err) {
            vscode.window.showErrorMessage(`Error testing Cascade commands: ${String(err)}`);
        }
    });

    context.subscriptions.push(testCascadeCommand);

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
                        const systemPrompt = `You are a world-class software engineer, an expert in writing clean, maintainable, scalable, and efficient code. You approach software development with a deep understanding of both high-level architecture and low-level implementation details, ensuring robust, performant solutions. Your goal is to provide precise, step-by-step guidance to a junior developer, refining their work while minimizing unnecessary changes. Review the project and problem specifications, then create a structured markdown file with clear, actionable instructions for improving and implementing the solution. Where relevant, reference industry best practices from Clean Code (Robert C. Martin), Design Patterns (Gang of Four), The Pragmatic Programmer, or similar authoritative sources to reinforce the importance of clarity, maintainability, and scalability in software design. Your instructions should be both practical and educational, helping the junior developer improve their skills while executing your solution. The project and problem specifications are provided in the file. Include a project summary as well as the user stories, use cases, and requirements. Your response should be in a markdown format.`;
                        
                        const result = await lifeLineAPI({
                            prompt: fileContent,
                            systemPrompt: systemPrompt
                        });

                        // Create the response file with the API result
                        await vscode.workspace.fs.writeFile(responseUri, Buffer.from(result));

                        // Copy the content to clipboard
                        await copyToClipboard(responseUri.fsPath);

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
        outputChannel.appendLine('LifeLine function error:');
        outputChannel.appendLine(errorMessage);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('An unknown error occurred');
    }
}
