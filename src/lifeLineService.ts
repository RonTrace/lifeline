import * as vscode from 'vscode';
import 'isomorphic-fetch';

export interface LifeLineParams {
    prompt: string;
    systemPrompt?: string;
}

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

    // Notify the user that the model call started.
    const startTime = new Date();
    vscode.window.showInformationMessage(
        `Model ${requestBody.model} started at ${startTime.toLocaleTimeString()}`
    );

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
            vscode.window.showErrorMessage(`API Error: ${response.status} - ${errorData}`);
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

        // This is the full chain of thought (aka the entire assistant message).
        const chainOfThought = data.choices?.[0]?.message?.content || '';

        // Display the chain of thought in a notification.
        // (Be aware that very long messages could overwhelm the notification.)
        vscode.window.showInformationMessage(`Chain of thought: ${chainOfThought}`);

        // After a short delay, display a finished message with the finish time.
        setTimeout(() => {
            const endTime = new Date();
            vscode.window.showInformationMessage(
                `Model ${requestBody.model} finished at ${endTime.toLocaleTimeString()}`
            );
        }, 5000);

        return chainOfThought || 'No response';
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        vscode.window.showErrorMessage(`LifeLine API Error: ${errorMessage}`);
        throw new Error(`LifeLine API call failed: ${errorMessage}`);
    }
}