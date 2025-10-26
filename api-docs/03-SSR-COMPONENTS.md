# Server-Side Rendering (SSR) Components

Complete guide to using Content Growth with server-side rendering frameworks.

## Overview

SSR components render content on the server, providing:
- ✅ **Perfect SEO** - Content in HTML source
- ✅ **Fast initial load** - Pre-rendered pages
- ✅ **Unique URLs** - Each article gets its own URL
- ✅ **Static generation** - Build-time rendering support

## Installation

```bash
npm install @contentgrowth/content-widget
```

## Supported Frameworks

- **Astro** - Recommended for content sites
- **React** - Next.js, Remix
- **Vue** - Nuxt
- **Svelte** - SvelteKit

---

## Astro Components

### ContentList

Display a paginated list of articles.

#### Basic Usage

```astro
---
import ContentList from '@contentgrowth/content-widget/astro/ContentList.astro';
import '@contentgrowth/content-widget/styles.css';

const apiKey = import.meta.env.PUBLIC_CG_API_KEY;
const baseUrl = import.meta.env.PUBLIC_CG_API_URL;
---

<ContentList 
  apiKey={apiKey}
  baseUrl={baseUrl}
  category="guide"
  layout="cards"
  pageSize={12}
  linkPattern="/blog/{slug}"
/>
```

#### Props Reference

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `apiKey` | string | ✅ Yes | - | Your Content Growth API key |
| `baseUrl` | string | ✅ Yes | - | API base URL |
| `category` | string | No | - | Filter by category (`guide`, `how-to`, `announce`) |
| `tags` | string | No | - | Filter by tags (comma-separated: `"tutorial,beginner"`) |
| `layout` | `'cards'` \| `'rows'` | No | `'cards'` | Display layout mode |
| `pageSize` | number | No | `12` | Number of articles per page |
| `showPagination` | boolean | No | `true` | Show pagination controls |
| `linkPattern` | string | No | `'/article/{uuid}'` | URL pattern for article links |
| `showAiSummary` | boolean | No | `false` | Show AI summaries in list |

#### Link Patterns

Define how article URLs are structured using placeholders:

**Available placeholders:**
- `{uuid}` - Article UUID
- `{slug}` - Article slug (SEO-friendly)
- `{category}` - Article category

**Examples:**

```astro
<!-- Simple blog -->
<ContentList linkPattern="/blog/{slug}" />
<!-- Result: /blog/getting-started -->

<!-- Category-based -->
<ContentList linkPattern="/docs/{category}/{slug}" />
<!-- Result: /docs/guides/installation -->

<!-- UUID-based -->
<ContentList linkPattern="/articles/{uuid}" />
<!-- Result: /articles/123e4567-e89b... -->
```

#### Layout Modes

**Cards Layout** (Default)
- Grid display
- Visual emphasis
- Good for browsing
- Shows thumbnails (if available)

```astro
<ContentList layout="cards" />
```

**Rows Layout**
- List display
- More compact
- Better for long lists
- Shows more metadata

```astro
<ContentList layout="rows" />
```

#### Filtering Examples

**By Category:**
```astro
<!-- Only guides -->
<ContentList category="guide" />

<!-- Only how-to articles -->
<ContentList category="how-to" />

<!-- Only announcements -->
<ContentList category="announce" />
```

**By Tags:**
```astro
<!-- Single tag -->
<ContentList tags="beginner" />

<!-- Multiple tags -->
<ContentList tags="tutorial,beginner,api" />
```

**Combined:**
```astro
<!-- Beginner guides only -->
<ContentList 
  category="guide" 
  tags="beginner" 
/>
```

#### Complete Example

```astro
---
import ContentList from '@contentgrowth/content-widget/astro/ContentList.astro';
import '@contentgrowth/content-widget/styles.css';

const apiKey = import.meta.env.PUBLIC_CG_API_KEY;
const baseUrl = import.meta.env.PUBLIC_CG_API_URL || 'https://api.content-growth.com';
---

<main>
  <h1>Guides & Tutorials</h1>
  
  <section>
    <h2>Getting Started</h2>
    <ContentList 
      apiKey={apiKey}
      baseUrl={baseUrl}
      category="guide"
      tags="beginner"
      layout="cards"
      pageSize={6}
      linkPattern="/guides/{slug}"
    />
  </section>
  
  <section>
    <h2>How-To Articles</h2>
    <ContentList 
      apiKey={apiKey}
      baseUrl={baseUrl}
      category="how-to"
      layout="rows"
      pageSize={10}
      linkPattern="/how-to/{slug}"
    />
  </section>
</main>
```

