# Content Growth Widget - Complete Documentation

**Create once. Present anywhere. Perfect SEO.**

## 📚 Documentation Index

### Getting Started
- **[Introduction](./01-INTRODUCTION.md)** - Concepts, architecture, and overview
- **[Quick Start](./QUICK-START.md)** - Get running in 5 minutes

### API & Integration
- **[API Reference](./02-API-REFERENCE.md)** - Complete REST API documentation
- **[SSR Components](./03-SSR-COMPONENTS.md)** - Server-side rendering (Astro, React, Vue)
- **[Frontend Widget](./04-FRONTEND-WIDGET.md)** - Client-side JavaScript widget
- **[Configuration](./05-CONFIGURATION.md)** - All options and settings explained

### Advanced
- **[Examples](./06-EXAMPLES.md)** - Real-world use cases and patterns
- **[Styling](./07-STYLING.md)** - Customization and theming guide

---

## Quick Links

| What do you want to do? | Go to |
|--------------------------|-------|
| Understand the concepts | [Introduction](./01-INTRODUCTION.md) |
| Get started quickly | [Quick Start](./QUICK-START.md) |
| Build an SEO-friendly blog | [SSR Components](./03-SSR-COMPONENTS.md) |
| Add dynamic content to any site | [Frontend Widget](./04-FRONTEND-WIDGET.md) |
| Use the API directly | [API Reference](./02-API-REFERENCE.md) |
| Customize the look | [Styling Guide](./07-STYLING.md) |
| See examples | [Examples](./06-EXAMPLES.md) |

---

## What is Content Growth?

Content Growth is a **headless CMS** that lets you:

1. ✍️ **Create content once** in a user-friendly dashboard
2. 🚀 **Present it anywhere** - blog, docs, marketing pages, apps
3. 🔄 **Update once, reflect everywhere** - changes propagate automatically
4. 🎯 **Choose your integration** - SEO-optimized SSR or dynamic widgets

---

## Integration Methods

### 1. Server-Side Components (Best for SEO)

Perfect for blogs, documentation, and content-heavy sites.

```astro
import ContentList from '@contentgrowth/content-widget/astro/ContentList.astro';

<ContentList 
  apiKey="your-key"
  baseUrl="https://api.content-growth.com"
  category="guide"
  linkPattern="/blog/{slug}"
/>
```

**Benefits:**
- ✅ Perfect SEO - content in HTML
- ✅ Fast initial load
- ✅ Unique URLs per article
- ✅ Works with Astro, React, Vue

[Learn more →](./03-SSR-COMPONENTS.md)

---

### 2. Frontend Widget (Best for Dynamic Content)

Perfect for dashboards, portals, and quick integration.

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

**Benefits:**
- ✅ No build tools needed
- ✅ Works anywhere
- ✅ Real-time updates
- ✅ Drop-in solution

[Learn more →](./04-FRONTEND-WIDGET.md)

---

### 3. Direct API (Best for Custom Implementations)

Perfect for mobile apps, custom UIs, and advanced use cases.

```javascript
const response = await fetch('https://api.content-growth.com/widget/articles', {
  headers: { 'X-API-Key': 'your-key' }
});
const data = await response.json();
```

**Benefits:**
- ✅ Full control
- ✅ Any language/framework
- ✅ Custom rendering
- ✅ Advanced filtering

[Learn more →](./02-API-REFERENCE.md)

---

## Key Features

### 🎯 Perfect SEO
Server-side rendering ensures content is in HTML source, fully indexable by search engines.

### ⚡ Fast Performance
Pre-rendered pages load instantly. Client-side caching reduces API calls.

### 🎨 Customizable
Full control over styling with CSS variables and custom themes.

### 📱 Responsive
Mobile-first design works perfectly on all devices.

### 🔄 Real-Time Updates
Update content once, see changes everywhere instantly.

### 🏷️ Flexible Filtering
Filter by categories, tags, or combine both for precise content selection.

### 📊 AI Summaries
Automatically generated summaries help readers quickly understand content.

### 🌐 Framework Agnostic
Works with Astro, React, Vue, Svelte, or vanilla JavaScript.

---

## Common Use Cases

### Blog
```astro
<ContentList 
  category="guide" 
  linkPattern="/blog/{slug}"
  layout="cards"
/>
```

### Documentation
```astro
<ContentList 
  category="how-to" 
  linkPattern="/docs/{category}/{slug}"
  layout="rows"
/>
```

### News Feed
```astro
<ContentList 
  category="announce" 
  pageSize={5}
  showAiSummary={false}
/>
```

### Knowledge Base
```astro
<ContentList 
  tags="faq,help" 
  linkPattern="/help/{slug}"
/>
```

[See more examples →](./06-EXAMPLES.md)

---

## Installation

### NPM
```bash
npm install @contentgrowth/content-widget
```

### CDN
```html
<script src="https://unpkg.com/@contentgrowth/content-widget@latest/dist/widget/widget.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@contentgrowth/content-widget@latest/dist/styles.css">
```

---

## Quick Start

### 1. Get Your API Key

1. Sign up at [content-growth.com](https://www.content-growth.com)
2. Go to **Settings** → **API Keys**
3. Create a new API key

### 2. Choose Your Integration

**For SEO (Astro/React/Vue):**
```astro
import ContentList from '@contentgrowth/content-widget/astro/ContentList.astro';
<ContentList apiKey="your-key" baseUrl="https://api.content-growth.com" />
```

**For Dynamic Content (Any Site):**
```html
<div id="content"></div>
<script>
  new ContentGrowthWidget(document.getElementById('content'), {
    apiKey: 'your-key',
    baseUrl: 'https://api.content-growth.com'
  });
</script>
```

### 3. Customize

Add categories, tags, layouts, and styling to match your needs.

[Full quick start guide →](./QUICK-START.md)

---

## Documentation Structure

```
api-docs/
├── README.md                  ← You are here
├── 01-INTRODUCTION.md         ← Concepts and architecture
├── 02-API-REFERENCE.md        ← Complete API documentation
├── 03-SSR-COMPONENTS.md       ← Server-side rendering guide
├── 04-FRONTEND-WIDGET.md      ← Client-side widget guide
├── 05-CONFIGURATION.md        ← All options explained
├── 06-EXAMPLES.md             ← Real-world examples
├── 07-STYLING.md              ← Customization guide
└── QUICK-START.md             ← 5-minute setup guide
```

---

## Support & Resources

- **GitHub**: [github.com/ContentGrowth/content-package](https://github.com/ContentGrowth/content-package)
- **Issues**: [Report bugs or request features](https://github.com/ContentGrowth/content-package/issues)
- **Website**: [content-growth.com](https://www.content-growth.com)
- **Live Demos**: [content-growth.com/demo](https://www.content-growth.com/demo)

---

## License

MIT License - See [LICENSE](../LICENSE) file for details.

---

## Next Steps

1. **New to Content Growth?** → Start with [Introduction](./01-INTRODUCTION.md)
2. **Want to get started quickly?** → Check [Quick Start](./QUICK-START.md)
3. **Building a blog?** → Read [SSR Components](./03-SSR-COMPONENTS.md)
4. **Need dynamic content?** → See [Frontend Widget](./04-FRONTEND-WIDGET.md)
5. **Want examples?** → Browse [Examples](./06-EXAMPLES.md)
