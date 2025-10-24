/**
 * Content Growth Widget - Vanilla JavaScript
 * Can be used in any framework or vanilla JS project
 */

import { ContentGrowthWidget } from './widget.js';
import { ContentGrowthAPI } from './utils/api-client.js';

// Export main widget class
export { ContentGrowthWidget };

// Export API client for advanced usage
export { ContentGrowthAPI };

// Export helper functions
export * from './utils/helpers.js';

/**
 * Auto-initialize widgets on page load
 * Only runs if this is loaded as a script (not imported as module)
 */
if (typeof document !== 'undefined' && !import.meta.url.includes('node_modules')) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initializeWidgets();
    });
  } else {
    initializeWidgets();
  }
}

function initializeWidgets() {
  const containers = document.querySelectorAll('[data-cg-content]');
  containers.forEach(container => {
    new ContentGrowthWidget(container);
  });
}

// Default export for convenience
export default ContentGrowthWidget;
