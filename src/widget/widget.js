/**
 * Content Growth Widget
 * Main widget class that combines list and viewer
 */
import { ContentGrowthAPI } from './utils/api-client.js';
import { ContentList } from './components/content-list.js';
import { ContentViewer } from './components/content-viewer.js';

export class ContentGrowthWidget {
  constructor(container, config) {
    console.log('[ContentGrowthWidget] Constructor called with config:', config);
    
    this.container = typeof container === 'string' 
      ? document.querySelector(container)
      : container;
    
    if (!this.container) {
      throw new Error('Container not found');
    }

    this.config = {
      apiKey: config.apiKey || config['api-key'],
      baseUrl: config.baseUrl || 'https://api.content-growth.com',
      tags: this.parseTags(config.tags),
      theme: config.theme || 'light',
      layoutMode: config.layoutMode || config['layout-mode'] || 'cards', // 'cards' or 'rows'
      displayMode: config.displayMode || config['display-mode'] || 'comfortable',
      viewerMode: config.viewerMode || config['viewer-mode'] || 'inline', // 'inline' | 'modal' | 'external'
      externalUrlPattern: config.externalUrlPattern || config['external-url-pattern'] || '/article/{id}',
      externalTarget: config.externalTarget || config['external-target'] || 'article-{id}', // Tab name with {id}
      pageSize: config.pageSize || config['page-size'] || 12,
      mode: config.mode || 'list', // 'list' or 'article-only'
      articleId: config.articleId || config['article-id'], // Article ID for article-only mode
      slug: config.slug // Article slug for article-only mode (alternative to articleId)
    };

    console.log('[ContentGrowthWidget] Final config:', this.config);

    if (!this.config.apiKey) {
      throw new Error('API key is required');
    }

    console.log('[ContentGrowthWidget] Creating API client with baseUrl:', this.config.baseUrl);
    this.api = new ContentGrowthAPI({
      apiKey: this.config.apiKey,
      baseUrl: this.config.baseUrl
    });

    this.currentView = 'list'; // 'list' or 'viewer'
    this.contentList = null;
    this.contentViewer = null;

    this.init();
  }

  /**
   * Initialize the widget
   */
  init() {
    console.log('[ContentGrowthWidget] Initializing widget...');
    // Apply theme
    this.container.classList.add('cg-widget');
    this.container.setAttribute('data-theme', this.config.theme);

    // Check if article-only mode
    if (this.config.mode === 'article-only') {
      if (this.config.slug) {
        console.log('[ContentGrowthWidget] Article-only mode, loading article by slug:', this.config.slug);
        this.showPostInlineBySlug(this.config.slug);
      } else if (this.config.articleId) {
        console.log('[ContentGrowthWidget] Article-only mode, loading article by ID:', this.config.articleId);
        this.showPostInline(this.config.articleId);
      }
    } else {
      // Create views
      this.showList();
    }
    console.log('[ContentGrowthWidget] Widget initialized');
  }

  /**
   * Show the list view
   */
  showList() {
    console.log('[ContentGrowthWidget] Showing list view...');
    this.currentView = 'list';
    this.container.innerHTML = '';

    const listContainer = document.createElement('div');
    listContainer.className = 'cg-list-view';
    this.container.appendChild(listContainer);

    console.log('[ContentGrowthWidget] Creating ContentList with options:', {
      layoutMode: this.config.layoutMode,
      displayMode: this.config.displayMode,
      pageSize: this.config.pageSize,
      tags: this.config.tags
    });

    this.contentList = new ContentList(listContainer, this.api, {
      layoutMode: this.config.layoutMode,
      displayMode: this.config.displayMode,
      pageSize: this.config.pageSize,
      tags: this.config.tags,
      viewerMode: this.config.viewerMode,
      externalUrlPattern: this.config.externalUrlPattern,
      externalTarget: this.config.externalTarget,
      onArticleClick: (article) => this.showPost(article.uuid)
    });

    this.contentList.init();
  }

  /**
   * Show the content viewer
   */
  showPost(uuid) {
    this.currentView = 'viewer';

    if (this.config.viewerMode === 'modal') {
      this.showPostModal(uuid);
    } else {
      this.showPostInline(uuid);
    }
  }

  /**
   * Show content inline (replaces list)
   */
  showPostInline(uuid) {
    this.container.innerHTML = '';

    const viewerContainer = document.createElement('div');
    viewerContainer.className = 'cg-viewer-view';
    this.container.appendChild(viewerContainer);

    // In article-only mode, don't show back button (no list to go back to)
    const showBackButton = this.config.mode !== 'article-only';

    this.contentViewer = new ContentViewer(viewerContainer, this.api, {
      displayMode: 'inline',
      showBackButton: showBackButton,
      onBack: showBackButton ? () => this.showList() : null
    });

    this.contentViewer.loadArticle(uuid);
  }

  /**
   * Show content inline by slug (replaces list)
   */
  showPostInlineBySlug(slug) {
    this.container.innerHTML = '';

    const viewerContainer = document.createElement('div');
    viewerContainer.className = 'cg-viewer-view';
    this.container.appendChild(viewerContainer);

    // In article-only mode, don't show back button (no list to go back to)
    const showBackButton = this.config.mode !== 'article-only';

    this.contentViewer = new ContentViewer(viewerContainer, this.api, {
      displayMode: 'inline',
      showBackButton: showBackButton,
      onBack: showBackButton ? () => this.showList() : null
    });

    this.contentViewer.loadArticleBySlug(slug);
  }

  /**
   * Show content in modal
   */
  showPostModal(uuid) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'cg-modal';
    // Apply theme to modal
    if (this.config.theme) {
      modal.setAttribute('data-theme', this.config.theme);
    }
    modal.innerHTML = `
      <div class="cg-modal-overlay"></div>
      <div class="cg-modal-content">
        <button class="cg-modal-close" aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        <div class="cg-modal-body"></div>
      </div>
    `;

    document.body.appendChild(modal);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Load content
    const modalBody = modal.querySelector('.cg-modal-body');
    this.contentViewer = new ContentViewer(modalBody, this.api, {
      displayMode: 'modal',
      onBack: () => this.closeModal(modal)
    });

    this.contentViewer.loadArticle(uuid);

    // Close handlers
    const closeBtn = modal.querySelector('.cg-modal-close');
    const overlay = modal.querySelector('.cg-modal-overlay');

    const closeModal = () => this.closeModal(modal);
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    // ESC key
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', handleEsc);
      }
    };
    document.addEventListener('keydown', handleEsc);

    // Fade in
    requestAnimationFrame(() => {
      modal.classList.add('cg-modal--active');
    });
  }

  /**
   * Close modal
   */
  closeModal(modal) {
    modal.classList.remove('cg-modal--active');
    
    setTimeout(() => {
      modal.remove();
      document.body.style.overflow = '';
    }, 300); // Match CSS transition duration
  }

  /**
   * Parse tags from string or array
   */
  parseTags(tags) {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags;
    return tags.split(',').map(t => t.trim()).filter(Boolean);
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig) {
    Object.assign(this.config, newConfig);
    this.init();
  }

  /**
   * Destroy the widget
   */
  destroy() {
    this.container.innerHTML = '';
    this.container.classList.remove('cg-widget');
    this.container.removeAttribute('data-theme');
  }
}
