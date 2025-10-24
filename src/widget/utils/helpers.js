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
