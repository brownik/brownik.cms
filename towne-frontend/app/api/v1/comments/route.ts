/**
 * 댓글 목록 조회 API
 * GET /api/v1/comments?boardItemKey={boardItemKey}
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/utils/response';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const boardItemKey = parseInt(searchParams.get('boardItemKey') || '0');

    if (!boardItemKey) {
      return errorResponse('boardItemKey가 필요합니다', 400);
    }

    // 게시글 존재 여부 확인
    const boardItem = await prisma.boardItem.findUnique({
      where: { key: boardItemKey },
    });

    if (!boardItem) {
      return errorResponse('존재하지 않는 게시글입니다', 404);
    }

    // 댓글 목록 조회 (계층 구조)
    const comments = await prisma.comment.findMany({
      where: {
        boardItemKey,
        status: 'U',
      },
      orderBy: [
        { parentTopKey: 'asc' },
        { insertDate: 'asc' },
      ],
    });

    return successResponse('댓글 목록 조회 성공', { comments });
  } catch (error: any) {
    console.error('Get comments error:', error);
    return errorResponse(error.message || '댓글 목록 조회 중 오류가 발생했습니다', 500);
  }
}
