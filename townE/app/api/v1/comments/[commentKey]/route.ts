/**
 * 댓글 CRUD API
 * POST /api/v1/comments/[commentKey] (생성은 별도 엔드포인트)
 * PUT /api/v1/comments/[commentKey]
 * DELETE /api/v1/comments/[commentKey]
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { getClientIpAddress } from '@/lib/utils/ip';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth/jwt';

// POST: 댓글 작성 (실제로는 /api/v1/comments로 요청)
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

    // 게시글의 댓글 수 증가
    await prisma.boardItem.update({
      where: { key: boardItemKey },
      data: { commentCount: { increment: 1 } },
    });

    // parentTopKey가 없으면 자신의 키로 설정
    if (!newComment.parentTopKey) {
      await prisma.comment.update({
        where: { key: newComment.key },
        data: { parentTopKey: newComment.key },
      });
    }

    return successResponse('댓글이 작성되었습니다', newComment);
  } catch (error: any) {
    console.error('Create comment error:', error);
    return errorResponse(error.message || '댓글 작성 중 오류가 발생했습니다', 500);
  }
}

// PUT: 댓글 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ commentKey: string }> }
) {
  try {
    const { commentKey: commentKeyParam } = await params;
    const commentKey = parseInt(commentKeyParam);
    const body = await request.json();
    const { comment } = body;

    if (!comment) {
      return errorResponse('댓글 내용은 필수입니다', 400);
    }

    const existingComment = await prisma.comment.findUnique({
      where: { key: commentKey },
    });

    if (!existingComment || existingComment.status !== 'U') {
      return errorResponse('존재하지 않는 댓글입니다', 404);
    }

    const clientIp = getClientIpAddress(request);
    let memberKey: number | null = null;

    // JWT에서 회원 정보 추출
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      const token = extractTokenFromHeader(authHeader);
      if (token) {
        try {
          const payload = verifyToken(token);
          memberKey = payload.memberKey;
        } catch (e) {
          // 토큰 검증 실패 시 비회원으로 처리
        }
      }
    }

    const updatedComment = await prisma.comment.update({
      where: { key: commentKey },
      data: {
        comment,
        updateIp: clientIp,
        updateMemberKey: memberKey,
        updateDate: new Date(),
      },
    });

    return successResponse('댓글이 수정되었습니다', updatedComment);
  } catch (error: any) {
    console.error('Update comment error:', error);
    return errorResponse(error.message || '댓글 수정 중 오류가 발생했습니다', 500);
  }
}

// DELETE: 댓글 삭제 (논리 삭제)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ commentKey: string }> }
) {
  try {
    const { commentKey: commentKeyParam } = await params;
    const commentKey = parseInt(commentKeyParam);

    const comment = await prisma.comment.findUnique({
      where: { key: commentKey },
    });

    if (!comment || comment.status !== 'U') {
      return errorResponse('존재하지 않는 댓글입니다', 404);
    }

    // 대댓글이 있는지 확인
    const hasChildComments = await prisma.comment.count({
      where: {
        parentKey: commentKey,
        status: 'U',
      },
    });

    if (hasChildComments > 0) {
      // 대댓글이 있으면 부모만 논리 삭제
      // (UI에서 "삭제된 댓글입니다" 표시)
    }

    const clientIp = getClientIpAddress(request);
    let memberKey: number | null = null;

    // JWT에서 회원 정보 추출
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      const token = extractTokenFromHeader(authHeader);
      if (token) {
        try {
          const payload = verifyToken(token);
          memberKey = payload.memberKey;
        } catch (e) {
          // 토큰 검증 실패 시 비회원으로 처리
        }
      }
    }

    // 논리 삭제
    await prisma.comment.update({
      where: { key: commentKey },
      data: {
        status: 'D',
        updateIp: clientIp,
        updateMemberKey: memberKey,
        updateDate: new Date(),
      },
    });

    // 게시글의 댓글 수 감소
    await prisma.boardItem.update({
      where: { key: comment.boardItemKey },
      data: { commentCount: { decrement: 1 } },
    });

    return successResponse('댓글이 삭제되었습니다', null);
  } catch (error: any) {
    console.error('Delete comment error:', error);
    return errorResponse(error.message || '댓글 삭제 중 오류가 발생했습니다', 500);
  }
}
