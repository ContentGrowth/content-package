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
  <div v-if="loading" class="cg-widget cg-loading" :class="className">
    <div class="cg-spinner"></div>
  </div>

  <div v-else-if="error || !article" class="cg-widget cg-error" :class="className">
    {{ error || 'No featured content found' }}
  </div>

  <div v-else class="cg-widget cg-content-viewer" :class="className">
    <article class="cg-article">
      <div v-if="showCategory && article?.category" class="cg-article-category">
        {{ article.category }}
      </div>
      
      <h1 class="cg-article-title">{{ article?.title }}</h1>
      
      <div class="cg-article-meta">
        <span class="cg-author">{{ article?.authorName }}</span>
        <span v-if="article?.publishedAt" class="cg-date">
          {{ new Date(article.publishedAt * 1000).toLocaleDateString() }}
        </span>
        <span v-if="article?.wordCount" class="cg-read-time">
          {{ Math.ceil(article.wordCount / 200) }} min read
        </span>
      </div>

      <div v-if="showAiSummary && article?.summary" class="cg-ai-summary">
        <div class="cg-ai-label">AI Summary</div>
        <p>{{ article.summary }}</p>
      </div>

      <!-- Content -->
      <div 
        class="cg-article-content"
        v-html="contentHtml"
      ></div>

      <!-- Tags -->
      <div v-if="showTags && article?.tags && article.tags.length > 0" class="cg-article-tags">
        <span v-for="tag in article.tags" :key="tag" class="cg-tag">#{{ tag }}</span>
      </div>
    </article>
  </div>
</template>
