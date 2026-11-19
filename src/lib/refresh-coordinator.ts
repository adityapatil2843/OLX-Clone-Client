/**
 * Single-Flight Refresh Coordinator
 * Prevents multiple concurrent refresh-token requests from causing token rotation race conditions.
 */

type RefreshPromise = Promise<string | null>;

class RefreshCoordinator {
  private activeRefresh: RefreshPromise | null = null;

  async executeRefresh(refreshFn: () => Promise<string | null>): Promise<string | null> {
    if (this.activeRefresh) {
      return this.activeRefresh;
    }

    this.activeRefresh = refreshFn()
      .then((token) => {
        return token;
      })
      .finally(() => {
        this.activeRefresh = null;
      });

    return this.activeRefresh;
  }

  isRefreshing(): boolean {
    return this.activeRefresh !== null;
  }
}

export const refreshCoordinator = new RefreshCoordinator();
