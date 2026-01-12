# Featured Content Card

> **Status:** ✅ Implemented  
> **Created:** 2026-01-11  
> **Updated:** 2026-01-12

## Overview

A new widget that displays the **latest article** from a "series" (defined by category/tags) as an **attractive promotional card** with a link to the full content—instead of showing the full article inline.

**Use Case:** Landing page hero sections, newsletter signup prompts, resource highlights.

---

## Implementation

The `FeaturedCard` component is now available in React, Vue, and Astro.

### Usage

```astro
<FeaturedCard
  apiKey="pk_your_key_here"
  category="announce"
  linkPattern="/articles/{slug}"
  layout="horizontal"
  borderStyle="dashed"
  itemsBackground="#f3f4f6"
  ctaText="Read full story"
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `apiKey` | string | - | Your API key (required) |
| `baseUrl` | string | - | API base URL |
| `category` | string | - | Filter by category |
| `tags` | string[] | [] | Filter by tags |
| `excludeTags` | string[] | [] | Exclude articles with these tags |
| `layout` | 'vertical' \| 'horizontal' | auto | Layout mode (auto uses article setting) |
| `borderStyle` | 'none' \| 'line' \| 'dashed' | 'none' | Card border style |
| `borderColor` | string | '#e5e7eb' | Border color (CSS value) |
| `cardBackground` | string | 'none' | Card background ('none' = transparent) |
| `itemsBackground` | string | '#f3f4f6' | Background for list/quote section |
| `ctaText` | string | 'Read full story' | Call-to-action text |
| `showAuthor` | boolean | false | Show author name |
| `showReadingTime` | boolean | false | Show reading time |
| `showCategory` | boolean | true | Show category badge |
| `linkPattern` | string | '/articles/{slug}' | URL pattern (supports {uuid}, {slug}, {category}) |

### Layout Modes

- **vertical** (default): Title + summary stacked vertically
- **horizontal**: Intro paragraph on left, list items on right (desktop only)

### Styling Examples

**No border (transparent):**
```astro
<FeaturedCard apiKey={apiKey} category="announce" />
```

**Dashed border:**
```astro
<FeaturedCard apiKey={apiKey} category="announce" borderStyle="dashed" />
```

**Solid border with custom color:**
```astro
<FeaturedCard apiKey={apiKey} category="announce" borderStyle="line" borderColor="#3b82f6" />
```

**Custom items background:**
```astro
<FeaturedCard apiKey={apiKey} category="announce" itemsBackground="#eff6ff" />
```

### Demo

View the live demo at `/demo/featured` on your wwwsite.

---

### 4. Auto-Link to Full Article

The card automatically wraps content in a link to the full article page.

**How it works:**
1. Widget fetches the latest article matching category/tags
2. `linkPattern` is populated with article's `{slug}` or `{uuid}`
3. Entire card (or just CTA) becomes a clickable link

**Example:**
```astro
<FeaturedContentCard 
  category="announce"
  linkPattern="/resources/{slug}"  <!-- Becomes /resources/growth-content-strategy -->
/>
```

**Rendered HTML:**
```html
<article class="cg-featured-card">
  <div class="cg-content-category">announce</div>
  <h2>Master Growth Content Strategy</h2>
  <p>Our platform helps you scale...</p>
  <a href="/resources/growth-content-strategy" class="cg-cta">
    Read More →
  </a>
</article>
```

**Placeholders supported in `linkPattern`:**
| Placeholder | Replaced With |
|-------------|---------------|
| `{slug}` | Article slug (e.g., `growth-content-strategy`) |
| `{uuid}` | Article UUID |
| `{category}` | Article category (lowercase) |

**SEO Benefits:**
- Static link in HTML (no JavaScript required)
- Search engines can follow and index the full article
- Works with SSR/SSG (Astro, Next.js, etc.)

---

## Implementation Plan

### Backend Changes

1. **Add templates config** to generation service
2. **Generate on publish**: Create promotional summaries for each template
3. **Store in metadata**: `promotionalSummary.{template}` field
4. **Expose via API**: Return in widget article response

### Widget Changes

1. **Create `FeaturedContentCard`** component (React, Vue, Astro)
2. **Render markdown** from selected template
3. **Apply default styles** with CSS variables for customization
4. **Support headless mode** via hooks for full user control

### Estimated Effort

| Task | Time |
|------|------|
| Backend: Template registry + prompts | 2 hours |
| Backend: Generation in publish flow | 2 hours |
| Backend: API changes | 30 min |
| Widget: FeaturedContentCard (3 frameworks) | 4 hours |
| Widget: Default CSS | 1 hour |
| Documentation + demo | 1 hour |
| **Total** | **~10-11 hours** |

---

## Alternatives Considered

1. **Slots-based customization** – More flexible but complex for users
2. **Headless-only** – Requires more work from users
3. **Single displayMode prop** – Makes FeaturedContent too complex

---

## Open Questions

1. Should templates be user-configurable or fixed?
2. Should we allow manual editing of promotional summaries in CMS?
3. How to handle regeneration if article content changes?
4. Should `linkUrl` auto-generate from slug or require explicit config?

---

## Decision

[ ] **Approved** – Proceed with implementation  
[ ] **Deferred** – Good idea, but not now  
[ ] **Rejected** – Not aligned with product direction
