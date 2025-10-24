# @content-growth/content-widget

Embed your Content Growth content anywhere with beautiful, customizable components.

## Features

- 🎨 **Beautiful UI** - Pre-styled components with light/dark themes
- 🚀 **Multi-Framework** - React, Vue, Astro, and Vanilla JS support
- 📦 **Zero Config** - Works out of the box with sensible defaults
- 🎯 **Type Safe** - Full TypeScript support
- ⚡ **Fast** - Built-in caching and optimized performance
- 🎨 **Customizable** - Multiple layouts and display modes
- 📱 **Responsive** - Mobile-first design

## Installation

```bash
npm install @content-growth/content-widget
```

## Quick Start

### Vanilla JavaScript

```html
<!-- Add CSS -->
<link rel="stylesheet" href="node_modules/@content-growth/content-widget/dist/styles.css">

<!-- Add container -->
<div id="blog"></div>

<!-- Initialize widget -->
<script type="module">
  import { ContentGrowthWidget } from '@content-growth/content-widget/widget';
  
  new ContentGrowthWidget(document.getElementById('blog'), {
    apiKey: 'pk_your_key_here',
    layout: 'cards'
  });
</script>
```

### React

```jsx
import { BlogList } from '@content-growth/content-widget/react';
import '@content-growth/content-widget/styles.css';

function App() {
  return <BlogList apiKey="pk_your_key_here" layout="cards" />;
}
```

**With Hooks:**

```jsx
import { useArticles } from '@content-growth/content-widget/react';

function CustomBlogList() {
  const { articles, loading, error } = useArticles({
    apiKey: 'pk_your_key_here',
    page: 1,
    limit: 12
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {articles.map(article => (
        <div key={article.uuid}>
          <h2>{article.title}</h2>
          <p>{article.summary}</p>
        </div>
      ))}
    </div>
  );
}
```

### Vue

```vue
<template>
  <BlogList api-key="pk_your_key_here" layout="cards" />
</template>

<script setup>
import { BlogList } from '@content-growth/content-widget/vue';
import '@content-growth/content-widget/styles.css';
</script>
```

**With Composables:**

```vue
<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else>
      <div v-for="article in articles" :key="article.uuid">
        <h2>{{ article.title }}</h2>
        <p>{{ article.summary }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useArticles } from '@content-growth/content-widget/vue';

const { articles, loading, error } = useArticles({
  apiKey: 'pk_your_key_here',
  page: 1,
  limit: 12
});
</script>
```

### Astro

```astro
---
import { BlogList } from '@content-growth/content-widget/astro';
import '@content-growth/content-widget/styles.css';
---

<BlogList apiKey="pk_your_key_here" />
```

### API Client (Framework Agnostic)

```typescript
import { ContentGrowthClient } from '@content-growth/content-widget/core';

const client = new ContentGrowthClient({
  apiKey: 'pk_your_key_here'
});

const { articles, pagination } = await client.listArticles({
  page: 1,
  limit: 12,
  tags: ['tutorial']
});
```

## Components

### Vanilla JS Widget

```javascript
import { ContentGrowthWidget } from '@content-growth/content-widget/widget';

const widget = new ContentGrowthWidget(container, {
  apiKey: 'pk_your_key_here',
  baseUrl: 'https://api.content-growth.com',
  layoutMode: 'cards', // 'cards' | 'rows'
  displayMode: 'comfortable', // 'compact' | 'comfortable' | 'spacious'
  theme: 'light', // 'light' | 'dark'
  pageSize: 12,
  tags: ['tutorial', 'guide'],
  category: 'guides',
  viewerMode: 'inline', // 'inline' | 'modal' | 'external'
  mode: 'list' // 'list' | 'article-only'
});
```

### React Components

**BlogList:**

```jsx
<BlogList
  apiKey="pk_your_key_here"
  layout="cards"
  displayMode="comfortable"
  theme="light"
  pageSize={12}
  tags={['tutorial', 'guide']}
  category="guides"
  showPagination={true}
/>
```

**BlogPost:**

```jsx
<BlogPost
  apiKey="pk_your_key_here"
  uuid="article-uuid"
  theme="light"
  showBackButton={true}
  backUrl="/articles"
/>
```

**Hooks:**

- `useArticles(options)` - Fetch articles list
- `useArticle(options)` - Fetch single article
- `useCategories(options)` - Fetch categories
- `useTags(options)` - Fetch tags

### Vue Components

**BlogList:**

