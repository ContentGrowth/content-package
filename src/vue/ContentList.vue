<template>
  <div
    :class="`cg-content-list cg-layout-${layout} cg-display-${displayMode} cg-theme-${theme} ${isFeaturedCardsMode ? 'cg-featured-cards-list' : ''} ${className}`"
    data-cg-widget="list"
  >
    <div v-if="loading" class="cg-empty-state">
      <p>Loading...</p>
    </div>
    <div v-else-if="articles.length === 0" class="cg-empty-state">
      <p>No articles found.</p>
    </div>
    <template v-else>
      <div :class="`cg-articles-grid ${isFeaturedCardsMode ? (layout === 'rows' ? 'cg-featured-cards-list' : 'cg-featured-cards-grid') : (layout === 'cards' ? 'cg-grid' : 'cg-list')}`">
        <!-- Featured Cards Mode -->
        <template v-if="isFeaturedCardsMode">
          <FeaturedCard
            v-for="article in articles"
            :key="article.uuid"
            :article="article"
            :linkPattern="linkPattern"
            :linkTarget="buildLinkTarget(article)"
            :showCategory="showCategory"
            :layout="featuredCardLayout"
            :borderStyle="borderStyle"
            :borderColor="borderColor"
            :itemsBackground="itemsBackground"
          />
        </template>

        <!-- Default Card Mode - Use ContentCard component -->
        <template v-else>
          <ContentCard
            v-for="article in articles"
            :key="article.uuid"
            :article="article"
            :linkPattern="linkPattern"
            :linkTarget="buildLinkTarget(article)"
            :showSummary="showAiSummary"
            :summaryMaxLength="summaryMaxLength"
            :showTags="showTags"
            :showCategory="showCategory"
            :borderStyle="borderStyle"
            :borderColor="borderColor"
          />
        </template>
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
import { ref, watch, onMounted, computed } from 'vue';
import { ContentGrowthClient } from '../core/client.js';
import FeaturedCard from './FeaturedCard.vue';
import ContentCard from './ContentCard.vue';
import type { ContentListProps, Article } from '../types/index.js';

export interface VueContentListProps extends Omit<ContentListProps, 'class'> {
  className?: string;
}

const props = withDefaults(defineProps<VueContentListProps>(), {
  layout: 'cards',
  displayMode: 'comfortable',
  displayAs: 'default',
  theme: 'light',
  pageSize: 12,
  tags: () => [],
  showPagination: true,
  linkPattern: '/articles/{uuid}',
  showTags: false,
  showAiSummary: true,
  showCategory: true,
  className: ''
});

const articles = ref<Article[]>([]);
const currentPage = ref(1);
const totalPages = ref(1);
const loading = ref(true);

const isFeaturedCardsMode = computed(() => props.displayAs === 'featured-cards');

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
  [
    () => props.apiKey,
    () => props.baseUrl,
    () => currentPage.value,
    () => props.pageSize,
    () => JSON.stringify(props.tags),
    () => props.category
  ],
  () => {
    fetchArticles();
  }
);
</script>

