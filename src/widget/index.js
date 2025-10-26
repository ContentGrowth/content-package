/**
 * Content Growth Widget - Entry Point
 * Auto-initializes widgets on page load
 */
import { ContentGrowthWidget } from './widget.js';

// Note: CSS import is commented out for non-bundled usage
// In production, this will be bundled and the CSS will be included
// For testing, include <link rel="stylesheet" href="./styles/widget.css"> in HTML
// import './styles/widget.css';

// Auto-initialize widgets
function initWidgets() {
  const containers = document.querySelectorAll('[data-cg-content]');
  
  containers.forEach((container, index) => {
    
    const config = {
      apiKey: container.dataset.apiKey || container.dataset.cgApiKey,
      baseUrl: window.WIDGET_BASE_URL || container.dataset.baseUrl || container.dataset.cgBaseUrl,
      tags: container.dataset.tags || container.dataset.cgTags,
      theme: container.dataset.theme || container.dataset.cgTheme || 'light',
      layoutMode: container.dataset.layoutMode || container.dataset.cgLayoutMode || 'cards',
      displayMode: container.dataset.displayMode || container.dataset.cgDisplayMode || 'comfortable',
      viewerMode: container.dataset.viewerMode || container.dataset.cgViewerMode || 'inline',
      externalUrlPattern: container.dataset.externalUrlPattern || container.dataset.cgExternalUrlPattern,
      externalTarget: container.dataset.externalTarget || container.dataset.cgExternalTarget,
      pageSize: container.dataset.pageSize || container.dataset.cgPageSize || 12,
      mode: container.dataset.mode || container.dataset.cgMode || 'list',
      articleId: container.dataset.articleId || container.dataset.cgArticleId
    };

    try {
      new ContentGrowthWidget(container, config);
    } catch (error) {
      console.error(`[Widget ${index}] Failed to initialize:`, error);
      container.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: #ef4444;">
          <p>Failed to load widget: ${error.message}</p>
          <p style="font-size: 0.875rem; margin-top: 0.5rem;">Check console for details</p>
        </div>
      `;
    }
  });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWidgets);
} else {
  initWidgets();
}

// Export for manual initialization
window.ContentGrowthWidget = ContentGrowthWidget;

export { ContentGrowthWidget };
