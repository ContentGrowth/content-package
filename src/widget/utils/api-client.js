/**
 * Content Growth API Client
 * Handles fetching articles from the widget API (requires API key)
 */

/**
 * Process markdown content to handle custom image syntax
 * Converts: ![alt](url =WIDTHxHEIGHT) to ![alt](url)
 */
function processImageSyntax(markdown) {
  if (!markdown) return markdown;
  return markdown.replace(
    /!\[([^\]]*)\]\(([^\s)]+)\s+=(\d+)x(\d+)\)/g,
    (match, alt, url, width, height) => {
      return `![${alt}](${url})`;
    }
  );
}

export class ContentGrowthAPI {
  constructor(config) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.content-growth.com';
    this.cache = new Map();
    this.cacheTTL = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Fetch list of articles
   */
  async fetchArticles(options = {}) {
    const { page = 1, limit = 12, tags = [], category } = options;
    
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    if (tags.length > 0) {
      params.set('tag', tags.join(','));
    }

    if (category) {
      params.set('category', category);
    }

    const url = `${this.baseUrl}/widget/articles?${params}`;
    const cacheKey = url;

    // Check cache
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      
      const response = await fetch(url, {
        headers: {
          'X-API-Key': this.apiKey
        }
      });


      if (!response.ok) {
        const errorText = await response.text();
        console.error('[ContentGrowthAPI] Error response body:', errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Cache the result
      this.setCache(cacheKey, data);
      
      return data;
    } catch (error) {
      console.error('[ContentGrowthAPI] Failed to fetch articles:', error);
      throw error;
    }
  }

  /**
   * Fetch single article by UUID
   */
  async fetchArticle(uuid) {
    const url = `${this.baseUrl}/widget/articles/${uuid}`;
    const cacheKey = url;

    // Check cache
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      
      const response = await fetch(url, {
        headers: {
          'X-API-Key': this.apiKey
        }
      });


      if (!response.ok) {
        const errorText = await response.text();
        console.error('[ContentGrowthAPI] Error response body:', errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Process image syntax in content
      if (data.content) {
        data.content = processImageSyntax(data.content);
      }
      
      // Cache the result
      this.setCache(cacheKey, data);
      
      return data;
    } catch (error) {
      console.error('[ContentGrowthAPI] Failed to fetch article:', error);
      throw error;
    }
  }

  /**
   * Fetch single article by slug
   */
  async fetchArticleBySlug(slug) {
    const url = `${this.baseUrl}/widget/articles/slug/${slug}`;
    const cacheKey = url;

    // Check cache
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      
      const response = await fetch(url, {
        headers: {
          'X-API-Key': this.apiKey
        }
      });


      if (!response.ok) {
        const errorText = await response.text();
        console.error('[ContentGrowthAPI] Error response body:', errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Process image syntax in content
      if (data.content) {
        data.content = processImageSyntax(data.content);
      }
      
      // Cache the result
      this.setCache(cacheKey, data);
      
      return data;
    } catch (error) {
      console.error('[ContentGrowthAPI] Failed to fetch article by slug:', error);
      throw error;
    }
  }

  /**
   * Get from cache if not expired
   */
  getFromCache(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > this.cacheTTL) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  /**
   * Set cache with timestamp
   */
  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Clear all cache
   */
  clearCache() {
    this.cache.clear();
  }
}
