# Configuration Reference

Complete reference for all configuration options across SSR components and frontend widget.

## Common Options

These options work across all integration methods (SSR and Widget).

### apiKey

**Type:** `string`  
**Required:** Yes  
**Description:** Your Content Growth API key

```javascript
apiKey: 'pk_live_abc123xyz'
```

**Getting your API key:**
1. Log in to [content-growth.com](https://www.content-growth.com)
2. Go to Settings → API Keys
3. Create new key or copy existing

**Security:**
- ⚠️ Never expose live keys in client-side code
- ✅ Use environment variables
- ✅ Use test keys for development

---

### aiSummaryMaxBytes (Widget)

**Type:** `number`  
**Required:** No  
**Default:** `undefined` (no clamping)  
**Description:** Maximum UTF-8 byte length of the AI summary to render in list items (cards/rows). When set, summaries are truncated to ensure consistent card heights. When omitted, full summaries are shown and card sizes may vary.

```javascript
aiSummaryMaxBytes: 360   // Roughly ~360 ASCII chars, fewer for multi-byte
```

**Notes:**
- Truncation is UTF-8 byte-aware to avoid breaking multi-byte characters.
- Applies to list items; the full article view shows the complete summary.

---

### baseUrl

**Type:** `string`  
**Required:** Yes  
**Description:** Content Growth API base URL

```javascript
baseUrl: 'https://api.content-growth.com'
```

**Default value:** `https://api.content-growth.com`

---

### category

**Type:** `string`  
**Required:** No  
**Default:** `undefined` (all categories)  
**Description:** Filter articles by category

```javascript
category: 'guide'  // Only show guides
category: 'how-to' // Only show how-to articles
category: 'announce' // Only show announcements
```

**Common categories:**
- `guide` - Long-form guides and tutorials
- `how-to` - Step-by-step instructions
- `announce` - News and announcements
- Custom categories you define

---

### tags

**Type:** `string` (SSR) | `string[]` (Widget)  
**Required:** No  
**Default:** `undefined` (no tag filtering)  
**Description:** Filter articles by tags

**SSR (comma-separated string):**
```astro
tags="tutorial,beginner"
```

**Widget (array):**
```javascript
tags: ['tutorial', 'beginner']
```

**Behavior:** Articles must have ALL specified tags (AND logic)

---

## List Display Options

### layout / layoutMode

**Type:** `'cards'` | `'rows'`  
**Required:** No  
**Default:** `'cards'`  
**Description:** How articles are displayed

**SSR prop name:** `layout`
```astro
<ContentList layout="cards" />
```

**Widget prop name:** `layoutMode`
```javascript
layoutMode: 'cards'
```

**Cards:**
- Grid layout
- Visual emphasis
- Good for browsing
- Shows thumbnails

**Rows:**
- List layout
- More compact
- Better for scanning
- Shows more metadata

---

### displayMode

**Type:** `'compact'` | `'comfortable'` | `'spacious'`  
**Required:** No  
**Default:** `'comfortable'`  
**Description:** Display density and spacing

```javascript
displayMode: 'compact'      // Minimal spacing
displayMode: 'comfortable'  // Balanced (default)
displayMode: 'spacious'     // Maximum spacing
```

**Compact:**
- Minimal padding
- More items visible
- Quick scanning

**Comfortable:**
- Balanced spacing
- Good readability
- General purpose

**Spacious:**
- Maximum padding
- Premium feel
- Focus on content

---

### pageSize

**Type:** `number`  
**Required:** No  
**Default:** `12`  
**Description:** Number of articles per page

```javascript
pageSize: 12  // Default
pageSize: 24  // More per page
pageSize: 6   // Fewer per page
```

**Recommendations:**
- Cards layout: 6, 9, 12
- Rows layout: 10, 15, 20
- Mobile: Consider smaller values

---

### showPagination

**Type:** `boolean`  
**Required:** No  
**Default:** `true`  
**Description:** Show/hide pagination controls

```astro
<ContentList showPagination={true} />  <!-- Show (default) -->
<ContentList showPagination={false} /> <!-- Hide -->
```

**Hide when:**
- Showing all items (small lists)
- Infinite scroll implemented
- Single page display

---

### showAiSummary

**Type:** `boolean`  
**Required:** No  
**Default:** `true` (ContentViewer), `false` (ContentList)  
**Description:** Show AI-generated summaries

**In ContentViewer:**
```astro
<ContentViewer showAiSummary={true} />  <!-- Show summary box -->
<ContentViewer showAiSummary={false} /> <!-- Hide summary box -->
```

**In ContentList:**
```astro
<ContentList showAiSummary={true} />  <!-- Show in cards -->
<ContentList showAiSummary={false} /> <!-- Hide in cards -->
```

**When to show:**
- Long-form content
- Guides and tutorials
- Complex topics

**When to hide:**
- Short announcements
- News items
- Brief updates

---

## Link Configuration

### linkPattern

**Type:** `string`  
**Required:** No  
**Default:** `'/article/{uuid}'`  
**Description:** URL pattern for article links (SSR only)

**Available placeholders:**
- `{uuid}` - Article UUID
- `{slug}` - Article slug
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

<!-- Complex pattern -->
<ContentList linkPattern="/content/{category}/articles/{slug}" />
<!-- Result: /content/guides/articles/installation -->
```

**Best practices:**
- ✅ Use `{slug}` for SEO
- ✅ Include `{category}` for organization
- ❌ Avoid `{uuid}` unless necessary

---

## Widget-Specific Options

### mode

**Type:** `'list'` | `'article-only'`  
**Required:** No  
**Default:** `'list'`  
**Description:** Widget display mode

```javascript
mode: 'list'         // Show article list
mode: 'article-only' // Show single article
```

**List mode:**
- Shows paginated articles
- Filtering and search
- Click to view details

**Article-only mode:**
- Shows one article
- No list or navigation
- Direct content display

---

### slug

**Type:** `string`  
**Required:** No (required if `mode: 'article-only'`)  
**Description:** Article slug for article-only mode

```javascript
{
  mode: 'article-only',
  slug: 'getting-started'
}
```

**Use when:**
- Embedding specific article
- SEO-friendly URLs
- Human-readable identifiers

---

### articleId

**Type:** `string`  
**Required:** No (required if `mode: 'article-only'` and no slug)  
**Description:** Article UUID for article-only mode

```javascript
{
  mode: 'article-only',
  articleId: '123e4567-e89b-12d3-a456-426614174000'
}
```

**Use when:**
- Need guaranteed uniqueness
- Internal references
- Database lookups

---

### viewerMode

**Type:** `'inline'` | `'modal'` | `'external'`  
**Required:** No  
**Default:** `'inline'`  
**Description:** How articles open when clicked

```javascript
viewerMode: 'inline'    // Replace list with article
viewerMode: 'modal'     // Open in modal overlay
viewerMode: 'external'  // Navigate to new page
```

**Inline:**
- Single-page experience
- Back button to list
- Smooth transitions

**Modal:**
- Overlay display
- List visible behind
- Quick preview

**External:**
- Full page navigation
- Custom URLs
- SEO benefits

---

### externalUrlPattern

**Type:** `string`  
**Required:** No (required if `viewerMode: 'external'`)  
**Default:** `'/article/{id}'`  
**Description:** URL pattern for external links

```javascript
{
  viewerMode: 'external',
  externalUrlPattern: '/blog/{slug}'
}
```

**Placeholders:**
- `{id}` - Article UUID
- `{slug}` - Article slug
- `{category}` - Article category

---

### externalTarget

**Type:** `string`  
**Required:** No  
**Default:** `'article-{id}'`  
**Description:** Target for external links

```javascript
externalTarget: '_blank'      // New tab
externalTarget: '_self'       // Same tab
externalTarget: 'article-{id}' // Named window
```

**Common values:**
- `_blank` - New tab/window
- `_self` - Same tab (default browser behavior)
- `_parent` - Parent frame
- `_top` - Top-level frame
- Custom name - Named window

---

### theme

**Type:** `'light'` | `'dark'`  
**Required:** No  
**Default:** `'light'`  
**Description:** Color theme

```javascript
theme: 'light'  // Light theme (default)
theme: 'dark'   // Dark theme
```

**Programmatic change:**
```javascript
widget.setTheme('dark');
```

---

### onArticleClick

**Type:** `function`  
**Required:** No  
**Default:** `undefined`  
**Description:** Callback when article is clicked

```javascript
{
  onArticleClick: (article) => {
    console.log('Clicked:', article.title);
    
    // Custom analytics
    gtag('event', 'article_view', {
      article_id: article.uuid,
      article_title: article.title
    });
    
    // Custom navigation
    window.location.href = `/custom/${article.slug}`;
  }
}
```

**Article object:**
```typescript
{
  uuid: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  authorName: string;
  publishedAt: number;
  wordCount: number;
  tags: string[];
  category: string;
}
```

---

## SSR-Specific Options

### uuid

**Type:** `string`  
**Required:** No (required for ContentViewer if no slug)  
**Description:** Article UUID for ContentViewer

```astro
<ContentViewer uuid="123e4567-e89b-12d3-a456-426614174000" />
```

**Use slug OR uuid, not both.**

---

## Configuration Examples

### Minimal Configuration

```javascript
{
  apiKey: 'your-key',
  baseUrl: 'https://api.content-growth.com'
}
```

### Blog Configuration

```javascript
{
  apiKey: 'your-key',
  baseUrl: 'https://api.content-growth.com',
  category: 'guide',
  layoutMode: 'cards',
  displayMode: 'comfortable',
  pageSize: 12,
  viewerMode: 'inline',
  theme: 'light'
}
```

### Documentation Configuration

```javascript
{
  apiKey: 'your-key',
  baseUrl: 'https://api.content-growth.com',
  category: 'how-to',
  tags: ['documentation'],
  layoutMode: 'rows',
  displayMode: 'compact',
  pageSize: 20,
  viewerMode: 'inline'
}
```

### News Feed Configuration

```javascript
{
  apiKey: 'your-key',
  baseUrl: 'https://api.content-growth.com',
  category: 'announce',
  layoutMode: 'rows',
  displayMode: 'compact',
  pageSize: 5,
  showPagination: false
}
```

### External Links Configuration

```javascript
{
  apiKey: 'your-key',
  baseUrl: 'https://api.content-growth.com',
  viewerMode: 'external',
  externalUrlPattern: '/blog/{slug}',
  externalTarget: '_blank',
  layoutMode: 'cards'
}
```

---

## Environment Variables

### Astro

```javascript
// .env
CG_API_KEY=your-key
CG_API_URL=https://api.content-growth.com

// Component
const apiKey = import.meta.env.CG_API_KEY;
const baseUrl = import.meta.env.CG_API_URL;
```

### Next.js

```javascript
// .env.local
NEXT_PUBLIC_CG_API_KEY=your-key
NEXT_PUBLIC_CG_API_URL=https://api.content-growth.com

// Component
const apiKey = process.env.NEXT_PUBLIC_CG_API_KEY;
const baseUrl = process.env.NEXT_PUBLIC_CG_API_URL;
```

### Vite (Vue/React)

```javascript
// .env
VITE_CG_API_KEY=your-key
VITE_CG_API_URL=https://api.content-growth.com

// Component
const apiKey = import.meta.env.VITE_CG_API_KEY;
const baseUrl = import.meta.env.VITE_CG_API_URL;
```

---

## Validation

### Required Fields

These must always be provided:
- `apiKey`
- `baseUrl`

### Conditional Requirements

**For ContentViewer:**
- `slug` OR `uuid` (one required)

**For article-only mode:**
- `slug` OR `articleId` (one required)

**For external viewer mode:**
- `externalUrlPattern` (recommended)

---

## Default Values Summary

| Option | Default Value |
|--------|---------------|
| `layout` / `layoutMode` | `'cards'` |
| `displayMode` | `'comfortable'` |
| `pageSize` | `12` |
| `showPagination` | `true` |
| `showAiSummary` | `true` (viewer), `false` (list) |
| `linkPattern` | `'/article/{uuid}'` |
| `mode` | `'list'` |
| `viewerMode` | `'inline'` |
| `externalUrlPattern` | `'/article/{id}'` |
| `externalTarget` | `'article-{id}'` |
| `theme` | `'light'` |
| `category` | `undefined` (all) |
| `tags` | `undefined` (all) |
| `aiSummaryMaxBytes` | `undefined` (no clamp) |

---

**Next:** [Examples](./06-EXAMPLES.md) →
