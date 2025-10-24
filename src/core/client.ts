/**
 * Content Growth API Client
 * Framework-agnostic API client for fetching articles
 */

import type {
  ClientConfig,
  ListArticlesOptions,
  ArticlesResponse,
  ArticleWithContent,
  CategoriesResponse,
  TagsResponse,
  CacheEntry
} from '../types/index.js';
import { ContentGrowthError } from '../types/index.js';

/**
 * Content Growth API Client
 * 
 * @example
 * ```typescript
 * const client = new ContentGrowthClient({
 *   apiKey: 'pk_your_key_here'
 * });
 * 
 * const { articles, pagination } = await client.listArticles({
 *   page: 1,
 *   limit: 12,
 *   tags: ['tutorial']
 * });
 * ```
 */
export class ContentGrowthClient {
  private config: Required<ClientConfig>;
  private cache: Map<string, CacheEntry<any>>;

  constructor(config: ClientConfig) {
    this.config = {
      apiKey: config.apiKey,
      baseUrl: config.baseUrl || 'https://api.content-growth.com',
      cacheTTL: config.cacheTTL ?? 300000, // 5 minutes default
      debug: config.debug ?? false
    };

    this.cache = new Map();

    if (!this.config.apiKey) {
      throw new ContentGrowthError('API key is required');
    }

    if (!this.config.apiKey.startsWith('pk_')) {
      console.warn('[ContentGrowth] API key should start with "pk_" for public use');
    }
  }

  /**
   * List articles with pagination and filtering
   */
  async listArticles(options: ListArticlesOptions = {}): Promise<ArticlesResponse> {
    const {
      page = 1,
      limit = 12,
      tags = [],
      category
    } = options;

    this.log('[ContentGrowthClient] listArticles called with options:', options);

    // Build query params
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    if (tags.length > 0) {
      params.set('tags', tags.join(','));
    }

    if (category) {
      params.set('category', category);
    }

    const cacheKey = `articles:${params.toString()}`;
    const cached = this.getFromCache<ArticlesResponse>(cacheKey);
    if (cached) {
      this.log('[ContentGrowthClient] Cache hit:', cacheKey);
      return cached;
    }

    const url = `${this.config.baseUrl}/widget/articles?${params}`;
    this.log('[ContentGrowthClient] Fetching from URL:', url);
    const data = await this.fetch<ArticlesResponse>(url);
    this.log('[ContentGrowthClient] Response received:', data);

    this.setCache(cacheKey, data);
    return data;
  }

  /**
   * Get a single article by UUID
   */
  async getArticle(uuid: string): Promise<ArticleWithContent> {
    if (!uuid) {
      throw new ContentGrowthError('Article UUID is required');
    }

    const cacheKey = `article:${uuid}`;
    const cached = this.getFromCache<ArticleWithContent>(cacheKey);
    if (cached) {
      this.log('Cache hit:', cacheKey);
      return cached;
    }

    const url = `${this.config.baseUrl}/widget/articles/${uuid}`;
    const data = await this.fetch<ArticleWithContent>(url);

    this.setCache(cacheKey, data);
    return data;
  }

  /**
   * Get a single article by slug
   */
  async getArticleBySlug(slug: string): Promise<ArticleWithContent> {
    if (!slug) {
      throw new ContentGrowthError('Article slug is required');
    }

    const cacheKey = `article:slug:${slug}`;
    const cached = this.getFromCache<ArticleWithContent>(cacheKey);
    if (cached) {
      this.log('Cache hit:', cacheKey);
      return cached;
    }

    const url = `${this.config.baseUrl}/widget/articles/slug/${slug}`;
    const data = await this.fetch<ArticleWithContent>(url);

    this.setCache(cacheKey, data);
    return data;
  }

  /**
   * Get all categories with article counts
   */
  async getCategories(): Promise<CategoriesResponse> {
    const cacheKey = 'categories';
    const cached = this.getFromCache<CategoriesResponse>(cacheKey);
    if (cached) {
      this.log('Cache hit:', cacheKey);
      return cached;
    }

    const url = `${this.config.baseUrl}/widget/categories`;
    const data = await this.fetch<CategoriesResponse>(url);

    this.setCache(cacheKey, data);
    return data;
  }

  /**
   * Get all tags with article counts
   */
  async getTags(): Promise<TagsResponse> {
    const cacheKey = 'tags';
    const cached = this.getFromCache<TagsResponse>(cacheKey);
    if (cached) {
      this.log('Cache hit:', cacheKey);
      return cached;
    }

    const url = `${this.config.baseUrl}/widget/tags`;
    const data = await this.fetch<TagsResponse>(url);

    this.setCache(cacheKey, data);
    return data;
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cache.clear();
    this.log('Cache cleared');
  }

  /**
   * Internal fetch wrapper with error handling
   */
  private async fetch<T>(url: string): Promise<T> {
    console.log('[ContentGrowthClient] Fetching:', url);
    console.log('[ContentGrowthClient] API Key:', this.config.apiKey);

    try {
      const response = await fetch(url, {
        headers: {
          'X-API-Key': this.config.apiKey,
          'Content-Type': 'application/json'
        }
      });

      console.log('[ContentGrowthClient] Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[ContentGrowthClient] Error response:', errorText);
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorJson.message || errorMessage;
        } catch {
          // Use default error message
        }

        throw new ContentGrowthError(
          errorMessage,
          response.status,
          errorText
        );
      }

      const data = await response.json();
      console.log('[ContentGrowthClient] Response data:', data);
      return data;
    } catch (error) {
      if (error instanceof ContentGrowthError) {
        console.error('[ContentGrowthClient] ContentGrowthError:', error);
        throw error;
      }

      // Network or parsing error
      console.error('[ContentGrowthClient] Network/Parse error:', error);
      throw new ContentGrowthError(
        `Failed to fetch from Content Growth API: ${(error as Error).message}`,
        undefined,
        error
      );
    }
  }

  /**
   * Get from cache if not expired
   */
  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > this.config.cacheTTL) {
      this.cache.delete(key);
      this.log('Cache expired:', key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set cache entry
   */
  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    this.log('Cache set:', key);
  }

  /**
   * Debug logging
   */
  private log(...args: any[]): void {
    if (this.config.debug) {
      console.log('[ContentGrowth]', ...args);
    }
  }
}
