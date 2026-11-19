import { describe, it, expect } from 'vitest';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { ProfileView } from '../../src/components/profile/ProfileView';
import { MOCK_LISTINGS } from '../../src/features/marketplace/mockData';
import { MOCK_REELS } from '../../src/features/reels/mockData';
import { getProfileCanonicalUrl, getBusinessCanonicalUrl } from '../../src/lib/share';

describe('Public Seller Profile Feature Tests', () => {
  const sampleUser = {
    id: 'user-rajesh-42',
    name: 'Rajesh Patil',
    avatarUrl: null,
    bio: 'Verified Pune automobile dealer with clean certified cars.',
    locationCity: 'Pune',
    locationState: 'Maharashtra',
    isVerifiedSeller: true,
    createdAt: '2024-02-10T00:00:00.000Z',
  };

  it('renders verified public seller fields correctly', () => {
    const html = renderToString(
      <ProfileView
        user={sampleUser}
        listings={MOCK_LISTINGS.slice(0, 2)}
        reels={MOCK_REELS.slice(0, 1)}
      />
    );

    expect(html).toContain('Rajesh Patil');
    expect(html).toContain('Verified Seller');
    expect(html).toContain('Pune, Maharashtra');
    expect(html).toContain('Member since Feb 2024');
    expect(html).toContain('Verified Pune automobile dealer');
    expect(html).toContain('Active Listings (2)');
    expect(html).toContain('Product Reels (1)');
    expect(html).toContain('Message Seller');
    expect(html).toContain('Share');
  });

  it('does NOT contain fake ratings or fake review reputation counts', () => {
    const html = renderToString(
      <ProfileView
        user={sampleUser}
        listings={MOCK_LISTINGS.slice(0, 2)}
        reels={MOCK_REELS.slice(0, 1)}
      />
    );

    expect(html).not.toContain('4.9 / 5.0');
    expect(html).not.toContain('48 Reviews');
    expect(html).not.toContain('100% Response');
    expect(html).not.toContain('Rating');
  });

  it('generates canonical profile share URL with Bazarr 360 domain', () => {
    const canonical = getProfileCanonicalUrl(sampleUser.id);
    expect(canonical).toBe('https://bazarr360.in/profile/user-rajesh-42');
  });

  it('renders verified business storefront profile with canonical URL and business badge', () => {
    const businessSlug = 'mumbai-motors';
    const businessCanonical = getBusinessCanonicalUrl(businessSlug);

    expect(businessCanonical).toBe('https://bazarr360.in/business/mumbai-motors');

    const html = renderToString(
      <ProfileView
        user={{
          ...sampleUser,
          id: businessSlug,
          name: 'Mumbai Motors',
        }}
        listings={MOCK_LISTINGS.slice(0, 3)}
        reels={MOCK_REELS.slice(0, 2)}
        canonicalUrl={businessCanonical}
        isBusiness={true}
      />
    );

    expect(html).toContain('Business Storefront: Mumbai Motors');
    expect(html).toContain('Verified Business');
    expect(html).toContain('Active Listings (3)');
    expect(html).toContain('Product Reels (2)');
    expect(html).not.toContain('4.9 / 5.0');
    expect(html).not.toContain('Reviews');
  });
});
