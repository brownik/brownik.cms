/**
 * 관리자 인증 상태 관리 스토어
 */

import { create } from 'zustand';
import { setStorage, removeStorage, getStorage } from '@/common/common_util/storage';
import { STORAGE_KEYS } from '@/common/common_base/constants';

export interface AdminUser {
  id: number;
  userId: string;
  name: string;
  email?: string;
  memberLevel: string;
}

interface AdminAuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (user: AdminUser, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  logout: () => void;
  setUser: (user: AdminUser) => void;
  initializeAuth: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  
  setAuth: (user, accessToken, refreshToken) => {
    setStorage(STORAGE_KEYS.ADMIN_ACCESS_TOKEN, accessToken);
    setStorage(STORAGE_KEYS.ADMIN_REFRESH_TOKEN, refreshToken);
    set({ user, accessToken, refreshToken, isAuthenticated: true });
  },
  
  clearAuth: () => {
    removeStorage(STORAGE_KEYS.ADMIN_ACCESS_TOKEN);
    removeStorage(STORAGE_KEYS.ADMIN_REFRESH_TOKEN);
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
  },
  
  logout: () => {
    removeStorage(STORAGE_KEYS.ADMIN_ACCESS_TOKEN);
    removeStorage(STORAGE_KEYS.ADMIN_REFRESH_TOKEN);
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login';
    }
  },
  
  setUser: (user) => {
    set({ user });
  },
  
  initializeAuth: () => {
    const accessToken = getStorage<string>(STORAGE_KEYS.ADMIN_ACCESS_TOKEN);
    const refreshToken = getStorage<string>(STORAGE_KEYS.ADMIN_REFRESH_TOKEN);
    // TODO: 토큰으로 관리자 정보 조회
    if (accessToken && refreshToken) {
      set({ accessToken, refreshToken, isAuthenticated: true });
    }
  },
}));
