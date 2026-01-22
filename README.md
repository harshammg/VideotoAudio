# Audio Extract Pro

A modern, browser-based audio extraction tool that converts video files to audio formats using native web technologies.

## 🚀 Features

- **Browser-based processing** - No server uploads, 100% client-side
- **Multiple format support** - MP3 (128kbps/320kbps) and WAV output
- **Fast conversion** - Uses Web Audio API for lightning-fast processing
- **Privacy focused** - Files never leave your device
- **Modern UI** - Built with React, TypeScript, and TailwindCSS

## 🏗️ Codebase Structure

```
audio-extract-pro/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # Shared UI components (buttons, inputs, etc.)
│   │   ├── ConvertButton.tsx     # Main conversion trigger button
│   │   ├── DownloadSection.tsx   # Audio player and download interface
│   │   ├── FormatSelector.tsx    # Output format selection
│   │   ├── UploadZone.tsx        # Drag & drop file upload area
│   │   ├── VideoConverter.tsx    # Main converter component
│   │   └── VideoConverter.tsx    # Main application wrapper
│   ├── hooks/               # Custom React hooks
│   │   └── useMediaProcessor.ts  # Core audio processing logic
│   ├── pages/               # Application pages
│   │   ├── Index.tsx        # Main landing page
│   │   └── NotFound.tsx     # 404 error page
│   ├── App.tsx              # Root application component
│   └── main.tsx             # Application entry point
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration
└── tailwind.config.ts       # TailwindCSS configuration
```

## 📁 Key Components Explained

### Core Processing Logic
- **`useMediaProcessor.ts`** - The heart of the application that handles audio conversion using Web Audio API
- **Features**: File decoding, format conversion, progress tracking, error handling

### UI Components
- **`VideoConverter.tsx`** - Main application container that orchestrates the conversion flow
- **`UploadZone.tsx`** - Handles file drag-and-drop functionality
- **`FormatSelector.tsx`** - Allows users to choose output format (MP3/WAV)
- **`ConvertButton.tsx`** - Triggers the conversion process with loading states
- **`DownloadSection.tsx`** - Provides audio playback and download functionality

### Pages
- **`Index.tsx`** - Main application page that renders the converter
- **`NotFound.tsx`** - Handles invalid routes

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS + shadcn/ui components
- **State Management**: React Hooks
- **Audio Processing**: Web Audio API
- **Routing**: React Router DOM
- **Animations**: Framer Motion

## ▶️ How to Run the Program

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Standard Installation

1. **Navigate to the project directory:**
   ```bash
   cd audio-extract-pro
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Visit `http://localhost:8081` (or the port shown in terminal)

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🤖 AI IDE Instructions

If you're using an AI-powered IDE (like Cursor, GitHub Copilot, or similar), you can run this project using voice/text commands:

### Voice Commands:
- "Run the audio extractor program"
- "Start the development server"
- "Launch the audio conversion app"

### Text Prompts:
```
/run-program audio-extract-pro
/start-dev-server
/launch-app audio-extractor
```

### AI IDE Specific Steps:

1. **Open the project workspace**
2. **Run installation command:**
   ```
   Install dependencies for audio-extract-pro
   ```

3. **Start development server:**
   ```
   Run development server for audio extractor
   ```

4. **Access the application:**
   The AI IDE should automatically detect the local server and provide a preview window

### Common AI IDE Commands:

**VS Code/Cursor:**
```
> Terminal: Run Task
> Select: dev
```

**JetBrains IDEs:**
```
Run npm script > dev
```

**GitHub Codespaces:**
```
Codespaces: Forward Port > 8081
```

## 🔧 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build development version
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
```

## 🎯 Usage Guide

1. **Upload a file** - Drag and drop or click to select a video/audio file
2. **Choose format** - Select MP3 (128kbps or 320kbps) or WAV output
3. **Convert** - Click the convert button to process your file
4. **Preview** - Listen to the converted audio in-browser
5. **Download** - Save the converted file to your device

## 🔒 Privacy & Security

- **Zero data upload** - All processing happens locally in your browser
- **No tracking** - No analytics or user data collection
- **Open source** - Full transparency of code and processing
- **No cookies** - Minimal local storage usage

## 🐛 Troubleshooting

### Common Issues:

**Port already in use:**
```bash
# Kill process on port 8081
npx kill-port 8081
# Or use a different port
PORT=3000 npm run dev
```

**Build errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors:**
```bash
# Check types
npm run lint
```

### Browser Compatibility:
- Chrome 70+ ✅
- Firefox 65+ ✅
- Safari 12+ ✅
- Edge 79+ ✅

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Built with React and Vite
- UI components from shadcn/ui
- Styled with TailwindCSS
- Powered by Web Audio API