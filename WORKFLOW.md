# DED Wrapped 2025 - Development Workflow

## Overview
This document explains how to maintain separate workflows for local development and GitHub Pages production deployment.

## Quick Reference

### Local Development (Fresh Data)
```bash
npm run process-data  # Generate latest stats
npm run dev          # Start dev server
# Visit: http://localhost:5173
```

### Production Deployment (Update Live Site)
```bash
npm run process-data      # Generate latest stats
npm run prepare-deploy    # Copy to production
git add .
git commit -m "Update production"
git push origin main      # Triggers deployment
# Visit: https://kaycep.github.io/DED-Wrapped-2025/
```

## Detailed Workflows

### Local Development Workflow
1. **Make changes** to code, styles, or components
2. **Generate fresh data** from latest Discord exports:
   ```bash
   npm run process-data
   ```
3. **Test locally** with latest data:
   ```bash
   npm run dev
   ```
4. **Iterate** as needed - all changes are local

### Production Deployment Workflow
1. **Generate final data** from latest Discord exports:
   ```bash
   npm run process-data
   ```
2. **Prepare production data**:
   ```bash
   npm run prepare-deploy
   ```
   This copies `stats.json` → `stats.production.json`
3. **Commit production data**:
   ```bash
   git add public/data/stats.production.json
   git commit -m "Update production stats with latest data"
   ```
4. **Push to GitHub** (triggers automatic deployment):
   ```bash
   git push origin main
   ```
5. **Wait 2-3 minutes** for GitHub Actions to deploy
6. **Verify live site** at https://kaycep.github.io/DED-Wrapped-2025/

## File Management

### What Gets Committed to Git
- ✅ **Source code** (`src/`, `public/assets/`, etc.)
- ✅ **Production stats** (`public/data/stats.production.json`)
- ✅ **Build configuration** (Vite, GitHub Actions, etc.)
- ❌ **Working stats** (`public/data/stats.json`) - gitignored
- ❌ **Raw Discord data** - never committed

### Local vs Production Data
- **Local**: Uses `public/data/stats.json` (fresh, gitignored)
- **Production**: Uses `public/data/stats.production.json` (committed, deployed)

## Troubleshooting

### Site Shows "Unable to load stats"
- Run `npm run process-data` locally
- For production: Run `npm run prepare-deploy` then push

### Assets Not Loading
- Check that `public/assets/` files are committed
- Verify paths use `${import.meta.env.BASE_URL}`

### Puns Not Loading
- Ensure `public/altani-puns-2025.json` is committed
- Check that path uses `${import.meta.env.BASE_URL}`

### Git Issues
- `stats.json` not updating: It's gitignored - use `stats.production.json`
- Branch issues: Ensure you're on `main` branch
- Push rejected: Pull latest changes first

## Emergency Recovery

If you lose track of local changes:

1. **Backup current work** (if any)
2. **Reset to clean state**:
   ```bash
   git reset --hard origin/main
   ```
3. **Regenerate local data**:
   ```bash
   npm run process-data
   ```
4. **Continue development**

## Best Practices

1. **Always run `npm run process-data`** before starting development
2. **Test locally** before deploying to production
3. **Use `npm run prepare-deploy`** to sync production data
4. **Commit production data** separately from code changes
5. **Keep raw Discord data** in a separate, private location

## Support

If you encounter issues:
1. Check this document first
2. Verify all files are in correct locations
3. Ensure GitHub Actions completed successfully
4. Check browser console for error details
