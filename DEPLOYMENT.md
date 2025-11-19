# Cloudflare Pages Deployment Guide

## Quick Setup

This is a **static HTML website** with no build process required.

## Cloudflare Pages Configuration

When setting up your Cloudflare Pages project, use these exact settings:

### ⚠️ CRITICAL: Use Configuration Option 1 or 2

**Option 1: No Build (Recommended)**
```
Framework preset: None
Build command: (leave completely empty - do not type anything)
Build output directory: /
Root directory (advanced): (leave empty)
```

**Option 2: Simple Build Script**
```
Framework preset: None
Build command: ./build.sh
Build output directory: /
Root directory (advanced): (leave empty)
```

**Option 3: Echo Command (Fallback)**
```
Framework preset: None
Build command: echo "Static site ready"
Build output directory: /
Root directory (advanced): (leave empty)
```

### Common Mistakes to Avoid
❌ DO NOT set build output directory to `.` (use `/` instead)
❌ DO NOT select any framework preset
❌ DO NOT set a root directory
❌ DO NOT add environment variables (none needed)

## Step-by-Step Deployment

1. **Log in to Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com/
   - Navigate to Pages

2. **Create New Project**
   - Click "Create a project"
   - Select "Connect to Git"

3. **Connect GitHub Repository**
   - Authorize Cloudflare to access your GitHub account
   - Select repository: `randunun-eng/-EuroVoltGreen`
   - Choose branch: `main`

4. **Configure Build Settings**
   - Framework preset: **None**
   - Build command: **Leave empty** or use `echo "No build required"`
   - Build output directory: **`/`**
   - Root directory: **Leave empty**

5. **Deploy**
   - Click "Save and Deploy"
   - Wait for deployment to complete

## What's Included

- ✅ `_headers` - Security headers and caching rules
- ✅ `_redirects` - URL redirect rules (currently empty)
- ✅ `package.json` - Project metadata
- ✅ Static HTML, CSS, and JavaScript files

## Troubleshooting

### Deployment Fails - "No build output found"

This is the most common error. Fix it by:

1. **Go to Cloudflare Pages → Your Project → Settings → Builds & deployments**
2. **Click "Edit configuration"**
3. **Set Build output directory to exactly: `/`** (forward slash only)
4. **Make sure Build command is empty OR `./build.sh`**
5. **Click "Save"**
6. **Go to Deployments tab → Click "Retry deployment"**

### Deployment Fails - Build command errors

**Error:** "Command not found" or "Build failed"

**Solutions:**
- Clear the build command completely (leave it blank)
- OR use: `./build.sh`
- OR use: `exit 0`

### Deployment Succeeds but Shows 404

**Issue:** Site deploys but shows 404 on all pages

**Solutions:**
1. Verify build output directory is `/` not `.`
2. Check that `index.html` exists in repository root
3. Verify all files are committed to Git:
   ```bash
   git status
   git push origin main
   ```
4. Force a new deployment in Cloudflare Pages

### Static Assets Not Loading (CSS/JS 404 errors)

**Issue:** Homepage loads but no styling, broken images

**Solutions:**
1. Check browser console for 404 errors
2. Verify `static/` directory is in repository:
   ```bash
   git ls-files | grep static
   ```
3. If missing, add and commit:
   ```bash
   git add static/
   git commit -m "Add static assets"
   git push origin main
   ```

### Build Keeps Failing

**Nuclear option - Complete reset:**

1. **Delete the Cloudflare Pages project**
2. **Create a new project**
3. **Use these EXACT settings:**
   - Framework: None
   - Build command: (empty)
   - Build output: `/`
4. **Deploy**

### Still Not Working?

**Check the build log in Cloudflare Pages:**
1. Go to Deployments tab
2. Click on the failed deployment
3. Read the error message
4. Common fixes:
   - If it says "directory not found": Set output to `/`
   - If it says "command failed": Clear build command
   - If it says "no index.html": Verify file is committed

## Verifying Deployment

After deployment, verify:

1. **Homepage loads:** `https://your-site.pages.dev`
2. **Navigation works:** Click through all menu items
3. **Static assets load:** Check browser console for errors
4. **Headers applied:** Use browser dev tools → Network tab

## Custom Domain Setup

1. Go to Cloudflare Pages → Your Project → Custom domains
2. Click "Set up a custom domain"
3. Enter your domain name
4. Follow DNS configuration instructions

## Environment Variables

This static site requires **no environment variables**.

The contact form uses Formspree - update the form action in `contact.html` with your Formspree form ID.

## Local Testing

Test the site locally before deploying:

```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit: `http://localhost:8000`

## Support

If deployment issues persist:
1. Check Cloudflare Pages build logs
2. Verify all files are committed to Git
3. Ensure `main` branch is up to date
4. Contact Cloudflare support with build logs
