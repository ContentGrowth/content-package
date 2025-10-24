/**
 * React BlogPost Component
 * Displays a single article with full content
 */

import React, { useEffect, useRef } from 'react';
import { ContentGrowthWidget } from '../widget/widget.js';
import type { BlogPostProps } from '../types/index.js';

export interface ReactBlogPostProps extends Omit<BlogPostProps, 'class'> {
  className?: string;
}

export const BlogPost: React.FC<ReactBlogPostProps> = ({
  apiKey,
  uuid,
  baseUrl,
  theme = 'light',
  showBackButton = false,
  backUrl = '/articles',
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<ContentGrowthWidget | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize widget in article-only mode
    widgetRef.current = new ContentGrowthWidget(containerRef.current, {
      apiKey,
      baseUrl,
      theme,
      mode: 'article-only',
      articleId: uuid
    });

    // Cleanup on unmount
    return () => {
      if (widgetRef.current && containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [apiKey, uuid, baseUrl, theme]);

  return (
    <div
      ref={containerRef}
      className={`cg-blog-post cg-theme-${theme} ${className}`}
      data-cg-widget="post"
    />
  );
};

export default BlogPost;
