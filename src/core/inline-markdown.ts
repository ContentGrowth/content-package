/**
 * Renders inline markdown syntax (bold and italic only) to HTML.
 * Supports: **bold**, *italic*, ***bold italic***
 * 
 * @param text - The text to parse
 * @returns HTML string with <strong> and <em> tags
 */
export function renderInlineMarkdown(text: string): string {
    if (!text) return '';

    return text
        // Bold + Italic: ***text*** -> <strong><em>text</em></strong>
        .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
        // Bold: **text** -> <strong>text</strong>
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // Italic: *text* -> <em>text</em>
        .replace(/\*(.+?)\*/g, '<em>$1</em>');
}

/**
 * Plain JavaScript version for use in Astro components
 */
export function renderInlineMarkdownJS(text: string): string {
    if (!text) return '';

    return text
        .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>');
}
