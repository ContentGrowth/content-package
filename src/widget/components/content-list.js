/**
 * Content List Component
 * Displays a list of content items with pagination
 */
import { ContentCard } from './content-card.js';

export class ContentList {
  constructor(container, api, options = {}) {
    console.log('[ContentList] Constructor called with options:', options);
    this.container = container;
    this.api = api;
    this.options = {
      layoutMode: options.layoutMode || 'cards', // 'cards' or 'rows'
      displayMode: options.displayMode || 'comfortable',
      pageSize: parseInt(options.pageSize) || 12,
      tags: options.tags || [],
      category: options.category,
      aiSummaryMaxBytes: options.aiSummaryMaxBytes,
      viewerMode: options.viewerMode || 'inline', // 'inline' | 'modal' | 'external'
      externalUrlPattern: options.externalUrlPattern || '/article/{id}',
      externalTarget: options.externalTarget || 'article-{id}',
      onArticleClick: options.onArticleClick || null
    };
    
    console.log('[ContentList] Final options:', this.options);
    
    this.currentPage = 1;
    this.totalPages = 1;
    this.articles = [];
    this.loading = false;
    this.expandedCards = new Set();
  }

  /**
   * Initialize and render the list
   */
  async init() {
    console.log('[ContentList] Initializing...');
    this.render();
    await this.loadArticles();
    console.log('[ContentList] Initialization complete');
  }

  /**
   * Render the list container
   */
  render() {
    const layoutClass = this.options.layoutMode === 'rows' ? 'cg-content-rows' : 'cg-content-grid';
    
    this.container.innerHTML = `
      <div class="cg-content-list">
        <div class="cg-list-header">
          <button class="cg-display-toggle" title="Toggle display mode">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="2" width="16" height="4" rx="1" stroke="currentColor" stroke-width="1.5"/>
              <rect x="2" y="8" width="16" height="4" rx="1" stroke="currentColor" stroke-width="1.5"/>
              <rect x="2" y="14" width="16" height="4" rx="1" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            <span>${this.options.displayMode === 'compact' ? 'Show summaries' : 'Hide summaries'}</span>
          </button>
        </div>
        <div class="${layoutClass}"></div>
        <div class="cg-pagination"></div>
      </div>
    `;

    // Add toggle handler
    const toggle = this.container.querySelector('.cg-display-toggle');
    toggle.addEventListener('click', () => this.toggleDisplayMode());
  }

  /**
   * Load articles from API
   */
  async loadArticles(page = 1) {
    if (this.loading) {
      console.log('[ContentList] Already loading, skipping...');
      return;
    }
    
    console.log('[ContentList] Loading articles for page:', page);
    this.loading = true;
    this.showLoading();

    try {
      console.log('[ContentList] Calling api.fetchArticles with:', {
        page,
        limit: this.options.pageSize,
        tags: this.options.tags,
        category: this.options.category
      });
      
      const data = await this.api.fetchArticles({
        page,
        limit: this.options.pageSize,
        tags: this.options.tags,
        category: this.options.category
      });

      console.log('[ContentList] Received data:', data);
      
      this.articles = data.articles || [];
      this.currentPage = data.pagination?.page || 1;
      this.totalPages = data.pagination?.totalPages || 1;

      console.log('[ContentList] Loaded', this.articles.length, 'articles');
      
      this.renderArticles();
      this.renderPagination();
    } catch (error) {
      console.error('[ContentList] Error loading articles:', error);
      this.showError('Failed to load articles. Please try again.');
    } finally {
      this.loading = false;
    }
  }

