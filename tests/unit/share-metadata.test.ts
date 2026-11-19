import { describe, it, expect } from 'vitest';
import { 
  getListingCanonicalUrl, 
  getReelCanonicalUrl, 
  getCategoryCanonicalUrl,
  getProfileCanonicalUrl,
  getBaseAppUrl, 
  shareContent 
} from '../../src/lib/share';

describe('Share and Metadata Helpers', () => {
  it('returns default domain as https://bazarr360.in', () => {
    expect(getBaseAppUrl()).toBe('https://bazarr360.in');
  });

  it('generates correct listing canonical URL', () => {
    const url = getListingCanonicalUrl('car-101');
    expect(url).toBe('https://bazarr360.in/listing/car-101');
  });

  it('generates correct reel canonical URL', () => {
    const url = getReelCanonicalUrl('reel-202');
    expect(url).toBe('https://bazarr360.in/reels/reel-202');
  });

  it('generates correct category canonical URL', () => {
    const url = getCategoryCanonicalUrl('vehicles');
    expect(url).toBe('https://bazarr360.in/categories/vehicles');
  });

  it('generates correct profile canonical URL', () => {
    const url = getProfileCanonicalUrl('rohit-deshmukh');
    expect(url).toBe('https://bazarr360.in/profile/rohit-deshmukh');
  });

  it('handles clipboard fallback when navigator.share is unavailable', async () => {
    const res = await shareContent({
      title: 'Test Ad',
      url: 'https://bazarr360.in/listing/123',
    });
    expect(res).toBeDefined();
    expect(res.shared).toBe(false);
  });
});
