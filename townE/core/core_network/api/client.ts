/**
 * API 클라이언트 설정
 */

import axios from 'axios';
import { config } from '@/common/common_base/config';
import { getStorage, removeStorage, setStorage } from '@/common/common_util/storage';
import { STORAGE_KEYS } from '@/common/common_base/constants';

const apiClient = axios.create({
  baseURL: config.app.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // JWT 토큰이 있으면 헤더에 추가
    if (typeof window !== 'undefined') {
      const token = getStorage<string>(STORAGE_KEYS.ACCESS_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고 아직 재시도하지 않은 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh token으로 새 access token 발급
        const refreshToken = getStorage<string>(STORAGE_KEYS.REFRESH_TOKEN);
        if (refreshToken) {
          const response = await axios.post(
            `${config.app.apiBaseUrl}/v1/auth/refresh`,
            { refreshToken }
          );
          const { accessToken } = response.data.data;
          setStorage(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token도 만료된 경우 로그아웃 처리
        removeStorage(STORAGE_KEYS.ACCESS_TOKEN);
        removeStorage(STORAGE_KEYS.REFRESH_TOKEN);
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
