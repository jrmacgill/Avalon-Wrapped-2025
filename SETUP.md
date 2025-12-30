# Setup Guide for Windows

## Step 1: Install Node.js and npm

1. **Download Node.js:**
   - Go to https://nodejs.org/
   - Download the **LTS version** (recommended)
   - Choose the Windows Installer (.msi) for your system (64-bit)

2. **Install Node.js:**
   - Run the downloaded installer
   - Follow the installation wizard (accept defaults)
   - Make sure "Add to PATH" is checked during installation

3. **Verify Installation:**
   - Open PowerShell or Command Prompt
   - Run these commands to verify:
   ```powershell
   node --version
   npm --version
   ```
   - You should see version numbers (e.g., v18.x.x and 9.x.x)

## Step 2: Install Project Dependencies

1. **Open PowerShell in the project folder:**
   - Navigate to: `C:\Users\Evelyn\Documents\DED Wrapped 2025`
   - Right-click in the folder → "Open in Terminal" or "Open PowerShell window here"
   - Or open PowerShell and run:
   ```powershell
   cd "C:\Users\Evelyn\Documents\DED Wrapped 2025"
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```
   This will download all required packages (React, Vite, etc.)

## Step 3: Process Your Discord Data

Generate the statistics file from your JSON exports:

```powershell
npm run process-data
```

This reads all JSON files from `C:\Users\Evelyn\Documents\DED` and creates `public/data/stats.json`.

**Note:** This may take a few minutes if you have many/large JSON files.

## Step 4: Start the Development Server

```powershell
npm run dev
```

This will:
- Start a local web server
- Show you a URL (usually http://localhost:5173)
- Open that URL in your browser

**Important:** You MUST use the dev server URL, not open `index.html` directly!

## Step 5: View Your Wrapped Experience

- The dev server will automatically open your browser
- Or manually go to the URL shown in the terminal (usually http://localhost:5173)
- Use arrow keys or the navigation buttons to move between slides

## Troubleshooting

### "npm is not recognized"
- Node.js isn't installed or not in PATH
- Restart PowerShell/Command Prompt after installing Node.js
- Verify with `node --version` and `npm --version`

### Blank white page when opening index.html directly
- **This is normal!** Vite projects need to be served via the dev server
- Run `npm run dev` instead of opening the HTML file directly

### "Cannot find module" errors
- Run `npm install` to install dependencies
- Make sure you're in the project directory

### Stats not loading
- Make sure you ran `npm run process-data` first
- Check that `public/data/stats.json` exists
- Verify the data directory path in `scripts/process-data.js` is correct

## Building for Production

When you're ready to deploy:

```powershell
npm run build
```

This creates a `dist` folder with the production-ready files.


