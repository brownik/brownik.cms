import apiClient from './client';
import { ApiResponse } from './types';

export interface MemberResponse {
  id: number;
  userId: string;
  name: string;
  nickName?: string;
  memberType: string;
  email?: string;
  phone?: string;
  memberLevel: string;
  status: string;
}

export interface MemberUpdateRequest {
  name?: string;
  nickName?: string;
  tel?: string;
  phone?: string;
  fax?: string;
  email?: string;
  age?: number;
  gender?: 'M' | 'F';
  zipCode?: string;
  address1?: string;
  address2?: string;
  birthday?: string;
  birthdayType?: 'S' | 'L';
  emailAgree?: 'Y' | 'N';
  smsAgree?: 'Y' | 'N';
}

export const memberApi = {
  getMyInfo: async (): Promise<ApiResponse<MemberResponse>> => {
    const response = await apiClient.get<ApiResponse<MemberResponse>>(
      '/v1/members/me'
    );
    return response.data;
  },

  updateMyInfo: async (
    data: MemberUpdateRequest
  ): Promise<ApiResponse<MemberResponse>> => {
    const response = await apiClient.put<ApiResponse<MemberResponse>>(
      '/v1/members/me',
      data
    );
    return response.data;
  },
};

