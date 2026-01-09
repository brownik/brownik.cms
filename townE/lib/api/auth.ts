import apiClient from '@/core/core_network/api/client';
import { ApiResponse } from '@/common/common_model/api';

export interface SignupRequest {
  memberType: 'P' | 'C';
  userId: string;
  userPw: string;
  name: string;
  nickName?: string;
  email?: string;
  phone?: string;
  businessNumber?: string;
  companyName?: string;
}

export interface LoginRequest {
  userId: string;
  userPw: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    userId: string;
    name: string;
    memberLevel: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export const authApi = {
  signup: async (data: SignupRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/v1/auth/signup',
      data
    );
    return response.data;
  },

  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/v1/auth/login',
      data
    );
    return response.data;
  },

  refreshToken: async (
    refreshToken: string
  ): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/v1/auth/refresh',
      { refreshToken }
    );
    return response.data;
  },
};

