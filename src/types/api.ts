/**
 * Authoritative API Response and Pagination Envelopes
 * Strictly matches server/src/utils/response.js and server/src/middlewares/errorHandler.js
 */

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: PaginationMeta | Record<string, unknown>;
}

export interface PaginatedApiResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface ApiErrorPayload {
  message: string;
  code?: string;
  details?: unknown;
  stack?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorPayload;
}
