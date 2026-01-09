import adminApiClient from '@/core/core_network/api/adminClient';
import { ApiResponse } from '@/common/common_model/api';
import { AuthResponse } from '@/core/core_network/services/authService';

export interface AdminLoginRequest {
  userId: string;
  userPw: string;
}

export const adminAuthApi = {
  login: async (data: AdminLoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await adminApiClient.post<ApiResponse<AuthResponse>>(
      '/v1/admin/auth/login',
      data
    );
    return response.data;
  },
};

