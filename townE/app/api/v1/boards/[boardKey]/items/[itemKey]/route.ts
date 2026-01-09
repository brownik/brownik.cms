/**
 * 게시글 상세 조회 API
 * GET /api/v1/boards/[boardKey]/items/[itemKey]
 * PUT /api/v1/boards/[boardKey]/items/[itemKey]
 * DELETE /api/v1/boards/[boardKey]/items/[itemKey]
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { getClientIpAddress } from '@/lib/utils/ip';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth/jwt';

// GET: 게시글 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ boardKey: string; itemKey: string }> }
) {
  try {
    const { boardKey: boardKeyParam, itemKey: itemKeyParam } = await params;
    const boardKey = parseInt(boardKeyParam);
    const itemKey = parseInt(itemKeyParam);

    const item = await prisma.boardItem.findFirst({
      where: {
        key: itemKey,
        boardKey,
        status: 'U',
      },
      include: {
        comments: {
          where: { status: 'U' },
          orderBy: { insertDate: 'asc' },
        },
      },
    });

    if (!item) {
      return errorResponse('존재하지 않는 게시글입니다', 404);
    }

    // 조회수 증가
    await prisma.boardItem.update({
      where: { key: itemKey },
      data: { hit: { increment: 1 } },
    });

    return successResponse('게시글 상세 조회 성공', {
      ...item,
      hit: item.hit + 1, // 증가된 조회수 반영
    });
  } catch (error: any) {
    console.error('Get board item error:', error);
    return errorResponse(error.message || '게시글 조회 중 오류가 발생했습니다', 500);
  }
}

// POST: 게시글 작성
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ boardKey: string }> }
) {
  try {
    const { boardKey: boardKeyParam } = await params;
    const boardKey = parseInt(boardKeyParam);
    const body = await request.json();
    const {
      title,
      content,
      writer,
      categoryKey,
      notice = 'N',
      secret = 'N',
      passwd,
      openDate,
      closeDate,
      parentKey,
    } = body;

    if (!title || !content || !writer) {
      return errorResponse('제목, 내용, 작성자는 필수입니다', 400);
    }

    // 게시판 존재 여부 확인
    const board = await prisma.board.findUnique({
      where: { key: boardKey },
    });

    if (!board) {
      return errorResponse('존재하지 않는 게시판입니다', 404);
    }

    const clientIp = getClientIpAddress(request);
    let memberKey: number | null = null;

    // JWT에서 회원 정보 추출 (선택적)
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      const token = extractTokenFromHeader(authHeader);
      if (token) {
        try {
          const payload = verifyToken(token);
          memberKey = payload.memberKey;
        } catch (e) {
          // 토큰이 없어도 비회원 게시글 작성 가능
        }
      }
    }

    const item = await prisma.boardItem.create({
      data: {
        boardKey,
        categoryKey,
        title,
        content,
        writer,
        notice,
        secret,
        passwd,
        openDate: openDate ? new Date(openDate) : null,
        closeDate: closeDate ? new Date(closeDate) : null,
        parentKey,
        insertIp: clientIp,
        insertMemberKey: memberKey,
        status: 'U',
        hit: 0,
        commentCount: 0,
        depth: 0,
      },
    });

    return successResponse('게시글이 작성되었습니다', item);
  } catch (error: any) {
    console.error('Create board item error:', error);
    return errorResponse(error.message || '게시글 작성 중 오류가 발생했습니다', 500);
  }
}

// PUT: 게시글 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ boardKey: string; itemKey: string }> }
) {
  try {
    const { boardKey: boardKeyParam, itemKey: itemKeyParam } = await params;
    const boardKey = parseInt(boardKeyParam);
    const itemKey = parseInt(itemKeyParam);
    const body = await request.json();

    const item = await prisma.boardItem.findFirst({
      where: {
        key: itemKey,
        boardKey,
        status: 'U',
      },
    });

    if (!item) {
      return errorResponse('존재하지 않는 게시글입니다', 404);
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

    const updatedItem = await prisma.boardItem.update({
      where: { key: itemKey },
      data: {
        ...body,
        updateIp: clientIp,
        updateMemberKey: memberKey,
        updateDate: new Date(),
      },
    });

    return successResponse('게시글이 수정되었습니다', updatedItem);
  } catch (error: any) {
    console.error('Update board item error:', error);
    return errorResponse(error.message || '게시글 수정 중 오류가 발생했습니다', 500);
  }
}

// DELETE: 게시글 삭제 (논리 삭제)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ boardKey: string; itemKey: string }> }
) {
  try {
    const { boardKey: boardKeyParam, itemKey: itemKeyParam } = await params;
    const boardKey = parseInt(boardKeyParam);
    const itemKey = parseInt(itemKeyParam);

    const item = await prisma.boardItem.findFirst({
      where: {
        key: itemKey,
        boardKey,
        status: 'U',
      },
    });

    if (!item) {
      return errorResponse('존재하지 않는 게시글입니다', 404);
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
    await prisma.boardItem.update({
      where: { key: itemKey },
      data: {
        status: 'D',
        updateIp: clientIp,
        updateMemberKey: memberKey,
        updateDate: new Date(),
      },
    });

    return successResponse('게시글이 삭제되었습니다', null);
  } catch (error: any) {
    console.error('Delete board item error:', error);
    return errorResponse(error.message || '게시글 삭제 중 오류가 발생했습니다', 500);
  }
}
