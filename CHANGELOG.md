# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-24

### Added

- Initial release
- Core API client for framework-agnostic usage
- Vanilla JavaScript widget with full feature set
- React components (ContentList, ContentViewer) and hooks
- Vue 3 components (ContentList, ContentViewer) and composables
- Astro components (ContentList, ContentViewer) with SSR support
- TypeScript support with full type definitions
- Multiple layout modes (cards, rows)
- Multiple display modes (compact, comfortable, spacious)
- Multiple viewer modes (inline, modal, external)
- Theme support (light, dark)
- Pagination support
- Filtering by tags and categories
- Built-in caching (5-minute TTL)
- Responsive design (mobile-first)
- Accessibility features (ARIA labels, keyboard navigation)
- Comprehensive documentation and examples

### Framework Support

- ✅ Vanilla JavaScript
- ✅ React 17+
- ✅ Vue 3
- ✅ Astro 4+

### API Features

- List articles with pagination
- Get single article with full content
- Get categories with counts
- Get tags with counts
- Built-in error handling
- Request caching

### Components

- ContentList - Article list with pagination
- ContentViewer - Single article viewer
- React hooks (useArticles, useArticle, useCategories, useTags)
- Vue composables (useArticles, useArticle, useCategories, useTags)

[1.0.0]: https://github.com/ContentGrowth/content-package/releases/tag/v1.0.0
