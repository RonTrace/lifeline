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