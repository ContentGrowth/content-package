# Quick Start Guide

Get up and running with Content Growth in 5 minutes!

## Choose Your Integration

### 🚀 Option 1: Frontend Widget (No Build Tools)

Perfect for: Static sites, WordPress, any HTML page

```html
<!-- 1. Add script and styles -->
<script src="https://unpkg.com/@contentgrowth/content-widget@latest/dist/widget/widget.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@contentgrowth/content-widget@latest/dist/styles.css">

<!-- 2. Add container -->
<div id="my-content"></div>

<!-- 3. Initialize -->
<script>
  new ContentGrowthWidget(
    document.getElementById('my-content'),
    {
      apiKey: 'your-api-key',
      baseUrl: 'https://api.content-growth.com'
    }
  );
</script>
```

**That's it!** Your content is now live.

---

### ⚡ Option 2: Server-Side (SEO-Optimized)

Perfect for: Astro, Next.js, Nuxt, SvelteKit

#### Astro

```bash
npm install @contentgrowth/content-widget
```

```astro
---
import ContentList from '@contentgrowth/content-widget/astro/ContentList.astro';
import '@contentgrowth/content-widget/styles.css';
---

<ContentList 
  apiKey="your-api-key"
  baseUrl="https://api.content-growth.com"
  category="guide"
  linkPattern="/articles/{slug}"
/>
```

#### React

```tsx
import { ContentList } from '@contentgrowth/content-widget/react';
import '@contentgrowth/content-widget/styles.css';

export default function Blog() {
  return (
    <ContentList 
      apiKey="your-api-key"
      baseUrl="https://api.content-growth.com"
      category="guide"
    />
  );
}
```

#### Vue

```vue
<template>
  <ContentList 
    apiKey="your-api-key"
    baseUrl="https://api.content-growth.com"
    category="guide"
  />
</template>

<script setup>
import { ContentList } from '@contentgrowth/content-widget/vue';
import '@contentgrowth/content-widget/styles.css';
</script>
```

---

## Common Use Cases

### Blog with Categories

```astro
<h2>Guides</h2>
<ContentList category="guide" linkPattern="/blog/{slug}" />

<h2>Tutorials</h2>
<ContentList category="how-to" linkPattern="/tutorials/{slug}" />
```

### Single Article Page

```astro
---
const { slug } = Astro.params;
---

<ContentViewer slug={slug} showAiSummary={true} />
```

### Filtered Content

```javascript
new ContentGrowthWidget(container, {
  apiKey: 'your-api-key',
  baseUrl: 'https://api.content-growth.com',
  tags: ['tutorial', 'beginner'],
  category: 'guide'
});
```

---

## Get Your API Key

1. Sign up at [content-growth.com](https://www.content-growth.com)
2. Go to Settings → API Keys
3. Create a new API key
4. Copy and use in your integration

---

## Next Steps

- 📖 [Full API Documentation](./README.md)
- 🎨 [Styling Guide](./STYLING.md)
- 🔧 [Configuration Options](./README.md#configuration-options)
- 💡 [Examples](./README.md#examples)

---

## Need Help?

- [GitHub Issues](https://github.com/ContentGrowth/content-package/issues)
- [Documentation](https://github.com/ContentGrowth/content-package/api-docs)
