/**
 * Vue Composables for Content Growth API
 */

import { ref, watch, type Ref } from 'vue';
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
  articles: Ref<Article[]>;
  pagination: Ref<Pagination | null>;
  loading: Ref<boolean>;
  error: Ref<Error | null>;
  refetch: () => Promise<void>;
}

/**
 * Composable to fetch articles list
 */
export function useArticles(options: UseArticlesOptions): UseArticlesResult {
  const articles = ref<Article[]>([]);
  const pagination = ref<Pagination | null>(null);
  const loading = ref(true);
  const error = ref<Error | null>(null);

  const fetchArticles = async () => {
    loading.value = true;
    error.value = null;

    try {
      const client = new ContentGrowthClient({
        apiKey: options.apiKey,
        baseUrl: options.baseUrl
      });
      const result = await client.listArticles({
        page: options.page,
        limit: options.limit,
        tags: options.tags,
        category: options.category
      });
      articles.value = result.articles;
      pagination.value = result.pagination;
    } catch (err) {
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
  };

  // Fetch on mount
  fetchArticles();

  // Watch for options changes
  watch(
    () => [options.apiKey, options.baseUrl, options.page, options.limit, options.tags, options.category],
    () => {
      fetchArticles();
    }
  );

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
  article: Ref<ArticleWithContent | null>;
  loading: Ref<boolean>;
  error: Ref<Error | null>;
  refetch: () => Promise<void>;
}

/**
 * Composable to fetch a single article
 */
export function useArticle(options: UseArticleOptions): UseArticleResult {
  const article = ref<ArticleWithContent | null>(null);
  const loading = ref(true);
  const error = ref<Error | null>(null);

  const fetchArticle = async () => {
    loading.value = true;
    error.value = null;

    try {
      const client = new ContentGrowthClient({
        apiKey: options.apiKey,
        baseUrl: options.baseUrl
      });
      const result = await client.getArticle(options.uuid);
      article.value = result;
    } catch (err) {
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
  };

  // Fetch on mount
  fetchArticle();

  // Watch for options changes
  watch(
    () => [options.apiKey, options.uuid, options.baseUrl],
    () => {
      fetchArticle();
    }
  );

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
  categories: Ref<Category[]>;
  loading: Ref<boolean>;
  error: Ref<Error | null>;
  refetch: () => Promise<void>;
}

/**
 * Composable to fetch categories
 */
export function useCategories(options: UseCategoriesOptions): UseCategoriesResult {
  const categories = ref<Category[]>([]);
  const loading = ref(true);
  const error = ref<Error | null>(null);

  const fetchCategories = async () => {
    loading.value = true;
    error.value = null;

    try {
      const client = new ContentGrowthClient({
        apiKey: options.apiKey,
        baseUrl: options.baseUrl
      });
      const result = await client.getCategories();
      categories.value = result.categories;
    } catch (err) {
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
  };

  // Fetch on mount
  fetchCategories();

  // Watch for options changes
  watch(
    () => [options.apiKey, options.baseUrl],
    () => {
      fetchCategories();
    }
  );

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
  tags: Ref<Tag[]>;
  loading: Ref<boolean>;
  error: Ref<Error | null>;
  refetch: () => Promise<void>;
}

/**
 * Composable to fetch tags
 */
export function useTags(options: UseTagsOptions): UseTagsResult {
  const tags = ref<Tag[]>([]);
  const loading = ref(true);
  const error = ref<Error | null>(null);

  const fetchTags = async () => {
    loading.value = true;
    error.value = null;

    try {
      const client = new ContentGrowthClient({
        apiKey: options.apiKey,
        baseUrl: options.baseUrl
      });
      const result = await client.getTags();
      tags.value = result.tags;
    } catch (err) {
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
  };

  // Fetch on mount
  fetchTags();

  // Watch for options changes
  watch(
    () => [options.apiKey, options.baseUrl],
    () => {
      fetchTags();
    }
  );

  return {
    tags,
    loading,
    error,
    refetch: fetchTags
  };
}
