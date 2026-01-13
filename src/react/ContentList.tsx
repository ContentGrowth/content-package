/**
 * React ContentList Component
 * Displays a list of articles with pagination
 */

import React, { useEffect, useState } from 'react';
import { ContentGrowthClient } from '../core/client.js';
import { FeaturedCard } from './FeaturedCard.js';
import { ContentCard } from './ContentCard.js';
import type { ContentListProps, Article } from '../types/index.js';

export interface ReactContentListProps extends Omit<ContentListProps, 'class'> {
  className?: string;
}

export const ContentList: React.FC<ReactContentListProps> = ({
  apiKey,
  baseUrl,
  layout = 'cards',
  displayMode = 'comfortable',
  displayAs = 'default',
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
  featuredCardLayout,
  borderStyle,
  borderColor,
  itemsBackground,
  showCategory = true,
  className = ''
}) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const isFeaturedCardsMode = displayAs === 'featured-cards';

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
      className={`cg-content-list cg-layout-${layout} cg-display-${displayMode} cg-theme-${theme} ${isFeaturedCardsMode ? 'cg-featured-cards-list' : ''} ${className}`}
      data-cg-widget="list"
    >
      {articles.length === 0 ? (
        <div className="cg-empty-state">
          <p>No articles found.</p>
        </div>
      ) : (
        <>
          <div className={`cg-articles-grid ${isFeaturedCardsMode ? (layout === 'rows' ? 'cg-featured-cards-list' : 'cg-featured-cards-grid') : (layout === 'cards' ? 'cg-grid' : 'cg-list')}`}>
            {articles.map((article) => {
              const articleTarget = buildLinkTarget(article);

              // Featured Cards Mode - Use FeaturedCard component
              if (isFeaturedCardsMode) {
                return (
                  <FeaturedCard
                    key={article.uuid}
                    article={article}
                    linkPattern={linkPattern}
                    linkTarget={articleTarget}
                    showCategory={showCategory}
                    layout={featuredCardLayout}
                    borderStyle={borderStyle}
                    borderColor={borderColor}
                    itemsBackground={itemsBackground}
                  />
                );
              }

              // Default Card Mode - Use ContentCard component
              return (
                <ContentCard
                  key={article.uuid}
                  article={article}
                  linkPattern={linkPattern}
                  linkTarget={articleTarget}
                  showSummary={showAiSummary}
                  summaryMaxLength={summaryMaxLength}
                  showTags={showTags}
                  showCategory={showCategory}
                  borderStyle={borderStyle}
                  borderColor={borderColor}
                />
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

