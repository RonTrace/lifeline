import * as vscode from 'vscode';
import 'isomorphic-fetch';

export interface LifeLineParams {
    prompt: string;
    systemPrompt?: string;
    temperature?: number;
}

export async function lifeLineAPI(params: LifeLineParams): Promise<string> {
    const config = vscode.workspace.getConfiguration();
    const apiKey = config.get<string>('o1.apiKey', '');
    const model = config.get<string>('o1.model', 'gpt-3.5-turbo');
    const defaultTemp = config.get<number>('o1.temperature', 0.7);

    if (!apiKey) {
        throw new Error('O1 API key not configured. Please set o1.apiKey in your VS Code settings.');
    }

    // Fallback to default if not specified
    const temperature = params.temperature ?? defaultTemp;

    // Build request body according to O1's spec
    const requestBody = {
        model,
        messages: [
            ...(params.systemPrompt ? [{ role: 'system', content: params.systemPrompt }] : []),
            { role: 'user', content: params.prompt }
        ],
        temperature
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

        const data = await response.json() as {
            choices?: Array<{
                message?: {
                    content?: string;
                };
            }>;
        };
        
        return data.choices?.[0]?.message?.content || 'No response';
    } catch (error) {
        console.error('LifeLine API call failed:', error);
        if (error instanceof Error) {
            throw new Error(`LifeLine API call failed: ${error.message}`);
        }
        throw new Error('LifeLine API call failed with an unknown error');
    }
}
