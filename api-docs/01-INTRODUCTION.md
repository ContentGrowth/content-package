# Content Growth Widget - Introduction

## What is Content Growth?

Content Growth is a headless content management platform that allows you to **create content once** and **present it anywhere**. Whether you need SEO-optimized server-side rendering or dynamic client-side widgets, Content Growth provides the tools to seamlessly integrate your content into any application.

## Key Concepts

### 1. Create Once, Present Anywhere

The core philosophy of Content Growth is content reusability:

- **Write your content once** in the Content Growth dashboard
- **Use it everywhere** - blog, documentation, marketing pages, mobile apps
- **Update once, reflect everywhere** - changes propagate automatically
- **No vendor lock-in** - your content is accessible via standard APIs

### 2. Two Integration Approaches

Content Growth offers two complementary integration methods:

#### Server-Side Rendering (SSR)
- **Perfect for SEO** - Content is rendered on the server
- **Unique URLs** - Each article gets its own URL
- **Fast initial load** - Pre-rendered HTML
- **Search engine friendly** - Fully indexable content
- **Use cases**: Blogs, documentation, marketing content

#### Client-Side Widget
- **Dynamic loading** - Content loads on demand
- **No build tools required** - Drop-in JavaScript widget
- **Real-time updates** - Content refreshes without deployment
- **Framework agnostic** - Works with any website
- **Use cases**: Dashboards, portals, dynamic content areas

### 3. Content Model

Every piece of content in Content Growth has:

```typescript
{
  uuid: string;           // Unique identifier
  slug: string;           // SEO-friendly URL slug
  title: string;          // Article title
  summary: string;        // AI-generated summary
  content: string;        // Full markdown content
  authorName: string;     // Author name
  publishedAt: number;    // Unix timestamp
  wordCount: number;      // Word count for reading time
  tags: string[];         // Tags for filtering
  category: string;       // Category (guide, how-to, announce, etc.)
}
```

### 4. Categories vs Tags

**Categories** are primary content types:
- `guide` - Long-form guides and tutorials
- `how-to` - Step-by-step instructions
- `announce` - News and announcements
- Custom categories you define

**Tags** are flexible labels:
- Multiple tags per article
- Used for filtering and search
- Examples: `beginner`, `advanced`, `tutorial`, `api`

### 5. Link Patterns

Link patterns define how articles are accessed:

```
/blog/{slug}           → /blog/getting-started
/docs/{category}/{slug} → /docs/guides/installation
/articles/{uuid}       → /articles/123e4567-e89b-12d3...
```

**Available placeholders:**
- `{uuid}` - Article UUID
- `{slug}` - Article slug
- `{category}` - Article category

## Integration Options

### Option 1: Server-Side Components

**Best for:** SEO-critical content, blogs, documentation

**Frameworks supported:**
- Astro
- React (Next.js, Remix)
- Vue (Nuxt)
- Svelte (SvelteKit)

**Benefits:**
- ✅ Perfect SEO - content in HTML
- ✅ Fast initial load
- ✅ Unique URLs per article
- ✅ Static site generation support

**Example:**
```astro
<ContentList category="guide" linkPattern="/blog/{slug}" />
```

### Option 2: Frontend Widget

**Best for:** Dynamic content, dashboards, quick integration

**Requirements:**
- Modern browser (ES6+)
- No build tools needed

**Benefits:**
- ✅ Drop-in solution
- ✅ Works anywhere
- ✅ Real-time updates
- ✅ No deployment needed

**Example:**
```html
<script src="https://unpkg.com/@contentgrowth/content-widget@latest/dist/widget/widget.js"></script>
<div id="content"></div>
<script>
  new ContentGrowthWidget(document.getElementById('content'), {
    apiKey: 'your-key',
    baseUrl: 'https://api.content-growth.com'
  });
</script>
```

### Option 3: Direct API

**Best for:** Custom implementations, mobile apps, advanced use cases

**Benefits:**
- ✅ Full control
- ✅ Use any language/framework
- ✅ Custom rendering
- ✅ Advanced filtering

**Example:**
```javascript
const response = await fetch('https://api.content-growth.com/widget/articles', {
  headers: { 'X-API-Key': 'your-key' }
});
const data = await response.json();
```

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                 Content Growth CMS                  │
│            (Create & Manage Content)                │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   Widget API          │
         │   (REST Endpoints)    │
         └───────┬───────────────┘
                 │
        ┌────────┼────────┐
        │        │        │
        ▼        ▼        ▼
   ┌────────┐ ┌────────┐ ┌────────┐
   │  SSR   │ │ Widget │ │  API   │
   │ Comps  │ │   JS   │ │ Direct │
   └────────┘ └────────┘ └────────┘
        │        │        │
        ▼        ▼        ▼
   ┌─────────────────────────┐
   │    Your Application     │
   └─────────────────────────┘
```

## Getting Started

1. **Sign up** at [content-growth.com](https://www.content-growth.com)
2. **Create content** in the dashboard
3. **Get your API key** from Settings → API Keys
4. **Choose integration method** (SSR, Widget, or API)
5. **Implement** using the guides below

## Documentation Structure

- **[Quick Start](./QUICK-START.md)** - Get running in 5 minutes
- **[API Reference](./02-API-REFERENCE.md)** - Complete API documentation
- **[SSR Components](./03-SSR-COMPONENTS.md)** - Server-side rendering guide
- **[Frontend Widget](./04-FRONTEND-WIDGET.md)** - Client-side widget guide
- **[Configuration](./05-CONFIGURATION.md)** - All options explained
- **[Examples](./06-EXAMPLES.md)** - Real-world use cases
- **[Styling](./07-STYLING.md)** - Customization guide

## Support

- **GitHub**: [github.com/ContentGrowth/content-package](https://github.com/ContentGrowth/content-package)
- **Issues**: [GitHub Issues](https://github.com/ContentGrowth/content-package/issues)
- **Website**: [content-growth.com](https://www.content-growth.com)

---

**Next:** [Quick Start Guide](./QUICK-START.md) →
