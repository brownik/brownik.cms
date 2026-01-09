/**
 * 공통 상수 정의
 */

// API 관련
export const API_ENDPOINTS = {
  AUTH: '/v1/auth',
  ADMIN_AUTH: '/v1/admin/auth',
  MEMBER: '/v1/members',
  BOARD: '/v1/boards',
  COMMENT: '/v1/comments',
} as const;

// 앱 설정
export const APP_CONFIG = {
  NAME: process.env.NEXT_PUBLIC_APP_NAME || 'townE',
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api',
} as const;

// 페이지네이션
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  ADMIN_ACCESS_TOKEN: 'adminAccessToken',
  ADMIN_REFRESH_TOKEN: 'adminRefreshToken',
} as const;
