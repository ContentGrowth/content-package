#!/bin/bash

# Content Growth Widget - Release Script
# This script builds the package and prepares it for release

set -e

echo "🚀 Content Growth Widget - Release Process"
echo "=========================================="
echo ""

# Step 1: Build the package
echo "📦 Step 1: Building package..."
rm -rf ./dist/
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed!"
  exit 1
fi

echo "✅ Build completed successfully"
echo ""

# Step 2: Create release folder and copy widget files
echo "📁 Step 2: Preparing release folder..."
mkdir -p release
cp dist/widget/widget.js release/widget.js
cp dist/widget/widget.dev.js release/widget.dev.js
cp dist/widget/widget.css release/widget.css
cp dist/widget/widget.dev.css release/widget.dev.css

echo "✅ Widget files copied to release/"
echo "   - release/widget.js (minified)"
echo "   - release/widget.dev.js (unminified)"
echo "   - release/widget.css (minified)"
echo "   - release/widget.dev.css (unminified)"
echo ""

# Step 3: Try to copy to wwwsite/public (if folder structure exists)
echo "🔄 Step 3: Copying to wwwsite/public..."
WWWSITE_PUBLIC="../wwwsite/public"

if [ -d "$WWWSITE_PUBLIC" ]; then
  cp release/widget.js "$WWWSITE_PUBLIC/widget.js"
  cp release/widget.dev.js "$WWWSITE_PUBLIC/widget.dev.js"
  cp release/widget.css "$WWWSITE_PUBLIC/widget.css"
  cp release/widget.dev.css "$WWWSITE_PUBLIC/widget.dev.css"
  echo "✅ Copied to $WWWSITE_PUBLIC"
  echo "   - widget.js (minified)"
  echo "   - widget.dev.js (unminified)"
  echo "   - widget.css (minified)"
  echo "   - widget.dev.css (unminified)"
else
  echo "⚠️  wwwsite/public not found at $WWWSITE_PUBLIC"
  echo "   You can manually copy files from release/ folder"
fi

echo ""

# Step 4: Show package info
echo "📋 Step 4: Package Information"
PACKAGE_VERSION=$(node -p "require('./package.json').version")
PACKAGE_NAME=$(node -p "require('./package.json').name")

echo "   Package: $PACKAGE_NAME"
echo "   Version: $PACKAGE_VERSION"
echo ""

# Step 5: Ask about npm publish
echo "📤 Step 5: Ready to publish to npm"
echo ""
echo "To publish to npm, run:"
echo "   npm publish --access public"
echo ""
echo "Or for a dry run first:"
echo "   npm publish --dry-run"
echo ""

# Summary
echo "✨ Release preparation complete!"
echo ""
echo "📦 Files ready in release/ folder:"
echo "   - widget.js (minified, production)"
echo "   - widget.dev.js (unminified, debugging)"
echo "   - widget.css (minified, production)"
echo "   - widget.dev.css (unminified, debugging)"
echo ""
echo "Next steps:"
echo "1. Test the widget in wwwsite"
echo "2. Update CHANGELOG.md"
echo "3. Commit changes: git add . && git commit -m 'Release v$PACKAGE_VERSION'"
echo "4. Create git tag: git tag v$PACKAGE_VERSION"
echo "5. Push: git push && git push --tags"
echo "6. Publish to npm: npm publish --access public"
echo ""
