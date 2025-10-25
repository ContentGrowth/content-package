/**
 * Content Viewer Component
 * Displays full content with markdown rendering
 */
import { formatDate, calculateReadingTime, escapeHtml } from '../utils/helpers.js';
import { marked } from 'marked';

export class ContentViewer {
  constructor(container, api, options = {}) {
    this.container = container;
    this.api = api;
    this.options = {
      displayMode: options.displayMode || 'inline', // 'inline' or 'modal'
      showBackButton: options.showBackButton !== false, // Default true, can be disabled
      showSummary: options.showSummary !== false, // Default true, can be disabled
      onBack: options.onBack || null
    };
    
    this.article = null;
    this.loading = false;
    this.summaryExpanded = true; // Summary visible by default
  }

  /**
   * Load and display an article by UUID
   */
  async loadArticle(uuid) {
    if (this.loading) return;
    
    this.loading = true;
    this.showLoading();

    try {
      this.article = await this.api.fetchArticle(uuid);
      this.render();
    } catch (error) {
      this.showError('Failed to load article. Please try again.');
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Load and display an article by slug
   */
  async loadArticleBySlug(slug) {
    if (this.loading) return;
    
    this.loading = true;
    this.showLoading();

    try {
      this.article = await this.api.fetchArticleBySlug(slug);
      this.render();
    } catch (error) {
      this.showError('Failed to load article. Please try again.');
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Render the article
   */
  render() {
    if (!this.article) return;

    const readingTime = calculateReadingTime(this.article.wordCount || this.article.content);
    const content = this.renderMarkdown(this.article.content || '');

    this.container.innerHTML = `
      <div class="cg-content-viewer">
        ${this.options.showBackButton ? `
        <div class="cg-viewer-header">
          <button class="cg-back-btn">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12 16L6 10L12 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Back to list
          </button>
        </div>
        ` : ''}
        
        <article class="cg-viewer-content">
          <header class="cg-post-title-section">
            <h1 class="cg-post-title">${escapeHtml(this.article.title)}</h1>
            
            ${this.options.showSummary && this.article.summary && this.article.category !== 'announce' ? `
            <div class="cg-ai-summary ${this.summaryExpanded ? 'expanded' : 'collapsed'}">
              <div class="cg-ai-summary-header">
                <div class="cg-ai-summary-label">
                  <svg class="cg-ai-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>AI Generated Summary</span>
                </div>
                <button class="cg-summary-toggle" aria-label="Toggle summary">
                  <svg class="cg-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6l4 4 4-4" />
                  </svg>
                </button>
              </div>
              <div class="cg-ai-summary-content">
                <p>${escapeHtml(this.article.summary)}</p>
              </div>
            </div>
            ` : ''}
            
            <div class="cg-post-meta">
              <span class="cg-meta-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 8C9.65685 8 11 6.65685 11 5C11 3.34315 9.65685 2 8 2C6.34315 2 5 3.34315 5 5C5 6.65685 6.34315 8 8 8Z" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M14 14C14 11.7909 11.3137 10 8 10C4.68629 10 2 11.7909 2 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                ${escapeHtml(this.article.authorName)}
              </span>
              <span class="cg-meta-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M5 2V4M11 2V4M2 6H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                ${formatDate(this.article.publishedAt)}
              </span>
              <span class="cg-meta-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M8 4V8L10.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                ${readingTime}
              </span>
            </div>
          </header>
          
          <div class="cg-post-body">
            ${content}
          </div>
        </article>
      </div>
    `;

    // Add back button handler if button exists
    if (this.options.showBackButton) {
      const backBtn = this.container.querySelector('.cg-back-btn');
      if (backBtn) {
        backBtn.addEventListener('click', () => this.handleBack());
      }
    }
    
    // Add summary toggle handler
    const summaryToggle = this.container.querySelector('.cg-summary-toggle');
    if (summaryToggle) {
      summaryToggle.addEventListener('click', () => this.toggleSummary());
    }
  }
  
  /**
   * Toggle AI summary visibility
   */
  toggleSummary() {
    this.summaryExpanded = !this.summaryExpanded;
    const summaryEl = this.container.querySelector('.cg-ai-summary');
    if (summaryEl) {
      if (this.summaryExpanded) {
        summaryEl.classList.add('expanded');
        summaryEl.classList.remove('collapsed');
      } else {
        summaryEl.classList.add('collapsed');
        summaryEl.classList.remove('expanded');
      }
    }
  }

  /**
   * Render markdown content to HTML
   */
  renderMarkdown(markdown) {
    // Configure marked
    marked.setOptions({
      breaks: true,
      gfm: true,
      headerIds: true,
      mangle: false
    });

    try {
      return marked.parse(markdown);
    } catch (error) {
      console.error('Markdown parsing error:', error);
      return `<p>${escapeHtml(markdown)}</p>`;
    }
  }

  /**
   * Handle back button click
   */
  handleBack() {
    if (this.options.onBack) {
      this.options.onBack();
    }
  }

  /**
   * Show loading state
   */
  showLoading() {
    this.container.innerHTML = `
      <div class="cg-content-viewer">
        <div class="cg-viewer-loading">
          <div class="cg-spinner"></div>
          <p>Loading article...</p>
        </div>
      </div>
    `;
  }

  /**
   * Show error message
   */
  showError(message) {
    this.container.innerHTML = `
      <div class="cg-content-viewer">
        <div class="cg-viewer-error">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="2"/>
            <path d="M24 16V26M24 32V32.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <p>${message}</p>
          ${this.options.showBackButton ? '<button class="cg-back-btn">Back to articles</button>' : ''}
        </div>
      </div>
    `;

    if (this.options.showBackButton) {
      const backBtn = this.container.querySelector('.cg-back-btn');
      if (backBtn) {
        backBtn.addEventListener('click', () => this.handleBack());
      }
    }
  }

  /**
   * Clear the post view
   */
  clear() {
    this.container.innerHTML = '';
    this.article = null;
  }
}
