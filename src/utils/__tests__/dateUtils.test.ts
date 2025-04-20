import { describe, it, expect } from 'vitest';
import { formatDate, formatDateLong, getWeekNumber, formatDuration } from '../dateUtils';

describe('dateUtils', () => {
  describe('formatDate', () => {
    it('formats date correctly in Dutch', () => {
      const date = '2025-01-15';
      expect(formatDate(date, 'nl')).toMatch(/woe\. 15-01-2025/i);
    });

    it('formats date correctly in English', () => {
      const date = '2025-01-15';
      expect(formatDate(date, 'en')).toMatch(/Wed\. 15-01-2025/i);
    });

    it('returns empty string for invalid date', () => {
      expect(formatDate('invalid-date')).toBe('');
    });
  });

  describe('formatDateLong', () => {
    it('formats date in long format in Dutch', () => {
      const date = '2025-01-15';
      expect(formatDateLong(date, 'nl')).toMatch(/woensdag 15 januari 2025/i);
    });

    it('formats date in long format in English', () => {
      const date = '2025-01-15';
      expect(formatDateLong(date, 'en')).toMatch(/Wednesday 15 January 2025/i);
    });

    it('returns empty string for invalid date', () => {
      expect(formatDateLong('invalid-date')).toBe('');
    });
  });

  describe('getWeekNumber', () => {
    it('calculates correct week number', () => {
      const date = new Date('2025-01-15');
      expect(getWeekNumber(date)).toBe(3);
    });

    it('handles year boundary correctly', () => {
      const date = new Date('2025-01-01');
      expect(getWeekNumber(date)).toBe(1);
    });
  });

  describe('formatDuration', () => {
    it('formats duration in Dutch for single day', () => {
      expect(formatDuration('2025-01-15', '2025-01-15', 'nl')).toBe('1 dag');
    });

    it('formats duration in Dutch for multiple days', () => {
      expect(formatDuration('2025-01-15', '2025-01-17', 'nl')).toBe('3 dagen');
    });

    it('formats duration in Dutch for one week', () => {
      expect(formatDuration('2025-01-13', '2025-01-19', 'nl')).toBe('1 week');
    });

    it('formats duration in Dutch for weeks and days', () => {
      // 13-24 January = 12 days = 1 week and 5 days
      expect(formatDuration('2025-01-13', '2025-01-24', 'nl')).toBe('1 week en 5 dagen');
      // 13-25 January = 13 days = 1 week and 6 days
      expect(formatDuration('2025-01-13', '2025-01-25', 'nl')).toBe('1 week en 6 dagen');
      // 13-26 January = 14 days = 2 weeks
      expect(formatDuration('2025-01-13', '2025-01-26', 'nl')).toBe('2 weken');
      // 13-27 January = 15 days = 2 weeks and 1 day
      expect(formatDuration('2025-01-13', '2025-01-27', 'nl')).toBe('2 weken en 1 dag');
    });

    it('formats duration in English for single day', () => {
      expect(formatDuration('2025-01-15', '2025-01-15', 'en')).toBe('1 day');
    });

    it('formats duration in English for multiple days', () => {
      expect(formatDuration('2025-01-15', '2025-01-17', 'en')).toBe('3 days');
    });

    it('formats duration in English for one week', () => {
      expect(formatDuration('2025-01-13', '2025-01-19', 'en')).toBe('1 week');
    });

    it('formats duration in English for weeks and days', () => {
      expect(formatDuration('2025-01-13', '2025-01-24', 'en')).toBe('1 week and 5 days');
      expect(formatDuration('2025-01-13', '2025-01-25', 'en')).toBe('1 week and 6 days');
      expect(formatDuration('2025-01-13', '2025-01-26', 'en')).toBe('2 weeks');
      expect(formatDuration('2025-01-13', '2025-01-27', 'en')).toBe('2 weeks and 1 day');
    });

    it('returns empty string for invalid dates', () => {
      expect(formatDuration('invalid', '2025-01-15')).toBe('');
      expect(formatDuration('2025-01-15', 'invalid')).toBe('');
    });

    it('includes weekends in the count', () => {
      // Friday to Monday (4 days total)
      expect(formatDuration('2025-01-17', '2025-01-20', 'en')).toBe('4 days');
      expect(formatDuration('2025-01-17', '2025-01-20', 'nl')).toBe('4 dagen');
    });
  });
});
