#!/bin/bash

# Verify Build Script for Content Package

echo "Verifying content-package build..."
echo ""

# Check if dist exists
if [ ! -d "dist" ]; then
  echo "ERROR: dist/ directory not found. Run 'npm run build' first."
  exit 1
fi

echo "dist/ directory exists"

# Check core files
if [ -d "dist/core" ] && [ -f "dist/core/index.js" ]; then
  echo "Core module built"
else
  echo "ERROR: Core module missing"
fi

# Check widget files
if [ -d "dist/widget" ] && [ -f "dist/widget/widget.js" ]; then
  echo "Widget module built"
else
  echo "ERROR: Widget module missing"
fi

# Check React files
if [ -d "dist/react" ] && [ -f "dist/react/index.js" ]; then
  echo "React module built"
else
  echo "ERROR: React module missing"
fi

# Check Vue files
if [ -d "dist/vue" ] && [ -f "dist/vue/index.js" ]; then
  echo "Vue module built (JS)"
else
  echo "ERROR: Vue module JS missing"
fi

if [ -f "dist/vue/ContentList.vue" ]; then
  echo "Vue components copied"
else
  echo "ERROR: Vue components missing"
fi

# Check Astro files
if [ -d "dist/astro" ] && [ -f "dist/astro/index.js" ]; then
  echo "Astro module built (JS)"
else
  echo "ERROR: Astro module JS missing"
fi

if [ -f "dist/astro/ContentList.astro" ]; then
  echo "Astro components copied"
else
  echo "ERROR: Astro components missing"
fi

# Check types
if [ -d "dist/types" ] && [ -f "dist/types/index.d.ts" ]; then
  echo "Type definitions generated"
else
  echo "ERROR: Type definitions missing"
fi

# Check styles
if [ -f "dist/styles.css" ]; then
  echo "Styles copied"
else
  echo "ERROR: Styles missing"
fi

# Check main entry
if [ -f "dist/index.js" ] && [ -f "dist/index.d.ts" ]; then
  echo "Main entry point built"
else
  echo "ERROR: Main entry point missing"
fi

echo ""
echo "Build verification complete!"
