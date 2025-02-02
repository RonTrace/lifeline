# LifeLine Extension for VS Code

LifeLine is a VS Code extension that provides seamless integration with OpenAI's o1. It gives you access to senior-level AI assistance for your coding tasks, acting like an expert developer at your fingertips. The extension automatically creates and manages a history of your interactions in markdown files, making it easy to track and reference your AI conversations.

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

3. **Add Global AI Rules**
   Add the text from this file to your Windsurf global AI rules:
   file: global-prompt-for-cascade.md

## Usage

The extension is designed to be simple to use:

1. When you encounter a coding problem or need AI assistance, simply type "lifeline" in your AI code helper chat (like Cascade)
2. The AI will automatically:
   - Create a new markdown file in the `_lifeline` directory with the current timestamp
   - Document your current problem and context
   - Provide suggestions and solutions
   - Track any code changes made
3. All interactions are saved in the `_lifeline` directory for future reference

## Features

- **AI-Powered File Monitoring**: Automatically processes markdown files in the `_lifeline` directory
- **Command Palette Integration**: Quick access to AI assistance through VS Code commands
- **Programmatic API Access**: Direct access to OpenAI's API through the `lifeLine()` function
- **Clipboard Integration**: Automatically copies AI responses to clipboard
- **Secure API Key Management**: Manages OpenAI API keys through VS Code settings
- **Workspace Support**: Works with multiple workspace folders

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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

```typescript
interface LifeLineParams {
    prompt: string;
    systemPrompt?: string;
}

async function lifeLine(params: LifeLineParams): Promise<string>
```

Example usage:
```typescript
const response = await lifeLine({
    prompt: "How do I implement a binary search?",
    systemPrompt: "You are an expert programming tutor."
});
