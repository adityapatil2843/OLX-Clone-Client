import { describe, it, expect } from 'vitest';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { 
  getFriendlyErrorMessage, 
  ErrorState, 
  EmptyState, 
  AuthPromptModal,
  ListingSkeletonGrid 
} from '../../src/components/ui/state-views';

describe('Operational State Views & Error Normalization', () => {
  describe('getFriendlyErrorMessage', () => {
    it('normalizes 401 Unauthorized into friendly sign-in prompt', () => {
      const result = getFriendlyErrorMessage('Unauthorized', 401);
      expect(result.isAuth).toBe(true);
      expect(result.title).toBe('Sign In Required');
      expect(result.description).not.toContain('stack');
    });

    it('normalizes 403 Forbidden into friendly access restricted prompt', () => {
      const result = getFriendlyErrorMessage('Forbidden', 403);
      expect(result.isAuth).toBe(true);
      expect(result.title).toBe('Access Restricted');
    });

    it('normalizes 404 Not Found into friendly missing item message', () => {
      const result = getFriendlyErrorMessage('Resource not found', 404);
      expect(result.isNotFound).toBe(true);
      expect(result.title).toBe('Item Not Found');
    });

    it('normalizes 429 Rate Limit into polite backoff hint', () => {
      const result = getFriendlyErrorMessage('Too many requests', 429);
      expect(result.isRateLimited).toBe(true);
      expect(result.title).toBe('Too Many Requests');
    });

    it('normalizes network / connection failure', () => {
      const result = getFriendlyErrorMessage(new Error('Network Error: ECONNREFUSED'));
      expect(result.isOffline).toBe(true);
      expect(result.title).toBe('Connection Problem');
    });

    it('normalizes unexpected 500 without leaking stack traces', () => {
      const result = getFriendlyErrorMessage(new Error('FATAL: Database connection died at line 42'));
      expect(result.title).toBe('Something went wrong');
      expect(result.description).not.toContain('FATAL');
      expect(result.description).not.toContain('line 42');
    });
  });

  describe('Component Rendering', () => {
    it('renders ErrorState with role="alert" and accessible labels', () => {
      const html = renderToString(
        <ErrorState
          title="Custom Failure"
          description="Failed to load items."
          onRetry={() => {}}
        />
      );
      expect(html).toContain('role="alert"');
      expect(html).toContain('Custom Failure');
      expect(html).toContain('Retry');
    });

    it('renders EmptyState with accessible action link', () => {
      const html = renderToString(
        <EmptyState
          title="No items found"
          description="Try broadening your search query."
          actionHref="/search"
          actionLabel="Explore All"
        />
      );
      expect(html).toContain('No items found');
      expect(html).toContain('Explore All');
      expect(html).toContain('/search');
    });

    it('renders ListingSkeletonGrid with matching card count', () => {
      const html = renderToString(<ListingSkeletonGrid count={4} />);
      expect(html).toContain('animate-pulse');
    });

    it('renders AuthPromptModal with accessible dialog attributes', () => {
      const html = renderToString(
        <AuthPromptModal
          isOpen={true}
          onClose={() => {}}
          title="Sign In to Save"
          description="Sign in to add this listing to your favourites."
          returnUrl="/listing/123"
        />
      );
      expect(html).toContain('role="dialog"');
      expect(html).toContain('aria-modal="true"');
      expect(html).toContain('Sign In to Save');
      expect(html).toContain('/login?redirect=%2Flisting%2F123');
      expect(html).toContain('Continue Browsing');
    });
  });
});
