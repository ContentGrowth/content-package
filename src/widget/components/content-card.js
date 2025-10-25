/**
 * Content Card Component
 * Displays a single content item in compact or expanded mode
 */
import { formatDate, calculateReadingTime, escapeHtml } from '../utils/helpers.js';

export class ContentCard {
  constructor(article, options = {}) {
    this.article = article;
    this.displayMode = options.displayMode || 'compact';
    this.viewerMode = options.viewerMode || 'inline';
    this.externalUrlPattern = options.externalUrlPattern || '/article/{id}';
    this.externalTarget = options.externalTarget || 'article-{id}';
    this.onExpand = options.onExpand || null;
    this.onClick = options.onClick || null;
  }

  /**
   * Render the content card
   */
  render() {
    // Map display modes: compact/comfortable/spacious all use compact layout
    // expanded shows summary
    const layoutMode = this.displayMode === 'expanded' ? 'expanded' : 'compact';
    
    // For external mode, wrap in <a> tag
    if (this.viewerMode === 'external') {
      const link = document.createElement('a');
      link.className = `cg-card cg-card--${this.displayMode}`;
      link.dataset.contentId = this.article.uuid;
      
      // Generate URL and target - support both {id} and {slug} placeholders
      let url = this.externalUrlPattern
        .replace('{id}', this.article.uuid)
        .replace('{slug}', this.article.slug || this.article.uuid);
      
      let target = this.externalTarget
        .replace('{id}', this.article.uuid)
        .replace('{slug}', this.article.slug || this.article.uuid);
      
      link.href = url;
      link.target = target;
      link.rel = 'noopener'; // Security best practice
      
      if (layoutMode === 'compact') {
        link.innerHTML = this.renderCompact();
      } else {
        link.innerHTML = this.renderExpanded();
      }
      
      // Add expand button handler
      const expandBtn = link.querySelector('.cg-expand-btn');
      if (expandBtn && this.onExpand) {
        expandBtn.addEventListener('click', (e) => {
          e.preventDefault(); // Prevent link navigation
          e.stopPropagation();
          this.onExpand(this.article, link);
        });
      }
      
      return link;
    }
    
    // For inline/modal mode, use regular article element
    const card = document.createElement('article');
    card.className = `cg-card cg-card--${this.displayMode}`;
    card.dataset.contentId = this.article.uuid;

    if (layoutMode === 'compact') {
      card.innerHTML = this.renderCompact();
    } else {
      card.innerHTML = this.renderExpanded();
    }

    // Add click handler for the whole card
    card.addEventListener('click', (e) => {
      // Don't trigger if clicking expand button
      if (e.target.closest('.cg-expand-btn')) return;
      
      if (this.onClick) {
        this.onClick(this.article);
      }
    });

    // Add expand button handler if in compact mode
    const expandBtn = card.querySelector('.cg-expand-btn');
    if (expandBtn && this.onExpand) {
      expandBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.onExpand(this.article, card);
      });
    }

    return card;
  }

  /**
   * Render compact mode (title, meta only)
   */
  renderCompact() {
    const readingTime = calculateReadingTime(this.article.wordCount);
    
    return `
      <div class="cg-card-header">
        <h3 class="cg-card-title">${escapeHtml(this.article.title)}</h3>
        <button class="cg-expand-btn" aria-label="Show more" title="Show summary">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
      <div class="cg-card-meta">
        <span class="cg-meta-item cg-author">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 7C8.65685 7 10 5.65685 10 4C10 2.34315 8.65685 1 7 1C5.34315 1 4 2.34315 4 4C4 5.65685 5.34315 7 7 7Z" stroke="currentColor" stroke-width="1.5"/>
            <path d="M13 13C13 10.7909 10.3137 9 7 9C3.68629 9 1 10.7909 1 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          ${escapeHtml(this.article.authorName)}
        </span>
        <span class="cg-meta-item cg-date">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="2" width="12" height="11" rx="2" stroke="currentColor" stroke-width="1.5"/>
            <path d="M4 1V3M10 1V3M1 5H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          ${formatDate(this.article.publishedAt)}
        </span>
        <span class="cg-meta-item cg-reading-time">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.5"/>
            <path d="M7 3.5V7L9.5 9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          ${readingTime}
        </span>
      </div>
    `;
  }

  /**
   * Render expanded mode (with summary and tags)
   */
  renderExpanded() {
    const readingTime = calculateReadingTime(this.article.wordCount);
    const summary = this.article.summary || '';
    const tags = this.article.tags || [];
    
    return `
      <div class="cg-card-header">
        <h3 class="cg-card-title">${escapeHtml(this.article.title)}</h3>
        <button class="cg-expand-btn cg-expand-btn--collapse" aria-label="Show less" title="Hide summary">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 10L8 6L4 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
      
      ${summary ? `
        <div class="cg-card-summary">
          <p>${escapeHtml(summary)}</p>
        </div>
      ` : ''}
      
      ${tags.length > 0 ? `
        <div class="cg-card-tags">
          ${tags.map(tag => `
            <span class="cg-tag">${escapeHtml(tag)}</span>
          `).join('')}
        </div>
      ` : ''}
      
      <div class="cg-card-meta">
        <span class="cg-meta-item cg-author">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 7C8.65685 7 10 5.65685 10 4C10 2.34315 8.65685 1 7 1C5.34315 1 4 2.34315 4 4C4 5.65685 5.34315 7 7 7Z" stroke="currentColor" stroke-width="1.5"/>
            <path d="M13 13C13 10.7909 10.3137 9 7 9C3.68629 9 1 10.7909 1 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          ${escapeHtml(this.article.authorName)}
        </span>
        <span class="cg-meta-item cg-date">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="2" width="12" height="11" rx="2" stroke="currentColor" stroke-width="1.5"/>
            <path d="M4 1V3M10 1V3M1 5H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          ${formatDate(this.article.publishedAt)}
        </span>
        <span class="cg-meta-item cg-reading-time">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.5"/>
            <path d="M7 3.5V7L9.5 9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          ${readingTime}
        </span>
      </div>
    `;
  }
}
