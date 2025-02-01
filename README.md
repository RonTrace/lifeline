# LifeLine Extension for VS Code

LifeLine is a VS Code extension that provides seamless integration with OpenAI's API. It exposes a `lifeLine()` function that can be used to send prompts to OpenAI and receive responses, making it easy to integrate AI capabilities into your development workflow.

## Features

- Direct access to OpenAI's API through VS Code
- Configurable model settings (temperature, model selection)
- Secure API key management through VS Code settings
- Command palette integration for quick access

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
2. Search for "o1.apiKey"
3. Enter your OpenAI API key

Additional settings:
- `o1.model`: Choose the OpenAI model to use (default: "gpt-3.5-turbo")
- `o1.temperature`: Set the temperature for responses (default: 0.7)

## Usage

### Via Command Palette
1. Open the Command Palette (Cmd+Shift+P)
2. Search for "Call LifeLine API"
3. Enter your prompt when prompted
4. Optionally provide a system prompt
5. View the response in a new editor window

### Via API
The extension exposes a `lifeLine()` function that can be called programmatically:

```typescript
interface LifeLineParams {
    prompt: string;
    systemPrompt?: string;
    temperature?: number;
}

async function lifeLine(params: LifeLineParams): Promise<string>
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

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
   This will create a `lifeLine-0.0.1.vsix` file in the root directory.

5. Install the extension locally:
   - Open VS Code
   - Go to the Extensions view (Cmd+Shift+X)
   - Click on the "..." menu at the top
   - Select "Install from VSIX..."
   - Choose the `lifeLine-0.0.1.vsix` file you just created

### Development Workflow
- Make your changes in the `src` directory
- Run `npm run compile` to compile your changes
- To test your changes:
  - Press F5 in VS Code to launch a new Extension Development Host window
  - Your extension will be loaded in this window for testing
