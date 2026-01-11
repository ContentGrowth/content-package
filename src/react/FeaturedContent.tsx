import React, { useEffect, useState } from 'react';
import { marked } from 'marked';
import { ContentGrowthClient } from '../core/client';
import type { FeaturedContentProps, ArticleWithContent } from '../types';

export const FeaturedContent: React.FC<FeaturedContentProps> = ({
    apiKey,
    baseUrl,
    tags = [],
    category,
    excludeTags = [],
    showAiSummary = true,
    showCategory = true,
    showTags = true,
    className = ''
}) => {
    const [article, setArticle] = useState<ArticleWithContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticle = async () => {
            setLoading(true);
            try {
                const client = new ContentGrowthClient({ apiKey, baseUrl });
                const fetchedArticle = await client.getFeaturedArticle({
                    tags,
                    category,
                    excludeTags
                });
                setArticle(fetchedArticle);
            } catch (err) {
                // 404 is valid for featured content (nothing matches criteria)
                // We'll just set article to null so nothing renders, or show optional empty state?
                // For a widget, usually empty is better than error if just no content matches.
                // But for debugging, knowing it failed is good. 
                // Let's stick to error state for now, user can handle 'No featured content found' 
                setError(err instanceof Error ? err.message : 'Failed to load featured article');
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [apiKey, baseUrl, category, JSON.stringify(tags), JSON.stringify(excludeTags)]);

    if (loading) {
        return (
            <div className={`cg-widget cg-loading ${className}`}>
                <div className="cg-spinner"></div>
            </div>
        );
    }

    if (error || !article) {
        // If specifically "No featured content found" (404), maybe we just render nothing or an empty placeholder?
        // For now render standard error container
        return (
            <div className={`cg-widget cg-error ${className}`}>
                {error || 'No featured content found'}
            </div>
        );
    }

    const contentHtml = marked(article.content);
    const publishedDate = new Date(article.publishedAt * 1000).toLocaleDateString();
    const readingTime = `${Math.ceil(article.wordCount / 200)} min read`;

    return (
        <article
            className={`cg-content-viewer ${className}`}
            data-cg-widget="post"
        >
            <header className="cg-content-header">
                {showCategory && article.category && (
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

                {showTags && article.tags && article.tags.length > 0 && (
                    <div className="cg-content-tags">
                        {article.tags.map(tag => (
                            <span key={tag} className="cg-tag">{tag}</span>
                        ))}
                    </div>
                )}
            </header>

            <div className="cg-content-body" dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </article>
    );
};
