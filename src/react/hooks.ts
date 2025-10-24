/**
 * React Hooks for Content Growth API
 */

import { useState, useEffect, useCallback } from 'react';
import { ContentGrowthClient } from '../core/client.js';
import type {
  Article,
  ArticleWithContent,
  Pagination,
  Category,
  Tag,
  ListArticlesOptions
} from '../types/index.js';

export interface UseArticlesOptions extends ListArticlesOptions {
  apiKey: string;
  baseUrl?: string;
}

export interface UseArticlesResult {
  articles: Article[];
  pagination: Pagination | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch articles list
 */
export function useArticles(options: UseArticlesOptions): UseArticlesResult {
  const { apiKey, baseUrl, ...listOptions } = options;
  const [articles, setArticles] = useState<Article[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const client = new ContentGrowthClient({ apiKey, baseUrl });
      const result = await client.listArticles(listOptions);
      setArticles(result.articles);
      setPagination(result.pagination);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [apiKey, baseUrl, JSON.stringify(listOptions)]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return {
    articles,
    pagination,
    loading,
    error,
    refetch: fetchArticles
  };
}

export interface UseArticleOptions {
  apiKey: string;
  uuid: string;
  baseUrl?: string;
}

export interface UseArticleResult {
  article: ArticleWithContent | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch a single article
 */
export function useArticle(options: UseArticleOptions): UseArticleResult {
  const { apiKey, uuid, baseUrl } = options;
  const [article, setArticle] = useState<ArticleWithContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchArticle = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const client = new ContentGrowthClient({ apiKey, baseUrl });
      const result = await client.getArticle(uuid);
      setArticle(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [apiKey, uuid, baseUrl]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  return {
    article,
    loading,
    error,
    refetch: fetchArticle
  };
}

export interface UseCategoriesOptions {
  apiKey: string;
  baseUrl?: string;
}

export interface UseCategoriesResult {
  categories: Category[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch categories
 */
export function useCategories(options: UseCategoriesOptions): UseCategoriesResult {
  const { apiKey, baseUrl } = options;
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const client = new ContentGrowthClient({ apiKey, baseUrl });
      const result = await client.getCategories();
      setCategories(result.categories);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [apiKey, baseUrl]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories
  };
}

export interface UseTagsOptions {
  apiKey: string;
  baseUrl?: string;
}

export interface UseTagsResult {
  tags: Tag[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch tags
 */
export function useTags(options: UseTagsOptions): UseTagsResult {
  const { apiKey, baseUrl } = options;
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTags = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const client = new ContentGrowthClient({ apiKey, baseUrl });
      const result = await client.getTags();
      setTags(result.tags);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [apiKey, baseUrl]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return {
    tags,
    loading,
    error,
    refetch: fetchTags
  };
}
