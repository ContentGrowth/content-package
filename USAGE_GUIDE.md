# Content Growth Content Widget - Usage Guide

## 📦 Package Structure

```
content-package/
├── src/
│   ├── core/              # Framework-agnostic API client
│   │   ├── client.ts      # ContentGrowthClient class
│   │   ├── utils.ts       # Utility functions
│   │   └── index.ts       # Core exports
│   ├── widget/            # Vanilla JS widget
│   │   ├── components/    # Widget components
│   │   ├── utils/         # Widget utilities
│   │   ├── widget.js      # Main widget class
│   │   └── index.js       # Widget exports
│   ├── react/             # React components
│   │   ├── ContentList.tsx   # ContentList component
│   │   ├── ContentViewer.tsx   # ContentViewer component
│   │   ├── hooks.ts       # React hooks
│   │   └── index.ts       # React exports
│   ├── vue/               # Vue components
│   │   ├── ContentList.vue   # ContentList component
│   │   ├── ContentViewer.vue   # ContentViewer component
│   │   ├── composables.ts # Vue composables
│   │   └── index.ts       # Vue exports
│   ├── astro/             # Astro components
│   │   ├── ContentList.astro # Article list component
│   │   ├── ContentViewer.astro # Single article component
│   │   └── index.ts       # Astro exports
│   ├── types/             # TypeScript types
│   │   └── index.ts       # All type definitions
│   ├── styles.css         # Complete widget styles
│   └── index.ts           # Main entry point
├── package.json
├── tsconfig.json
├── README.md
└── USAGE_GUIDE.md (this file)
```

## 🚀 Local Development (Testing in wwwsite)

### Step 1: Link the Package Locally

The package is at `/content-package/`. You can use `npm link` to test it locally:

```bash
# In content-package directory
cd /home/coder/work/extra/content/content-package
npm install
npm run build
npm link

# In wwwsite directory
cd /home/coder/work/extra/content/wwwsite
npm link @content-growth/content-widget
```

Then in your Astro pages:

```astro
---
// Import from linked package
import { ContentList } from '@content-growth/content-widget/astro';
import '@content-growth/content-widget/styles.css';
---

<ContentList apiKey="pk_your_key" />
```

### Step 2: Create Test Pages

Create example pages to test the components:

**`src/pages/examples/content-list.astro`:**
```astro
---
import Layout from '../../layouts/Layout.astro';
import { ContentList } from '@content-growth/content-widget/astro';
import '@content-growth/content-widget/styles.css';
---

<Layout title="Content List Example">
  <main class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-8">Our Content</h1>
    
    <ContentList
      apiKey={import.meta.env.PUBLIC_CG_API_KEY || 'pk_test_key'}
      baseUrl={import.meta.env.PUBLIC_CG_API_URL || 'http://localhost:8787'}
      layout="cards"
      displayMode="comfortable"
      theme="light"
      pageSize={12}
    />
  </main>
</Layout>
```

**`src/pages/examples/content/[uuid].astro`:**
```astro
---
import Layout from '../../../layouts/Layout.astro';
import { ContentViewer } from '@content-growth/content-widget/astro';
import '@content-growth/content-widget/styles.css';

const { uuid } = Astro.params;
---

<Layout title="Article">
  <main class="container mx-auto px-4 py-8">
    <ContentViewer
      apiKey={import.meta.env.PUBLIC_CG_API_KEY || 'pk_test_key'}
      baseUrl={import.meta.env.PUBLIC_CG_API_URL || 'http://localhost:8787'}
      uuid={uuid}
      showBackButton={true}
      backUrl="/examples/content-list"
      theme="light"
    />
  </main>
</Layout>
```

### Step 3: Set Environment Variables

Create `.env` file in wwwsite root:

```env
PUBLIC_CG_API_KEY=pk_your_actual_key
PUBLIC_CG_API_URL=http://localhost:8787
```

### Step 4: Test Locally

```bash
cd wwwsite
npm run dev
```

Visit:
- `http://localhost:4321/examples/content-list` - Article list
- `http://localhost:4321/examples/content/{uuid}` - Single article

## 📤 Publishing to NPM

### Step 1: Build the Package

```bash
cd /home/coder/work/extra/content/content-package
npm install
npm run build
```

This will:
1. Compile TypeScript to JavaScript
2. Generate `.d.ts` type definition files
3. Copy Astro components to `dist/`
4. Copy CSS to `dist/`

### Step 2: Test the Build

```bash
# Check dist folder
ls -la dist/

# Should contain:
# - core/
# - widget/
# - react/
# - vue/
# - astro/
# - types/
# - index.js
# - index.d.ts
# - styles.css
```

### Step 3: Publish to NPM

```bash
# Login to NPM (first time only)
npm login

# Publish the package
npm publish --access public
```

### Step 4: Update Version

For future releases:

```bash
# Patch version (1.0.0 -> 1.0.1)
npm version patch

# Minor version (1.0.0 -> 1.1.0)
npm version minor

# Major version (1.0.0 -> 2.0.0)
npm version major

# Then publish
npm publish
```

## 🎯 Using the Published Package

Once published, users can install and use it:

```bash
npm install @content-growth/content-widget
```

```astro
---
import { ContentList } from '@content-growth/content-widget/astro';
import '@content-growth/content-widget/styles.css';
---

<ContentList apiKey="pk_user_key" />
```

## 🔧 Package Features

### 1. Core API Client

**Framework-agnostic** - Works with any JavaScript framework:

