# LifeLine Extension for VS Code

[![Version](https://img.shields.io/badge/version-0.2.1-blue.svg)](https://github.com/RonTrace/lifeline/releases)

LifeLine is a VS Code extension that provides seamless integration with OpenAI's o1. It gives you access to senior-level AI assistance for your coding tasks, acting like an expert developer at your fingertips. The extension automatically creates and manages a history of your interactions in markdown files, making it easy to track and reference your AI conversations.

**Note:** This extension requires your own OpenAI API key to function. The API key is used to access OpenAI's o1 model for providing expert coding assistance.

![Screenshot](lifeline.png)

## Usage

The extension provides two main commands:

### 1. Expert AI Guidance - "lifeline"

When you need senior-level guidance on your code:

1. Type "**lifeline**" in your AI code helper chat
2. Your local AI will:
   - Create a new _lifeline markdown file in XML format with the following structure:
     - **Goal**: Project summary and current task/problem description
     - **Return Format**: Expected output format for the AI response
     - **Warnings**: Potential issues and identified concerns
     - **Code Map**: How all elements work together
     - **Context**: Relevant code snippets and project information
   - Document any planned changes without modifying the codebase
   - Stop after creating the lifeline file

### 2. Execute Expert Response - "lifeline read"

When you want to execute the expert's recommendations:

1. Type "**lifeline read**" in your AI code helper chat
2. Your local AI will:
   - Find the most recent _lifeline-response file in the _lifeline folder
   - Follow the directions outlined in that file step by step

For all commands, you can paste your clipboard into your AI code helper chat or read the generated file directly.

## Installation

There are three steps to get started with LifeLine:

1. **Install the Extension**
   - Download the `.vsix` file from the latest release
   - Open VS Code
   - Go to the Extensions view (Ctrl+Shift+X)
   - Click on the "..." menu at the top of the Extensions view
   - Select "Install from VSIX..." and choose the downloaded file

2. **Configure OpenAI API Key**
   - Open VS Code settings (Cmd+, on macOS, Ctrl+, on Windows/Linux)
   - Search for "openai.apiKey"
   - Enter your OpenAI API key in the settings field

   >
   > ```json
   > {
   >     "openai.apiKey": "sk-your_api_key_here"
   > }
   > ```
   >

3. **Add Global AI Rules**
   - Add the text from the file (global-prompt-for-ai-coder.md) to your global AI rules:   
   
   >
   >  ```markdown 
   ><userCommandsList>
   >    <description>
   >      The following are specific commands that the user may type. For each command, follow the corresponding instructions precisely.
   >    </description>
   >
   >    <userCommand> lifeline
   >      <trigger>
   >        When a user types <strong>lifeline</strong>, Cascade should:
   >      </trigger>
   >      <instructions>
   >        <step>  
   >          1. **Create a lifeline markdown file:**  
   >            - Look for a folder in the project called `_lifeline`.  
   >            - If that folder does not exist, create it.  
   >            - Inside that folder, create a file called `_lifeline-[date].md`, where [date] is the current date and time in the format `YYYY-MM-DD-HH-MM-SS`.  
   >        </step>
   >        <step>
   >          2. **Gather context to write inside the lifeline file:**  
   >            - You are writing a prompt for an AI coder
   >            - Your prompt should be in XML format and have the structure a. goal b. return format c. warnings d. code map e. context  
   >            - In the goal section: Summarize the current project and describe the specific task or problem we are trying to solve.
   >            - In the return format section: Describe the expected output format of the AI coder's response.  
   >            - In the warnings section: Document any potential issues or warnings that may arise during the AI coder's work. Include issues we have identified. 
   >            - In the code map section: Include a code map of how all the elements we are working with fit together.  
   >            - In the context section: Include any relevant code snippets, comments, or other information that can help the AI coder understand the project context.  
   >            - If applicable, **log the intended** before and after states of any planned code changes in code blocks (without applying changes to the actual codebase).  
   >        </step>
   >        <step>
   >          3. **Important**  
   >            - **Only create the lifeline file.**  
   >            - **Do not make any modifications to the existing codebase.**  
   >            - **Do not edit or modify files—just document information inside the lifeline file.**
   >            - **Stop working after you've created the lifeline file.**  
   >        </step>
   >      </instructions>
   >    </userCommand>
   >
   >    <userCommand> lifeline read
   >      <trigger>
   >        When a user types <strong>lifeline read</strong>, Cascade should:
   >      </trigger>
   >      <instructions>
   >        Find the most recent file in the <em>_lifeline</em> folder that starts with <strong>_lifeline-response</strong> and follow the directions outlined in that file step by step.
   >      </instructions>
   >    </userCommand>
   >  </userCommandsList>
   > ```
   >

---

## Latest Changes (v0.2.1)

- Fixed response file naming to prevent overwriting existing files
- Added unique file naming with timestamps for response files
- Improved path handling and file system operations
- Added detailed debug logging for troubleshooting

## Requirements

You'll need one of the following:
- VS Code version 1.96.0 or higher
- Windsurf by Codeium

Essential requirement:
- **Your own OpenAI API key** (This extension uses your personal API key to access OpenAI's services. You can obtain one from [OpenAI's website](https://platform.openai.com/api-keys))

## Development

### Prerequisites
- Node.js and npm installed
- VS Code

### Building and Installing Locally

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Compile the extension:
   ```bash
   npm run compile
   ```
4. Package the extension:
   ```bash
   npx vsce package
   ```

### Project Structure
- `src/extension.ts`: Main extension entry point, command registration, and file system watcher
- `src/lifeLineService.ts`: OpenAI API communication and file operations
- `_lifeline/`: Directory where prompts and responses are stored

### Development Workflow
1. Make changes in the `src` directory
2. Run `npm run compile` to compile changes
3. Press F5 in VS Code to launch Extension Development Host
4. Test changes in the new window

## License

MIT