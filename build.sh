#!/bin/bash
set -e

# Static Site Build Script for Cloudflare Pages
echo "🚀 Building EuroVolt static site..."

# Ensure public directory exists and is clean
echo "📁 Setting up public directory..."
rm -rf public 2>/dev/null || true
mkdir -p public

# Copy HTML files from site directory
echo "📋 Copying HTML files..."
if [ -d "site" ]; then
    cp site/*.html public/ 2>/dev/null || true
fi

# Copy static assets
echo "📋 Copying CSS files..."
mkdir -p public/css
cp -r static/css/* public/css/ 2>/dev/null || true

echo "📋 Copying JavaScript files..."
mkdir -p public/js
cp -r static/js/* public/js/ 2>/dev/null || true

echo "📋 Copying images..."
mkdir -p public/images
cp -r static/images/* public/images/ 2>/dev/null || true

# Copy headers file if exists
if [ -f "site/_headers" ]; then
    cp site/_headers public/_headers
fi

echo "✅ Build complete! Output in /public directory"
echo "📊 Files created:"
ls -lh public/ | grep -v total
