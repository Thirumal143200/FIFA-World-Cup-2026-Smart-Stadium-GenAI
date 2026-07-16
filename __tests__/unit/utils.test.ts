// __tests__/unit/utils.test.ts
// Unit tests for helper utilities

import { cn, formatPercentage, getDensityColor, getDensityLabel } from '@/lib/utils';

describe('Utility Functions', () => {
  describe('cn (Class Merger)', () => {
    it('merges multiple class strings together', () => {
      expect(cn('flex', 'items-center')).toBe('flex items-center');
    });

    it('resolves conflicting Tailwind classes correctly', () => {
      expect(cn('p-4', 'p-6')).toBe('p-6');
    });

    it('handles conditional class expressions correctly', () => {
      const active = true;
      const disabled = false;
      expect(cn('btn', active && 'btn-active', disabled && 'btn-disabled')).toBe('btn btn-active');
    });
  });

  describe('formatPercentage', () => {
    it('formats decimal numbers as percentage strings', () => {
      expect(formatPercentage(0.55)).toBe('55%');
      expect(formatPercentage(0.999, 1)).toBe('99.9%');
    });
  });

  describe('getDensityColor & Label', () => {
    it('returns green for low densities', () => {
      expect(getDensityColor(0.25)).toBe('#22c55e');
      expect(getDensityLabel(0.25)).toBe('Low');
    });

    it('returns red or dark red for high/critical densities', () => {
      expect(getDensityColor(0.95)).toBe('#dc2626');
      expect(getDensityLabel(0.95)).toBe('Critical');
    });
  });

  describe('getLanguageDirection', () => {
    it('returns rtl for Arabic, Hebrew, Urdu', () => {
      const { getLanguageDirection } = require('@/lib/utils');
      expect(getLanguageDirection('ar')).toBe('rtl');
      expect(getLanguageDirection('he')).toBe('rtl');
      expect(getLanguageDirection('ur')).toBe('rtl');
    });

    it('returns ltr for English, Spanish, Vietnamese', () => {
      const { getLanguageDirection } = require('@/lib/utils');
      expect(getLanguageDirection('en')).toBe('ltr');
      expect(getLanguageDirection('es')).toBe('ltr');
      expect(getLanguageDirection('vi')).toBe('ltr');
    });
  });
});
