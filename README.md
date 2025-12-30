# DED Wrapped 2025

An interactive "Spotify Wrapped"-style web experience showcasing Discord server statistics from 2025, themed around Final Fantasy XIV and the Dead on Arrival.

## Features

- **Interactive Slides**: Navigate through various statistics with smooth animations
- **Comprehensive Stats**: Messages, users, channels, activity patterns, reactions, and more
- **FFXIV Theming**: Custom color scheme and styling inspired by Final Fantasy XIV
- **Local Search Tool**: Search through JSON files to discover interesting stats
- **GitHub Pages Ready**: Deployable as a static site

## Setup

### Prerequisites

- **Node.js 18+ and npm** (see [SETUP.md](SETUP.md) for Windows installation instructions)
- Discord JSON export files in `C:\Users\Evelyn\Documents\DED`

### Quick Start (Windows)

**Option A: Using Batch Files (Easiest)**

1. **Install Node.js** (if not already installed):
   - Download from https://nodejs.org/ (LTS version)
   - Run the installer and follow the prompts

2. **Double-click `setup.bat`** - This installs all dependencies

3. **Run `npm run process-data`** - Processes your Discord JSON files

4. **Double-click `start-dev.bat`** - Starts the development server

5. **Open the URL shown** in your browser (usually http://localhost:5173)

**Option B: Using PowerShell**

1. **Install Node.js** (if not already installed):
   - Download from https://nodejs.org/ (LTS version)
   - Run the installer and follow the prompts

2. **Open PowerShell in the project folder:**
   ```powershell
   cd "C:\Users\Evelyn\Documents\DED Wrapped 2025"
   ```

3. **Install dependencies:**
   ```powershell
   npm install
   ```

4. **Process Discord data:**
   ```powershell
   npm run process-data
   ```

5. **Start development server:**
   ```powershell
   npm run dev
   ```

6. **Open the URL shown** (usually http://localhost:5173) in your browser

**⚠️ Important:** Don't open `index.html` directly - you must use the dev server! The HTML file will show a helpful message if opened directly.

See [SETUP.md](SETUP.md) for detailed Windows setup instructions or [QUICKSTART.md](QUICKSTART.md) for troubleshooting.

## Local Search Tool

Search through Discord JSON files to find interesting statistics:

```bash
npm run search -- --query "raid" --author "Kuma"
npm run search -- --min-reactions 5 --has-attachments
npm run search -- --help
```

See `tools/search-json.js` for all available options.

## Deployment

### GitHub Pages

1. Update `vite.config.js` with your repository name if different from `DED-Wrapped-2025`
2. Push to GitHub
3. Enable GitHub Pages in repository settings (Settings > Pages)
4. Select "GitHub Actions" as the source
5. The workflow will automatically build and deploy on push to `main`

### Manual Deployment

1. Run `npm run build`
2. Deploy the `dist` folder to your static hosting service

## Project Structure

```
├── tools/
│   └── search-json.js          # Local JSON search tool
├── scripts/
│   └── process-data.js         # Data aggregation script
├── src/
│   ├── App.jsx                 # Main app component
│   ├── components/             # Slide components
│   ├── styles/                 # CSS styles
│   └── utils/                  # Utility functions
├── public/
│   ├── data/
│   │   └── stats.json          # Generated statistics
│   └── assets/                 # Custom graphics
└── .github/workflows/
    └── deploy.yml              # GitHub Actions workflow
```

## Customization

### Adding Custom Graphics

1. Copy images from `C:\Users\Evelyn\Documents\DED\Assets` to `public/assets/`
2. Reference them in components: `<img src="/assets/filename.png" />`

### Modifying Stats

Edit `scripts/process-data.js` to add new statistics or modify existing ones.

### Styling

- Main theme colors: `src/styles/themes.css`
- Slide styles: `src/styles/Slide.css`
- App styles: `src/styles/App.css`

## Notes

- The data processing script reads from `C:\Users\Evelyn\Documents\DED` - update the path in `scripts/process-data.js` if your data is elsewhere
- Large JSON files may take time to process
- `stats.json` is gitignored by default - commit it manually if needed for deployment

## License

Private project for Dead on Arrival.

