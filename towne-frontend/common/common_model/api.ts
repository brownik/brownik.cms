/**
 * 공통 API 타입 정의
 */

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
  timestamp: string;
}

export interface PaginationParams {
  page: number;
  size: number;
}

export interface PaginationResponse {
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
