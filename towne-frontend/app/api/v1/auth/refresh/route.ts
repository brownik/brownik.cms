/**
 * 토큰 갱신 API
 * POST /api/v1/auth/refresh
 */

import { NextRequest } from 'next/server';
import { verifyToken, generateAccessToken, extractTokenFromHeader } from '@/lib/auth/jwt';
import { successResponse, errorResponse } from '@/lib/utils/response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return errorResponse('Refresh token이 필요합니다', 400);
    }

    // Refresh token 검증
    const payload = verifyToken(refreshToken);

    // 새로운 Access token 생성
    const newAccessToken = generateAccessToken({
      memberKey: payload.memberKey,
      userId: payload.userId,
      memberLevel: payload.memberLevel,
    });

    return successResponse('토큰이 갱신되었습니다', {
      accessToken: newAccessToken,
    });
  } catch (error: any) {
    console.error('Refresh token error:', error);
    return errorResponse('유효하지 않은 토큰입니다', 401);
  }
}
