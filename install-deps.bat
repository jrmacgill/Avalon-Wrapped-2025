@echo off
echo ========================================
echo Installing Dependencies
echo ========================================
echo.

REM Refresh PATH
set PATH=%PATH%;%ProgramFiles%\nodejs;%ProgramFiles(x86)%\nodejs;%LOCALAPPDATA%\Programs\nodejs

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js not found!
    echo Please install from https://nodejs.org/
    pause
    exit /b 1
)

echo Installing dependencies...
echo This may take a few minutes...
echo.

call npm install

if %ERRORLEVEL% EQU 0 (
    echo.
    echo SUCCESS: Dependencies installed!
    echo You can now run: npm run process-data
    echo Then: npm run dev
) else (
    echo.
    echo ERROR: Installation failed!
    echo Try running: npm install --verbose
)

echo.
pause


