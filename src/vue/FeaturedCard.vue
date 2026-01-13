<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { marked } from 'marked';
import { ContentGrowthClient } from '../core/client';
import type { ArticleWithContent, Article } from '../types';

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
  tags?: string[];
  category?: string;
  excludeTags?: string[];
  showCategory?: boolean;
  showReadingTime?: boolean;
  showAuthor?: boolean;
  linkPattern?: string;
  linkTarget?: string;
  ctaText?: string;
  layout?: 'vertical' | 'horizontal';
  className?: string;
}>(), {
  tags: () => [],
  excludeTags: () => [],
  showCategory: true,
  showReadingTime: false,
  showAuthor: false,
  linkPattern: '/articles/{slug}',
  className: ''
});

const loadedArticle = ref<Article | ArticleWithContent | null>(props.article || null);
const loading = ref(!props.article);
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

// Render featured summary (or fallback to regular summary) as HTML
const summaryHtml = computed(() => {
  if (!loadedArticle.value) return '';
  const summaryText = (loadedArticle.value as any).featuredSummary || loadedArticle.value.summary;
  if (!summaryText) return '';
  return marked.parse(summaryText, { async: false }) as string;
});

const readingTime = computed(() => {
  if (!loadedArticle.value) return 0;
  return Math.ceil(loadedArticle.value.wordCount / 200);
});

// Generate layout class
const layoutClass = computed(() => {
  if (!loadedArticle.value) return '';
  const layout = props.layout || (loadedArticle.value as any).featuredSummaryLayout || 'vertical';
  return layout !== 'vertical' ? `cg-layout-${layout}` : '';
});

// Compute CTA text from prop or article data
const ctaText = computed(() => {
  return props.ctaText || (loadedArticle.value as any)?.featuredCtaText || 'Read full story';
});

onMounted(async () => {
  // If article is already provided, no need to fetch
  if (props.article) {
    loadedArticle.value = props.article;
    loading.value = false;
    return;
  }

  // Need API key to fetch
  if (!props.apiKey) {
    loading.value = false;
    return;
  }

  loading.value = true;
  try {
    const client = new ContentGrowthClient({ 
      apiKey: props.apiKey, 
      baseUrl: props.baseUrl 
    });

    let fetchedArticle: ArticleWithContent;

    if (props.uuid) {
      // Mode 2: Load by UUID
      fetchedArticle = await client.getArticle(props.uuid, { excludeTags: props.excludeTags });
    } else if (props.slug) {
      // Mode 3: Load by slug
      fetchedArticle = await client.getArticleBySlug(props.slug, { excludeTags: props.excludeTags });
    } else {
      // Mode 4: Find featured article by category/tags
      fetchedArticle = await client.getFeaturedArticle({
        tags: props.tags,
        category: props.category,
        excludeTags: props.excludeTags
      });
    }

    loadedArticle.value = fetchedArticle;
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

  <div v-else-if="error || !loadedArticle" class="cg-widget cg-error" :class="className">
    {{ error || 'No featured content found' }}
  </div>

  <a
    v-else
    :href="articleUrl"
    class="cg-widget cg-featured-card"
    :class="[className, layoutClass]"
    data-cg-widget="featured-card"
    :target="linkTarget"
    :rel="linkTarget === '_blank' ? 'noopener noreferrer' : undefined"
  >
    <article class="cg-featured-card-inner">
      <!-- Header with category badge -->
      <div v-if="showCategory && loadedArticle.category" class="cg-featured-card-category">
        <span class="cg-category-badge">{{ loadedArticle.category }}</span>
      </div>

      <!-- Title -->
      <h3 class="cg-featured-card-title">{{ loadedArticle.title }}</h3>

      <!-- Featured Summary -->
      <div
        v-if="summaryHtml"
        class="cg-featured-card-summary"
        v-html="summaryHtml"
      ></div>

      <!-- Footer with meta info -->
      <div v-if="showAuthor || showReadingTime" class="cg-featured-card-footer">
        <span v-if="showAuthor" class="cg-featured-card-author">{{ loadedArticle.authorName }}</span>
        <template v-if="showAuthor && showReadingTime">
          <span class="cg-featured-card-separator">•</span>
        </template>
        <span v-if="showReadingTime" class="cg-featured-card-reading-time">{{ readingTime }} min read</span>
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

