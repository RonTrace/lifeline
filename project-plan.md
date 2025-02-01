Below is an updated product plan with the **project name** and **function name** changed to **`lifeLine`**, along with references to using the **Yeoman Generator** and the **OpenAI** API (your custom OpenAI wrapper, presumably). The **Development Checklist** has been expanded with more detailed steps.

---

## 1. Product Requirements

### 1.1. Overview
- **Extension Name**: `lifeline`
- **Purpose**: Provide a function `lifeLine()` that Cascade (the AI assistant in Windsurf) can call to send prompts to your **OpenAI API** (your custom wrapper around OpenAI or another LLM provider) and receive responses. https://platform.openai.com/docs/models#o1
- **Target Users**: 
  - Windsurf users who want direct control over calls to their own o1-based LLM account.
  - Developers who need a dedicated function to generate advanced prompts/responses from an external API.

### 1.2. Functionality & Features

1. **Register a New Cascade Function**  
   - Expose a function named `lifeLine()` that can be invoked by Cascade.  
   - This function accepts structured parameters (e.g., `prompt`, `systemPrompt`, `temperature`, etc.) to be sent to o1’s API.  
   - The response from o1 will be returned to Cascade for further usage in the conversation.

2. **User Configuration**  
   - Users must store their personal o1 (OpenAI) API key in the user’s `settings.json` (VS Code user settings).  
   - Provide extension-level settings with default values for:  
     - `o1.apiKey` (string; required for authentication)  
     - `o1.model` (e.g. `"o1"`)  
     - `o1.temperature` (e.g. `0.7`)  
     - Additional optional parameters (top_p, max_tokens, etc.) if desired.

3. **Security & Privacy**  
   - The extension must not log API keys anywhere in plaintext.  
   - Only store the API key in the local user settings.  
   - All requests must be made securely (HTTPS).

4. **Predefined Prompts**  
   - The extension can optionally append or prepend standard instructions to the user’s prompt before sending it to o1’s API (e.g., “You are an extremely helpful coding assistant...”).

5. **Result Handling**  
   - Return success and error states in a structured format for Cascade.  
   - Include usage statistics (token usage, cost estimates, etc.) if the o1 API provides them.

6. **Integration with Cascade**  
   - Extend the Cascade system prompt (or relevant config) so that Cascade knows it can call `lifeLine()` with specific parameters.  
   - Provide a short usage doc so Cascade can pass the correct arguments.

7. **Optional Command & Menu Items**  
   - (Optional) A `lifeline.callLifeLine` command in the Command Palette for direct user invocation.  
   - This can help debug or test responses without going through Cascade.

### 1.3. Constraints & Assumptions
- Access to the underlying function-calling mechanism or a documented hooking point so Cascade recognizes `lifeLine()`.  
- o1 usage constraints (rate limits, token limits, etc.) must be handled gracefully (e.g., error messages).

### 1.4. Performance Considerations
- Large prompts can lead to slow responses and higher costs.  
- Implement calls asynchronously (no blocking the UI thread).

### 1.5. Future Enhancements
- **Streaming Responses** (if o1 offers streaming).  
- **Multiple LLM Providers**.  
- **Advanced Prompt Management** (templatized prompts, etc.).

---

## 2. Detailed Development Checklist

Below is a **step-by-step** process you can paste into your conversation with Claude (or any other assistant) to assist with actual implementation. 

### 2.1. Environment Setup

1. **Install Prerequisites**  
   - Install **Node.js** (preferably the latest LTS version).  
   - Install **Yeoman** (`npm install -g yo`) and the **VS Code Extension Generator** (`npm install -g generator-code`).

2. **Run Yeoman Generator**  
   - Open a terminal in your desired project directory.  
   - Run `yo code` to scaffold a new VS Code extension.  
   - When prompted, use the following as needed:  
     - **Extension Name**: `lifeline`  
     - **Description**: “A VS Code extension that provides the `lifeLine()` function for Cascade to call O1.”  
     - **Publisher**: your GitHub/Marketplace name or company name.  
     - **TypeScript** is recommended for type-safety.

3. **Initial Directory Check**  
   - Confirm that Yeoman generated a new folder structure:  
     - `.vscode/` (for debug configs)  
     - `package.json` (project metadata)  
     - `src/extension.ts` (main extension code if TypeScript)  
     - `tsconfig.json` (if TS was chosen)

---

### 2.2. Configure Extension Settings

1. **Open `package.json`** in the new project.  
   - In the `contributes.configuration` section, define new settings:  
     ```json
     {
       "contributes": {
         "configuration": {
           "type": "object",
           "title": "Lifeline Settings",
           "properties": {
             "o1.apiKey": {
               "type": "string",
               "description": "Your o1 (OpenAI) API Key",
               "default": ""
             },
             "o1.model": {
               "type": "string",
               "description": "Default model for o1 completions",
               "default": "gpt-3.5-turbo"
             },
             "o1.temperature": {
               "type": "number",
               "description": "Default temperature for o1 completions",
               "default": 0.7
             }
           }
         }
       }
     }
     ```
   - Adjust or add other fields like `max_tokens` if needed.

2. **Decide on Additional Settings**  
   - For advanced usage, you might add `top_p`, `frequency_penalty`, `presence_penalty`, etc.  
   - Document these in your extension README.

---

### 2.3. Implement `lifeLine()` in the Extension Code

1. **Create a Utility/Service File**  
   - In `src/`, create a file (e.g. `lifeLineService.ts`).  
   - This will house the core function or class that:  
     - Reads user settings.  
     - Makes the API call to o1.  
     - Returns the response.

