# Cloudflare Pages Deployment Guide

## Quick Setup

This is a **static HTML website** with no build process required.

## Cloudflare Pages Configuration

When setting up your Cloudflare Pages project, use these exact settings:

### Build Settings
```
Framework preset: None
Build command: (leave empty)
Build output directory: /
Root directory (advanced): (leave empty)
```

### Alternative Build Command
If Cloudflare Pages requires a build command, use:
```
echo "No build required - static site"
```

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

### Deployment Fails

**Issue:** Build fails with "No build output found"
**Solution:** Make sure build output directory is set to `/` (root)

**Issue:** Build command errors
**Solution:** Leave build command empty or use `echo "No build required"`

**Issue:** 404 errors after deployment
**Solution:** Verify that `index.html` exists in the root directory

### Static Assets Not Loading

**Issue:** CSS/JS files return 404
**Solution:** Verify the `static/` directory structure is intact

### Headers Not Applied

**Issue:** Security headers not showing
**Solution:** Check `_headers` file syntax matches Cloudflare Pages format

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
