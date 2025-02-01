// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { lifeLineAPI, LifeLineParams } from './lifeLineService';

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "lifeLine" is now active!');

    // Register the lifeLine function for direct use
    const disposable = vscode.commands.registerCommand('lifeline.callLifeLine', async () => {
        try {
            // Get user input for the prompt
            const prompt = await vscode.window.showInputBox({
                prompt: 'Enter your prompt for LifeLine',
                placeHolder: 'What would you like to ask?'
            });

            if (!prompt) {
                return; // User cancelled
            }

            // Optional: Get system prompt
            const systemPrompt = await vscode.window.showInputBox({
                prompt: 'Enter system prompt (optional)',
                placeHolder: 'You are a helpful assistant...'
            });

            const result = await lifeLineAPI({ 
                prompt,
                systemPrompt: systemPrompt || undefined
            });

            // Show the result in a new editor
            const document = await vscode.workspace.openTextDocument({
                content: result,
                language: 'markdown'
            });
            await vscode.window.showTextDocument(document);

        } catch (error) {
            if (error instanceof Error) {
                vscode.window.showErrorMessage(`LifeLine Error: ${error.message}`);
            } else {
                vscode.window.showErrorMessage('An unknown error occurred');
            }
        }
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

// Export the lifeLine function for use by Cascade
export async function lifeLine(params: LifeLineParams): Promise<string> {
    try {
        return await lifeLineAPI(params);
    } catch (error) {
        console.error('LifeLine function error:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('An unknown error occurred');
    }
}