```vue
<BlogList
  api-key="pk_your_key_here"
  layout="cards"
  display-mode="comfortable"
  theme="light"
  :page-size="12"
  :tags="['tutorial', 'guide']"
  category="guides"
  :show-pagination="true"
/>
```

**BlogPost:**

```vue
<BlogPost
  api-key="pk_your_key_here"
  uuid="article-uuid"
  theme="light"
  :show-back-button="true"
  back-url="/articles"
/>
```

**Composables:**

- `useArticles(options)` - Fetch articles list
- `useArticle(options)` - Fetch single article
- `useCategories(options)` - Fetch categories
- `useTags(options)` - Fetch tags

### Astro Components

**BlogList:**

```astro
<BlogList
  apiKey="pk_your_key_here"
  layout="cards"
  displayMode="comfortable"
  theme="light"
  pageSize={12}
  tags={['tutorial', 'guide']}
  category="guides"
  showPagination={true}
/>
```

**BlogPost:**

```astro
<BlogPost
  apiKey="pk_your_key_here"
  uuid={uuid}
  theme="light"
  showBackButton={true}
  backUrl="/articles"
/>
```

## API Client

### ContentGrowthClient

```typescript
import { ContentGrowthClient } from '@content-growth/content-widget/core';

const client = new ContentGrowthClient({
  apiKey: 'pk_your_key_here',
  baseUrl: 'https://api.content-growth.com', // optional
  cacheTTL: 300000, // 5 minutes, optional
  debug: false // optional
});
```

### Methods

#### `listArticles(options?)`

```typescript
const { articles, pagination } = await client.listArticles({
  page: 1,
  limit: 12,
  tags: ['tutorial', 'guide'],
  category: 'guides'
});
```

#### `getArticle(uuid)`

```typescript
const article = await client.getArticle('article-uuid');
```

#### `getCategories()`

```typescript
const { categories } = await client.getCategories();
```

#### `getTags()`

```typescript
const { tags } = await client.getTags();
```

#### `clearCache()`

```typescript
client.clearCache();
```

## Styling

Import the CSS file:

```javascript
import '@content-growth/content-widget/styles.css';
```

### Customization

Override CSS variables:

```css
.cg-blog-list {
  --cg-primary: #3b82f6;
  --cg-primary-hover: #2563eb;
  --cg-bg: #ffffff;
  --cg-bg-secondary: #f9fafb;
  --cg-text: #1f2937;
  --cg-text-secondary: #6b7280;
  --cg-border: #e5e7eb;
  --cg-radius: 12px;
}
```

## TypeScript

Full TypeScript support with exported types:

```typescript
import type {
  Article,
  ArticleWithContent,
  Pagination,
  Category,
  Tag,
  ClientConfig,
  ListArticlesOptions,
  BlogListProps,
  BlogPostProps
} from '@content-growth/content-widget/core';
```

## Getting Your API Key

1. Sign in to [Content Growth](https://app.content-growth.com)
2. Go to Settings → API Keys
3. Create a new API key
4. Copy the key (starts with `pk_`)

## Examples

### Next.js App Router

```tsx
// app/articles/page.tsx
import { BlogList } from '@content-growth/content-widget/react';
import '@content-growth/content-widget/styles.css';

export default function ArticlesPage() {
  return (
    <main>
      <h1>Articles</h1>
      <BlogList apiKey={process.env.CG_API_KEY!} />
    </main>
  );
}
```

### Nuxt 3

```vue
<!-- pages/articles.vue -->
<template>
  <div>
    <h1>Articles</h1>
    <BlogList :api-key="apiKey" />
  </div>
</template>

<script setup>
import { BlogList } from '@content-growth/content-widget/vue';
import '@content-growth/content-widget/styles.css';

const config = useRuntimeConfig();
const apiKey = config.public.cgApiKey;
</script>
```

### Vanilla HTML

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://unpkg.com/@content-growth/content-widget/dist/styles.css">
</head>
<body>
  <div id="blog"></div>
  
  <script type="module">
    import { ContentGrowthWidget } from 'https://unpkg.com/@content-growth/content-widget/dist/widget/index.js';
    
    new ContentGrowthWidget(document.getElementById('blog'), {
      apiKey: 'pk_your_key_here'
    });
  </script>
</body>
</html>
```

## License

MIT

## Support

- [Documentation](https://docs.content-growth.com)
- [GitHub Issues](https://github.com/ContentGrowth/content-package/issues)
- [Email Support](mailto:support@content-growth.com)
