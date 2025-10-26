# Real-World Examples

Practical examples for common use cases.

## Blog Examples

### Simple Blog

**Astro:**
```astro
---
import ContentList from '@contentgrowth/content-widget/astro/ContentList.astro';
import '@contentgrowth/content-widget/styles.css';

const apiKey = import.meta.env.PUBLIC_CG_API_KEY;
const baseUrl = import.meta.env.PUBLIC_CG_API_URL;
---

<main class="max-w-7xl mx-auto px-4 py-12">
  <h1 class="text-4xl font-bold mb-8">Blog</h1>
  
  <ContentList 
    apiKey={apiKey}
    baseUrl={baseUrl}
    category="guide"
    layout="cards"
    pageSize={12}
    linkPattern="/blog/{slug}"
  />
</main>
```

### Multi-Category Blog

```astro
<main>
  <section>
    <h2>Latest Guides</h2>
    <ContentList 
      category="guide"
      layout="cards"
      pageSize={6}
      linkPattern="/guides/{slug}"
    />
  </section>
  
  <section>
    <h2>How-To Articles</h2>
    <ContentList 
      category="how-to"
      layout="rows"
      pageSize={5}
      linkPattern="/how-to/{slug}"
    />
  </section>
  
  <section>
    <h2>Latest News</h2>
    <ContentList 
      category="announce"
      layout="rows"
      pageSize={3}
      showPagination={false}
      linkPattern="/news/{slug}"
    />
  </section>
</main>
```

### Blog with Article Page

**List page (`/blog/index.astro`):**
```astro
---
import ContentList from '@contentgrowth/content-widget/astro/ContentList.astro';
---

<ContentList 
  category="guide"
  linkPattern="/blog/{slug}"
/>
```

**Article page (`/blog/[slug].astro`):**
```astro
---
import ContentViewer from '@contentgrowth/content-widget/astro/ContentViewer.astro';

const { slug } = Astro.params;
---

<ContentViewer 
  slug={slug}
  showAiSummary={true}
/>
```

---

## Documentation Examples

### Documentation Portal

```astro
<nav>
  <a href="/docs/getting-started">Getting Started</a>
  <a href="/docs/guides">Guides</a>
  <a href="/docs/api">API Reference</a>
</nav>

<main>
  <ContentList 
    category="how-to"
    tags="documentation"
    layout="rows"
    displayMode="compact"
    pageSize={20}
    linkPattern="/docs/{slug}"
  />
</main>
```

### Searchable Docs

```html
<input type="text" id="search" placeholder="Search docs...">
<div id="docs"></div>

<script>
  const widget = new ContentGrowthWidget(
    document.getElementById('docs'),
    {
      apiKey: 'your-key',
      baseUrl: 'https://api.content-growth.com',
      category: 'how-to',
      layoutMode: 'rows'
    }
  );
  
  document.getElementById('search').addEventListener('input', (e) => {
    // Implement search filtering
    const query = e.target.value.toLowerCase();
    // Filter logic here
  });
</script>
```

---

## Marketing Examples

### Landing Page

```astro
<\!-- Hero Section -->
<section class="hero">
  <h1>Welcome to Our Platform</h1>
  <p>Learn how to get started</p>
</section>

<\!-- Featured Articles -->
<section>
  <h2>Getting Started</h2>
  <ContentList 
    tags="getting-started"
    layout="cards"
    pageSize={3}
    showPagination={false}
    linkPattern="/learn/{slug}"
  />
</section>

<\!-- Latest Updates -->
<section>
  <h2>What's New</h2>
  <ContentList 
    category="announce"
    layout="rows"
    pageSize={5}
    showPagination={false}
  />
</section>
```

### Resource Center

```astro
<div class="grid md:grid-cols-3 gap-8">
  <\!-- Guides Column -->
  <div>
    <h3>Guides</h3>
    <ContentList 
      category="guide"
      layout="rows"
      pageSize={5}
      showPagination={false}
    />
  </div>
  
  <\!-- Tutorials Column -->
  <div>
    <h3>Tutorials</h3>
    <ContentList 
      category="how-to"
      layout="rows"
      pageSize={5}
      showPagination={false}
    />
  </div>
  
  <\!-- News Column -->
  <div>
    <h3>News</h3>
    <ContentList 
      category="announce"
      layout="rows"
      pageSize={5}
      showPagination={false}
    />
  </div>
</div>
```

---

## Widget Examples

### WordPress Blog

```html
<\!-- Add to WordPress theme or page -->
<div id="blog-articles"></div>

<script src="https://unpkg.com/@contentgrowth/content-widget@latest/dist/widget/widget.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@contentgrowth/content-widget@latest/dist/styles.css">

<script>
  new ContentGrowthWidget(
    document.getElementById('blog-articles'),
    {
      apiKey: '<?php echo get_option("cg_api_key"); ?>',
      baseUrl: 'https://api.content-growth.com',
      category: 'guide',
      layoutMode: 'cards',
      viewerMode: 'modal'
    }
  );
</script>
```

