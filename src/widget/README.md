# Content Growth Widget

Embeddable JavaScript widget for displaying Content Growth articles on any website.

## 🚀 Quick Start

### Simple Usage

```html
<!-- Add this to your HTML -->
<div data-cg-content data-api-key="pk_your_key_here"></div>
<script src="https://www.content-growth.com/widget.js"></script>
<link rel="stylesheet" href="https://www.content-growth.com/widget.css">
```

That's it! The widget will automatically load and display your articles.

## 📖 Configuration Options

### Via Data Attributes

```html
<div data-cg-content
     data-api-key="pk_your_key_here"
     data-tags="tutorial,guide"
     data-theme="dark"
     data-display-mode="expanded"
     data-viewer-mode="modal"
     data-page-size="12">
</div>
```

### Options Reference

| Attribute | Default | Description |
|-----------|---------|-------------|
| `data-api-key` | *required* | Your Content Growth API key |
| `data-tags` | `""` | Filter by tags (comma-separated) |
| `data-theme` | `"light"` | Theme: `light` or `dark` |
| `data-display-mode` | `"compact"` | List display: `compact` or `expanded` |
| `data-viewer-mode` | `"inline"` | Article viewer: `inline` or `modal` |
| `data-page-size` | `12` | Articles per page |

## 🎨 Display Modes

### Compact Mode (Default)
Shows title, author, date, and reading time only.

### Expanded Mode
Shows title, AI summary, tags, author, date, and reading time.

Users can toggle between modes using the button in the widget.

## 📱 Viewer Modes

### Inline Mode (Default)
Clicking an article replaces the list with the full article content.

### Modal Mode
Clicking an article opens it in a modal overlay.

## 🎨 Theming

### Light Theme (Default)
```html
<div data-cg-content data-theme="light"></div>
```

### Dark Theme
```html
<div data-cg-content data-theme="dark"></div>
```

### Custom Styling
Override CSS variables:

```css
.cg-widget {
  --cg-primary: #10b981;
  --cg-bg: #ffffff;
  --cg-text: #1f2937;
  --cg-radius: 16px;
}
```

## 🔧 Advanced Usage

### Manual Initialization

```javascript
const widget = new ContentGrowthWidget('#my-container', {
  apiKey: 'pk_your_key_here',
  tags: ['tutorial', 'guide'],
  theme: 'dark',
  displayMode: 'expanded',
  viewerMode: 'modal',
  pageSize: 12
});
```

### API Methods

```javascript
// Update configuration
widget.updateConfig({ theme: 'dark' });

// Destroy widget
widget.destroy();
```

## 📦 Development

### File Structure
```
src/widget/
├── index.js              # Entry point
├── widget.js             # Main widget class
├── components/
│   ├── article-card.js   # Article card component
│   ├── blog-list.js      # List view component
│   └── blog-post.js      # Post view component
├── utils/
│   ├── api-client.js     # API client
│   └── helpers.js        # Utility functions
└── styles/
    └── widget.css        # All styles
```

### Building

```bash
# Build widget
node build-widget.js

# Output:
# - public/widget.js
# - public/widget.css
```

### Testing

Open `public/widget-test.html` in your browser to test the widget.

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## 📝 License

MIT License - Content Growth

## 🆘 Support

For issues or questions, contact support@content-growth.com