---

### ContentViewer

Display a single article with full content.

#### Basic Usage

```astro
---
import ContentViewer from '@contentgrowth/content-widget/astro/ContentViewer.astro';
import '@contentgrowth/content-widget/styles.css';

const apiKey = import.meta.env.PUBLIC_CG_API_KEY;
const baseUrl = import.meta.env.PUBLIC_CG_API_URL;
const { slug } = Astro.params;
---

<ContentViewer 
  apiKey={apiKey}
  baseUrl={baseUrl}
  slug={slug}
  showAiSummary={true}
  theme="light"
/>
```

#### Props Reference

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `apiKey` | string | ✅ Yes | - | Your Content Growth API key |
| `baseUrl` | string | ✅ Yes | - | API base URL |
| `slug` | string | ⚠️ One required | - | Article slug (SEO-friendly URL) |
| `uuid` | string | ⚠️ One required | - | Article UUID (unique identifier) |
| `showAiSummary` | boolean | No | `true` | Display AI-generated summary box |
| `theme` | `'light'` \| `'dark'` | No | `'light'` | Color theme |

**Note:** You must provide either `slug` OR `uuid`, not both.

#### Slug vs UUID

**Use Slug when:**
- ✅ SEO is important
- ✅ URLs should be readable
- ✅ Building a blog or documentation

**Use UUID when:**
- ✅ Need guaranteed uniqueness
- ✅ Internal references
- ✅ Database lookups

**Example:**
```astro
<!-- SEO-friendly -->
<ContentViewer slug="getting-started" />
<!-- URL: /blog/getting-started -->

<!-- UUID-based -->
<ContentViewer uuid="123e4567-e89b-12d3-a456-426614174000" />
<!-- URL: /articles/123e4567-e89b-12d3-a456-426614174000 -->
```

#### AI Summary

The AI summary appears at the top of articles:

```astro
<!-- Show AI summary (default) -->
<ContentViewer slug={slug} showAiSummary={true} />

<!-- Hide AI summary -->
<ContentViewer slug={slug} showAiSummary={false} />
```

**When to hide:**
- Announcements (usually short)
- News articles
- Brief updates

**When to show:**
- Long-form guides
- Tutorials
- Technical documentation

#### Dynamic Routing Example

Create a dynamic route for articles:

```astro
---
// pages/blog/[slug].astro
import ContentViewer from '@contentgrowth/content-widget/astro/ContentViewer.astro';
import Layout from '../layouts/Layout.astro';
import '@contentgrowth/content-widget/styles.css';

const apiKey = import.meta.env.PUBLIC_CG_API_KEY;
const baseUrl = import.meta.env.PUBLIC_CG_API_URL;
const { slug } = Astro.params;
---

<Layout title="Blog Article">
  <main class="max-w-4xl mx-auto px-4 py-12">
    <ContentViewer 
      apiKey={apiKey}
      baseUrl={baseUrl}
      slug={slug}
      showAiSummary={true}
      theme="light"
    />
  </main>
</Layout>
```

---

## React Components

### Installation

```bash
npm install @contentgrowth/content-widget
```

### ContentList

```tsx
import { ContentList } from '@contentgrowth/content-widget/react';
import '@contentgrowth/content-widget/styles.css';

export default function BlogPage() {
  return (
    <ContentList 
      apiKey={process.env.PUBLIC_CG_API_KEY}
      baseUrl={process.env.PUBLIC_CG_API_URL}
      category="guide"
      layout="cards"
      pageSize={12}
      linkPattern="/blog/{slug}"
    />
  );
}
```

### ContentViewer