### Dashboard Widget

```html
<div class="dashboard">
  <div class="widget-card">
    <h3>Recent Articles</h3>
    <div id="recent-articles"></div>
  </div>
</div>

<script>
  new ContentGrowthWidget(
    document.getElementById('recent-articles'),
    {
      apiKey: 'your-key',
      baseUrl: 'https://api.content-growth.com',
      layoutMode: 'rows',
      displayMode: 'compact',
      pageSize: 5,
      showPagination: false
    }
  );
</script>
```

---

## Advanced Examples

### Custom Analytics

```javascript
new ContentGrowthWidget(container, {
  apiKey: 'your-key',
  baseUrl: 'https://api.content-growth.com',
  onArticleClick: (article) => {
    // Google Analytics
    gtag('event', 'article_view', {
      article_id: article.uuid,
      article_title: article.title,
      article_category: article.category
    });
    
    // Mixpanel
    mixpanel.track('Article Viewed', {
      article_id: article.uuid,
      title: article.title
    });
    
    // Custom tracking
    fetch('/api/track', {
      method: 'POST',
      body: JSON.stringify({
        event: 'article_view',
        article: article.uuid
      })
    });
  }
});
```

### Dynamic Theme Switching

```html
<button id="theme-toggle">Toggle Theme</button>
<div id="content"></div>

<script>
  const widget = new ContentGrowthWidget(
    document.getElementById('content'),
    {
      apiKey: 'your-key',
      baseUrl: 'https://api.content-growth.com',
      theme: 'light'
    }
  );
  
  document.getElementById('theme-toggle').addEventListener('click', () => {
    const currentTheme = widget.theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    widget.setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  });
  
  // Restore saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    widget.setTheme(savedTheme);
  }
</script>
```

### Filtered Views

```html
<div class="filters">
  <button data-filter="all">All</button>
  <button data-filter="beginner">Beginner</button>
  <button data-filter="advanced">Advanced</button>
</div>

<div id="articles"></div>

<script>
  function createWidget(tags) {
    const container = document.getElementById('articles');
    container.innerHTML = '';
    
    new ContentGrowthWidget(container, {
      apiKey: 'your-key',
      baseUrl: 'https://api.content-growth.com',
      tags: tags,
      layoutMode: 'cards'
    });
  }
  
  // Initial load
  createWidget([]);
  
  // Filter buttons
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const filter = e.target.dataset.filter;
      const tags = filter === 'all' ? [] : [filter];
      createWidget(tags);
    });
  });
</script>
```

---

## Framework-Specific Examples

### Next.js App Router

```tsx
// app/blog/page.tsx
import { ContentList } from '@contentgrowth/content-widget/react';
import '@contentgrowth/content-widget/styles.css';

export default function BlogPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <ContentList 
        apiKey={process.env.PUBLIC_CG_API_KEY\!}
        baseUrl={process.env.PUBLIC_CG_API_URL\!}
        category="guide"
        layout="cards"
        pageSize={12}
        linkPattern="/blog/{slug}"
      />
    </main>
  );
}

// app/blog/[slug]/page.tsx
import { ContentViewer } from '@contentgrowth/content-widget/react';

export default function ArticlePage({ params }: { params: { slug: string } }) {
  return (
    <ContentViewer 
      apiKey={process.env.PUBLIC_CG_API_KEY\!}
      baseUrl={process.env.PUBLIC_CG_API_URL\!}
      slug={params.slug}
    />
  );
}
```

### Nuxt 3

```vue
<\!-- pages/blog/index.vue -->
<template>
  <main class="container mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold mb-8">Blog</h1>
    <ContentList 
      :apiKey="config.public.cgApiKey"
      :baseUrl="config.public.cgApiUrl"
      category="guide"
      layout="cards"
      :pageSize="12"
      linkPattern="/blog/{slug}"
    />
  </main>
</template>

<script setup>
import { ContentList } from '@contentgrowth/content-widget/vue';
import '@contentgrowth/content-widget/styles.css';

const config = useRuntimeConfig();
</script>

<\!-- pages/blog/[slug].vue -->
<template>
  <ContentViewer 
    :apiKey="config.public.cgApiKey"
    :baseUrl="config.public.cgApiUrl"
    :slug="route.params.slug"
  />
</template>

<script setup>
import { ContentViewer } from '@contentgrowth/content-widget/vue';

const route = useRoute();
const config = useRuntimeConfig();
</script>
```

---

**Next:** [Styling Guide](./07-STYLING.md) →
