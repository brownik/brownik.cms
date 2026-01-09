/**
 * 인증 상태 관리 스토어
 */

import { create } from 'zustand';
import { setStorage, removeStorage, getStorage } from '@/common/common_util/storage';
import { STORAGE_KEYS } from '@/common/common_base/constants';

export interface User {
  id: number;
  userId: string;
  name: string;
  email?: string;
  memberLevel: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  logout: () => void;
  setUser: (user: User) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  
  setAuth: (user, accessToken, refreshToken) => {
    setStorage(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    setStorage(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    set({ user, accessToken, refreshToken, isAuthenticated: true });
  },
  
  clearAuth: () => {
    removeStorage(STORAGE_KEYS.ACCESS_TOKEN);
    removeStorage(STORAGE_KEYS.REFRESH_TOKEN);
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
  },
  
  logout: () => {
    removeStorage(STORAGE_KEYS.ACCESS_TOKEN);
    removeStorage(STORAGE_KEYS.REFRESH_TOKEN);
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  },
  
  setUser: (user) => {
    set({ user });
  },
  
  initializeAuth: () => {
    const accessToken = getStorage<string>(STORAGE_KEYS.ACCESS_TOKEN);
    const refreshToken = getStorage<string>(STORAGE_KEYS.REFRESH_TOKEN);
    // TODO: 토큰으로 사용자 정보 조회
    if (accessToken && refreshToken) {
      set({ accessToken, refreshToken, isAuthenticated: true });
    }
  },
}));
