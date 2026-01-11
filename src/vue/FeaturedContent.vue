<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { marked } from 'marked';
import { ContentGrowthClient } from '../core/client';
import type { ArticleWithContent } from '../types';

const props = withDefaults(defineProps<{
  apiKey: string;
  baseUrl: string;
  tags?: string[];
  category?: string;
  excludeTags?: string[];
  showAiSummary?: boolean;
  showCategory?: boolean;
  showTags?: boolean;
  className?: string;
}>(), {
  tags: () => [],
  excludeTags: () => [],
  showAiSummary: true,
  showCategory: true,
  showTags: true,
  className: ''
});

const article = ref<ArticleWithContent | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

// Render markdown to HTML
const contentHtml = computed(() => {
  if (!article.value) return '';
  return marked(article.value.content);
});

onMounted(async () => {
  loading.value = true;
  try {
    const client = new ContentGrowthClient({ 
      apiKey: props.apiKey, 
      baseUrl: props.baseUrl 
    });
    const fetchedArticle = await client.getFeaturedArticle({
      tags: props.tags,
      category: props.category,
      excludeTags: props.excludeTags
    });
    article.value = fetchedArticle;
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load featured article';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div v-if="loading" class="cg-content-viewer" :class="className">
    <div class="cg-empty-state">
      <p>Loading...</p>
    </div>
  </div>

  <div v-else-if="error || !article" class="cg-content-viewer" :class="className">
    <div class="cg-empty-state">
      <p>{{ error || 'No featured content found' }}</p>
    </div>
  </div>

  <div v-else class="cg-content-viewer" :class="className" data-cg-widget="post">
    <article>
      <header class="cg-content-header">
        <div v-if="showCategory && article.category" class="cg-content-category">
          <span class="cg-category-badge">{{ article.category }}</span>
        </div>
        
        <h1 class="cg-content-title">{{ article.title }}</h1>
        
        <div v-if="showAiSummary && article.summary" class="cg-ai-summary">
          <div class="cg-ai-summary-header">
            <svg class="cg-ai-summary-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span class="cg-ai-summary-label">AI Generated Summary</span>
          </div>
          <p class="cg-ai-summary-text">{{ article.summary }}</p>
        </div>
        
        <div class="cg-content-meta">
          <span class="cg-info-author">{{ article.authorName }}</span>
          <span class="cg-info-separator">•</span>
          <time class="cg-info-date" :datetime="new Date(article.publishedAt * 1000).toISOString()">
            {{ new Date(article.publishedAt * 1000).toLocaleDateString() }}
          </time>
          <span class="cg-info-separator">•</span>
          <span class="cg-info-reading-time">{{ Math.ceil(article.wordCount / 200) }} min read</span>
        </div>
        
        <div v-if="showTags && article.tags && article.tags.length > 0" class="cg-content-tags">
          <span v-for="tag in article.tags" :key="tag" class="cg-tag">{{ tag }}</span>
        </div>
      </header>

      <div class="cg-content-body" v-html="contentHtml"></div>
    </article>
  </div>
</template>
