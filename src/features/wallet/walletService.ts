import { apiClient } from '@/lib/api-client';

export type CoinTransactionType =
  | 'WELCOME_BONUS'
  | 'BOOST_SPENT'
  | 'PURCHASE'
  | 'REFUND'
  | string;

export interface CoinTransaction {
  id: string;
  userId: string;
  amount: number;
  balanceAfter: number;
  type: CoinTransactionType;
  reason?: string | null;
  referenceType?: string | null;
  referenceId?: string | null;
  idempotencyKey?: string | null;
  createdAt: string;
}

export interface WalletBalanceData {
  coinsBalance: number;
}

export interface WalletTransactionsData {
  data: CoinTransaction[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage?: boolean;
  };
}

export const walletService = {
  getBalance: async (): Promise<WalletBalanceData> => {
    const res = await apiClient.get<{ success: boolean; data: WalletBalanceData }>('/wallet/balance');
    return res.data;
  },

  getTransactions: async (page = 1, limit = 20): Promise<WalletTransactionsData> => {
    const res = await apiClient.get<{
      success: boolean;
      data: CoinTransaction[];
      meta: WalletTransactionsData['meta'];
    }>(`/wallet/transactions?page=${page}&limit=${limit}`);
    return { data: res.data || [], meta: res.meta };
  },
};
