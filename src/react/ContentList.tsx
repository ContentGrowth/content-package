/**
 * React ContentList Component
 * Displays a list of articles with pagination
 */

import React, { useEffect, useState } from 'react';
import { ContentGrowthClient } from '../core/client.js';
import { formatDate, calculateReadingTime } from '../core/utils.js';
import type { ContentListProps, Article } from '../types/index.js';

export interface ReactContentListProps extends Omit<ContentListProps, 'class'> {
  className?: string;
}

export const ContentList: React.FC<ReactContentListProps> = ({
  apiKey,
  baseUrl,
  layout = 'cards',
  displayMode = 'comfortable',
  theme = 'light',
  pageSize = 12,
  tags = [],
  category,
  showPagination = true,
  linkPattern = '/articles/{uuid}',
  showTags = false,
  showAiSummary = true,
  summaryMaxLength,
  linkTarget,
  className = ''
}) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const client = new ContentGrowthClient({ apiKey, baseUrl });

        // Process tags
        let processedTags: string[] | undefined;
        const tagsProp = tags as string[] | string | undefined;
        if (tagsProp) {
          if (Array.isArray(tagsProp)) {
            processedTags = tagsProp;
          } else if (typeof tagsProp === 'string') {
            processedTags = tagsProp.split(',').map((t: string) => t.trim()).filter(Boolean);
          }
        }

        const result = await client.listArticles({
          page: currentPage,
          limit: pageSize,
          tags: processedTags,
          category
        });

        setArticles(result.articles);
        setTotalPages(result.pagination.totalPages);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey, baseUrl, currentPage, pageSize, JSON.stringify(tags), category]);

  // Truncate summary text
  const truncateSummary = (text: string | null, maxLength?: number): string => {
    if (!text) return '';
    if (!maxLength || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  // Build article URL from pattern
  const buildArticleUrl = (article: Article): string => {
    return linkPattern
      .replace('{uuid}', article.uuid)
      .replace('{slug}', article.slug)
      .replace('{category}', article.category || '');
  };

  // Build link target from pattern
  const buildLinkTarget = (article: Article): string | undefined => {
    if (!linkTarget) return undefined;
    return linkTarget
      .replace('{uuid}', article.uuid)
      .replace('{id}', article.uuid);
  };

  if (loading) {
    return (
      <div className={`cg-content-list cg-layout-${layout} cg-display-${displayMode} cg-theme-${theme} ${className}`}>
        <div className="cg-empty-state">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`cg-content-list cg-layout-${layout} cg-display-${displayMode} cg-theme-${theme} ${className}`}
      data-cg-widget="list"
    >
      {articles.length === 0 ? (
        <div className="cg-empty-state">
          <p>No articles found.</p>
        </div>
      ) : (
        <>
          <div className={`cg-articles-grid ${layout === 'cards' ? 'cg-grid' : 'cg-list'}`}>
            {articles.map((article) => {
              const articleUrl = buildArticleUrl(article);
              const articleTarget = buildLinkTarget(article);
              const readingTime = calculateReadingTime(article.wordCount);
              const publishedDate = formatDate(article.publishedAt);

              return (
                <article key={article.uuid} className="cg-article-card">
                  <a href={articleUrl} target={articleTarget} className="cg-card-link">
                    <div className="cg-card-content">
                      {article.category && (
                        <div className="cg-card-category">
                          <span className="cg-category-badge">{article.category}</span>
                        </div>
                      )}

                      <h2 className="cg-card-title">{article.title}</h2>

                      {showAiSummary && article.summary && (
                        <p className="cg-card-summary">{truncateSummary(article.summary, summaryMaxLength)}</p>
                      )}

                      <div className="cg-card-meta">
                        <span className="cg-meta-author">{article.authorName}</span>
                        <span className="cg-meta-separator">•</span>
                        <time className="cg-meta-date" dateTime={new Date(article.publishedAt * 1000).toISOString()}>
                          {publishedDate}
                        </time>
                        <span className="cg-meta-separator">•</span>
                        <span className="cg-meta-reading-time">{readingTime}</span>
                      </div>

                      {showTags && article.tags && article.tags.length > 0 && (
                        <div className="cg-card-tags">
                          {article.tags.map((tag) => (
                            <span key={tag} className="cg-tag">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </a>
                </article>
              );
            })}
          </div>

          {showPagination && totalPages > 1 && (
            <div className="cg-pagination">
              <button
                className="cg-pagination-btn"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <span className="cg-pagination-info">
                Page {currentPage} of {totalPages}
              </span>

              <button
                className="cg-pagination-btn"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ContentList;
