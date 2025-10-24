/**
 * React ContentList Component
 * Displays a list of articles with pagination
 */

import React, { useEffect, useRef } from 'react';
import { ContentGrowthWidget } from '../widget/widget.js';
import type { ContentListProps } from '../types/index.js';

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
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<ContentGrowthWidget | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize widget
    widgetRef.current = new ContentGrowthWidget(containerRef.current, {
      apiKey,
      baseUrl,
      layoutMode: layout,
      displayMode,
      theme,
      pageSize,
      tags: Array.isArray(tags) ? tags : [],
      category,
      mode: 'list'
    });

    // Cleanup on unmount
    return () => {
      if (widgetRef.current && containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [apiKey, baseUrl, layout, displayMode, theme, pageSize, tags, category]);

  return (
    <div
      ref={containerRef}
      className={`cg-content-list cg-layout-${layout} cg-display-${displayMode} cg-theme-${theme} ${className}`}
      data-cg-widget="list"
    />
  );
};

export default ContentList;
