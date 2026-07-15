// __tests__/unit/stadiums.test.ts
// Unit tests for stadium dataset search and filters

import { getStadiumById, getStadiumsByCountry, stadiums } from '@/data/stadiums';

describe('Stadiums Telemetry Data', () => {
  it('contains exactly 16 stadiums total', () => {
    expect(stadiums.length).toBe(16);
  });

  describe('getStadiumById', () => {
    it('retrieves correct stadium by its unique identifier', () => {
      const metlife = getStadiumById('metlife');
      expect(metlife).toBeDefined();
      expect(metlife?.name).toBe('MetLife Stadium');
      expect(metlife?.city).toBe('East Rutherford');
      expect(metlife?.country).toBe('USA');
    });

    it('returns undefined if stadium identifier does not exist', () => {
      const missing = getStadiumById('non-existent');
      expect(missing).toBeUndefined();
    });
  });

  describe('getStadiumsByCountry', () => {
    it('groups stadiums by host nations accurately', () => {
      const usa = getStadiumsByCountry('USA');
      const mexico = getStadiumsByCountry('Mexico');
      const canada = getStadiumsByCountry('Canada');

      expect(usa.length).toBe(11);
      expect(mexico.length).toBe(3);
      expect(canada.length).toBe(2);

      expect(usa.map((s) => s.id)).toContain('sofi');
      expect(mexico.map((s) => s.id)).toContain('estadio-azteca');
      expect(canada.map((s) => s.id)).toContain('bc-place');
    });
  });
});
