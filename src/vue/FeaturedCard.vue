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
  showCategory?: boolean;
  showReadingTime?: boolean;
  linkPattern?: string;
  linkTarget?: string;
  ctaText?: string;
  className?: string;
}>(), {
  tags: () => [],
  excludeTags: () => [],
  showCategory: true,
  showReadingTime: true,
  linkPattern: '/articles/{slug}',
  className: ''
});

const article = ref<ArticleWithContent | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

// Generate article URL
const articleUrl = computed(() => {
  if (!article.value) return '#';
  return props.linkPattern
    .replace('{uuid}', article.value.uuid || '')
    .replace('{slug}', article.value.slug || article.value.uuid || '')
    .replace('{category}', article.value.category || 'uncategorized');
});

// Render featured summary (or fallback to regular summary) as HTML
const summaryHtml = computed(() => {
  if (!article.value) return '';
  const summaryText = (article.value as any).featuredSummary || article.value.summary;
  if (!summaryText) return '';
  return marked.parse(summaryText, { async: false }) as string;
});

const readingTime = computed(() => {
  if (!article.value) return 0;
  return Math.ceil(article.value.wordCount / 200);
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
// Generate layout class
const layoutClass = computed(() => {
  if (!article.value) return '';
  const layout = (article.value as any).featuredSummaryLayout || 'standard';
  return layout !== 'standard' ? `cg-layout-${layout}` : '';
});

// Compute CTA text from prop or article data
const ctaText = computed(() => {
  return props.ctaText || (article.value as any)?.featuredCtaText || 'Read full story';
});
</script>

<template>
  <div v-if="loading" class="cg-widget cg-loading" :class="className">
    <div class="cg-spinner"></div>
  </div>

  <div v-else-if="error || !article" class="cg-widget cg-error" :class="className">
    {{ error || 'No featured content found' }}
  </div>

  <a
    v-else
    :href="articleUrl"
    class="cg-featured-card"
    :class="[className, layoutClass]"
    data-cg-widget="featured-card"
    :target="linkTarget"
    :rel="linkTarget === '_blank' ? 'noopener noreferrer' : undefined"
  >
    <article class="cg-featured-card-inner">
      <!-- Header with category badge -->
      <div v-if="showCategory && article.category" class="cg-featured-card-category">
        <span class="cg-category-badge">{{ article.category }}</span>
      </div>

      <!-- Title -->
      <h3 class="cg-featured-card-title">{{ article.title }}</h3>

      <!-- Featured Summary -->
      <div
        v-if="summaryHtml"
        class="cg-featured-card-summary"
        v-html="summaryHtml"
      ></div>

      <!-- Footer with meta info -->
      <div class="cg-featured-card-footer">
        <span class="cg-featured-card-author">{{ article.authorName }}</span>
        <template v-if="showReadingTime">
          <span class="cg-featured-card-separator">•</span>
          <span class="cg-featured-card-reading-time">{{ readingTime }} min read</span>
        </template>
      </div>

      <!-- Read more indicator -->
      <div class="cg-featured-card-cta">
        <span>{{ ctaText }}</span>
        <svg class="cg-featured-card-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </article>
  </a>
</template>