```typescript
import { ContentGrowthClient } from '@content-growth/content-widget/core';

const client = new ContentGrowthClient({
  apiKey: 'pk_xxx',
  cacheTTL: 300000 // 5 minutes
});

// List articles
const { articles, pagination } = await client.listArticles({
  page: 1,
  limit: 12,
  tags: ['tutorial'],
  category: 'guides'
});

// Get single article
const article = await client.getArticle('uuid');

// Get categories
const { categories } = await client.getCategories();

// Get tags
const { tags } = await client.getTags();
```

### 2. Astro Components

**Pre-built, styled components** for Astro:

- `ContentList` - Article list with pagination
- `ContentViewer` - Single article with markdown rendering

### 3. Utility Functions

**Helper functions** for common tasks:

```typescript
import {
  formatDate,
  calculateReadingTime,
  truncate,
  generateExcerpt,
  slugify
} from '@content-growth/content-widget/core';
```

### 4. TypeScript Support

**Full type safety** with exported types:

```typescript
import type {
  Article,
  ArticleWithContent,
  Pagination,
  ClientConfig,
  ContentListProps,
  ContentViewerProps
} from '@content-growth/content-widget/core';
```

### 5. Styling

**Complete CSS** with customizable variables:

```css
/* Override default styles */
.cg-content-list {
  --cg-primary: #your-color;
  --cg-radius: 8px;
}
```

## 🎨 Customization Examples

### Custom Styling

```astro
---
import { ContentList } from '@content-growth/content-widget/astro';
import '@content-growth/content-widget/styles.css';
---

<style>
  /* Override widget styles */
  :global(.cg-content-list) {
    --cg-primary: #10b981;
    --cg-radius: 16px;
  }
  
  /* Custom card hover effect */
  :global(.cg-article-card:hover) {
    transform: translateY(-4px);
  }
</style>

<ContentList apiKey="pk_xxx" class="my-custom-class" />
```

### Custom Layout

```astro
---
import { ContentGrowthClient } from '@content-growth/content-widget/core';

const client = new ContentGrowthClient({ apiKey: 'pk_xxx' });
const { articles } = await client.listArticles();
---

<div class="my-custom-grid">
  {articles.map(article => (
    <div class="my-custom-card">
      <h2>{article.title}</h2>
      <p>{article.summary}</p>
      <a href={`/articles/${article.uuid}`}>Read more</a>
    </div>
  ))}
</div>
```

## 📝 Best Practices

### 1. Environment Variables

Store API keys in environment variables:

```env
# .env
PUBLIC_CG_API_KEY=pk_your_key_here
```

```astro
---
<ContentList apiKey={import.meta.env.PUBLIC_CG_API_KEY} />
---
```

### 2. Error Handling

Wrap components in error boundaries:

```astro
---
import { ContentList } from '@content-growth/content-widget/astro';

let error = null;
try {
  // Component will handle its own errors
} catch (e) {
  error = e;
}
---

{error ? (
  <div class="error">Failed to load articles</div>
) : (
  <ContentList apiKey="pk_xxx" />
)}
```

### 3. Performance

Use caching and pagination:

```typescript
const client = new ContentGrowthClient({
  apiKey: 'pk_xxx',
  cacheTTL: 300000 // 5 minutes cache
});

// Paginate for better performance
const { articles } = await client.listArticles({
  limit: 12 // Don't load too many at once
});
```

### 4. SEO

Use proper meta tags with ContentViewer:

```astro
---
import { ContentViewer } from '@content-growth/content-widget/astro';
import { ContentGrowthClient } from '@content-growth/content-widget/core';

const { uuid } = Astro.params;
const client = new ContentGrowthClient({ apiKey: 'pk_xxx' });
const article = await client.getArticle(uuid);
---

<head>
  <title>{article.title}</title>
  <meta name="description" content={article.summary} />
  <meta property="og:title" content={article.title} />
  <meta property="og:description" content={article.summary} />
</head>

<ContentViewer apiKey="pk_xxx" uuid={uuid} />
```

## 🐛 Troubleshooting

### Issue: "Module not found"

**Solution:** Make sure you're importing from the correct path:

```typescript
// ✅ Correct
import { ContentGrowthClient } from '@content-growth/content-widget/core';
import { ContentList } from '@content-growth/content-widget/astro';

// ❌ Wrong
import { ContentGrowthClient } from '@content-growth/content-widget';
```

### Issue: "API key invalid"

**Solution:** Check your API key:
- Must start with `pk_`
- Must be active in your Content Growth account
- Check environment variable is set correctly

### Issue: "No articles found"

**Solution:** 
- Verify you have published articles
- Check filters (tags, category) aren't too restrictive
- Test API endpoint directly: `GET /widget/articles`

### Issue: Styles not loading

**Solution:** Import the CSS file:

```astro
---
import '@content-growth/content-widget/styles.css';
---
```

## 📚 Additional Resources

- **API Documentation:** https://docs.content-growth.com/api
- **Component Examples:** https://docs.content-growth.com/widgets
- **GitHub Repository:** https://github.com/ContentGrowth/content-package
- **Support:** support@content-growth.com

## 🎉 Next Steps

1. **Test locally** with the examples above
2. **Build the package** with `npm run build`
3. **Publish to NPM** with `npm publish`
4. **Update documentation** with real examples
5. **Create demo site** showcasing all features

---

**Package Version:** 1.0.0  
**Last Updated:** October 24, 2025
