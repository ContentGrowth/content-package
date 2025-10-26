/**
 * React ContentViewer Component
 * Displays a single article with full content
 */

import React, { useEffect, useState } from 'react';
import { ContentGrowthClient } from '../core/client.js';
import { formatDate, calculateReadingTime } from '../core/utils.js';
import { marked } from 'marked';
import type { ContentViewerProps, ArticleWithContent } from '../types/index.js';

export interface ReactContentViewerProps extends Omit<ContentViewerProps, 'class'> {
  className?: string;
}

export const ContentViewer: React.FC<ReactContentViewerProps> = ({
  apiKey,
  uuid,
  slug,
  baseUrl,
  theme = 'light',
  showBackButton = false,
  backUrl = '/articles',
  showAiSummary = true,
  className = ''
}) => {
  const [article, setArticle] = useState<ArticleWithContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!uuid && !slug) {
        setError('Either uuid or slug must be provided');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const client = new ContentGrowthClient({ apiKey, baseUrl });
        const fetchedArticle = slug
          ? await client.getArticleBySlug(slug)
          : await client.getArticle(uuid!);
        setArticle(fetchedArticle);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [apiKey, baseUrl, uuid, slug]);

  // Process markdown content to handle custom image syntax
  const processImageSyntax = (markdown: string): string => {
    // Match: ![alt](url =widthxheight)
    return markdown.replace(
      /!\[([^\]]*)\]\(([^\s)]+)\s+=(\d+)x(\d+)\)/g,
      (match, alt, url, width, height) => {
        return `![${alt}](${url})`;
      }
    );
  };

  // Configure marked to handle image attributes
  marked.use({
    renderer: {
      image(href, title, text) {
        // Extract width/height from {width="x" height="y"} syntax
        const attrMatch = text.match(/\{width="(\d+)"\s+height="(\d+)"\}/);
        if (attrMatch) {
          const cleanText = text.replace(/\{[^}]+\}/, '').trim();
          return `<img src="${href}" alt="${cleanText}" width="${attrMatch[1]}" height="${attrMatch[2]}" ${title ? `title="${title}"` : ''} />`;
        }
        return `<img src="${href}" alt="${text}" ${title ? `title="${title}"` : ''} />`;
      }
    }
  });

  if (loading) {
    return (
      <div className={`cg-content-viewer cg-theme-${theme} ${className}`}>
        <div className="cg-empty-state">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className={`cg-content-viewer cg-theme-${theme} ${className}`}>
        <div className="cg-empty-state">
          <p>{error || 'Article not found'}</p>
        </div>
      </div>
    );
  }

  const processedContent = processImageSyntax(article.content);
  const contentHtml = marked(processedContent);
  const publishedDate = formatDate(article.publishedAt);
  const readingTime = calculateReadingTime(article.wordCount);

  return (
    <article
      className={`cg-content-viewer cg-theme-${theme} ${className}`}
      data-cg-widget="post"
    >
      {showBackButton && (
        <div className="cg-content-header-back">
          <a href={backUrl} className="cg-back-btn">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12 16L6 10L12 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Back to articles
          </a>
        </div>
      )}

      <header className="cg-content-header">
        {article.category && (
          <div className="cg-content-category">
            <span className="cg-category-badge">{article.category}</span>
          </div>
        )}
        
        <h1 className="cg-content-title">{article.title}</h1>
        
        {showAiSummary && article.summary && (
          <div className="cg-ai-summary">
            <div className="cg-ai-summary-header">
              <svg className="cg-ai-summary-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="cg-ai-summary-label">AI Generated Summary</span>
            </div>
            <p className="cg-ai-summary-text">{article.summary}</p>
          </div>
        )}
        
        <div className="cg-content-meta">
          <span className="cg-info-author">{article.authorName}</span>
          <span className="cg-info-separator">•</span>
          <time className="cg-info-date" dateTime={new Date(article.publishedAt * 1000).toISOString()}>
            {publishedDate}
          </time>
          <span className="cg-info-separator">•</span>
          <span className="cg-info-reading-time">{readingTime}</span>
        </div>
        
        {article.tags.length > 0 && (
          <div className="cg-content-tags">
            {article.tags.map((tag) => (
              <span key={tag} className="cg-tag">{tag}</span>
            ))}
          </div>
        )}
      </header>

      <div className="cg-content-body" dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </article>
  );
};

export default ContentViewer;
