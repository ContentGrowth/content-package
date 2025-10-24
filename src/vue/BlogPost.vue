<template>
  <div
    ref="containerRef"
    :class="`cg-blog-post cg-theme-${theme} ${className}`"
    data-cg-widget="post"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { ContentGrowthWidget } from '../widget/widget.js';
import type { BlogPostProps } from '../types/index.js';

export interface VueBlogPostProps extends Omit<BlogPostProps, 'class'> {
  className?: string;
}

const props = withDefaults(defineProps<VueBlogPostProps>(), {
  theme: 'light',
  showBackButton: false,
  backUrl: '/articles',
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
    theme: props.theme,
    mode: 'article-only',
    articleId: props.uuid
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
  () => [props.apiKey, props.uuid, props.baseUrl, props.theme],
  () => {
    initWidget();
  }
);
</script>
