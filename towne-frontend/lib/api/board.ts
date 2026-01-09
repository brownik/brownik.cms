import apiClient from '@/core/core_network/api/client';
import { ApiResponse } from '@/common/common_model/api';

// 게시글 타입 정의
export interface BoardItem {
  key: number;
  boardKey: number;
  title: string;
  content: string;
  writer: string;
  hit: number;
  commentCount: number;
  notice: string; // 'Y' | 'N'
  secret: string; // 'Y' | 'N'
  status: string; // 'U' | 'N' | 'D'
  insertDate: string;
  updateDate?: string;
  categoryKey?: number;
  openDate?: string;
  closeDate?: string;
  parentKey?: number;
  parentTopKey?: number;
  parentAllKey?: string;
  depth: number;
}

export interface BoardItemListResponse {
  items: BoardItem[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface BoardItemCreateRequest {
  title: string;
  content: string;
  writer: string;
  categoryKey?: number;
  notice?: string;
  secret?: string;
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
  notice?: string;
  secret?: string;
  passwd?: string;
  openDate?: string;
  closeDate?: string;
}

// 게시글 목록 조회
export async function getBoardItemList(
  boardKey: number,
  page: number = 0,
  size: number = 10,
  keyword?: string
): Promise<BoardItemListResponse> {
  const params: Record<string, string> = {
    page: page.toString(),
    size: size.toString(),
  };
  if (keyword) {
    params.keyword = keyword;
  }

  const response = await apiClient.get<ApiResponse<BoardItemListResponse>>(
    `/v1/boards/${boardKey}/items`,
    { params }
  );
  return response.data.data;
}

// 게시글 상세 조회
export async function getBoardItemDetail(
  boardKey: number,
  itemKey: number
): Promise<BoardItem> {
  const response = await apiClient.get<ApiResponse<BoardItem>>(
    `/v1/boards/${boardKey}/items/${itemKey}`
  );
  return response.data.data;
}

// 게시글 작성
export async function createBoardItem(
  boardKey: number,
  request: BoardItemCreateRequest
): Promise<BoardItem> {
  const response = await apiClient.post<ApiResponse<BoardItem>>(
    `/v1/boards/${boardKey}/items`,
    request
  );
  return response.data.data;
}

// 게시글 수정
export async function updateBoardItem(
  boardKey: number,
  itemKey: number,
  request: BoardItemUpdateRequest
): Promise<BoardItem> {
  const response = await apiClient.put<ApiResponse<BoardItem>>(
    `/v1/boards/${boardKey}/items/${itemKey}`,
    request
  );
  return response.data.data;
}

// 게시글 삭제
export async function deleteBoardItem(
  boardKey: number,
  itemKey: number
): Promise<void> {
  await apiClient.delete<ApiResponse<void>>(
    `/v1/boards/${boardKey}/items/${itemKey}`
  );
}
