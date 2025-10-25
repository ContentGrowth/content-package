# Frontend Widget Guide

Complete guide to using the Content Growth JavaScript widget for client-side rendering.

## Overview

The frontend widget is a **pure JavaScript solution** that requires no build tools. Perfect for:
- ✅ Static HTML sites
- ✅ WordPress, Wix, Squarespace
- ✅ Quick prototypes
- ✅ Dynamic dashboards
- ✅ Any website

## Installation

### Via CDN (Recommended)

```html
<!-- Load widget script -->
<script src="https://unpkg.com/@contentgrowth/content-widget@latest/dist/widget/widget.js"></script>

<!-- Load widget styles -->
<link rel="stylesheet" href="https://unpkg.com/@contentgrowth/content-widget@latest/dist/styles.css">
```

### Via NPM

```bash
npm install @contentgrowth/content-widget
```

```javascript
import { ContentGrowthWidget } from '@contentgrowth/content-widget/widget';
import '@contentgrowth/content-widget/styles.css';
```

---

## Basic Usage

### List Mode

Display a list of articles:

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://unpkg.com/@contentgrowth/content-widget@latest/dist/styles.css">
</head>
<body>
  <!-- Container for widget -->
  <div id="my-articles"></div>

  <!-- Load widget -->
  <script src="https://unpkg.com/@contentgrowth/content-widget@latest/dist/widget/widget.js"></script>
  
  <!-- Initialize -->
  <script>
    new ContentGrowthWidget(
      document.getElementById('my-articles'),
      {
        apiKey: 'your-api-key',
        baseUrl: 'https://api.content-growth.com',
        mode: 'list',
        category: 'guide',
        layoutMode: 'cards',
        displayMode: 'expanded', // show AI summary in list
        aiSummaryMaxBytes: 360,  // clamp AI summary to keep cards even
        pageSize: 12
      }
    );
  </script>
</body>
</html>
```

### Article Mode

Display a single article:

```html
<div id="article-viewer"></div>

<script>
  new ContentGrowthWidget(
    document.getElementById('article-viewer'),
    {
      apiKey: 'your-api-key',
      baseUrl: 'https://api.content-growth.com',
      mode: 'article-only',
      slug: 'getting-started'
    }
  );
</script>
```

---

## Configuration Options

### Complete Options Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | string | **required** | Your Content Growth API key |
| `baseUrl` | string | **required** | API base URL |
| `mode` | `'list'` \| `'article-only'` | `'list'` | Widget display mode |
| `slug` | string | - | Article slug (for article-only mode) |
| `articleId` | string | - | Article UUID (for article-only mode) |
| `category` | string | - | Filter by category |
| `tags` | string[] | `[]` | Filter by tags |
| `layoutMode` | `'cards'` \| `'rows'` | `'cards'` | List layout mode |
| `displayMode` | `'compact'` \| `'comfortable'` \| `'spacious'` | `'comfortable'` | Display density |
| `aiSummaryMaxBytes` | number | - | Max UTF-8 bytes of AI summary to render in list items (cards/rows). If omitted, full summary shows and card heights may vary. |
| `pageSize` | number | `12` | Articles per page |
| `theme` | `'light'` \| `'dark'` | `'light'` | Color theme |
| `viewerMode` | `'inline'` \| `'modal'` \| `'external'` | `'inline'` | How articles open |
| `externalUrlPattern` | string | `'/article/{id}'` | URL pattern for external links |
| `externalTarget` | string | `'article-{id}'` | Target for external links |
| `onArticleClick` | function | - | Callback when article is clicked |

---

## Mode Options

### List Mode (Default)

Shows a paginated list of articles.

```javascript
new ContentGrowthWidget(container, {
  apiKey: 'your-key',
  baseUrl: 'https://api.content-growth.com',
  mode: 'list',
  category: 'guide',
  pageSize: 12
});
```

**Features:**
- Pagination controls
- Filtering by category/tags
- Multiple layout modes
- Click to view full article

### Article-Only Mode

Shows a single article without list.

```javascript
// By slug
new ContentGrowthWidget(container, {
  apiKey: 'your-key',
  baseUrl: 'https://api.content-growth.com',
  mode: 'article-only',
  slug: 'getting-started'
});

