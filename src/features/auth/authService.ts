import { apiClient } from '@/lib/api-client';
import { tokenStorage } from '@/lib/token-storage';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  locationCity?: string | null;
  locationState?: string | null;
  avatarUrl?: string | null;
  isVerifiedSeller?: boolean;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  name: string;
  email: string;
  password: string;
  phone?: string;
  locationCity?: string;
  locationState?: string;
}

export interface RequestOtpParams {
  email: string;
  purpose?: 'REGISTRATION' | 'LOGIN' | 'PASSWORD_RESET';
}

export interface VerifyOtpParams {
  email: string;
  otp: string;
  purpose?: 'REGISTRATION' | 'LOGIN' | 'PASSWORD_RESET';
}

export interface ResetPasswordParams {
  email: string;
  otp: string;
  newPassword: string;
}

export interface AuthApiResponse {
  success: boolean;
  data: {
    user: UserProfile;
    tokens: AuthTokens;
  };
}

export const authService = {
  login: async (params: LoginParams): Promise<UserProfile> => {
    const res = await apiClient.post<AuthApiResponse>('/auth/login', {
      email: params.email.trim().toLowerCase(),
      password: params.password,
    });

    const { user, tokens } = res.data;
    if (tokens?.accessToken) {
      tokenStorage.saveTokens(tokens.accessToken, tokens.refreshToken);
    }
    return user;
  },

  register: async (params: RegisterParams): Promise<UserProfile> => {
    const res = await apiClient.post<AuthApiResponse>('/auth/register', {
      name: params.name.trim(),
      email: params.email.trim().toLowerCase(),
      password: params.password,
      ...(params.phone ? { phone: params.phone.trim() } : {}),
      ...(params.locationCity ? { locationCity: params.locationCity.trim() } : {}),
      ...(params.locationState ? { locationState: params.locationState.trim() } : {}),
    });

    const { user, tokens } = res.data;
    if (tokens?.accessToken) {
      tokenStorage.saveTokens(tokens.accessToken, tokens.refreshToken);
    }
    return user;
  },

  requestOtp: async (params: RequestOtpParams): Promise<{ message: string; email: string }> => {
    const res = await apiClient.post<{ success: boolean; data: { message: string; email: string } }>(
      '/auth/otp/request',
      {
        email: params.email.trim().toLowerCase(),
        purpose: params.purpose || 'LOGIN',
      }
    );
    return res.data;
  },

  verifyOtp: async (params: VerifyOtpParams): Promise<{ user?: UserProfile; verified: boolean }> => {
    const res = await apiClient.post<{
      success: boolean;
      data: { user?: UserProfile; tokens?: AuthTokens; verified: boolean };
    }>('/auth/otp/verify', {
      email: params.email.trim().toLowerCase(),
      otp: params.otp.trim(),
      purpose: params.purpose || 'LOGIN',
    });

    const { user, tokens, verified } = res.data;
    if (tokens?.accessToken) {
      tokenStorage.saveTokens(tokens.accessToken, tokens.refreshToken);
    }
    return { user, verified };
  },

  getCurrentUser: async (): Promise<UserProfile | null> => {
    try {
      const token = tokenStorage.getAccessToken();
      if (!token) return null;
      const res = await apiClient.get<{ success: boolean; data: UserProfile }>('/auth/me');
      return res.data;
    } catch {
      return null;
    }
  },

  resetPassword: async (params: ResetPasswordParams): Promise<{ message: string }> => {
    const res = await apiClient.post<{ success: boolean; data: { message: string } }>(
      '/auth/password-reset',
      {
        email: params.email.trim().toLowerCase(),
        otp: params.otp.trim(),
        newPassword: params.newPassword,
      }
    );
    return res.data;
  },

  logout: async (): Promise<void> => {
    const refreshToken = tokenStorage.getRefreshToken();
    if (refreshToken) {
      try {
        await apiClient.post('/auth/logout', { refreshToken });
      } catch {
        // Ignore logout error if token already expired
      }
    }
    tokenStorage.clearTokens();
  },
};
