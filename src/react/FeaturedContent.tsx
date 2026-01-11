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

    return (
        <div className={`cg-widget cg-content-viewer ${className}`}>
            <article className="cg-article">
                {showCategory && article.category && (
                    <div className="cg-article-category">{article.category}</div>
                )}

                <h1 className="cg-article-title">{article.title}</h1>

                <div className="cg-article-meta">
                    <span className="cg-author">{article.authorName}</span>
                    <span className="cg-date">
                        {new Date(article.publishedAt * 1000).toLocaleDateString()}
                    </span>
                    <span className="cg-read-time">
                        {Math.ceil(article.wordCount / 200)} min read
                    </span>
                </div>

                {showAiSummary && article.summary && (
                    <div className="cg-ai-summary">
                        <div className="cg-ai-label">AI Summary</div>
                        <p>{article.summary}</p>
                    </div>
                )}

                {/* Content */}
                <div
                    className="cg-article-content"
                    dangerouslySetInnerHTML={{ __html: marked(article.content) }}
                />

                {/* Tags */}
                {showTags && article.tags && article.tags.length > 0 && (
                    <div className="cg-article-tags">
                        {article.tags.map(tag => (
                            <span key={tag} className="cg-tag">#{tag}</span>
                        ))}
                    </div>
                )}
            </article>
        </div>
    );
};
