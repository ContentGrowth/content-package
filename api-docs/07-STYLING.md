# Styling & Customization Guide

Complete guide to customizing the look and feel of Content Growth widgets.

## CSS Variables

Content Growth uses CSS custom properties for easy theming.

### Color Variables

```css
:root {
  /* Primary colors */
  --cg-primary-color: #3b82f6;
  --cg-primary-hover: #2563eb;
  
  /* Background colors */
  --cg-background-color: #ffffff;
  --cg-card-background: #ffffff;
  --cg-hover-background: #f3f4f6;
  
  /* Text colors */
  --cg-text-color: #1f2937;
  --cg-text-secondary: #6b7280;
  --cg-text-muted: #9ca3af;
  
  /* Border colors */
  --cg-border-color: #e5e7eb;
  --cg-border-hover: #d1d5db;
}
```

### Spacing Variables

```css
:root {
  /* Spacing */
  --cg-spacing-xs: 0.25rem;
  --cg-spacing-sm: 0.5rem;
  --cg-spacing-md: 1rem;
  --cg-spacing-lg: 1.5rem;
  --cg-spacing-xl: 2rem;
  
  /* Border radius */
  --cg-border-radius: 0.5rem;
  --cg-border-radius-sm: 0.25rem;
  --cg-border-radius-lg: 1rem;
}
```

### Typography Variables

```css
:root {
  /* Font families */
  --cg-font-family: system-ui, -apple-system, sans-serif;
  --cg-font-family-mono: 'Courier New', monospace;
  
  /* Font sizes */
  --cg-font-size-xs: 0.75rem;
  --cg-font-size-sm: 0.875rem;
  --cg-font-size-base: 1rem;
  --cg-font-size-lg: 1.125rem;
  --cg-font-size-xl: 1.25rem;
  --cg-font-size-2xl: 1.5rem;
  --cg-font-size-3xl: 1.875rem;
  
  /* Font weights */
  --cg-font-weight-normal: 400;
  --cg-font-weight-medium: 500;
  --cg-font-weight-semibold: 600;
  --cg-font-weight-bold: 700;
}
```

---

## Custom Themes

### Brand Colors

```css
:root {
  --cg-primary-color: #8b5cf6;      /* Purple brand */
  --cg-primary-hover: #7c3aed;
  --cg-card-background: #faf5ff;    /* Light purple tint */
}
```

### Dark Theme

```css
[data-theme="dark"] {
  --cg-background-color: #1f2937;
  --cg-card-background: #374151;
  --cg-text-color: #f9fafb;
  --cg-text-secondary: #d1d5db;
  --cg-text-muted: #9ca3af;
  --cg-border-color: #4b5563;
  --cg-hover-background: #4b5563;
}
```

### Minimal Theme

```css
:root {
  --cg-border-radius: 0;            /* Square corners */
  --cg-card-background: transparent; /* No background */
  --cg-border-color: #e5e7eb;
  --cg-spacing-md: 0.75rem;         /* Tighter spacing */
}
```

### Colorful Theme

```css
:root {
  --cg-primary-color: #ec4899;      /* Pink */
  --cg-border-radius-lg: 1.5rem;    /* Rounded */
  --cg-card-background: linear-gradient(135deg, #fef3c7 0%, #fce7f3 100%);
}
```

---

## Component Styling

### Card Styling

```css
/* Customize cards */
.cg-card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.cg-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

/* Card title */
.cg-card-title {
  color: var(--cg-primary-color);
  font-size: 1.25rem;
}

/* Card meta */
.cg-card-meta {
  font-size: 0.875rem;
  color: var(--cg-text-muted);
}
```

### List Styling

```css
/* Customize list layout */
.cg-content-grid {
  gap: 2rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.cg-content-rows {
  gap: 1rem;
}
```

### Pagination Styling

```css
/* Customize pagination */
.cg-pagination {
  margin-top: 3rem;
  gap: 1rem;
}

.cg-btn-prev,
.cg-btn-next {
  background: var(--cg-primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
}

.cg-btn-prev:hover,
.cg-btn-next:hover {
  background: var(--cg-primary-hover);
}

.cg-btn-prev:disabled,
.cg-btn-next:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Viewer Styling

```css
/* Article viewer */
.cg-content-viewer {
  max-width: 800px;
  margin: 0 auto;
}

.cg-content-title {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1rem;
}

.cg-content-body {
  font-size: 1.125rem;
  line-height: 1.75;
  color: var(--cg-text-color);
}

/* Code blocks in articles */
.cg-content-body pre {
  background: #1f2937;
  color: #f9fafb;
  padding: 1.5rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}
```

### AI Summary Styling

```css
/* AI summary box */
.cg-ai-summary {
  background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
  border-left: 4px solid var(--cg-primary-color);
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
}

