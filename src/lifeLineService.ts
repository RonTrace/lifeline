import * as vscode from 'vscode';
import 'isomorphic-fetch';

export interface LifeLineParams {
    prompt: string;
    systemPrompt?: string;
}

/**
 * Existing function to call OpenAI. This is unchanged.
 */
export async function lifeLineAPI(params: LifeLineParams): Promise<string> {
    const config = vscode.workspace.getConfiguration();
    const apiKey = config.get<string>('openai.apiKey', '');

    if (!apiKey) {
        throw new Error('OpenAI API key not configured. Please set openai.apiKey in your VS Code settings.');
    }

    // Build the request body for the O1 model.
    const requestBody = {
        model: 'o1',
        messages: [
            ...(params.systemPrompt
                ? [{ role: 'system', content: params.systemPrompt }]
                : []
            ),
            { role: 'user', content: params.prompt }
        ]
    };

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`API returned status ${response.status}: ${errorData}`);
        }

        const data = (await response.json()) as {
            choices?: [
                {
                    message: {
                        content: string;
                    };
                }
            ];
        };

        const content = data.choices?.[0]?.message?.content;
        if (!content) {
            throw new Error('No content received from API');
        }

        return content;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        vscode.window.showErrorMessage(`LifeLine API Error: ${errorMessage}`);
        throw error;
    }
}

/**
 * Copies the content of a file to the clipboard
 */
export async function copyToClipboard(filePath: string): Promise<void> {
    try {
        const content = await vscode.workspace.fs.readFile(vscode.Uri.file(filePath));
        await vscode.env.clipboard.writeText(content.toString());
        vscode.window.showInformationMessage('Lifeline content copied to clipboard!');
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        vscode.window.showErrorMessage(`Failed to copy to clipboard: ${errorMessage}`);
        throw error;
    }
}

/**
 * Command registration (optional).
 * Call this from your `activate()` function in your extension's main file,
 * or just paste in your main file directly.
 */
export function activate(context: vscode.ExtensionContext) {
    const outputChannel = vscode.window.createOutputChannel('LifeLine Debug');
    outputChannel.appendLine('LifeLine extension activated');

    // Register a command to copy the latest lifeline file to clipboard
    let disposable = vscode.commands.registerCommand('lifeLine.copyToClipboard', async () => {
        try {
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (!workspaceFolder) {
                throw new Error('No workspace folder found');
            }

            const lifelinePath = vscode.Uri.joinPath(workspaceFolder.uri, '_lifeline');
            const files = await vscode.workspace.fs.readDirectory(lifelinePath);
            
            // Filter markdown files and sort by name (which includes the timestamp)
            const markdownFiles = files
                .filter(([name]) => name.endsWith('.md'))
                .sort(([a], [b]) => b.localeCompare(a));

            if (markdownFiles.length === 0) {
                throw new Error('No lifeline files found');
            }

            // Get the most recent file
            const latestFile = markdownFiles[0][0];
            const fullPath = vscode.Uri.joinPath(lifelinePath, latestFile).fsPath;
            
            await copyToClipboard(fullPath);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            vscode.window.showErrorMessage(`LifeLine Error: ${errorMessage}`);
        }
    });

    context.subscriptions.push(disposable);
    outputChannel.show(true);
}