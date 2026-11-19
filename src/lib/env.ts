/**
 * Bazarr 360 - Safe Environment Configuration & Runtime Validation
 * Standard Production Domain: https://bazarr360.in
 *
 * Rules:
 * - No secrets in NEXT_PUBLIC_ variables
 * - Safe fallback defaults for local development
 * - Runtime validation for malformed URLs and missing variables
 * - Trailing slash normalization
 */

export interface ClientEnv {
  appName: string;
  appUrl: string;
  apiBaseUrl: string;
  isProduction: boolean;
  isDevelopment: boolean;
}

const DEFAULT_APP_NAME = 'Bazarr 360';
const DEFAULT_APP_URL = 'https://bazarr360.in';
const DEFAULT_API_BASE_URL = 'http://localhost:5000/api/v1';

/**
 * Normalizes URL by removing trailing slash and validating protocol
 */
export function normalizeUrl(url: string | undefined, defaultUrl: string, varName: string): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return defaultUrl;
  }

  const trimmed = url.trim();

  // Validate protocol
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    console.warn(
      `[Env Validation Warning]: ${varName} ("${trimmed}") does not specify http:// or https:// protocol. Falling back to default: ${defaultUrl}`
    );
    return defaultUrl;
  }

  try {
    const parsed = new URL(trimmed);
    // Return sanitized origin + pathname without trailing slash
    const cleanPath = parsed.pathname.replace(/\/+$/, '');
    return `${parsed.origin}${cleanPath}`;
  } catch {
    console.warn(
      `[Env Validation Warning]: ${varName} ("${trimmed}") is not a valid URL. Falling back to default: ${defaultUrl}`
    );
    return defaultUrl;
  }
}

/**
 * Validates and returns parsed client-safe environment variables
 */
export function getClientEnv(): ClientEnv {
  const rawAppName = process.env.NEXT_PUBLIC_APP_NAME;
  const rawAppUrl = process.env.NEXT_PUBLIC_APP_URL;
  const rawApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const appName = rawAppName?.trim() || DEFAULT_APP_NAME;
  const appUrl = normalizeUrl(rawAppUrl, DEFAULT_APP_URL, 'NEXT_PUBLIC_APP_URL');
  const apiBaseUrl = normalizeUrl(rawApiBaseUrl, DEFAULT_API_BASE_URL, 'NEXT_PUBLIC_API_BASE_URL');

  const nodeEnv = process.env.NODE_ENV || 'development';
  const isProduction = nodeEnv === 'production';
  const isDevelopment = nodeEnv === 'development';

  return {
    appName,
    appUrl,
    apiBaseUrl,
    isProduction,
    isDevelopment,
  };
}

export const env = getClientEnv();
