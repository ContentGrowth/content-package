/**
 * Simple widget bundler
 * Combines all JS and CSS files into single widget.js and widget.css
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read version from package.json
const packageJsonPath = path.join(__dirname, '../../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const VERSION = packageJson.version;

console.log(`📦 Building widget v${VERSION}`);

// Paths
const srcDir = __dirname; // Current directory is src/widget
const distDir = path.join(__dirname, '../../dist/widget'); // Output to dist/widget
const releaseDir = path.join(__dirname, '../../release'); // Also output to release/

// Ensure directories exist
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}
if (!fs.existsSync(releaseDir)) {
  fs.mkdirSync(releaseDir, { recursive: true });
}

// Read all JS files
const files = {
  utils: {
    helpers: fs.readFileSync(path.join(srcDir, 'utils/helpers.js'), 'utf8'),
    apiClient: fs.readFileSync(path.join(srcDir, 'utils/api-client.js'), 'utf8')
  },
  components: {
    contentCard: fs.readFileSync(path.join(srcDir, 'components/content-card.js'), 'utf8'),
    contentList: fs.readFileSync(path.join(srcDir, 'components/content-list.js'), 'utf8'),
    contentViewer: fs.readFileSync(path.join(srcDir, 'components/content-viewer.js'), 'utf8')
  },
  widget: fs.readFileSync(path.join(srcDir, 'widget.js'), 'utf8'),
  index: fs.readFileSync(path.join(srcDir, 'index.js'), 'utf8')
};

// Read CSS from main styles.css
const css = fs.readFileSync(path.join(__dirname, '../styles.css'), 'utf8');

// Read marked.js from node_modules (try UMD first, then minified)
const markedUmdPath = path.join(__dirname, '../../node_modules/marked/lib/marked.umd.js');
const markedMinPath = path.join(__dirname, '../../node_modules/marked/marked.min.js');
let markedLib = '';

if (fs.existsSync(markedUmdPath)) {
  console.log('📚 Using marked UMD bundle');
  markedLib = fs.readFileSync(markedUmdPath, 'utf8');
  // Wrap UMD to expose marked globally
  markedLib = markedLib.replace(/\(function \(global, factory\) \{/, '(function (global, factory) {\n  // Marked.js UMD Bundle\n  ');
} else if (fs.existsSync(markedMinPath)) {
  console.log('📚 Using marked minified bundle');
  markedLib = fs.readFileSync(markedMinPath, 'utf8');
} else {
  console.warn('⚠️  marked.js not found in node_modules, using basic fallback');
  markedLib = `
    // Basic markdown parser fallback
    const marked = {
      parse: function(md) {
        return md
          .replace(/\\n\\n/g, '</p><p>')
          .replace(/\\n/g, '<br>')
          .replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>')
          .replace(/\\*(.+?)\\*/g, '<em>$1</em>')
          .replace(/\\[(.+?)\\]\\((.+?)\\)/g, '<a href="$2">$1</a>')
          .replace(/^(.+)$/, '<p>$1</p>');
      }
    };
  `;
}

// Helper to remove import/export statements and inject version
function cleanModule(code, injectVersion = false) {
  let cleaned = code
    .replace(/import\s+.*?from\s+['"].*?['"];?/g, '')
    .replace(/import\s+['"].*?['"];?/g, '')
    .replace(/export\s+/g, '')
    .replace(/export\s*{[^}]*};?/g, '')
    .trim();
  
  // Replace __VERSION__ placeholder with actual version
  if (injectVersion) {
    cleaned = cleaned.replace(/__VERSION__/g, VERSION);
  }
  
  return cleaned;
}

// Simple JS minifier - removes comments, extra whitespace, console.logs (except version)
function minifyJS(code) {
  return code
    // Remove multi-line comments (but preserve the header)
    .replace(/\/\*\*[\s\S]*?\*\//g, (match, offset) => {
      // Keep the very first comment (header with version)
      if (offset < 100) return match;
      return '';
    })
    // Remove single-line comments
    .replace(/\/\/[^\n]*/g, '')
    // Remove console.log except the version one
    .replace(/console\.log\([^)]*\);?/g, (match) => {
      if (match.includes('Loaded successfully')) return match;
      return '';
    })
    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    // Remove spaces around operators and punctuation
    .replace(/\s*([{}();:,=<>!+\-*/%&|?])\s*/g, '$1')
    // Remove space after 'function' and 'return'
    .replace(/function\s+/g, 'function ')
    .replace(/return\s+/g, 'return ')
    // Add back necessary spaces for keywords
    .replace(/}(else|catch|finally)/g, '} $1')
    .replace(/(if|while|for|switch|catch)\(/g, '$1 (')
    .trim();
}

// Simple CSS minifier
function minifyCSS(code) {
  return code
    // Remove comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    // Remove spaces around selectors and properties
    .replace(/\s*([{}:;,>+~])\s*/g, '$1')
    // Remove trailing semicolons
    .replace(/;}/g, '}')
    .trim();
}

// Bundle JS (IIFE wrapper with all dependencies)
const bundledJS = `/**
 * Content Growth Widget - Standalone Bundle
 * Version: ${VERSION}
 * https://www.content-growth.com
 */
