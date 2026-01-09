/**
 * 게시글 목록 조회 API
 * GET /api/v1/boards/[boardKey]/items
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/utils/response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ boardKey: string }> }
) {
  try {
    const { boardKey: boardKeyParam } = await params;
    const boardKey = parseInt(boardKeyParam);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '0');
    const size = parseInt(searchParams.get('size') || '10');
    const keyword = searchParams.get('keyword') || '';

    // 게시판 존재 여부 확인
    const board = await prisma.board.findUnique({
      where: { key: boardKey },
    });

    if (!board) {
      return errorResponse('존재하지 않는 게시판입니다', 404);
    }

    // 검색 조건
    const where: any = {
      boardKey,
      status: 'U', // 승인된 게시글만
    };

    // 키워드 검색
    if (keyword) {
      where.OR = [
        { title: { contains: keyword } },
        { content: { contains: keyword } },
        { writer: { contains: keyword } },
      ];
    }

    // 현재 시간 기준 공개 기간 확인
    const now = new Date();
    where.OR = [
      { openDate: null },
      { openDate: { lte: now } },
    ];
    where.AND = [
      { closeDate: null },
      { closeDate: { gte: now } },
    ];

    // 전체 개수 조회
    const totalElements = await prisma.boardItem.count({ where });

    // 게시글 목록 조회
    const items = await prisma.boardItem.findMany({
      where,
      skip: page * size,
      take: size,
      orderBy: [
        { notice: 'desc' }, // 공지사항 우선
        { insertDate: 'desc' }, // 최신순
      ],
      select: {
        key: true,
        boardKey: true,
        title: true,
        writer: true,
        hit: true,
        commentCount: true,
        notice: true,
        secret: true,
        status: true,
        insertDate: true,
        updateDate: true,
      },
    });

    const totalPages = Math.ceil(totalElements / size);

    return successResponse('게시글 목록 조회 성공', {
      items,
      totalElements,
      totalPages,
      currentPage: page,
      size,
      hasNext: page < totalPages - 1,
      hasPrevious: page > 0,
    });
  } catch (error: any) {
    console.error('Get board items error:', error);
    return errorResponse(error.message || '게시글 목록 조회 중 오류가 발생했습니다', 500);
  }
}
