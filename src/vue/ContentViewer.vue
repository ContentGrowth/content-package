<template>
  <div
    :class="`cg-content-viewer cg-theme-${theme} ${className}`"
    data-cg-widget="post"
  >
    <div v-if="loading" class="cg-empty-state">
      <p>Loading...</p>
    </div>
    <div v-else-if="error || !article" class="cg-empty-state">
      <p>{{ error || 'Article not found' }}</p>
    </div>
    <article v-else>
      <div v-if="showBackButton" class="cg-content-header-back">
        <a :href="backUrl" class="cg-back-btn">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 16L6 10L12 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Back to articles
        </a>
      </div>

      <header class="cg-content-header">
        <div v-if="article.category" class="cg-content-category">
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
            {{ formatDate(article.publishedAt) }}
          </time>
          <span class="cg-info-separator">•</span>
          <span class="cg-info-reading-time">{{ calculateReadingTime(article.wordCount) }}</span>
        </div>
        
        <div v-if="article.tags.length > 0" class="cg-content-tags">
          <span v-for="tag in article.tags" :key="tag" class="cg-tag">{{ tag }}</span>
        </div>
      </header>

      <div class="cg-content-body" v-html="contentHtml"></div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { ContentGrowthClient } from '../core/client.js';
import { formatDate, calculateReadingTime } from '../core/utils.js';
import { marked } from 'marked';
import type { ContentViewerProps, ArticleWithContent } from '../types/index.js';

export interface VueContentViewerProps extends Omit<ContentViewerProps, 'class'> {
  className?: string;
}

const props = withDefaults(defineProps<VueContentViewerProps>(), {
  theme: 'light',
  showBackButton: false,
  backUrl: '/articles',
  showAiSummary: true,
  className: ''
});

const article = ref<ArticleWithContent | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

// Process markdown content to handle custom image syntax
const processImageSyntax = (markdown: string): string => {
  // Match: ![alt](url =widthxheight)
  return markdown.replace(
    /!\[([^\]]*)\]\(([^\s)]+)\s+=(\d+)x(\d+)\)/g,
    (match, alt, url, width, height) => {
      return `![${alt}](${url}){width="${width}" height="${height}"}`;
    }
  );
};

// Configure marked to handle image attributes
marked.use({
  renderer: {
    image(href, title, text) {
      // Extract width/height from {width="x" height="y"} syntax
      const attrMatch = text.match(/\{width="(\d+)"\s+height="(\d+)"\}/);
      if (attrMatch) {
        const cleanText = text.replace(/\{[^}]+\}/, '').trim();
        return `<img src="${href}" alt="${cleanText}" width="${attrMatch[1]}" height="${attrMatch[2]}" ${title ? `title="${title}"` : ''} />`;
      }
      return `<img src="${href}" alt="${text}" ${title ? `title="${title}"` : ''} />`;
    }
  }
});

const contentHtml = computed(() => {
  if (!article.value) return '';
  const processedContent = processImageSyntax(article.value.content);
  return marked(processedContent);
});

onMounted(async () => {
  if (!props.uuid && !props.slug) {
    error.value = 'Either uuid or slug must be provided';
    loading.value = false;
    return;
  }

  loading.value = true;
  try {
    const client = new ContentGrowthClient({ 
      apiKey: props.apiKey, 
      baseUrl: props.baseUrl 
    });
    const fetchedArticle = props.slug
      ? await client.getArticleBySlug(props.slug)
      : await client.getArticle(props.uuid!);
    article.value = fetchedArticle;
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load article';
  } finally {
    loading.value = false;
  }
});
</script>
