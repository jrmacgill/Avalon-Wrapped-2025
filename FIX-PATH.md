# Fixing npm PATH Issue on Windows

If you see "npm is not recognized" in PowerShell even though Node.js is installed, here's how to fix it:

## Quick Fix

**Option 1: Restart PowerShell**
- Close your current PowerShell window
- Open a new PowerShell window
- Try `npm --version` again

**Option 2: Refresh PATH in Current Session**
Run this in PowerShell:

```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

Then verify:
```powershell
npm --version
```

**Option 3: Use the PowerShell Scripts**
Instead of `.bat` files, use the `.ps1` scripts:
- `.\setup.ps1` - Setup script
- `.\start-dev.ps1` - Start dev server

If you get an execution policy error, run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Permanent Fix

If the above doesn't work, Node.js might not be in your PATH:

1. **Find Node.js installation:**
   - Usually: `C:\Program Files\nodejs\`
   - Or: `C:\Users\YourName\AppData\Local\Programs\nodejs\`

2. **Add to PATH manually:**
   - Press `Win + X` → System → Advanced system settings
   - Click "Environment Variables"
   - Under "System variables", find "Path" and click "Edit"
   - Click "New" and add: `C:\Program Files\nodejs`
   - Click OK on all dialogs
   - **Restart PowerShell**

3. **Verify:**
   ```powershell
   node --version
   npm --version
   ```

## Alternative: Use Command Prompt

If PowerShell keeps having issues, you can use Command Prompt (cmd.exe) instead:
- The `.bat` files work in Command Prompt
- Or run commands directly in cmd.exe


