@echo off
echo ========================================
echo DED Wrapped 2025 - Setup Script
echo ========================================
echo.

REM Refresh PATH to include Node.js
call refreshenv >nul 2>nul
set PATH=%PATH%;%ProgramFiles%\nodejs;%ProgramFiles(x86)%\nodejs;%LOCALAPPDATA%\Programs\nodejs

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Download the LTS version and run the installer.
    echo.
    echo After installing, you may need to:
    echo   1. Close and reopen this window, OR
    echo   2. Restart your computer
    echo.
    pause
    exit /b 1
)

echo [1/3] Checking Node.js installation...
node --version
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js found but 'node' command failed
    pause
    exit /b 1
)

npm --version
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm command failed
    echo Try restarting this window after installing Node.js
    pause
    exit /b 1
)
echo.

echo [2/3] Installing dependencies...
echo This may take a few minutes...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to install dependencies
    echo.
    echo Troubleshooting:
    echo   - Make sure you have internet connection
    echo   - Try running: npm install --verbose
    echo   - Check if antivirus is blocking npm
    echo.
    pause
    exit /b 1
)
echo.

REM Verify node_modules was created
if not exist "node_modules" (
    echo ERROR: node_modules folder was not created!
    echo npm install may have failed silently.
    echo Try running manually: npm install
    pause
    exit /b 1
)

echo [3/3] Setup complete!
echo.
echo Next steps:
echo   1. Run: npm run process-data
echo      (This processes your Discord JSON files)
echo.
echo   2. Run: npm run dev
echo      (This starts the development server)
echo.
echo   3. Open the URL shown in your browser
echo.
pause

