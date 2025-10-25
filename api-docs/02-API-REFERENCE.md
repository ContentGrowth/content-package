# API Reference

Complete reference for the Content Growth Widget API.

## Base URL

```
https://api.content-growth.com
```

## Authentication

All API requests require authentication via API key in the request header:

```http
X-API-Key: your-api-key-here
```

### Getting Your API Key

1. Log in to [content-growth.com](https://www.content-growth.com)
2. Navigate to **Settings** → **API Keys**
3. Click **Create New API Key**
4. Copy the key and store it securely

⚠️ **Security Note**: Never expose your API key in client-side code for production. Use environment variables or server-side rendering.

## Endpoints

### List Articles

Retrieve a paginated list of articles with optional filtering.

```http
GET /widget/articles
```

#### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | `1` | Page number (1-indexed) |
| `limit` | integer | No | `12` | Items per page (max: 100) |
| `tag` | string | No | - | Filter by tags (comma-separated) |
| `category` | string | No | - | Filter by category |

#### Example Request

```bash
curl -X GET \
  'https://api.content-growth.com/widget/articles?page=1&limit=12&category=guide' \
  -H 'X-API-Key: your-api-key'
```

#### Example Response

```json
{
  "articles": [
    {
      "uuid": "123e4567-e89b-12d3-a456-426614174000",
      "slug": "getting-started-with-content-growth",
      "title": "Getting Started with Content Growth",
      "summary": "Learn how to integrate Content Growth into your application in just a few minutes.",
      "content": "# Getting Started\n\nContent Growth makes it easy...",
      "authorName": "John Doe",
      "publishedAt": 1704067200,
      "wordCount": 1500,
      "tags": ["tutorial", "beginner", "getting-started"],
      "category": "guide"
    },
    {
      "uuid": "234e5678-e89b-12d3-a456-426614174001",
      "slug": "advanced-configuration",
      "title": "Advanced Configuration Options",
      "summary": "Deep dive into advanced configuration and customization options.",
      "content": "# Advanced Configuration\n\nOnce you're familiar...",
      "authorName": "Jane Smith",
      "publishedAt": 1704153600,
      "wordCount": 2300,
      "tags": ["advanced", "configuration"],
      "category": "guide"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "totalPages": 5,
    "totalItems": 58
  }
}
```

#### Response Fields

**Article Object:**

| Field | Type | Description |
|-------|------|-------------|
| `uuid` | string | Unique identifier (UUID v4) |
| `slug` | string | URL-friendly identifier |
| `title` | string | Article title |
| `summary` | string | AI-generated summary (2-3 sentences) |
| `content` | string | Full article content in Markdown format |
| `authorName` | string | Author's display name |
| `publishedAt` | integer | Publication timestamp (Unix epoch seconds) |
| `wordCount` | integer | Total word count (for reading time calculation) |
| `tags` | string[] | Array of tags |
| `category` | string | Primary category |

**Pagination Object:**

| Field | Type | Description |
|-------|------|-------------|
| `page` | integer | Current page number |
| `limit` | integer | Items per page |
| `totalPages` | integer | Total number of pages |
| `totalItems` | integer | Total number of articles matching filters |

---

### Get Article by UUID

Retrieve a single article by its unique identifier.

```http
GET /widget/articles/:uuid
```

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `uuid` | string | Yes | Article UUID |

#### Example Request

```bash
curl -X GET \
  'https://api.content-growth.com/widget/articles/123e4567-e89b-12d3-a456-426614174000' \
  -H 'X-API-Key: your-api-key'
```

#### Example Response

```json
{
  "uuid": "123e4567-e89b-12d3-a456-426614174000",
  "slug": "getting-started-with-content-growth",
  "title": "Getting Started with Content Growth",
  "summary": "Learn how to integrate Content Growth into your application in just a few minutes.",
  "content": "# Getting Started\n\nContent Growth makes it easy to add dynamic content to your website...\n\n## Installation\n\n```bash\nnpm install @contentgrowth/content-widget\n```\n\n## Quick Start\n\nHere's how to get started...",
  "authorName": "John Doe",
  "publishedAt": 1704067200,
  "wordCount": 1500,
  "tags": ["tutorial", "beginner", "getting-started"],
  "category": "guide"
}
```

#### Error Responses

**404 Not Found:**
```json
{
  "error": "Article not found",
  "code": "ARTICLE_NOT_FOUND"
}
```

---

### Get Article by Slug

Retrieve a single article by its URL-friendly slug.

```http
GET /widget/articles/slug/:slug
```

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `slug` | string | Yes | Article slug (URL-friendly identifier) |

#### Example Request

```bash
curl -X GET \
  'https://api.content-growth.com/widget/articles/slug/getting-started-with-content-growth' \
  -H 'X-API-Key: your-api-key'
```

#### Example Response

Same as "Get Article by UUID" endpoint.

#### Use Cases

**When to use UUID:**
- Internal references
- Guaranteed uniqueness
- Database lookups

**When to use Slug:**
- SEO-friendly URLs
- Human-readable links
- Blog post URLs

**Example URL patterns:**
```
/blog/getting-started-with-content-growth  ← Uses slug
/articles/123e4567-e89b-12d3-a456...       ← Uses UUID
```

---

## Filtering

### By Category

Categories are primary content types. Filter to show only specific content types:

```bash
# Get only guides
curl 'https://api.content-growth.com/widget/articles?category=guide' \
  -H 'X-API-Key: your-key'

# Get only how-to articles
curl 'https://api.content-growth.com/widget/articles?category=how-to' \
  -H 'X-API-Key: your-key'

# Get only announcements
curl 'https://api.content-growth.com/widget/articles?category=announce' \
  -H 'X-API-Key: your-key'
```

**Common categories:**
- `guide` - Comprehensive guides and tutorials
- `how-to` - Step-by-step instructions
- `announce` - News and announcements
- Custom categories you define

### By Tags

Tags provide flexible filtering. Use comma-separated values for multiple tags:

```bash
# Single tag
curl 'https://api.content-growth.com/widget/articles?tag=beginner' \
  -H 'X-API-Key: your-key'

# Multiple tags (AND logic - article must have all tags)
curl 'https://api.content-growth.com/widget/articles?tag=tutorial,beginner' \
  -H 'X-API-Key: your-key'
```

### Combined Filtering

Combine category and tags for precise filtering:

```bash
# Beginner guides only
curl 'https://api.content-growth.com/widget/articles?category=guide&tag=beginner' \
  -H 'X-API-Key: your-key'

# Advanced API tutorials
curl 'https://api.content-growth.com/widget/articles?category=how-to&tag=advanced,api' \
  -H 'X-API-Key: your-key'
```

---

## Pagination

### Basic Pagination

```bash
# First page (default)
curl 'https://api.content-growth.com/widget/articles' \
  -H 'X-API-Key: your-key'

# Second page
curl 'https://api.content-growth.com/widget/articles?page=2' \
  -H 'X-API-Key: your-key'

# Custom page size
curl 'https://api.content-growth.com/widget/articles?limit=24' \
  -H 'X-API-Key: your-key'
```

### Pagination Response

```json
{
  "articles": [...],
  "pagination": {
    "page": 2,
    "limit": 12,
    "totalPages": 5,
    "totalItems": 58
  }
}
```

**Calculating total pages:**
```javascript
const totalPages = Math.ceil(totalItems / limit);
```

**Checking for more pages:**
```javascript
const hasNextPage = page < totalPages;
const hasPrevPage = page > 1;
```

---

## Rate Limiting

**Current limits:**
- 1000 requests per hour per API key
- 10 requests per second burst

**Rate limit headers:**
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 995
X-RateLimit-Reset: 1704067200
```

**429 Too Many Requests response:**
```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 3600
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid parameters |
| 401 | Unauthorized | Missing or invalid API key |
| 404 | Not Found | Article not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Error Response Format

```json
{
  "error": "Human-readable error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional context"
  }
}
```

### Common Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| `INVALID_API_KEY` | API key is invalid | Check your API key |
| `ARTICLE_NOT_FOUND` | Article doesn't exist | Verify UUID/slug |
| `INVALID_PARAMETER` | Invalid query parameter | Check parameter format |
| `RATE_LIMIT_EXCEEDED` | Too many requests | Wait and retry |

---

## Best Practices

### 1. Caching

Implement client-side caching to reduce API calls:

```javascript
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchWithCache(url) {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  const response = await fetch(url, {
    headers: { 'X-API-Key': apiKey }
  });
  const data = await response.json();
  
  cache.set(url, { data, timestamp: Date.now() });
  return data;
}
```

### 2. Error Handling

Always handle errors gracefully:

```javascript
try {
  const response = await fetch(url, {
    headers: { 'X-API-Key': apiKey }
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  const data = await response.json();
  return data;
} catch (error) {
  console.error('Failed to fetch articles:', error);
  // Show user-friendly error message
  return { articles: [], pagination: {} };
}
```

### 3. Secure API Keys

**Never expose API keys in client-side code:**

❌ **Bad:**
```javascript
// Exposed in browser!
const apiKey = 'pk_live_abc123';
```

✅ **Good:**
```javascript
// Server-side only
const apiKey = process.env.CG_API_KEY;
```

For client-side widgets, use server-side proxies or environment variables that are only available at build time.

---

**Next:** [SSR Components Guide](./03-SSR-COMPONENTS.md) →
