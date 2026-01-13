import React, { useEffect, useState } from 'react';
import { ContentGrowthClient } from '../core/client';
import { formatDate, calculateReadingTime } from '../core/utils';
import type { Article, ArticleWithContent } from '../types';

export interface ContentCardProps {
    /**
     * Pre-loaded article data (bypasses API fetch)
     */
    article?: Article | ArticleWithContent;

    /**
     * Load specific article by slug
     */
    slug?: string;

    /**
     * Load specific article by UUID
     */
    uuid?: string;

    /**
     * API key (required if fetching article)
     */
    apiKey?: string;

    /**
     * API base URL
     */
    baseUrl?: string;

    /**
     * URL pattern for the article link
     * @default '/articles/{slug}'
     */
    linkPattern?: string;

    /**
     * Link target attribute
     */
    linkTarget?: string;

    /**
     * Show article summary
     * @default true
     */
    showSummary?: boolean;

    /**
     * Maximum length of summary text
     */
    summaryMaxLength?: number;

    /**
     * Show article tags
     * @default false
     */
    showTags?: boolean;

    /**
     * Show article category
     * @default true
     */
    showCategory?: boolean;

    /**
     * Additional CSS class
     */
    className?: string;
}

export const ContentCard: React.FC<ContentCardProps> = ({
    apiKey,
    baseUrl,
    article: providedArticle,
    slug,
    uuid,
    linkPattern = '/articles/{slug}',
    linkTarget,
    showSummary = true,
    summaryMaxLength,
    showTags = false,
    showCategory = true,
    className = ''
}) => {
    const [article, setArticle] = useState<Article | ArticleWithContent | null>(providedArticle || null);
    const [loading, setLoading] = useState(!providedArticle && !!(apiKey && (slug || uuid)));
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // If article is provided, use it directly
        if (providedArticle) {
            setArticle(providedArticle);
            setLoading(false);
            return;
        }

        // Need API key and identifier to fetch
        if (!apiKey || (!slug && !uuid)) {
            setLoading(false);
            return;
        }

        const fetchArticle = async () => {
            setLoading(true);
            try {
                const client = new ContentGrowthClient({ apiKey, baseUrl });

                if (uuid) {
                    const fetchedArticle = await client.getArticle(uuid);
                    setArticle(fetchedArticle);
                } else if (slug) {
                    const fetchedArticle = await client.getArticleBySlug(slug);
                    setArticle(fetchedArticle);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load article');
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [apiKey, baseUrl, providedArticle, uuid, slug]);

    // Generate article URL
    const getArticleUrl = (article: Article | ArticleWithContent) => {
        return linkPattern
            .replace('{uuid}', article.uuid || '')
            .replace('{slug}', article.slug || article.uuid || '')
            .replace('{category}', article.category || 'uncategorized');
    };

    // Truncate summary text
    const truncateSummary = (text: string | null, maxLength?: number): string => {
        if (!text) return '';
        if (!maxLength || text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    };

    if (loading) {
        return (
            <div className={`cg-widget cg-loading ${className}`}>
                <div className="cg-spinner"></div>
            </div>
        );
    }

    if (error || !article) {
        if (error) {
            return (
                <div className={`cg-widget cg-error ${className}`}>
                    {error}
                </div>
            );
        }
        return null;
    }

    const readingTime = calculateReadingTime(article.wordCount);
    const publishedDate = formatDate(article.publishedAt);

    return (
        <article className={`cg-article-card ${className}`}>
            <a href={getArticleUrl(article)} target={linkTarget} className="cg-card-link">
                <div className="cg-card-content">
                    {showCategory && article.category && (
                        <div className="cg-card-category">
                            <span className="cg-category-badge">{article.category}</span>
                        </div>
                    )}

                    <h2 className="cg-card-title">{article.title}</h2>

                    {showSummary && article.summary && (
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
};

export default ContentCard;
