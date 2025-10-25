/**
 * Simple widget bundler
 * Combines all JS and CSS files into single widget.js and widget.css
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Helper to remove import/export statements
function cleanModule(code) {
  return code
    .replace(/import\s+.*?from\s+['"].*?['"];?/g, '')
    .replace(/import\s+['"].*?['"];?/g, '')
    .replace(/export\s+/g, '')
    .replace(/export\s*{[^}]*};?/g, '')
    .trim();
}

// Bundle JS (IIFE wrapper with all dependencies)
const bundledJS = `/**
 * Content Growth Widget - Standalone Bundle
 * Version: 1.1.0
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
  ${cleanModule(files.widget)}
  
  // ===== Auto-initialization =====
  ${cleanModule(files.index)}
  
  // ===== Expose to window =====
  window.ContentGrowthWidget = ContentGrowthWidget;
  
  console.log('[ContentGrowthWidget] Loaded successfully v1.1.0');
  
})(window);
`;

// Write bundled files to dist/widget/
fs.writeFileSync(path.join(distDir, 'widget.js'), bundledJS);
fs.writeFileSync(path.join(distDir, 'widget.css'), css);

// Also write to release/ folder
fs.writeFileSync(path.join(releaseDir, 'widget.js'), bundledJS);
fs.writeFileSync(path.join(releaseDir, 'widget.css'), css);

console.log('✅ Widget bundled successfully!');
console.log('   📦 dist/widget/widget.js');
console.log('   📦 dist/widget/widget.css');
console.log('   📦 release/widget.js');
console.log('   📦 release/widget.css');
console.log('');
console.log('Bundle size:');
console.log(`   JS:  ${(bundledJS.length / 1024).toFixed(2)} KB`);
console.log(`   CSS: ${(css.length / 1024).toFixed(2)} KB`);
