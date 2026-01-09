/**
 * 로그인 API
 * POST /api/v1/auth/login
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { generateAccessToken, generateRefreshToken } from '@/lib/auth/jwt';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { getClientIpAddress } from '@/lib/utils/ip';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, userPw } = body;

    if (!userId || !userPw) {
      return errorResponse('아이디와 비밀번호를 입력해주세요', 400);
    }

    // 사용자 조회
    const member = await prisma.member.findFirst({
      where: {
        userId,
        status: 'U', // 사용 중인 회원만
      },
    });

    if (!member || !member.userPw) {
      return errorResponse('아이디 또는 비밀번호가 잘못되었습니다', 401);
    }

    // 비밀번호 검증
    const isValidPassword = await verifyPassword(userPw, member.userPw);
    if (!isValidPassword) {
      // 로그인 실패 횟수 증가
      await prisma.member.update({
        where: { key: member.key },
        data: {
          loginFailCount: { increment: 1 },
        },
      });
      return errorResponse('아이디 또는 비밀번호가 잘못되었습니다', 401);
    }

    // 로그인 정보 업데이트
    const clientIp = getClientIpAddress(request);
    await prisma.member.update({
      where: { key: member.key },
      data: {
        lastLoginDate: new Date(),
        lastLoginIp: clientIp,
        loginFailCount: 0, // 로그인 성공 시 실패 횟수 초기화
      },
    });

    // JWT 토큰 생성
    const accessToken = generateAccessToken({
      memberKey: member.key,
      userId: member.userId || '',
      memberLevel: member.memberLevel,
    });
    const refreshToken = generateRefreshToken({
      memberKey: member.key,
      userId: member.userId || '',
      memberLevel: member.memberLevel,
    });

    return successResponse('로그인 성공', {
      accessToken,
      refreshToken,
      user: {
        id: member.key,
        userId: member.userId,
        name: member.name,
        memberLevel: member.memberLevel,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return errorResponse(error.message || '로그인 중 오류가 발생했습니다', 500);
  }
}
