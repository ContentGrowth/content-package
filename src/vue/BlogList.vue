<template>
  <div
    ref="containerRef"
    :class="`cg-blog-list cg-layout-${layout} cg-display-${displayMode} cg-theme-${theme} ${className}`"
    data-cg-widget="list"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { ContentGrowthWidget } from '../widget/widget.js';
import type { BlogListProps } from '../types/index.js';

export interface VueBlogListProps extends Omit<BlogListProps, 'class'> {
  className?: string;
}

const props = withDefaults(defineProps<VueBlogListProps>(), {
  layout: 'cards',
  displayMode: 'comfortable',
  theme: 'light',
  pageSize: 12,
  tags: () => [],
  showPagination: true,
  className: ''
});

const containerRef = ref<HTMLDivElement | null>(null);
let widget: ContentGrowthWidget | null = null;

const initWidget = () => {
  if (!containerRef.value) return;

  // Clean up existing widget
  if (widget) {
    containerRef.value.innerHTML = '';
  }

  // Initialize new widget
  widget = new ContentGrowthWidget(containerRef.value, {
    apiKey: props.apiKey,
    baseUrl: props.baseUrl,
    layoutMode: props.layout,
    displayMode: props.displayMode,
    theme: props.theme,
    pageSize: props.pageSize,
    tags: Array.isArray(props.tags) ? props.tags : [],
    category: props.category,
    mode: 'list'
  });
};

onMounted(() => {
  initWidget();
});

onUnmounted(() => {
  if (widget && containerRef.value) {
    containerRef.value.innerHTML = '';
  }
});

// Re-initialize widget when props change
watch(
  () => [props.apiKey, props.baseUrl, props.layout, props.displayMode, props.theme, props.pageSize, props.tags, props.category],
  () => {
    initWidget();
  }
);
</script>