.cg-ai-summary-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.cg-ai-icon {
  color: var(--cg-primary-color);
}
```

---

## Layout Customization

### Grid Layouts

```css
/* 2 columns on mobile, 3 on tablet, 4 on desktop */
.cg-content-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .cg-content-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .cg-content-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### Compact Layout

```css
/* Tighter spacing for compact displays */
.cg-card--compact {
  padding: 0.75rem;
}

.cg-card--compact .cg-card-title {
  font-size: 1rem;
}

.cg-card--compact .cg-card-meta {
  font-size: 0.75rem;
}
```

---

## Responsive Design

### Mobile Optimization

```css
@media (max-width: 640px) {
  /* Stack cards on mobile */
  .cg-content-grid {
    grid-template-columns: 1fr;
  }
  
  /* Smaller text on mobile */
  .cg-content-title {
    font-size: 1.75rem;
  }
  
  .cg-content-body {
    font-size: 1rem;
  }
  
  /* Adjust pagination */
  .cg-pagination {
    flex-direction: column;
    gap: 0.5rem;
  }
}
```

### Tablet Optimization

```css
@media (min-width: 641px) and (max-width: 1024px) {
  .cg-content-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

---

## Animation & Transitions

### Smooth Transitions

```css
.cg-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.cg-card:hover {
  transform: translateY(-4px);
}

/* Fade in animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.cg-card {
  animation: fadeIn 0.5s ease-out;
}
```

### Loading States

```css
.cg-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
}

.cg-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--cg-border-color);
  border-top-color: var(--cg-primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

---

## Complete Theme Examples

### Corporate Theme

```css
:root {
  /* Colors */
  --cg-primary-color: #1e40af;
  --cg-primary-hover: #1e3a8a;
  --cg-background-color: #f8fafc;
  --cg-card-background: #ffffff;
  --cg-text-color: #0f172a;
  
  /* Typography */
  --cg-font-family: 'Inter', system-ui, sans-serif;
  --cg-border-radius: 0.375rem;
  
  /* Spacing */
  --cg-spacing-md: 1.25rem;
}

.cg-card {
  border: 1px solid var(--cg-border-color);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

### Creative Theme

```css
:root {
  --cg-primary-color: #f59e0b;
  --cg-primary-hover: #d97706;
  --cg-background-color: #fffbeb;
  --cg-card-background: #ffffff;
  --cg-border-radius-lg: 2rem;
  --cg-font-family: 'Poppins', sans-serif;
}

.cg-card {
  border-radius: var(--cg-border-radius-lg);
  box-shadow: 0 10px 30px rgba(245, 158, 11, 0.2);
}

.cg-card-title {
  background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### Minimalist Theme

```css
:root {
  --cg-primary-color: #000000;
  --cg-background-color: #ffffff;
  --cg-card-background: #ffffff;
  --cg-border-color: #e5e7eb;
  --cg-border-radius: 0;
  --cg-font-family: 'Helvetica Neue', sans-serif;
}

.cg-card {
  border: 1px solid var(--cg-border-color);
  border-radius: 0;
  box-shadow: none;
}

.cg-card:hover {
  border-color: var(--cg-primary-color);
}
```

---

## Best Practices

### 1. Use CSS Variables

Always use CSS variables for consistency:

```css
/* ✅ Good */
.my-custom-element {
  color: var(--cg-primary-color);
}

/* ❌ Bad */
.my-custom-element {
  color: #3b82f6;
}
```

### 2. Maintain Specificity

Use appropriate specificity to override styles:

```css
/* Override card styles */
.my-blog .cg-card {
  background: #f0f9ff;
}
```

### 3. Responsive First

Design for mobile first, then enhance:

```css
/* Mobile first */
.cg-content-grid {
  grid-template-columns: 1fr;
}

/* Tablet and up */
@media (min-width: 768px) {
  .cg-content-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

### 4. Performance

Minimize animations and transitions:

```css
/* Use transform for better performance */
.cg-card:hover {
  transform: translateY(-4px);  /* ✅ GPU accelerated */
}

/* Avoid animating layout properties */
.cg-card:hover {
  margin-top: -4px;  /* ❌ Causes reflow */
}
```

---

## Troubleshooting

### Styles Not Applying

**Check:**
1. CSS is loaded after widget CSS
2. Specificity is high enough
3. No typos in class names

**Solution:**
```css
/* Increase specificity */
.my-site .cg-card {
  /* Your styles */
}
```

### Theme Not Changing

**Check:**
1. CSS variables are defined
2. Theme attribute is set correctly

**Solution:**
```javascript
// Ensure theme is applied
widget.setTheme('dark');
```

---

**Previous:** [Examples](./06-EXAMPLES.md)  
**Back to:** [Documentation Index](./README.md)
