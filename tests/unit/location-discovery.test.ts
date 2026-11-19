import { describe, it, expect } from 'vitest';
import { 
  INDIAN_STATES, 
  POPULAR_CITIES, 
  getCitiesForState, 
  searchCitiesAndStates 
} from '../../src/features/location/indiaLocations';

describe('Location-Based Discovery Metadata Tests', () => {
  it('contains comprehensive Indian states and popular metro cities', () => {
    expect(INDIAN_STATES.length).toBeGreaterThanOrEqual(15);
    expect(INDIAN_STATES.some((s) => s.name === 'Maharashtra')).toBe(true);
    expect(INDIAN_STATES.some((s) => s.name === 'Karnataka')).toBe(true);
    expect(INDIAN_STATES.some((s) => s.name === 'Delhi NCR')).toBe(true);

    expect(POPULAR_CITIES).toContain('All India');
    expect(POPULAR_CITIES).toContain('Mumbai');
    expect(POPULAR_CITIES).toContain('Bangalore');
  });

  it('resolves cities for a valid Indian state and handles invalid states safely', () => {
    const mhCities = getCitiesForState('Maharashtra');
    expect(mhCities).toContain('Mumbai');
    expect(mhCities).toContain('Pune');

    const empty = getCitiesForState('NonExistentState');
    expect(empty).toEqual([]);
  });

  it('searches cities and states by query string', () => {
    const results = searchCitiesAndStates('Mumb');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name).toBe('Mumbai');
    expect(results[0].type).toBe('city');
  });
});
