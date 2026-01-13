import React, { useEffect, useState } from 'react';
import { ContentGrowthClient } from '../core/client';
import { renderInlineMarkdown } from '../core/inline-markdown';
import type { FeaturedContentProps, ArticleWithContent, Article } from '../types';

// Summary data interface for structured JSON format
interface SummaryData {
    type: 'classic' | 'list' | 'steps' | 'quote' | 'legacy';
    title?: string;
    text?: string;
    intro?: string;
    items?: Array<{ title: string; description: string }>;
    quote?: string;
    highlight?: string;
}

// Parse featured summary - supports both JSON (new) and plain text (legacy)
const parseSummary = (article: Article | ArticleWithContent): SummaryData | null => {
    const summaryText = (article as any).featuredSummary || article.summary;
    if (!summaryText) return null;

    // Try to parse as JSON
    try {
        const parsed = JSON.parse(summaryText);
        if (parsed.type) {
            return parsed as SummaryData;
        }
    } catch (e) {
        // Not JSON, treat as legacy markdown/plain text
    }

    // Legacy fallback - render as plain text
    return {
        type: 'legacy',
        text: summaryText
    };
};

interface FeaturedCardProps extends Partial<Omit<FeaturedContentProps, 'showBackButton' | 'backUrl' | 'showAiSummary' | 'showTags'>> {
    /**
     * Pre-loaded article data (bypasses API fetch - used by ContentList)
     */
    article?: Article | ArticleWithContent;

    /**
     * Load specific article by slug (bypasses category/tags search)
     */
    slug?: string;

    /**
     * Load specific article by UUID (bypasses category/tags search)
     */
    uuid?: string;

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
    /**
     * Background color for list/quote section (the items area)
     * @default '#f3f4f6'
     */
    itemsBackground?: string;

    /**
     * Custom padding for the card content
     * @example "20px" or "0"
     */
    padding?: string;

    /**
     * Override category display text
     */
    categoryLabel?: string;
}

export const FeaturedCard: React.FC<FeaturedCardProps> = ({
    apiKey,
    baseUrl,
    article: providedArticle,
    slug,
    uuid,
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
    padding,
    categoryLabel,
    className = ''
}) => {
    const [article, setArticle] = useState<Article | ArticleWithContent | null>(providedArticle || null);
    const [loading, setLoading] = useState(!providedArticle);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // If article is provided, use it directly (no fetch needed)
        if (providedArticle) {
            setArticle(providedArticle);
            setLoading(false);
            return;
        }

        // Need API key to fetch
        if (!apiKey) {
            setLoading(false);
            return;
        }

        const fetchArticle = async () => {
            setLoading(true);
            try {
                const client = new ContentGrowthClient({ apiKey, baseUrl });
                let fetchedArticle: ArticleWithContent;

                if (uuid) {
                    // Mode 2: Load by UUID
                    fetchedArticle = await client.getArticle(uuid, { excludeTags });
                } else if (slug) {
                    // Mode 3: Load by slug
                    fetchedArticle = await client.getArticleBySlug(slug, { excludeTags });
                } else {
                    // Mode 4: Find featured article by category/tags (original behavior)
                    fetchedArticle = await client.getFeaturedArticle({
                        tags,
                        category,
                        excludeTags
                    });
                }

                setArticle(fetchedArticle);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load article');
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [apiKey, baseUrl, providedArticle, uuid, slug, category, JSON.stringify(tags), JSON.stringify(excludeTags)]);

    // Generate article URL
    const getArticleUrl = (article: Article | ArticleWithContent) => {
        return linkPattern
            .replace('{uuid}', article.uuid || '')
            .replace('{slug}', article.slug || article.uuid || '')
            .replace('{category}', article.category || 'uncategorized');
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

    const layout = propLayout || (article as any).featuredSummaryLayout || 'vertical';
    const readingTime = Math.ceil(article.wordCount / 200);
    const borderClass = borderStyle !== 'none' ? `cg-border-${borderStyle}` : '';
    const layoutClass = layout !== 'vertical' ? `cg-layout-${layout}` : '';

    // Use ctaText from prop, or from article data, or fallback to default
    const ctaText = propCtaText || (article as any).featuredCtaText || 'Read full story';

    const customStyles: Record<string, string> = {};
    if (borderColor !== '#e5e7eb') customStyles['--cg-card-border-color'] = borderColor;
    if (cardBackground !== 'none') customStyles['--cg-card-bg'] = cardBackground;
    if (itemsBackground !== '#f3f4f6') customStyles['--cg-items-bg'] = itemsBackground;
    if (padding) customStyles['--cg-card-padding'] = padding;

    const summaryData = parseSummary(article);
    const displayTitle = summaryData?.title || article.title;

    return (
        <a
            href={getArticleUrl(article)}
            className={`cg-widget cg-featured-card ${className} ${layoutClass} ${borderClass}`}
            style={Object.keys(customStyles).length > 0 ? customStyles : undefined}
            data-cg-widget="featured-card"
            target={linkTarget}
            rel={linkTarget === '_blank' ? 'noopener noreferrer' : undefined}
        >
            <article className="cg-featured-card-inner">
                <div className="cg-card-primary">
                    {/* Header with category badge */}
                    {showCategory && (categoryLabel || (article as any).categoryLabel || article.category) && (
                        <div className="cg-card-header">
                            <span className="cg-category-badge">{categoryLabel || (article as any).categoryLabel || article.category}</span>
                        </div>
                    )}

                    <h3 className="cg-card-title">{displayTitle}</h3>

                    {/* Featured Summary - Structured Rendering */}
                    {parseSummary(article) && (
                        <div className="cg-featured-card-summary">
                            {(() => {
                                const summaryData = parseSummary(article)!;

                                if (summaryData.type === 'classic') {
                                    return <p dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(summaryData.text || '') }} />;
                                }

                                if ((summaryData.type === 'list' || summaryData.type === 'steps') && summaryData.intro) {
                                    return <p dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(summaryData.intro) }} />;
                                }

                                if (summaryData.type === 'quote' && summaryData.quote) {
                                    return <p dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(summaryData.intro || '') }} />;
                                }

                                // Legacy
                                return <p>{summaryData.text}</p>;
                            })()}
                        </div>
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


                </div>

                {/* Right Panel - Structured Visual Items */}
                {(() => {
                    const summaryData = parseSummary(article);
                    if (!summaryData) return null;

                    if ((summaryData.type === 'list' || summaryData.type === 'steps') && summaryData.items) {
                        return (
                            <div className="cg-card-secondary">
                                <ul className="cg-summary-items">
                                    {summaryData.items.map((item, index) => (
                                        <li key={index}>
                                            <span className="cg-item-number">{index + 1}</span>
                                            <div className="cg-item-content">
                                                <strong className="cg-item-title" dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item.title) }} />
                                                <span className="cg-item-description" dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(item.description) }} />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    }

                    if (summaryData.type === 'quote' && summaryData.quote) {
                        return (
                            <div className="cg-card-secondary">
                                <blockquote dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(summaryData.quote) }} />
                            </div>
                        );
                    }

                    return null;
                })()}

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
