/**
 * 게시판 서비스
 */

import apiClient from '../api/client';
import { ApiResponse, PaginationParams, PaginationResponse } from '@/common/common_model/api';

export interface BoardItem {
  key: number;
  boardKey: number;
  title: string;
  content: string;
  writer: string;
  hit: number;
  commentCount: number;
  notice: 'Y' | 'N';
  secret: 'Y' | 'N';
  status: 'U' | 'N' | 'D';
  insertDate: string;
  updateDate?: string;
}

export interface BoardItemListResponse extends PaginationResponse {
  items: BoardItem[];
}

export interface BoardItemCreateRequest {
  title: string;
  content: string;
  writer: string;
  categoryKey?: number;
  notice?: 'Y' | 'N';
  secret?: 'Y' | 'N';
  passwd?: string;
  openDate?: string;
  closeDate?: string;
  parentKey?: number;
}

export interface BoardItemUpdateRequest {
  title?: string;
  content?: string;
  writer?: string;
  categoryKey?: number;
  notice?: 'Y' | 'N';
  secret?: 'Y' | 'N';
  passwd?: string;
  openDate?: string;
  closeDate?: string;
}

export const boardService = {
  /**
   * 게시글 목록 조회
   */
  async getBoardItemList(
    boardKey: number,
    params: PaginationParams & { keyword?: string }
  ): Promise<ApiResponse<BoardItemListResponse>> {
    const response = await apiClient.get<ApiResponse<BoardItemListResponse>>(
      `/v1/boards/${boardKey}/items`,
      { params }
    );
    return response.data;
  },
  
  /**
   * 게시글 상세 조회
   */
  async getBoardItemDetail(
    boardKey: number,
    itemKey: number
  ): Promise<ApiResponse<BoardItem>> {
    const response = await apiClient.get<ApiResponse<BoardItem>>(
      `/v1/boards/${boardKey}/items/${itemKey}`
    );
    return response.data;
  },
  
  /**
   * 게시글 작성
   */
  async createBoardItem(
    boardKey: number,
    request: BoardItemCreateRequest
  ): Promise<ApiResponse<BoardItem>> {
    const response = await apiClient.post<ApiResponse<BoardItem>>(
      `/v1/boards/${boardKey}/items`,
      request
    );
    return response.data;
  },
  
  /**
   * 게시글 수정
   */
  async updateBoardItem(
    boardKey: number,
    itemKey: number,
    request: BoardItemUpdateRequest
  ): Promise<ApiResponse<BoardItem>> {
    const response = await apiClient.put<ApiResponse<BoardItem>>(
      `/v1/boards/${boardKey}/items/${itemKey}`,
      request
    );
    return response.data;
  },
  
  /**
   * 게시글 삭제
   */
  async deleteBoardItem(
    boardKey: number,
    itemKey: number
  ): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/v1/boards/${boardKey}/items/${itemKey}`
    );
    return response.data;
  },
};
