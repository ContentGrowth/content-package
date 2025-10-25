/**
 * Simple widget bundler
 * Combines all JS and CSS files into single widget.js and widget.css
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths relative to build-widget.js location (wwwsite/src/widget/)
const srcDir = __dirname; // Current directory is src/widget
const publicDir = path.join(__dirname, '../../public'); // Go up to wwwsite/public

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

// Read CSS
const css = fs.readFileSync(path.join(srcDir, 'styles/widget.css'), 'utf8');

// Bundle JS (simple concatenation with IIFE wrapper)
const bundledJS = `
/**
 * Content Growth Widget
 * Version: 1.0.0
 * https://www.content-growth.com
 */
(function() {
  'use strict';
  
  // Marked.js minimal implementation (you'll need to add the full library)
  const marked = { parse: (md) => md.replace(/\\n/g, '<br>') };
  
  ${files.utils.helpers.replace(/export /g, '')}
  ${files.utils.apiClient.replace(/export /g, '')}
  ${files.components.contentCard.replace(/export /g, '').replace(/import.*from.*';/g, '')}
  ${files.components.contentList.replace(/export /g, '').replace(/import.*from.*';/g, '')}
  ${files.components.contentViewer.replace(/export /g, '').replace(/import.*from.*';/g, '')}
  ${files.widget.replace(/export /g, '').replace(/import.*from.*';/g, '')}
  
  // Auto-initialize
  ${files.index.replace(/export /g, '').replace(/import.*from.*';/g, '').replace(/import.*';/g, '')}
  
  // Expose to window
  window.ContentGrowthWidget = ContentGrowthWidget;
})();
`;

// Write bundled files
fs.writeFileSync(path.join(publicDir, 'widget.js'), bundledJS);
fs.writeFileSync(path.join(publicDir, 'widget.css'), css);

console.log('✅ Widget built successfully!');
console.log('   - widget.js');
console.log('   - widget.css');