// By UUID
new ContentGrowthWidget(container, {
  apiKey: 'your-key',
  baseUrl: 'https://api.content-growth.com',
  mode: 'article-only',
  articleId: '123e4567-e89b-12d3-a456-426614174000'
});
```

**Use cases:**
- Embed specific article
- Landing pages
- Documentation pages

---

## Layout Modes

### Cards Layout

Grid display with visual emphasis.

```javascript
{
  layoutMode: 'cards'
}
```

**Best for:**
- Visual browsing
- Image-heavy content
- Marketing content

**Appearance:**
```
┌────────┐ ┌────────┐ ┌────────┐
│ Card 1 │ │ Card 2 │ │ Card 3 │
└────────┘ └────────┘ └────────┘
┌────────┐ ┌────────┐ ┌────────┐
│ Card 4 │ │ Card 5 │ │ Card 6 │
└────────┘ └────────┘ └────────┘
```

### Rows Layout

List display with more details.

```javascript
{
  layoutMode: 'rows'
}
```

**Best for:**
- Text-heavy content
- Long article lists
- Documentation

**Appearance:**
```
┌─────────────────────────────────┐
│ Row 1                           │
├─────────────────────────────────┤
│ Row 2                           │
├─────────────────────────────────┤
│ Row 3                           │
└─────────────────────────────────┘
```

---

## Display Modes

Control the density and spacing of content.

### Compact

Minimal spacing, more content visible.

```javascript
{
  displayMode: 'compact'
}
```

**Use when:**
- Screen space is limited
- Showing many items
- Quick scanning needed

### Comfortable (Default)

Balanced spacing for readability.

```javascript
{
  displayMode: 'comfortable'
}
```

**Use when:**
- General purpose
- Mixed content types
- Standard blogs

### Spacious

Maximum spacing for focus.

```javascript
{
  displayMode: 'spacious'
}
```

**Use when:**
- Premium content
- Long-form articles
- Minimal design

---

## Viewer Modes

Control how articles open when clicked.

### Inline Mode (Default)

Articles replace the list within the widget.

```javascript
{
  viewerMode: 'inline'
}
```

**Features:**
- Back button to return to list
- Smooth transitions
- Single-page experience

**Best for:**
- Self-contained widgets
- Dashboards
- Embedded content

### Modal Mode

Articles open in a modal overlay.

```javascript
{
  viewerMode: 'modal'
}
```

**Features:**
- Overlay with backdrop
- Close button
- List remains visible behind

**Best for:**
- Quick previews
- Keeping context
- Multi-step flows

### External Mode

Articles open in new pages/tabs.

```javascript
{
  viewerMode: 'external',
  externalUrlPattern: '/blog/{slug}',
  externalTarget: '_blank'
}
```

**Features:**
- Full page navigation
- Custom URL patterns
- Target control (_blank, _self, etc.)

**Best for:**
- SEO-optimized sites
- Deep linking
- Shareable URLs

---

## Filtering

### By Category

Show only specific content types:

```javascript
// Only guides
{
  category: 'guide'
}

// Only how-to articles
{
  category: 'how-to'
}

// Only announcements
{
  category: 'announce'
}
```

### By Tags

Filter by one or more tags:

```javascript
// Single tag
{
  tags: ['beginner']
}

// Multiple tags (AND logic)
{
  tags: ['tutorial', 'beginner', 'api']
}
```

### Combined Filtering

```javascript
{
  category: 'guide',
  tags: ['beginner', 'tutorial']
}
```

---

## Theming

### Light Theme (Default)

```javascript
{
  theme: 'light'
}
```

### Dark Theme

```javascript
{
  theme: 'dark'
}
```

### Programmatic Theme Change

```javascript
const widget = new ContentGrowthWidget(container, {
  apiKey: 'your-key',
  baseUrl: 'https://api.content-growth.com',
  theme: 'light'
});

