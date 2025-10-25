# Release Process

This document describes how to release a new version of the Content Growth Widget package.

## Quick Release

```bash
npm run release
```

This will:
1. ✅ Build the package (TypeScript, components, widget)
2. ✅ Copy widget files to `release/` folder
3. ✅ Auto-copy to `../wwwsite/public/` (if exists)
4. ✅ Show next steps for publishing

## Manual Steps After Release Script

### 1. Test the Widget

Test in wwwsite:
```bash
cd ../wwwsite
npm run dev
# Visit http://localhost:4321/demo/widget
```

### 2. Update Version

```bash
npm version patch  # 1.1.0 -> 1.1.1
# or
npm version minor  # 1.1.0 -> 1.2.0
# or
npm version major  # 1.1.0 -> 2.0.0
```

### 3. Update CHANGELOG.md

Add release notes:
```markdown
## [1.1.1] - 2025-01-25

### Added
- New feature X
- New feature Y

### Fixed
- Bug fix Z

### Changed
- Improvement A
```

### 4. Commit and Tag

```bash
git add .
git commit -m "Release v1.1.1"
git tag v1.1.1
git push origin main
git push origin v1.1.1
```

### 5. Publish to NPM

Dry run first:
```bash
npm publish --dry-run
```

Then publish:
```bash
npm publish --access public
```

### 6. Update wwwsite

The widget files are already copied to `wwwsite/public/`, so just commit:
```bash
cd ../wwwsite
git add public/widget.js public/widget.css
git commit -m "Update widget to v1.1.1"
git push
```

## Release Folder Structure

After running `npm run release`, you'll have:

```
content-package/
├── dist/                    # Full package build
│   ├── astro/
│   ├── react/
│   ├── vue/
│   ├── widget/
│   │   └── widget.js       # Widget source
│   └── styles.css
├── release/                 # Release artifacts
│   ├── widget.js           # Standalone widget
│   └── widget.css          # Widget styles
└── release.sh
```

## Widget Maintenance

### Source of Truth

- **Widget source**: `content-package/src/widget/`
- **DO NOT** edit `wwwsite/src/widget/` (deprecated)
- **DO NOT** edit `wwwsite/public/widget.js` directly

### Making Widget Changes

1. Edit files in `content-package/src/widget/`
2. Run `npm run release`
3. Test in wwwsite
4. Commit and publish

### Widget Files

The widget consists of:
- `widget.js` - Main widget code with ContentGrowthWidget class
- `components/` - ContentList, ContentViewer, etc.
- `utils/` - API client, helpers
- `styles/` - Widget CSS (compiled to widget.css)

## Troubleshooting

### Build Fails

```bash
# Clean and rebuild
rm -rf dist/
npm run build
```

### Widget Not Updating in wwwsite

```bash
# Manually copy
cp release/widget.js ../wwwsite/public/widget.js
cp release/widget.css ../wwwsite/public/widget.css
```

### NPM Publish Fails

Check:
- Are you logged in? `npm whoami`
- Is version bumped? Check package.json
- Is package name available? Check npmjs.com

## Version Strategy

- **Patch** (1.1.0 -> 1.1.1): Bug fixes, small improvements
- **Minor** (1.1.0 -> 1.2.0): New features, backward compatible
- **Major** (1.1.0 -> 2.0.0): Breaking changes

## Checklist

Before publishing:
- [ ] All tests pass
- [ ] Widget works in wwwsite demo
- [ ] CHANGELOG.md updated
- [ ] Version bumped
- [ ] Git committed and tagged
- [ ] Dry run successful

After publishing:
- [ ] Verify on npmjs.com
- [ ] Test installation: `npm install @contentgrowth/content-widget@latest`
- [ ] Update documentation if needed
- [ ] Announce release (if major/minor)
