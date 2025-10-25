/**
 * Utility helper functions
 */

/**
 * Format date to readable string
 */
export function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Calculate reading time from word count or content
 * @param {number|string} wordCountOrContent - Word count (number) or content text (string)
 * @returns {string} Reading time string (e.g., "5 min read")
 */
export function calculateReadingTime(wordCountOrContent) {
  if (!wordCountOrContent) return 'Unknown';
  
  const wordsPerMinute = 200;
  let words;
  
  // If it's a number, use it directly as word count
  if (typeof wordCountOrContent === 'number') {
    words = wordCountOrContent;
    if (words === 0) return 'Unknown'; // No word count available
  } else {
    // Otherwise, calculate from content text (fallback)
    words = wordCountOrContent.trim().split(/\s+/).filter(w => w.length > 0).length;
  }
  
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

/**
 * Truncate text to specified length
 */
export function truncate(text, maxLength = 150) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Truncate text to specified max UTF-8 byte length
 */
export function truncateBytes(text, maxBytes) {
  if (!text || !maxBytes || maxBytes <= 0) return text || '';
  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);
  if (bytes.length <= maxBytes) return text;
  // Binary search for max codepoint length within byte budget
  let lo = 0, hi = text.length;
  while (lo < hi) {
    const mid = Math.floor((lo + hi + 1) / 2);
    const slice = text.slice(0, mid);
    const len = encoder.encode(slice).length;
    if (len <= maxBytes) lo = mid; else hi = mid - 1;
  }
  return text.slice(0, lo).trimEnd() + '...';
}

/**
 * Escape HTML to prevent XSS
 */
export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Debounce function calls
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