```tsx
import { ContentViewer } from '@contentgrowth/content-widget/react';
import '@contentgrowth/content-widget/styles.css';
import { useParams } from 'react-router-dom';

export default function ArticlePage() {
  const { slug } = useParams();
  
  return (
    <ContentViewer 
      apiKey={process.env.PUBLIC_CG_API_KEY}
      baseUrl={process.env.PUBLIC_CG_API_URL}
      slug={slug}
      showAiSummary={true}
    />
  );
}
```

### Next.js Example

```tsx
// app/blog/[slug]/page.tsx
import { ContentViewer } from '@contentgrowth/content-widget/react';
import '@contentgrowth/content-widget/styles.css';

export default function ArticlePage({ params }: { params: { slug: string } }) {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <ContentViewer 
        apiKey={process.env.PUBLIC_CG_API_KEY!}
        baseUrl={process.env.PUBLIC_CG_API_URL!}
        slug={params.slug}
        showAiSummary={true}
      />
    </main>
  );
}
```

---

## Vue Components

### Installation

```bash
npm install @contentgrowth/content-widget
```

### ContentList

```vue
<template>
  <ContentList 
    :apiKey="apiKey"
    :baseUrl="baseUrl"
    category="guide"
    layout="cards"
    :pageSize="12"
    linkPattern="/blog/{slug}"
  />
</template>

<script setup>
import { ContentList } from '@contentgrowth/content-widget/vue';
import '@contentgrowth/content-widget/styles.css';

const apiKey = import.meta.env.VITE_CG_API_KEY;
const baseUrl = import.meta.env.VITE_CG_API_URL;
</script>
```

### ContentViewer

```vue
<template>
  <ContentViewer 
    :apiKey="apiKey"
    :baseUrl="baseUrl"
    :slug="slug"
    :showAiSummary="true"
  />
</template>

<script setup>
import { ContentViewer } from '@contentgrowth/content-widget/vue';
import '@contentgrowth/content-widget/styles.css';
import { useRoute } from 'vue-router';

const route = useRoute();
const slug = route.params.slug;

const apiKey = import.meta.env.VITE_CG_API_KEY;
const baseUrl = import.meta.env.VITE_CG_API_URL;
</script>
```

---

## Environment Variables

### Setup

Create a `.env` file:

```bash
# .env
PUBLIC_CG_API_KEY=your-api-key-here
PUBLIC_CG_API_URL=https://api.content-growth.com
```

### Framework-Specific

**Astro:**
```javascript
const apiKey = import.meta.env.PUBLIC_CG_API_KEY;
```

**Next.js:**
```javascript
const apiKey = process.env.PUBLIC_CG_API_KEY;
```

**Vite (Vue/React):**
```javascript
const apiKey = import.meta.env.VITE_CG_API_KEY;
```

**Nuxt:**
```javascript
const config = useRuntimeConfig();
const apiKey = config.public.cgApiKey;
```

---

## Best Practices

### 1. Use Environment Variables

Never hardcode API keys:

```astro
<!-- ❌ Bad -->
<ContentList apiKey="pk_live_abc123" />

<!-- ✅ Good -->
<ContentList apiKey={import.meta.env.PUBLIC_CG_API_KEY} />
```

### 2. Implement Error Boundaries

Handle API failures gracefully:

```tsx
import { ErrorBoundary } from 'react-error-boundary';

<ErrorBoundary fallback={<div>Failed to load content</div>}>
  <ContentList apiKey={apiKey} baseUrl={baseUrl} />
</ErrorBoundary>
```

### 3. Optimize Link Patterns

Use SEO-friendly slugs:

```astro
<!-- ✅ Good for SEO -->
<ContentList linkPattern="/blog/{slug}" />

<!-- ❌ Not SEO-friendly -->
<ContentList linkPattern="/article/{uuid}" />
```

### 4. Category Organization

Organize content by category:

```astro
<!-- Separate sections -->
<section>
  <h2>Guides</h2>
  <ContentList category="guide" />
</section>

<section>
  <h2>Tutorials</h2>
  <ContentList category="how-to" />
</section>
```

---

**Next:** [Frontend Widget Guide](./04-FRONTEND-WIDGET.md) →
