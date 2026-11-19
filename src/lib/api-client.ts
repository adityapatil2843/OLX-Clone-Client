import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { ApiError } from './api-error';
import { tokenStorage } from './token-storage';
import { refreshCoordinator } from './refresh-coordinator';
import { env } from './env';

const API_BASE_URL = env.apiBaseUrl;

/**
 * Strips undefined, null, and empty string parameters before sending GET query strings.
 */
export const cleanParams = (
  params?: Record<string, unknown>
): Record<string, unknown> | undefined => {
  if (!params) return undefined;
  const cleaned: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== null && val !== '') {
      cleaned[key] = val;
    }
  }
  return Object.keys(cleaned).length > 0 ? cleaned : undefined;
};

class ApiClient {
  public client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request Interceptor: Attach Bearer Token (Never log tokens)
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
          delete config.headers['Content-Type'];
        }
        const token = tokenStorage.getAccessToken();
        if (token && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response Interceptor: Error Normalization & Single-Flight 401 Refresh
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as
          | (InternalAxiosRequestConfig & { _retry?: boolean })
          | undefined;
        const statusCode = error.response?.status;
        const responseData = error.response?.data;
        const headers = error.response?.headers as Record<string, unknown> | undefined;

        // Handle 401 Unauthorized: Attempt token refresh with single-flight mutex
        const isAuthEndpoint =
          originalRequest?.url?.includes('/auth/login') ||
          originalRequest?.url?.includes('/auth/register') ||
          originalRequest?.url?.includes('/auth/refresh');

        if (statusCode === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
          originalRequest._retry = true;
          const refreshToken = tokenStorage.getRefreshToken();

          if (refreshToken) {
            try {
              const newAccessToken = await refreshCoordinator.executeRefresh(async () => {
                const res = await axios.post<{
                  success: boolean;
                  data: { tokens?: { accessToken: string; refreshToken?: string } };
                }>(`${API_BASE_URL}/auth/refresh`, { refreshToken });

                const newTokens = res.data.data?.tokens;
                if (newTokens?.accessToken) {
                  tokenStorage.saveTokens(newTokens.accessToken, newTokens.refreshToken);
                  return newTokens.accessToken;
                }
                return null;
              });

              if (newAccessToken) {
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return this.client(originalRequest);
              }
            } catch {
              tokenStorage.clearTokens();
            }
          } else {
            tokenStorage.clearTokens();
          }
        }

        const normalizedError = ApiError.fromResponse(
          statusCode || 500,
          responseData || { message: error.message },
          headers
        );

        return Promise.reject(normalizedError);
      }
    );
  }

  // Convenient typed helper methods
  async get<T>(url: string, params?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.get<T>(url, {
      ...config,
      params: cleanParams(params),
    });
    return res.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.post<T>(url, data, config);
    return res.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.put<T>(url, data, config);
    return res.data;
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.patch<T>(url, data, config);
    return res.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.delete<T>(url, config);
    return res.data;
  }
}

export const apiClient = new ApiClient();
export { ApiError } from './api-error';
