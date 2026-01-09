/**
 * 관리자 로그인 API
 * POST /api/v1/admin/auth/login
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth/password';
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

    // 관리자 회원 조회 (memberLevel이 9인 경우 최고관리자)
    const member = await prisma.member.findFirst({
      where: {
        userId,
        status: 'U',
        // 관리자는 memberLevel이 높은 사용자 (예: 9=최고관리자)
        // 필요에 따라 조건 추가 가능
      },
    });

    if (!member || !member.userPw) {
      return errorResponse('아이디 또는 비밀번호가 잘못되었습니다', 401);
    }

    // 관리자 권한 확인 (memberLevel이 9 이상인 경우)
    const memberLevel = parseInt(member.memberLevel || '0');
    if (memberLevel < 9) {
      return errorResponse('관리자 권한이 없습니다', 403);
    }

    // 비밀번호 검증 (하이브리드 방식: bcrypt + SHA-256)
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

    // SHA-256 해시인 경우 bcrypt로 재해싱
    if (!member.userPw.startsWith('$2')) {
      const { hashPassword } = await import('@/lib/auth/password');
      const newHashedPassword = await hashPassword(userPw);
      await prisma.member.update({
        where: { key: member.key },
        data: { userPw: newHashedPassword },
      });
      console.log(`회원 ${member.userId}의 비밀번호를 bcrypt로 재해싱했습니다.`);
    }

    // 로그인 정보 업데이트
    const clientIp = getClientIpAddress(request);
    await prisma.member.update({
      where: { key: member.key },
      data: {
        lastLoginDate: new Date(),
        lastLoginIp: clientIp,
        loginFailCount: 0,
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

    return successResponse('관리자 로그인 성공', {
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
    console.error('Admin login error:', error);
    return errorResponse(error.message || '관리자 로그인 중 오류가 발생했습니다', 500);
  }
}
