<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { ContentGrowthClient } from '../core/client';
import type { ArticleWithContent, Article } from '../types';

// Summary data interface for structured JSON format
interface SummaryData {
  type: 'classic' | 'list' | 'steps' | 'quote' | 'legacy';
  text?: string;
  intro?: string;
  items?: Array<{ title: string; description: string }>;
  quote?: string;
  highlight?: string;
}

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
  borderStyle?: 'none' | 'line' | 'dashed';
  borderColor?: string;
  cardBackground?: string;
  itemsBackground?: string;
  padding?: string;
  className?: string;
}>(), {
  tags: () => [],
  excludeTags: () => [],
  showCategory: true,
  showReadingTime: false,
  showAuthor: false,
  linkPattern: '/articles/{slug}',
  borderStyle: 'none',
  borderColor: '#e5e7eb',
  cardBackground: 'none',
  itemsBackground: '#f3f4f6',
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

// Parse featured summary - supports both JSON (new) and plain text (legacy)
const summaryData = computed((): SummaryData | null => {
  if (!loadedArticle.value) return null;
  const summaryText = (loadedArticle.value as any).featuredSummary || loadedArticle.value.summary;
  if (!summaryText) return null;
  
  // Try to parse as JSON
  try {
    const parsed = JSON.parse(summaryText);
    if (parsed.type) {
      return parsed as SummaryData;
    }
  } catch (e) {
    // Not JSON, treat as legacy markdown/plain text
  }
  
  // Legacy fallback - render as plain text
  return {
    type: 'legacy',
    text: summaryText
  };
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

const borderClass = computed(() => {
  return props.borderStyle !== 'none' ? `cg-border-${props.borderStyle}` : '';
});

// Compute CTA text from prop or article data
const ctaText = computed(() => {
  return props.ctaText || (loadedArticle.value as any)?.featuredCtaText || 'Read full story';
});

// Custom CSS properties
const customStyles = computed(() => {
  const styles: Record<string, string> = {};
  if (props.borderColor !== '#e5e7eb') styles['--cg-card-border-color'] = props.borderColor;
  if (props.cardBackground !== 'none') styles['--cg-card-bg'] = props.cardBackground;
  if (props.itemsBackground !== '#f3f4f6') styles['--cg-items-bg'] = props.itemsBackground;
  if (props.padding) styles['--cg-card-padding'] = props.padding;
  return styles;
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
    :class="[className, layoutClass, borderClass]"
    :style="customStyles"
    data-cg-widget="featured-card"
    :target="linkTarget"
    :rel="linkTarget === '_blank' ? 'noopener noreferrer' : undefined"
  >
    <article class="cg-featured-card-inner">
      <div class="cg-card-primary">
        <!-- Header with category badge -->
        <div v-if="showCategory && loadedArticle.category" class="cg-featured-card-category">
          <span class="cg-category-badge">{{ loadedArticle.category }}</span>
        </div>

        <!-- Title -->
        <h3 class="cg-featured-card-title">{{ loadedArticle.title }}</h3>

        <!-- Featured Summary - Intro Part -->
        <div v-if="summaryData" class="cg-featured-card-summary">
          <!-- Structured Intro -->
          <p v-if="(summaryData.type === 'list' || summaryData.type === 'steps' || summaryData.type === 'quote') && summaryData.intro">
            {{ summaryData.intro }}
          </p>
          
          <!-- Classic type -->
          <p v-else-if="summaryData.type === 'classic'">{{ summaryData.text }}</p>
          
          <!-- Legacy type -->
          <p v-else-if="summaryData.type === 'legacy'">{{ summaryData.text }}</p>
        </div>

        <!-- Footer with meta info -->
        <div v-if="showAuthor || showReadingTime" class="cg-featured-card-footer">
          <span v-if="showAuthor" class="cg-featured-card-author">{{ loadedArticle.authorName }}</span>
          <template v-if="showAuthor && showReadingTime">
            <span class="cg-featured-card-separator">•</span>
          </template>
          <span v-if="showReadingTime" class="cg-featured-card-reading-time">{{ readingTime }} min read</span>
        </div>


      </div>

      <!-- Right Panel - Structured Visual Items -->
      <div v-if="summaryData && (summaryData.type === 'list' || summaryData.type === 'steps')" class="cg-card-secondary">
        <ul class="cg-summary-items">
          <li v-for="(item, index) in summaryData.items" :key="index">
            <span class="cg-item-number">{{ index + 1 }}</span>
            <div class="cg-item-content">
              <strong class="cg-item-title">{{ item.title }}</strong>
              <span class="cg-item-description">{{ item.description }}</span>
            </div>
          </li>
        </ul>
      </div>

      <div v-else-if="summaryData && summaryData.type === 'quote'" class="cg-card-secondary">
        <blockquote>{{ summaryData.quote }}</blockquote>
      </div>

      <!-- CTA (Bottom) -->
      <div class="cg-featured-card-cta">
        <span>{{ ctaText }}</span>
        <svg class="cg-featured-card-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </article>
  </a>
</template>

