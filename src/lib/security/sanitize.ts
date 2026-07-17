// src/lib/security/sanitize.ts
// Input sanitization — lightweight, server-safe (no jsdom dependency)

/**
 * Sanitize user input — strips all HTML tags and dangerous content.
 * Uses a lightweight regex approach that works in all serverless environments
 * (Vercel, Cloudflare Workers, etc.) without requiring jsdom.
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return stripHtml(input)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters (preserve tabs/newlines)
    .trim();
}

/**
 * Sanitize HTML content — allows safe formatting tags.
 * For server-side use, strips all HTML since we don't need rich rendering on the backend.
 * The frontend should handle rich HTML rendering with its own DOMPurify instance.
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';
  // On the server side, strip everything for safety.
  // Frontend rendering uses client-side DOMPurify if needed.
  return stripHtml(html).trim();
}

/**
 * Sanitize a plain-text query parameter.
 */
export function sanitizeQuery(query: string): string {
  if (!query || typeof query !== 'string') return '';
  // Remove control characters, null bytes, and excessive whitespace
  return query
    .replace(/[\x00-\x1F\x7F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 500);
}

/**
 * Validate and sanitize an email address.
 */
export function sanitizeEmail(email: string): string | null {
  if (!email || typeof email !== 'string') return null;
  const cleaned = email.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(cleaned) ? cleaned : null;
}

// ---- Internal helpers ----

/**
 * Strip all HTML tags from a string.
 * Handles:
 * - Standard HTML tags (<p>, <div>, <script>, etc.)
 * - Self-closing tags (<br/>, <img/>)
 * - HTML comments (<!-- ... -->)
 * - Decodes common HTML entities
 */
function stripHtml(html: string): string {
  return html
    // Remove HTML comments
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remove script/style tags and their contents
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    // Remove all HTML tags
    .replace(/<[^>]*>/g, '')
    // Decode common HTML entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    // Collapse multiple spaces
    .replace(/\s+/g, ' ');
}