2. **In `lifeLineService.ts`, Implement the API Call**  
   ```ts
   import * as vscode from 'vscode';
   import fetch from 'node-fetch'; // or axios

   export async function lifeLineAPI(params: {
     prompt: string;
     systemPrompt?: string;
     temperature?: number;
     // ...any other fields
   }): Promise<string> {
     const config = vscode.workspace.getConfiguration();
     const apiKey = config.get<string>('o1.apiKey', '');
     const model = config.get<string>('o1.model', 'gpt-3.5-turbo');
     const defaultTemp = config.get<number>('o1.temperature', 0.7);

     // Fallback to default if not specified
     const temperature = params.temperature ?? defaultTemp;

     // Build your request body according to o1’s spec
     const requestBody = {
       model,
       prompt: params.prompt,
       systemPrompt: params.systemPrompt,
       temperature
       // ... other o1 fields
     };

     try {
       const response = await fetch('https://api.o1.com/v1/completions', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${apiKey}`
         },
         body: JSON.stringify(requestBody)
       });
       if (!response.ok) {
         throw new Error(`API returned status ${response.status}`);
       }
       const data = await response.json();
       // Return the completion text (adjust as needed for o1’s format)
       return data.choices?.[0]?.text || 'No response';
     } catch (err: any) {
       // Handle error gracefully
       console.error(err);
       throw new Error(`lifeLine API call failed: ${err.message}`);
     }
   }
   ```

3. **Export a Function for Cascade**  
   - In `src/extension.ts`, import the utility:  
     ```ts
     import { lifeLineAPI } from './lifeLineService';
     ```
   - Create a function that matches the signature that Cascade will call, e.g.:
     ```ts
     export async function lifeLine(params: { prompt: string; systemPrompt?: string; temperature?: number }) {
       // We might sanitize or log the params here if needed
       const response = await lifeLineAPI(params);
       // Return the raw text or a structured object
       return response;
     }
     ```
   - (Or you can just implement directly in `extension.ts`; the separation is just for cleanliness.)

---

### 2.4. Register and Expose the `lifeLine()` Function

1. **Register a VS Code Command (Optional)**  
   - Still in `extension.ts`, in the `activate` function:
     ```ts
     import * as vscode from 'vscode';
     import { lifeLineAPI } from './lifeLineService';

     export function activate(context: vscode.ExtensionContext) {
       // Register a command for manual testing
       const disposable = vscode.commands.registerCommand('lifeline.callLifeLine', async () => {
         try {
           const result = await lifeLineAPI({ 
             prompt: 'Hello from the manual command!' 
           });
           vscode.window.showInformationMessage(`lifeLine response: ${result}`);
         } catch (error) {
           vscode.window.showErrorMessage(String(error));
         }
       });

       context.subscriptions.push(disposable);
     }
     ```
   - This allows direct invocation from the Command Palette (“Call LifeLine”).

2. **Expose Function to Cascade**  
   - **If** Windsurf offers a specific hook or method to declare new AI “tools,” follow that pattern. For instance, you might do something like:
     ```ts
     // Pseudocode - depends on how Cascade recognizes new functions
     windsurf.registerCascadeFunction('lifeLine', lifeLine); 
     ```
   - **If** you can modify the Cascade system prompt, add a snippet:  
     > “A function `lifeLine()` is available. You can call it with the following parameters:  
     > `{ "prompt": "string", "systemPrompt": "string", "temperature": 0.7 }`.  
     > It returns the text completion from the o1 API.”  
   - The exact integration steps depend on how Cascade is designed to discover custom tools.

---

### 2.5. Testing & Debugging

1. **Local Testing**  
   - Open the project in VS Code.  
   - Press `F5` or run the “Launch Extension” debug config.  
   - A new Extension Development Host window opens.  
   - Open the Command Palette (`Cmd+Shift+P` on Mac or `Ctrl+Shift+P` on Windows/Linux), type “Call LifeLine,” and run it.  
   - Check the response in a popup notification or in the debug console.

2. **Test with Real O1 API Key**  
   - In the new host window, open **Settings** (`settings.json`), add your key:  
     ```json
     {
       "o1.apiKey": "YOUR_OPENAI_API_KEY"
     }
     ```
   - Rerun the command or attempt a Cascade call.

3. **Cascade Integration Testing**  
   - In Windsurf, open the chat with Cascade and instruct:  
     > "Please call `lifeLine()` with prompt: 'Test calling o1 via Windsurf-Lifeline'."
   - Verify if Cascade is able to see and invoke `lifeLine()`.

4. **Error Cases**  
   - No API key set in settings.  
   - Invalid API key.  
   - Large prompt that might exceed o1’s context.  
   - Network or rate-limit errors.

---

### 2.6. Documentation & Publication

1. **Extension README**  
   - Document how to install and configure (especially how to set the openai API key).  
   - Provide example usage in Cascade.  
   - List known issues or limitations.

2. **Changelog**  
   - Maintain a `CHANGELOG.md` for new features or bug fixes.

3. **Publishing**  
   - If you plan to publish on [Open VSX](https://open-vsx.org/) or the Visual Studio Marketplace, run:  
     ```bash
     npm install -g vsce
     vsce login <publisher-name>
     vsce publish
     ```
   - Make sure your `publisher` in `package.json` matches what you used during the Yeoman generation.

---

## 3. Final Notes

- Your main new function name: **`lifeLine()`**  
- Project scaffold name: **`lifeline`**  
- API usage: **O1** (treated as your custom LLM or an OpenAI wrapper)  
- Key steps: 
  - Generate extension skeleton with Yeoman,  
  - Implement the function to call o1,  
  - Expose that function to Cascade,  
  - Provide user settings for the API key,  
  - Thoroughly test and publish.
