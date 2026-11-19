import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { ReelCommentsSheet } from '../../src/components/reels/ReelCommentsSheet';

vi.mock('../../src/features/reels/reelsService', () => ({
  reelsService: {
    getComments: vi.fn(),
    addComment: vi.fn(),
  },
}));

vi.mock('../../src/features/auth/useAuthStore', () => ({
  useAuthStore: () => ({
    isAuthenticated: false,
    user: null,
    isLoading: false,
  }),
}));

describe('Reel Comments Feature Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders ReelCommentsSheet with accessible dialog semantics and title', () => {
    const html = renderToString(
      <ReelCommentsSheet
        isOpen={true}
        onClose={() => {}}
        reelId="reel-test-123"
        initialCommentsCount={5}
      />
    );

    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain('aria-label="Reel Comments"');
    expect(html).toContain('Comments');
    expect(html).toContain('(5)');
  });

  it('renders guest sign-in placeholder when user is unauthenticated', () => {
    const html = renderToString(
      <ReelCommentsSheet
        isOpen={true}
        onClose={() => {}}
        reelId="reel-test-123"
        initialCommentsCount={0}
      />
    );

    expect(html).toContain('Sign in to comment');
  });

  it('does not render sheet when isOpen is false', () => {
    const html = renderToString(
      <ReelCommentsSheet
        isOpen={false}
        onClose={() => {}}
        reelId="reel-test-123"
      />
    );

    expect(html).toBe('');
  });
});
