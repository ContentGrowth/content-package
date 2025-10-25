/**
 * Type declarations for ContentGrowthWidget
 */

export interface WidgetConfig {
  apiKey: string;
  baseUrl?: string;
  layoutMode?: 'cards' | 'rows';
  displayMode?: 'compact' | 'comfortable' | 'spacious';
  theme?: 'light' | 'dark';
  pageSize?: number;
  tags?: string[];
  category?: string;
  viewerMode?: 'inline' | 'modal' | 'external';
  mode?: 'list' | 'article-only';
  uuid?: string;
  slug?: string;
  articleId?: string; // Legacy support for uuid
}

export class ContentGrowthWidget {
  constructor(container: HTMLElement, config: WidgetConfig);
  destroy(): void;
}
