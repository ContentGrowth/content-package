<template>
  <div
    :class="`cg-content-list cg-layout-${layout} cg-display-${displayMode} cg-theme-${theme} ${className}`"
    data-cg-widget="list"
  >
    <div v-if="loading" class="cg-empty-state">
      <p>Loading...</p>
    </div>
    <div v-else-if="articles.length === 0" class="cg-empty-state">
      <p>No articles found.</p>
    </div>
    <template v-else>
      <div :class="`cg-articles-grid ${layout === 'cards' ? 'cg-grid' : 'cg-list'}`">
        <article v-for="article in articles" :key="article.uuid" class="cg-article-card">
          <a :href="buildArticleUrl(article)" :target="buildLinkTarget(article)" class="cg-card-link">
            <div class="cg-card-content">
              <div v-if="article.category" class="cg-card-category">
                <span class="cg-category-badge">{{ article.category }}</span>
              </div>
              
              <h2 class="cg-card-title">{{ article.title }}</h2>
              
              <p v-if="showAiSummary && article.summary" class="cg-card-summary">
                {{ truncateSummary(article.summary, summaryMaxLength) }}
              </p>
              
              <div class="cg-card-meta">
                <span class="cg-meta-author">{{ article.authorName }}</span>
                <span class="cg-meta-separator">•</span>
                <time class="cg-meta-date" :datetime="new Date(article.publishedAt * 1000).toISOString()">
                  {{ formatDate(article.publishedAt) }}
                </time>
                <span class="cg-meta-separator">•</span>
                <span class="cg-meta-reading-time">{{ calculateReadingTime(article.wordCount) }}</span>
              </div>
              
              <div v-if="showTags && article.tags && article.tags.length > 0" class="cg-card-tags">
                <span v-for="tag in article.tags" :key="tag" class="cg-tag">{{ tag }}</span>
              </div>
            </div>
          </a>
        </article>
      </div>

      <div v-if="showPagination && totalPages > 1" class="cg-pagination">
        <button
          class="cg-pagination-btn"
          @click="currentPage = Math.max(1, currentPage - 1)"
          :disabled="currentPage === 1"
        >
          Previous
        </button>
        
        <span class="cg-pagination-info">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        
        <button
          class="cg-pagination-btn"
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
          :disabled="currentPage === totalPages"
        >
          Next
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { ContentGrowthClient } from '../core/client.js';
import { formatDate, calculateReadingTime } from '../core/utils.js';
import type { ContentListProps, Article } from '../types/index.js';

export interface VueContentListProps extends Omit<ContentListProps, 'class'> {
  className?: string;
}

const props = withDefaults(defineProps<VueContentListProps>(), {
  layout: 'cards',
  displayMode: 'comfortable',
  theme: 'light',
  pageSize: 12,
  tags: () => [],
  showPagination: true,
  linkPattern: '/articles/{uuid}',
  showTags: false,
  showAiSummary: true,
  className: ''
});

const articles = ref<Article[]>([]);
const currentPage = ref(1);
const totalPages = ref(1);
const loading = ref(true);

const fetchArticles = async () => {
  loading.value = true;
  try {
    const client = new ContentGrowthClient({ 
      apiKey: props.apiKey, 
      baseUrl: props.baseUrl 
    });
    
    // Process tags
    let processedTags: string[] | undefined;
    const tagsProp = props.tags as string[] | string | undefined;
    if (tagsProp) {
      if (Array.isArray(tagsProp)) {
        processedTags = tagsProp;
      } else if (typeof tagsProp === 'string') {
        processedTags = tagsProp.split(',').map((t: string) => t.trim()).filter(Boolean);
      }
    }

    const result = await client.listArticles({
      page: currentPage.value,
      limit: props.pageSize,
      tags: processedTags,
      category: props.category
    });

    articles.value = result.articles;
    totalPages.value = result.pagination.totalPages;
  } catch (error) {
    console.error('Error fetching articles:', error);
  } finally {
    loading.value = false;
  }
};

// Truncate summary text
const truncateSummary = (text: string | null, maxLength?: number): string => {
  if (!text) return '';
  if (!maxLength || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// Build article URL from pattern
const buildArticleUrl = (article: Article): string => {
  return props.linkPattern
    .replace('{uuid}', article.uuid)
    .replace('{slug}', article.slug)
    .replace('{category}', article.category || '');
};

// Build link target from pattern
const buildLinkTarget = (article: Article): string | undefined => {
  if (!props.linkTarget) return undefined;
  return props.linkTarget
    .replace('{uuid}', article.uuid)
    .replace('{id}', article.uuid);
};

onMounted(() => {
  fetchArticles();
});

watch(
  () => [props.apiKey, props.baseUrl, currentPage.value, props.pageSize, props.tags, props.category],
  () => {
    fetchArticles();
  }
);
</script>
