@echo off
echo ========================================
echo Starting DED Wrapped 2025 Dev Server
echo ========================================
echo.

REM Refresh PATH to include Node.js
set PATH=%PATH%;%ProgramFiles%\nodejs;%ProgramFiles(x86)%\nodejs;%LOCALAPPDATA%\Programs\nodejs

REM Check if Node.js is available
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js not found in PATH!
    echo.
    echo Please:
    echo   1. Install Node.js from https://nodejs.org/
    echo   2. Close and reopen this window
    echo   3. Or restart your computer
    echo.
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo ERROR: Dependencies not installed!
    echo.
    echo Please run one of these:
    echo   - Double-click setup.bat
    echo   - Or run: npm install
    echo.
    pause
    exit /b 1
)

REM Check if stats.json exists
if not exist "public\data\stats.json" (
    echo WARNING: stats.json not found!
    echo.
    echo You need to process your Discord data first.
    echo Run: npm run process-data
    echo.
    echo Press any key to continue anyway, or Ctrl+C to cancel...
    pause >nul
)

echo Starting development server...
echo.
echo The app will open in your browser automatically.
echo Press Ctrl+C to stop the server.
echo.

call npm run dev