(function(window) {
  'use strict';
  
  // ===== Marked.js Library =====
  ${markedLib}
  
  // ===== Utility Functions =====
  ${cleanModule(files.utils.helpers)}
  
  // ===== API Client =====
  ${cleanModule(files.utils.apiClient)}
  
  // ===== Components =====
  ${cleanModule(files.components.contentCard)}
  ${cleanModule(files.components.contentList)}
  ${cleanModule(files.components.contentViewer)}
  
  // ===== Main Widget Class =====
  ${cleanModule(files.widget, true)}
  
  // ===== Auto-initialization =====
  ${cleanModule(files.index)}
  
  // ===== Expose to window =====
  window.ContentGrowthWidget = ContentGrowthWidget;
  
  console.log('[ContentGrowthWidget] Loaded successfully v${VERSION}');
  
})(window);
`;

// Minify the bundles
console.log('🔧 Minifying bundles...');
const minifiedJS = minifyJS(bundledJS);
const minifiedCSS = minifyCSS(css);

// Calculate sizes
const originalJSSize = bundledJS.length;
const minifiedJSSize = minifiedJS.length;
const originalCSSSize = css.length;
const minifiedCSSSize = minifiedCSS.length;

const jsSavings = ((1 - minifiedJSSize / originalJSSize) * 100).toFixed(1);
const cssSavings = ((1 - minifiedCSSSize / originalCSSSize) * 100).toFixed(1);

// Write minified files to dist/widget/
fs.writeFileSync(path.join(distDir, 'widget.js'), minifiedJS);
fs.writeFileSync(path.join(distDir, 'widget.css'), minifiedCSS);

// Write unminified files for debugging (with .dev suffix)
fs.writeFileSync(path.join(distDir, 'widget.dev.js'), bundledJS);
fs.writeFileSync(path.join(distDir, 'widget.dev.css'), css);

// Write minified to release/ folder
fs.writeFileSync(path.join(releaseDir, 'widget.js'), minifiedJS);
fs.writeFileSync(path.join(releaseDir, 'widget.css'), minifiedCSS);

console.log('✅ Widget bundled and minified successfully!');
console.log('');
console.log('📦 Production (minified):');
console.log('   dist/widget/widget.js');
console.log('   dist/widget/widget.css');
console.log('   release/widget.js');
console.log('   release/widget.css');
console.log('');
console.log('🔍 Development (unminified):');
console.log('   dist/widget/widget.dev.js');
console.log('   dist/widget/widget.dev.css');
console.log('');
console.log('📊 Bundle sizes:');
console.log(`   JS:  ${(originalJSSize / 1024).toFixed(2)} KB → ${(minifiedJSSize / 1024).toFixed(2)} KB (saved ${jsSavings}%)`);
console.log(`   CSS: ${(originalCSSSize / 1024).toFixed(2)} KB → ${(minifiedCSSSize / 1024).toFixed(2)} KB (saved ${cssSavings}%)`);
