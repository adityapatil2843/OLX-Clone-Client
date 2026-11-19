/**
 * Normalized API Error Class
 * Standardizes backend and network errors without exposing internal traces or tokens.
 */

export class ApiError extends Error {
  public status: number;
  public code: string;
  public details?: unknown;
  public retryAfter?: string | null;

  constructor(
    message: string,
    status = 500,
    code = 'UNKNOWN_ERROR',
    details?: unknown,
    retryAfter?: string | null
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.retryAfter = retryAfter;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  isValidationError(): boolean {
    return this.status === 422;
  }

  isUnauthorized(): boolean {
    return this.status === 401;
  }

  isForbidden(): boolean {
    return this.status === 403;
  }

  isNotFound(): boolean {
    return this.status === 404;
  }

  isRateLimited(): boolean {
    return this.status === 429;
  }

  /**
   * Extracts structured validation field errors if present in details (e.g. from Zod flatten()).
   */
  getFieldErrors(): Record<string, string[]> | null {
    if (!this.details || typeof this.details !== 'object') {
      return null;
    }

    const obj = this.details as Record<string, unknown>;
    if (obj.fieldErrors && typeof obj.fieldErrors === 'object') {
      return obj.fieldErrors as Record<string, string[]>;
    }

    if (obj.formErrors && Array.isArray(obj.formErrors)) {
      return { _form: obj.formErrors as string[] };
    }

    return null;
  }

  static fromUnknown(err: unknown): ApiError {
    if (err instanceof ApiError) return err;
    if (err instanceof Error) {
      return new ApiError(err.message, 500, 'UNEXPECTED_ERROR');
    }
    return new ApiError('An unexpected network error occurred', 500, 'UNKNOWN_ERROR');
  }

  static fromResponse(
    status: number,
    data: unknown,
    headers?: Record<string, unknown>
  ): ApiError {
    const responseObj = data && typeof data === 'object' ? (data as Record<string, unknown>) : null;
    const errObj = responseObj?.error && typeof responseObj.error === 'object'
      ? (responseObj.error as Record<string, unknown>)
      : null;

    const message =
      (errObj?.message as string) ||
      (responseObj?.message as string) ||
      'An unexpected error occurred';

    const code =
      (errObj?.code as string) ||
      (responseObj?.code as string) ||
      (status === 422
        ? 'VALIDATION_ERROR'
        : status === 401
        ? 'UNAUTHORIZED'
        : status === 403
        ? 'FORBIDDEN'
        : status === 404
        ? 'NOT_FOUND'
        : status === 429
        ? 'RATE_LIMITED'
        : 'API_ERROR');

    const details = errObj?.details ?? responseObj?.details;
    const retryAfter = (headers?.['retry-after'] as string) || null;

    return new ApiError(message, status, code, details, retryAfter);
  }
}
