import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { ListingCard } from '../../src/components/listings/ListingCard';
import { ReelCard } from '../../src/components/reels/ReelCard';
import { BoostModal } from '../../src/components/boost/BoostModal';
import { MOCK_LISTINGS } from '../../src/features/marketplace/mockData';
import { MOCK_REELS } from '../../src/features/reels/mockData';
import { walletService } from '../../src/features/wallet/walletService';
import { boostService } from '../../src/features/boost/boostService';
import { apiClient } from '../../src/lib/api-client';

vi.mock('../../src/lib/api-client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
}));

describe('Phase 5 — Wallet & Boost System Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Sponsored Content Presentation', () => {
    it('renders "Featured" badge on ListingCard when isSponsored is true', () => {
      const sponsoredListing = {
        ...MOCK_LISTINGS[0],
        isSponsored: true,
        advertisementId: 'ad-test-123',
      };

      const html = renderToString(<ListingCard listing={sponsoredListing} />);

      expect(html).toContain('Featured');
      expect(html).toContain('role="status"');
      expect(html).toContain('aria-label="Sponsored listing"');
    });

    it('does not render "Featured" badge on ListingCard when isSponsored is absent or false', () => {
      const normalListing = {
        ...MOCK_LISTINGS[0],
        isSponsored: false,
      };

      const html = renderToString(<ListingCard listing={normalListing} />);

      expect(html).not.toContain('aria-label="Sponsored listing"');
    });

    it('renders "Sponsored" badge on ReelCard when isSponsored is true', () => {
      const sponsoredReel = {
        ...MOCK_REELS[0],
        isSponsored: true,
        advertisementId: 'ad-reel-123',
      };

      const html = renderToString(<ReelCard reel={sponsoredReel} />);

      expect(html).toContain('Sponsored');
      expect(html).toContain('role="status"');
      expect(html).toContain('aria-label="Sponsored reel"');
    });
  });

  describe('BoostModal Dialog & Form Semantics', () => {
    it('renders accessible dialog semantics, header, and target title', () => {
      const html = renderToString(
        <BoostModal
          isOpen={true}
          onClose={() => {}}
          target={{
            type: 'LISTING',
            id: 'listing-uuid-1',
            title: 'Royal Enfield Classic 350',
          }}
        />
      );

      expect(html).toContain('role="dialog"');
      expect(html).toContain('aria-modal="true"');
      expect(html).toContain('Boost Your Listing');
      expect(html).toContain('Royal Enfield Classic 350');
      expect(html).toContain('Available Coin Balance');
    });

    it('does not render when isOpen is false', () => {
      const html = renderToString(
        <BoostModal
          isOpen={false}
          onClose={() => {}}
          target={{
            type: 'LISTING',
            id: 'listing-uuid-1',
            title: 'Royal Enfield Classic 350',
          }}
        />
      );

      expect(html).toBe('');
    });
  });

  describe('Wallet & Boost Services API Verification', () => {
    it('calls /wallet/balance and returns coinsBalance', async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce({
        data: { coinsBalance: 200 },
      });

      const res = await walletService.getBalance();
      expect(apiClient.get).toHaveBeenCalledWith('/wallet/balance');
      expect(res.coinsBalance).toBe(200);
    });

    it('calls /wallet/transactions with pagination params', async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce({
        data: [
          {
            id: 'tx-1',
            userId: 'user-1',
            amount: 200,
            balanceAfter: 200,
            type: 'WELCOME_BONUS',
            createdAt: '2026-11-18T00:00:00.000Z',
          },
        ],
        meta: { page: 1, limit: 20, total: 1, totalPages: 1 },
      });

      const res = await walletService.getTransactions(1, 20);
      expect(apiClient.get).toHaveBeenCalledWith('/wallet/transactions?page=1&limit=20');
      expect(res.data.length).toBe(1);
      expect(res.data[0].type).toBe('WELCOME_BONUS');
    });

    it('calls /boost-packages to retrieve active packages', async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce({
        data: [
          {
            id: 'pkg-1',
            name: '1-Day Starter Boost',
            durationDays: 1,
            coinsCost: 50,
            isActive: true,
            sortOrder: 1,
          },
        ],
      });

      const packages = await boostService.getPackages();
      expect(apiClient.get).toHaveBeenCalledWith('/boost-packages');
      expect(packages.length).toBe(1);
      expect(packages[0].coinsCost).toBe(50);
    });

    it('calls POST /advertisements with target and package data', async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce({
        data: {
          id: 'ad-created-1',
          targetType: 'LISTING',
          targetId: 'listing-123',
          packageId: 'pkg-1',
          status: 'ACTIVE',
        },
      });

      const res = await boostService.createBoost({
        targetType: 'LISTING',
        targetId: 'listing-123',
        packageId: 'pkg-1',
        idempotencyKey: 'idemp-12345',
      });

      expect(apiClient.post).toHaveBeenCalledWith('/advertisements', {
        targetType: 'LISTING',
        targetId: 'listing-123',
        packageId: 'pkg-1',
        idempotencyKey: 'idemp-12345',
      });
      expect(res.id).toBe('ad-created-1');
      expect(res.status).toBe('ACTIVE');
    });

    it('calls POST /advertisements/:id/cancel to stop an active campaign', async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce({
        data: {
          id: 'ad-123',
          status: 'CANCELLED',
        },
      });

      const res = await boostService.cancelBoost('ad-123');
      expect(apiClient.post).toHaveBeenCalledWith('/advertisements/ad-123/cancel');
      expect(res.status).toBe('CANCELLED');
    });
  });
});
