#!/bin/bash

# Static Site Build Script for Cloudflare Pages
echo "Building EuroVolt static site..."

# Create public directory if it doesn't exist
mkdir -p public

# Copy static assets
echo "Copying static assets..."
cp -r static/css public/
cp -r static/js public/
cp -r static/images public/

# Copy HTML files
echo "Copying HTML pages..."
cp public/index.html public/index.html 2>/dev/null || echo "index.html already in place"

echo "✅ Build complete! Output in /public directory"
