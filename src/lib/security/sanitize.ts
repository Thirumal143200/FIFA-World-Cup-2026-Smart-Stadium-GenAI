// src/lib/security/sanitize.ts
// Input sanitization to prevent XSS and injection attacks

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize user input — strips all HTML tags and dangerous content.
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  }).trim();
}

/**
 * Sanitize HTML content — allows safe formatting tags.
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'a', 'code', 'pre'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
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