  /**
   * Render content grid
   */
  renderArticles() {
    const grid = this.container.querySelector('.cg-content-grid, .cg-content-rows');
    
    if (this.articles.length === 0) {
      grid.innerHTML = `
        <div class="cg-empty-state">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <rect x="8" y="12" width="48" height="40" rx="4" stroke="currentColor" stroke-width="2"/>
            <path d="M16 24H48M16 32H48M16 40H32" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <p>No articles found</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = '';
    
    this.articles.forEach(article => {
      const isExpanded = this.expandedCards.has(article.uuid);
      const card = new ContentCard(article, {
        displayMode: isExpanded ? 'expanded' : this.options.displayMode,
        viewerMode: this.options.viewerMode,
        externalUrlPattern: this.options.externalUrlPattern,
        externalTarget: this.options.externalTarget,
        aiSummaryMaxBytes: this.options.aiSummaryMaxBytes,
        onExpand: (article, cardElement) => this.handleExpand(article, cardElement),
        onClick: (article) => this.handleArticleClick(article)
      });
      
      grid.appendChild(card.render());
    });
  }

  /**
   * Handle expand/collapse of a card
   */
  handleExpand(article, cardElement) {
    const isExpanded = this.expandedCards.has(article.uuid);
    
    if (isExpanded) {
      this.expandedCards.delete(article.uuid);
    } else {
      this.expandedCards.add(article.uuid);
    }
    
    // Re-render just this card
    const newCard = new ContentCard(article, {
      displayMode: isExpanded ? this.options.displayMode : 'expanded',
      viewerMode: this.options.viewerMode,
      externalUrlPattern: this.options.externalUrlPattern,
      externalTarget: this.options.externalTarget,
      onExpand: (article, cardElement) => this.handleExpand(article, cardElement),
      onClick: (article) => this.handleArticleClick(article)
    });
    
    cardElement.replaceWith(newCard.render());
  }

  /**
   * Handle article click
   */
  handleArticleClick(article) {
    if (this.options.onArticleClick) {
      this.options.onArticleClick(article);
    }
  }

  /**
   * Toggle display mode for all cards
   */
  toggleDisplayMode() {
    this.options.displayMode = this.options.displayMode === 'compact' ? 'expanded' : 'compact';
    this.expandedCards.clear(); // Reset individual expansions
    this.renderArticles();
    
    // Update button text
    const toggle = this.container.querySelector('.cg-display-toggle span');
    toggle.textContent = this.options.displayMode === 'compact' ? 'Show summaries' : 'Hide summaries';
  }

  /**
   * Render pagination controls
   */
  renderPagination() {
    const pagination = this.container.querySelector('.cg-pagination');
    
    if (this.totalPages <= 1) {
      pagination.innerHTML = '';
      return;
    }

    const prevDisabled = this.currentPage === 1;
    const nextDisabled = this.currentPage === this.totalPages;

    pagination.innerHTML = `
      <button class="cg-btn-prev" ${prevDisabled ? 'disabled' : ''}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        Previous
      </button>
      <span class="cg-page-info">Page ${this.currentPage} of ${this.totalPages}</span>
      <button class="cg-btn-next" ${nextDisabled ? 'disabled' : ''}>
        Next
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    `;

    // Add event listeners
    const prevBtn = pagination.querySelector('.cg-btn-prev');
    const nextBtn = pagination.querySelector('.cg-btn-next');

    prevBtn.addEventListener('click', () => {
      if (this.currentPage > 1) {
        this.loadArticles(this.currentPage - 1);
        this.scrollToTop();
      }
    });

    nextBtn.addEventListener('click', () => {
      if (this.currentPage < this.totalPages) {
        this.loadArticles(this.currentPage + 1);
        this.scrollToTop();
      }
    });
  }

  /**
   * Show loading state
   */
  showLoading() {
    const grid = this.container.querySelector('.cg-content-grid, .cg-content-rows');
    if (grid) {
      grid.innerHTML = `
        <div class="cg-loading">
          <div class="cg-spinner"></div>
          <p>Loading articles...</p>
        </div>
      `;
    }
  }

  /**
   * Show error message
   */
  showError(message) {
    const grid = this.container.querySelector('.cg-content-grid, .cg-content-rows');
    if (grid) {
      grid.innerHTML = `
        <div class="cg-error">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="2"/>
            <path d="M24 16V26M24 32V32.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <p>${message}</p>
          <button class="cg-retry-btn">Try Again</button>
        </div>
      `;

      const retryBtn = grid.querySelector('.cg-retry-btn');
      retryBtn.addEventListener('click', () => this.loadArticles(this.currentPage));
    }
  }

  /**
   * Scroll to top of widget
   */
  scrollToTop() {
    this.container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
