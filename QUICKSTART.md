# Quick Start Guide

## Why is index.html blank?

**Vite projects cannot be opened directly as HTML files.** They need to be:
1. Served via a development server (`npm run dev`), OR
2. Built and served as static files (`npm run build`)

Opening `index.html` directly won't work because:
- The JavaScript modules need to be processed by Vite
- The React code needs to be compiled
- Assets need to be properly resolved

## The Right Way to View Your Project

### Option 1: Development Server (Recommended)

```powershell
# 1. Install Node.js from https://nodejs.org/ if you haven't
# 2. Open PowerShell in this folder
cd "C:\Users\Evelyn\Documents\DED Wrapped 2025"

# 3. Install dependencies (first time only)
npm install

# 4. Generate stats from your Discord data
npm run process-data

# 5. Start the dev server
npm run dev
```

Then open the URL shown (usually http://localhost:5173)

### Option 2: Build and Preview

```powershell
# Build the project
npm run build

# Preview the built version
npm run preview
```

## Still Having Issues?

1. **Make sure Node.js is installed:**
   ```powershell
   node --version
   npm --version
   ```
   If these don't work, install Node.js from https://nodejs.org/

2. **Make sure you're in the right folder:**
   ```powershell
   cd "C:\Users\Evelyn\Documents\DED Wrapped 2025"
   ```

3. **Check that dependencies are installed:**
   - Look for a `node_modules` folder
   - If it doesn't exist, run `npm install`

4. **Make sure stats.json exists:**
   - Check `public/data/stats.json`
   - If it doesn't exist, run `npm run process-data`