// Change theme later
widget.setTheme('dark');
```

---

## Event Handling

### Article Click Callback

Execute custom code when an article is clicked:

```javascript
new ContentGrowthWidget(container, {
  apiKey: 'your-key',
  baseUrl: 'https://api.content-growth.com',
  onArticleClick: (article) => {
    console.log('Article clicked:', article);
    
    // Track analytics
    gtag('event', 'article_view', {
      article_id: article.uuid,
      article_title: article.title
    });
    
    // Custom navigation
    window.location.href = `/custom/${article.slug}`;
  }
});
```

**Article object contains:**
- `uuid` - Article UUID
- `slug` - Article slug
- `title` - Article title
- `category` - Article category
- `tags` - Article tags
- All other article fields

---

## Complete Examples

### Blog Widget

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Blog</title>
  <link rel="stylesheet" href="https://unpkg.com/@contentgrowth/content-widget@latest/dist/styles.css">
  <style>
    body { font-family: system-ui; margin: 0; padding: 20px; }
    .container { max-width: 1200px; margin: 0 auto; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Latest Articles</h1>
    <div id="blog-content"></div>
  </div>

  <script src="https://unpkg.com/@contentgrowth/content-widget@latest/dist/widget/widget.js"></script>
  <script>
    new ContentGrowthWidget(
      document.getElementById('blog-content'),
      {
        apiKey: 'your-api-key',
        baseUrl: 'https://api.content-growth.com',
        mode: 'list',
        category: 'guide',
        layoutMode: 'cards',
        displayMode: 'comfortable',
        viewerMode: 'inline',
        pageSize: 12,
        theme: 'light'
      }
    );
  </script>
</body>
</html>
```

### Documentation Portal

```html
<div id="docs"></div>

<script>
  new ContentGrowthWidget(
    document.getElementById('docs'),
    {
      apiKey: 'your-api-key',
      baseUrl: 'https://api.content-growth.com',
      mode: 'list',
      category: 'how-to',
      layoutMode: 'rows',
      displayMode: 'compact',
      viewerMode: 'inline',
      pageSize: 20,
      tags: ['documentation']
    }
  );
</script>
```

### News Feed

```html
<div id="news"></div>

<script>
  new ContentGrowthWidget(
    document.getElementById('news'),
    {
      apiKey: 'your-api-key',
      baseUrl: 'https://api.content-growth.com',
      mode: 'list',
      category: 'announce',
      layoutMode: 'rows',
      displayMode: 'compact',
      pageSize: 5
    }
  );
</script>
```

### External Links Mode

```html
<div id="articles"></div>

<script>
  new ContentGrowthWidget(
    document.getElementById('articles'),
    {
      apiKey: 'your-api-key',
      baseUrl: 'https://api.content-growth.com',
      mode: 'list',
      viewerMode: 'external',
      externalUrlPattern: '/blog/{slug}',
      externalTarget: '_blank',
      layoutMode: 'cards'
    }
  );
</script>
```

---

## WordPress Integration

### Add to Theme

Edit your theme's `footer.php` or use a custom HTML block:

```html
<!-- Add before </body> -->
<div id="cg-content"></div>

<script src="https://unpkg.com/@contentgrowth/content-widget@latest/dist/widget/widget.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@contentgrowth/content-widget@latest/dist/styles.css">

<script>
  new ContentGrowthWidget(
    document.getElementById('cg-content'),
    {
      apiKey: '<?php echo get_option('cg_api_key'); ?>',
      baseUrl: 'https://api.content-growth.com',
      category: 'guide'
    }
  );
</script>
```

---

## Best Practices

### 1. Use Environment-Specific Keys

```javascript
const apiKey = window.location.hostname === 'localhost' 
  ? 'pk_test_key' 
  : 'pk_live_key';
```

### 2. Handle Loading States

```html
<div id="content">
  <p>Loading articles...</p>
</div>

<script>
  // Widget will replace loading message
  new ContentGrowthWidget(
    document.getElementById('content'),
    { apiKey: 'your-key', baseUrl: 'https://api.content-growth.com' }
  );
</script>
```

### 3. Responsive Design

The widget is responsive by default, but ensure container has proper width:

```css
#content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
```

### 4. Performance

Load widget script asynchronously:

```html
<script async src="https://unpkg.com/@contentgrowth/content-widget@latest/dist/widget/widget.js"></script>
```

---

## Troubleshooting

### Widget Not Showing

**Check:**
1. API key is correct
2. Container element exists
3. Script loaded successfully
4. No console errors

### Styling Issues

**Solutions:**
1. Ensure CSS is loaded
2. Check for CSS conflicts
3. Use custom CSS to override

### CORS Errors

**Solution:**
API should handle CORS automatically. If issues persist, contact support.

---

**Next:** [Configuration Reference](./05-CONFIGURATION.md) →
