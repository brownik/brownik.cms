/**
 * 인증 서비스
 */

import apiClient from '../api/client';
import { ApiResponse } from '@/common/common_model/api';

export interface LoginRequest {
  userId: string;
  userPw: string;
}

export interface SignupRequest {
  userId: string;
  userPw: string;
  name: string;
  email?: string;
}

export interface AuthResponse {
  user: {
    id: number;
    userId: string;
    name: string;
    email?: string;
    memberLevel: string;
  };
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  /**
   * 로그인
   */
  async login(request: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/v1/auth/login',
      request
    );
    return response.data;
  },
  
  /**
   * 회원가입
   */
  async signup(request: SignupRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/v1/auth/signup',
      request
    );
    return response.data;
  },
  
  /**
   * 토큰 갱신
   */
  async refreshToken(refreshToken: string): Promise<ApiResponse<{ accessToken: string }>> {
    const response = await apiClient.post<ApiResponse<{ accessToken: string }>>(
      '/v1/auth/refresh',
      { refreshToken }
    );
    return response.data;
  },
  
  /**
   * 로그아웃
   */
  async logout(): Promise<void> {
    await apiClient.post('/v1/auth/logout');
  },
};
