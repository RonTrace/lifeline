# LifeLine Extension for VS Code

LifeLine is a VS Code extension that provides seamless integration with OpenAI's o1. It gives you access to senior-level AI assistance for your coding tasks, acting like an expert developer at your fingertips. The extension automatically creates and manages a history of your interactions in markdown files, making it easy to track and reference your AI conversations.

![Screenshot](lifeline.png)

## Usage

The extension provides two main commands:

### 1. Basic Documentation - "lifeline"

When you need to document your current coding task or problem:

1. Type "**lifeline**" in your AI code helper chat
2. Your local AI will:
   - Create a new _lifeline markdown file in the `_lifeline` directory
   - Document your current problem and context
   - Include technical notes, design decisions, and references to specific files
   - Log any intended code changes without modifying the actual codebase
3. The contents are sent to o1 and the response will be saved and copied to your clipboard

### 2. Project Specification - "lifeline spec"

When you need to create a comprehensive project specification:

1. Type "**lifeline spec**" in your AI code helper chat
2. Your local AI will:
   - Create a new _lifeline markdown file with detailed project specifications
   - Include project summary, user stories, and requirements
   - Document technical decisions and design considerations
   - Provide references to relevant files and code segments
   - Log any planned changes without modifying the codebase

For both commands, you can paste your clipboard into your AI code helper chat or read the generated file directly.

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
   ><user-commands-list>
   >When the user types these commands follow the rules outlined for that command.
   >
   > <user-command>
   >   When a user types **"lifeline"**, Cascade should:
   >     <lifeline>
   >     Follow the directions below in the <lifeline-prompt> section
   >     </lifeline>
   > </user-command>
   >
   > <user-command>
   >   When a user types **"lifeline spec"**, Cascade should:
   >     <lifeline>
   >     Follow the directions below in the <lifeline-spec-prompt> section
   >     </lifeline>
   > </user-command>
   > </user-commands-list>
   > 
   > <lifeline-prompt>
   >   <step>  
   >   1. **Create a lifeline markdown file:**  
   >     - Look for a folder in the project called `_lifeline`.  
   >     - If that folder does not exist, create it.  
   >     - Inside that folder, create a file called `_lifeline-[date].md`, where [date] is the current date and time in the format `YYYY-MM-DD-HH-MM-SS`.  
   >   </step>
   >   <step>
   >   2. **Gather context to write inside the lifeline file:**  
   >     - Summarize the current project and describe the specific task or problem at hand.  
   >     - Document technical notes, design decisions, and other relevant project details.  
   >     - Include a reference section with paths to specific files or code segments.  
   >     - If applicable, **log the intended** before and after states of any planned code changes in code blocks (without applying changes to the actual codebase).  
   >   </step>
   >   <step>
   >   3. **Important**  
   >     - **Only create the lifeline file.**  
   >     - **Do not make any modifications to the existing codebase.**  
   >     - **Do not edit or modify files—just document information inside the lifeline file.**  
   >   </step>
   > </lifeline-prompt>
   >
   > <lifeline-spec-prompt>
   >   <step>  
   >   1. **Create a lifeline markdown file:**  
   >     - Look for a folder in the project called `_lifeline`.  
   >     - If that folder does not exist, create it.  
   >     - Inside that folder, create a file called `_lifeline-[date].md`, where [date] is the current date and time in the format `YYYY-MM-DD-HH-MM-SS`.  
   >   </step>
   >   <step>
   >   2. **Gather context to write a comprehensive project specification inside the lifeline file:**  
   >     - Summarize the current project and describe the specific task or problem at hand.
   >     - Create user stories, use cases, or requirements (e.g. As a user, I want to click a button in a modal to close it.)
   >     - If you are unclear about the user stories, ask for clarification.  
   >     - Document technical notes, design decisions, and other relevant project details.  
   >     - Include a reference section with paths to specific files or code segments.  
   >     - If applicable, **log the intended** before and after states of any planned code changes in code blocks (without applying changes to the actual codebase).  
   >   </step>
   >   <step>
   >   3. **Important**  
   >     - **Only create the _lifeline file.**  
   >     - **Do not make any modifications to the existing codebase.**  
   >     - **Do not edit or modify files. Only document information inside the lifeline file.**  
   >   </step>
   > </lifeline-spec-prompt>
   > ```
   >

---

## Requirements

- VS Code version 1.96.0 or higher
- An OpenAI API key

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