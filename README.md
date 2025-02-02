# LifeLine Extension for VS Code

LifeLine is a VS Code extension that provides seamless integration with OpenAI's API. It offers both interactive AI assistance through file monitoring and programmatic access through a `lifeLine()` function, making it easy to integrate AI capabilities into your development workflow.

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

## Installation

1. Download the `.vsix` file from the latest release
2. Open VS Code
3. Go to the Extensions view (Ctrl+Shift+X)
4. Click on the "..." menu at the top of the Extensions view
5. Select "Install from VSIX..." and choose the downloaded file

## Configuration

Before using the extension, you need to configure your OpenAI API key:

1. Open VS Code settings (Cmd+, on macOS, Ctrl+, on Windows/Linux)
2. Search for "openai.apiKey"
3. Enter your OpenAI API key

## Usage

### Method 1: File-Based Interaction
1. Create or navigate to a `_lifeline` directory in your workspace
2. Create a new markdown file with the format `_lifeline-[timestamp].md`
3. Write your prompt/question in the file
4. Save the file - the extension will automatically:
   - Process your request
   - Generate a response file (`_lifeline-response-[timestamp].md`)
   - Copy the response to your clipboard
   - Open the response in a new editor

### Method 2: Command Palette
1. Open the Command Palette (Cmd+Shift+P)
2. Search for "Call LifeLine API"
3. Enter your prompt when prompted
4. Optionally provide a system prompt
5. View the response in a new editor window

### Method 3: Programmatic API
The extension exposes a `lifeLine()` function that can be called programmatically:

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
```

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
