# DED Wrapped 2025 - PowerShell Dev Server Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting DED Wrapped 2025 Dev Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
try {
    node --version | Out-Null
} catch {
    Write-Host "ERROR: Node.js not found in PATH!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please:" -ForegroundColor Yellow
    Write-Host "  1. Install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "  2. Close and reopen PowerShell" -ForegroundColor Yellow
    Write-Host "  3. Or restart your computer" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "ERROR: Dependencies not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please run one of these:" -ForegroundColor Yellow
    Write-Host "  - Double-click setup.bat" -ForegroundColor Yellow
    Write-Host "  - Or run: .\setup.ps1" -ForegroundColor Yellow
    Write-Host "  - Or run: npm install" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if stats.json exists
if (-not (Test-Path "public\data\stats.json")) {
    Write-Host "WARNING: stats.json not found!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "You need to process your Discord data first." -ForegroundColor Yellow
    Write-Host "Run: npm run process-data" -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Press Enter to continue anyway, or Ctrl+C to cancel"
}

Write-Host "Starting development server..." -ForegroundColor Green
Write-Host ""
Write-Host "The app will open in your browser automatically." -ForegroundColor Gray
Write-Host "Press Ctrl+C to stop the server." -ForegroundColor Gray
Write-Host ""

npm run dev


