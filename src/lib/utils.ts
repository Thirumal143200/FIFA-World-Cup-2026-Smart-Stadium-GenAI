// src/lib/utils.ts
// Utility functions used across the application

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS classes with conflict resolution.
 * Combines clsx for conditional classes with tailwind-merge for deduplication.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as a percentage string.
 */
export function formatPercentage(value: number, decimals = 0): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Formats a number with thousands separators.
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Returns a relative time string (e.g., "2 minutes ago").
 */
export function getRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

/**
 * Generates a unique ID.
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Delays execution for the specified milliseconds.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Truncates text to the specified length with ellipsis.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Converts a crowd density percentage to a risk color.
 */
export function getDensityColor(density: number): string {
  if (density <= 0.3) return '#22c55e'; // green
  if (density <= 0.5) return '#eab308'; // yellow
  if (density <= 0.7) return '#f97316'; // orange
  if (density <= 0.9) return '#ef4444'; // red
  return '#dc2626'; // dark red
}

/**
 * Returns a risk level label based on density percentage.
 */
export function getDensityLabel(density: number): string {
  if (density <= 0.3) return 'Low';
  if (density <= 0.5) return 'Moderate';
  if (density <= 0.7) return 'High';
  if (density <= 0.9) return 'Very High';
  return 'Critical';
}

/**
 * Maps a language code to its display name.
 */
export const SUPPORTED_LANGUAGES: Record<string, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  pt: 'Português',
  de: 'Deutsch',
  it: 'Italiano',
  nl: 'Nederlands',
  ar: 'العربية',
  ja: '日本語',
  ko: '한국어',
  zh: '中文',
  hi: 'हिन्दी',
  bn: 'বাংলা',
  ur: 'اردو',
  tr: 'Türkçe',
  pl: 'Polski',
  ru: 'Русский',
  sv: 'Svenska',
  da: 'Dansk',
  no: 'Norsk',
  fi: 'Suomi',
  el: 'Ελληνικά',
  he: 'עברית',
  th: 'ไทย',
  vi: 'Tiếng Việt',
  id: 'Bahasa Indonesia',
  ms: 'Bahasa Melayu',
  sw: 'Kiswahili',
  ro: 'Română',
  hr: 'Hrvatski',
  sr: 'Српски',
  cs: 'Čeština',
};

/**
 * Gets the language direction (LTR or RTL).
 */
export function getLanguageDirection(lang: string): 'ltr' | 'rtl' {
  const rtlLanguages = ['ar', 'he', 'ur'];
  return rtlLanguages.includes(lang) ? 'rtl' : 'ltr';
}
