/**
 * Content Growth Content Widget - TypeScript Types
 */

/**
 * Article metadata
 */
export interface Article {
  uuid: string;
  slug: string;
  title: string;
  category: string | null;
  authorName: string;
  publishedAt: number;
  summary: string | null;
  tags: string[];
  wordCount: number;
}

/**
 * Full article with content
 */
export interface ArticleWithContent extends Article {
  content: string;
}

/**
 * Pagination metadata
 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Articles list response
 */
export interface ArticlesResponse {
  articles: Article[];
  pagination: Pagination;
}

/**
 * Category with count
 */
export interface Category {
  name: string;
  count: number;
}

/**
 * Tag with count
 */
export interface Tag {
  name: string;
  normalized: string;
  count: number;
}

/**
 * Categories response
 */
export interface CategoriesResponse {
  categories: Category[];
}

/**
 * Tags response
 */
export interface TagsResponse {
  tags: Tag[];
}

/**
 * Client configuration
 */
export interface ClientConfig {
  /**
   * Your Content Growth API key (pk_xxx)
   */
  apiKey: string;

  /**
   * API base URL
   * @default 'https://api.content-growth.com'
   */
  baseUrl?: string;

  /**
   * Cache TTL in milliseconds
   * @default 300000 (5 minutes)
   */
  cacheTTL?: number;

  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean;
}

/**
 * Options for listing articles
 */
export interface ListArticlesOptions {
  /**
   * Page number (1-indexed)
   * @default 1
   */
  page?: number;

  /**
   * Number of articles per page
   * @default 12
   */
  limit?: number;

  /**
   * Filter by tags (array of tag names)
   */
  tags?: string[];

  /**
   * Filter by category
   */
  category?: string;
}

/**
 * Layout mode for displaying articles
 */
export type LayoutMode = 'cards' | 'rows';

/**
 * Display density mode
 */
export type DisplayMode = 'compact' | 'comfortable' | 'spacious';

/**
 * Theme mode
 */
export type Theme = 'light' | 'dark';

/**
 * Component props for ContentList
 */
export interface ContentListProps {
  /**
   * Your Content Growth API key
   */
  apiKey: string;

  /**
   * API base URL
   * @default 'https://api.content-growth.com'
   */
  baseUrl?: string;

  /**
   * Layout mode
   * @default 'cards'
   */
  layout?: LayoutMode;

  /**
   * Display density
   * @default 'comfortable'
   */
  displayMode?: DisplayMode;

  /**
   * Theme
   * @default 'light'
   */
  theme?: Theme;

  /**
   * Number of articles per page
   * @default 12
   */
  pageSize?: number;

  /**
   * Filter by tags
   */
  tags?: string[];

  /**
   * Filter by category
   */
  category?: string;

  /**
   * Show pagination controls
   * @default true
   */
  showPagination?: boolean;

  /**
   * Custom CSS class
   */
  class?: string;
}

/**
 * Component props for ContentViewer
 */
export interface ContentViewerProps {
  /**
   * Your Content Growth API key
   */
  apiKey: string;

  /**
   * Article UUID (use either uuid or slug)
   */
  uuid?: string;

  /**
   * Article slug (use either uuid or slug)
   */
  slug?: string;

  /**
   * API base URL
   * @default 'https://api.content-growth.com'
   */
  baseUrl?: string;

  /**
   * Theme
   * @default 'light'
   */
  theme?: Theme;

  /**
   * Show back button
   * @default false
   */
  showBackButton?: boolean;

  /**
   * Back button URL
   */
  backUrl?: string;

  /**
   * Custom CSS class
   */
  class?: string;
}

/**
 * Cache entry
 */
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * API Error
 */
export class ContentGrowthError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ContentGrowthError';
  }
}
