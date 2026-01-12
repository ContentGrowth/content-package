import React, { useEffect, useState } from 'react';
import { marked } from 'marked';
import { ContentGrowthClient } from '../core/client';
import type { FeaturedContentProps, ArticleWithContent } from '../types';

interface FeaturedCardProps extends Omit<FeaturedContentProps, 'showBackButton' | 'backUrl' | 'showAiSummary' | 'showTags'> {
    /**
     * URL pattern for the article link
     * Supports placeholders: {uuid}, {slug}, {category}
     * @default '/articles/{slug}'
     */
    linkPattern?: string;

    /**
     * Show reading time
     * @default false
     */
    showReadingTime?: boolean;

    /**
     * Show author
     * @default false
     */
    showAuthor?: boolean;

    /**
     * Text for the Call to Action link
     * @default "Read full story"
     */
    ctaText?: string;

    /**
     * Link target attribute
     * @default undefined (same tab)
     */
    linkTarget?: string;

    /**
     * Layout override
     */
    layout?: 'vertical' | 'horizontal';

    /**
     * Border style
     * @default 'none'
     */
    borderStyle?: 'none' | 'line' | 'dashed';

    /**
     * Border color (CSS color value)
     * @default '#e5e7eb'
     */
    borderColor?: string;

    /**
     * Card background color (CSS color value, 'none' for transparent)
     * @default 'none'
     */
    cardBackground?: string;

    /**
     * Background color for list/quote section (the items area)
     * @default '#f3f4f6'
     */
    itemsBackground?: string;
}

export const FeaturedCard: React.FC<FeaturedCardProps> = ({
    apiKey,
    baseUrl,
    tags = [],
    category,
    excludeTags = [],
    showCategory = true,
    showReadingTime = false,
    showAuthor = false,
    ctaText: propCtaText,
    linkPattern = '/articles/{slug}',
    linkTarget,
    layout: propLayout,
    borderStyle = 'none',
    borderColor = '#e5e7eb',
    cardBackground = 'none',
    itemsBackground = '#f3f4f6',
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
                setError(err instanceof Error ? err.message : 'Failed to load featured article');
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [apiKey, baseUrl, category, JSON.stringify(tags), JSON.stringify(excludeTags)]);

    // Generate article URL
    const getArticleUrl = (article: ArticleWithContent) => {
        return linkPattern
            .replace('{uuid}', article.uuid || '')
            .replace('{slug}', article.slug || article.uuid || '')
            .replace('{category}', article.category || 'uncategorized');
    };

    // Render featured summary (or fallback to regular summary) as HTML
    const getSummaryHtml = (article: ArticleWithContent) => {
        const summaryText = (article as any).featuredSummary || article.summary;
        if (!summaryText) return '';
        return marked.parse(summaryText, { async: false }) as string;
    };

    if (loading) {
        return (
            <div className={`cg-widget cg-loading ${className}`}>
                <div className="cg-spinner"></div>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className={`cg-widget cg-error ${className}`}>
                {error || 'No featured content found'}
            </div>
        );
    }

    const summaryHtml = getSummaryHtml(article);
    // Explicitly use any to access dynamic properties until types are fully updated
    const layout = propLayout || (article as any).featuredSummaryLayout || 'standard';
    const readingTime = Math.ceil(article.wordCount / 200);
    const borderClass = borderStyle !== 'none' ? `cg-border-${borderStyle}` : '';

    // Use ctaText from prop, or from article data, or fallback to default
    const ctaText = propCtaText || (article as any).featuredCtaText || 'Read full story';

    const customStyles: Record<string, string> = {};
    if (borderColor !== '#e5e7eb') customStyles['--cg-card-border-color'] = borderColor;
    if (cardBackground !== 'none') customStyles['--cg-card-bg'] = cardBackground;
    if (itemsBackground !== '#f3f4f6') customStyles['--cg-items-bg'] = itemsBackground;

    return (
        <a
            href={getArticleUrl(article)}
            className={`cg-widget cg-featured-card ${className} ${layout !== 'standard' ? `cg-layout-${layout}` : ''} ${borderClass}`}
            style={Object.keys(customStyles).length > 0 ? customStyles : undefined}
            data-cg-widget="featured-card"
            target={linkTarget}
            rel={linkTarget === '_blank' ? 'noopener noreferrer' : undefined}
        >
            <article className="cg-featured-card-inner">
                {/* Header with category badge */}
                {showCategory && article.category && (
                    <div className="cg-featured-card-category">
                        <span className="cg-category-badge">{article.category}</span>
                    </div>
                )}

                {/* Title */}
                <h3 className="cg-featured-card-title">{article.title}</h3>

                {/* Featured Summary */}
                {summaryHtml && (
                    <div
                        className="cg-featured-card-summary"
                        dangerouslySetInnerHTML={{ __html: summaryHtml }}
                    />
                )}

                {/* Footer with meta info */}
                {(showAuthor || showReadingTime) && (
                    <div className="cg-featured-card-footer">
                        {showAuthor && <span className="cg-featured-card-author">{article.authorName}</span>}
                        {showAuthor && showReadingTime && (
                            <span className="cg-featured-card-separator">•</span>
                        )}
                        {showReadingTime && (
                            <span className="cg-featured-card-reading-time">
                                {readingTime} min read
                            </span>
                        )}
                    </div>
                )}

                {/* Read more indicator */}
                <div className="cg-featured-card-cta">
                    <span>{ctaText}</span>
                    <svg className="cg-featured-card-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </article>
        </a>
    );
};
