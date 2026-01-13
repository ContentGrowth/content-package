<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { ContentGrowthClient } from '../core/client';
import { formatDate, calculateReadingTime } from '../core/utils';
import type { Article, ArticleWithContent } from '../types';

const props = withDefaults(defineProps<{
  // Pre-loaded article data (bypasses API fetch)
  article?: Article | ArticleWithContent;
  // Load specific article by slug
  slug?: string;
  // Load specific article by UUID
  uuid?: string;
  // API config (required if fetching)
  apiKey?: string;
  baseUrl?: string;
  // Display options
  linkPattern?: string;
  linkTarget?: string;
  showSummary?: boolean;
  summaryMaxLength?: number;
  showTags?: boolean;
  showCategory?: boolean;
  borderStyle?: 'none' | 'line' | 'dashed';
  borderColor?: string;
  cardBackground?: string;
  padding?: string;
  className?: string;
}>(), {
  linkPattern: '/articles/{slug}',
  showSummary: true,
  showTags: false,
  showCategory: true,
  borderStyle: 'line',
  borderColor: '#e5e7eb',
  cardBackground: 'none',
  className: ''
});

const loadedArticle = ref<Article | ArticleWithContent | null>(props.article || null);
const loading = ref(!props.article && !!(props.apiKey && (props.slug || props.uuid)));
const error = ref<string | null>(null);

// Watch for provided article prop changes
watch(() => props.article, (newArticle) => {
  if (newArticle) {
    loadedArticle.value = newArticle;
    loading.value = false;
  }
}, { immediate: true });

// Generate article URL
const articleUrl = computed(() => {
  if (!loadedArticle.value) return '#';
  return props.linkPattern
    .replace('{uuid}', loadedArticle.value.uuid || '')
    .replace('{slug}', loadedArticle.value.slug || loadedArticle.value.uuid || '')
    .replace('{category}', loadedArticle.value.category || 'uncategorized');
});

// Truncate summary text
const truncateSummary = (text: string | null, maxLength?: number): string => {
  if (!text) return '';
  if (!maxLength || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

const readingTime = computed(() => {
  if (!loadedArticle.value) return '';
  return calculateReadingTime(loadedArticle.value.wordCount);
});

const publishedDate = computed(() => {
  if (!loadedArticle.value) return '';
  return formatDate(loadedArticle.value.publishedAt);
});

const publishedDateTime = computed(() => {
  if (!loadedArticle.value) return '';
  return new Date(loadedArticle.value.publishedAt * 1000).toISOString();
});

onMounted(async () => {
  // If article is already provided, no need to fetch
  if (props.article) {
    loadedArticle.value = props.article;
    loading.value = false;
    return;
  }

  // Need API key and identifier to fetch
  if (!props.apiKey || (!props.slug && !props.uuid)) {
    loading.value = false;
    return;
  }

  loading.value = true;
  try {
    const client = new ContentGrowthClient({ 
      apiKey: props.apiKey, 
      baseUrl: props.baseUrl 
    });

    if (props.uuid) {
      loadedArticle.value = await client.getArticle(props.uuid);
    } else if (props.slug) {
      loadedArticle.value = await client.getArticleBySlug(props.slug);
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load article';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div v-if="loading" class="cg-widget cg-loading" :class="className">
    <div class="cg-spinner"></div>
  </div>

  <div v-else-if="error" class="cg-widget cg-error" :class="className">
    {{ error }}
  </div>

  <article 
    v-else-if="loadedArticle" 
    class="cg-article-card" 
    :class="[
      className,
      borderStyle !== 'none' ? `cg-border-${borderStyle}` : ''
    ]"
    :style="{
      '--cg-card-border-color': borderColor !== '#e5e7eb' ? borderColor : undefined,
      '--cg-card-bg': cardBackground !== 'none' ? cardBackground : undefined,
      '--cg-card-padding': padding
    }"
  >
    <a :href="articleUrl" :target="linkTarget" class="cg-card-link">
      <div class="cg-card-content">
        <div v-if="showCategory && loadedArticle.category" class="cg-card-category">
          <span class="cg-category-badge">{{ loadedArticle.category }}</span>
        </div>
        
        <h2 class="cg-card-title">{{ loadedArticle.title }}</h2>
        
        <p v-if="showSummary && loadedArticle.summary" class="cg-card-summary">
          {{ truncateSummary(loadedArticle.summary, summaryMaxLength) }}
        </p>
        
        <div class="cg-card-meta">
          <span class="cg-meta-author">{{ loadedArticle.authorName }}</span>
          <span class="cg-meta-separator">•</span>
          <time class="cg-meta-date" :datetime="publishedDateTime">
            {{ publishedDate }}
          </time>
          <span class="cg-meta-separator">•</span>
          <span class="cg-meta-reading-time">{{ readingTime }}</span>
        </div>
        
        <div v-if="showTags && loadedArticle.tags && loadedArticle.tags.length > 0" class="cg-card-tags">
          <span v-for="tag in loadedArticle.tags" :key="tag" class="cg-tag">{{ tag }}</span>
        </div>
      </div>
    </a>
  </article>
</template>
