/**
 * 댓글 작성 API
 * POST /api/v1/comments/create
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { getClientIpAddress } from '@/lib/utils/ip';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth/jwt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      boardItemKey,
      parentKey,
      comment,
      writer,
      passwd,
    } = body;

    if (!boardItemKey || !comment || !writer) {
      return errorResponse('게시글 키, 댓글 내용, 작성자는 필수입니다', 400);
    }

    // 게시글 존재 여부 확인
    const boardItem = await prisma.boardItem.findUnique({
      where: { key: boardItemKey },
    });

    if (!boardItem) {
      return errorResponse('존재하지 않는 게시글입니다', 404);
    }

    const clientIp = getClientIpAddress(request);
    let memberKey: number | null = null;
    let parentTopKey: number | null = null;
    let depth = 0;

    // JWT에서 회원 정보 추출
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      const token = extractTokenFromHeader(authHeader);
      if (token) {
        try {
          const payload = verifyToken(token);
          memberKey = payload.memberKey;
        } catch (e) {
          // 토큰이 없어도 비회원 댓글 작성 가능
        }
      }
    }

    // 부모 댓글이 있는 경우
    if (parentKey) {
      const parentComment = await prisma.comment.findUnique({
        where: { key: parentKey },
      });

      if (!parentComment) {
        return errorResponse('존재하지 않는 부모 댓글입니다', 404);
      }

      parentTopKey = parentComment.parentTopKey || parentComment.key;
      depth = parentComment.depth + 1;
    }

    // 댓글 생성
    const newComment = await prisma.comment.create({
      data: {
        boardItemKey,
        parentKey: parentKey || null,
        parentTopKey: parentTopKey || null,
        comment,
        writer,
        passwd,
        depth,
        insertIp: clientIp,
        insertMemberKey: memberKey,
        status: 'U',
      },
    });

    // parentTopKey가 없으면 자신의 키로 설정
    if (!newComment.parentTopKey) {
      await prisma.comment.update({
        where: { key: newComment.key },
        data: { parentTopKey: newComment.key },
      });
    }

    // 게시글의 댓글 수 증가
    await prisma.boardItem.update({
      where: { key: boardItemKey },
      data: { commentCount: { increment: 1 } },
    });

    return successResponse('댓글이 작성되었습니다', newComment);
  } catch (error: any) {
    console.error('Create comment error:', error);
    return errorResponse(error.message || '댓글 작성 중 오류가 발생했습니다', 500);
  }
}
