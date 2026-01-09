/**
 * 공통 설정
 */

import { APP_CONFIG } from './constants';

export const config = {
  app: {
    name: APP_CONFIG.NAME,
    apiBaseUrl: APP_CONFIG.API_BASE_URL,
  },
  features: {
    auth: {
      tokenRefreshThreshold: 5 * 60 * 1000, // 5분
    },
  },
} as const;

export type AppConfig = typeof config;
