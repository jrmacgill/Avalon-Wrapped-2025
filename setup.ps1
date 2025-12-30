# DED Wrapped 2025 - PowerShell Setup Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "DED Wrapped 2025 - Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "[1/3] Node.js installation found:" -ForegroundColor Green
    Write-Host "  Node.js: $nodeVersion"
    Write-Host "  npm: $npmVersion"
    Write-Host ""
} catch {
    Write-Host "ERROR: Node.js is not installed or not in PATH!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "Download the LTS version and run the installer." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "After installing, you may need to:" -ForegroundColor Yellow
    Write-Host "  1. Close and reopen PowerShell, OR" -ForegroundColor Yellow
    Write-Host "  2. Restart your computer" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Install dependencies
Write-Host "[2/3] Installing dependencies..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Gray
Write-Host ""

try {
    npm install
    if ($LASTEXITCODE -ne 0) {
        throw "npm install failed"
    }
} catch {
    Write-Host ""
    Write-Host "ERROR: Failed to install dependencies" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "  - Make sure you have internet connection" -ForegroundColor Yellow
    Write-Host "  - Try running: npm install --verbose" -ForegroundColor Yellow
    Write-Host "  - Check if antivirus is blocking npm" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Verify installation
if (-not (Test-Path "node_modules")) {
    Write-Host ""
    Write-Host "ERROR: node_modules folder was not created!" -ForegroundColor Red
    Write-Host "npm install may have failed silently." -ForegroundColor Yellow
    Write-Host "Try running manually: npm install" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "[3/3] Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Run: npm run process-data" -ForegroundColor White
Write-Host "     (This processes your Discord JSON files)" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. Run: npm run dev" -ForegroundColor White
Write-Host "     (This starts the development server)" -ForegroundColor Gray
Write-Host ""
Write-Host "  3. Open the URL shown in your browser" -ForegroundColor Gray
Write-Host ""
Read-Host "Press Enter to exit"


