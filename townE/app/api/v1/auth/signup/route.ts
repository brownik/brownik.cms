/**
 * 회원가입 API
 * POST /api/v1/auth/signup
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth/password';
import { generateAccessToken, generateRefreshToken } from '@/lib/auth/jwt';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { getClientIpAddress } from '@/lib/utils/ip';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      memberType = 'P',
      userId,
      userPw,
      name,
      nickName,
      email,
      phone,
      businessNumber,
      companyName,
    } = body;

    if (!userId || !userPw || !name) {
      return errorResponse('필수 정보를 입력해주세요', 400);
    }

    // 중복 아이디 확인
    const existingMember = await prisma.member.findFirst({
      where: { userId },
    });

    if (existingMember) {
      return errorResponse('이미 사용 중인 아이디입니다', 400);
    }

    // 비밀번호 해시화
    const hashedPassword = await hashPassword(userPw);

    // 회원 생성
    const clientIp = getClientIpAddress(request);
    const member = await prisma.member.create({
      data: {
        memberType,
        userId,
        userPw: hashedPassword,
        name,
        nickName,
        email,
        phone,
        businessNumber,
        companyName,
        memberLevel: '0', // 일반 회원
        status: 'U',
        insertIp: clientIp,
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

    return successResponse('회원가입이 완료되었습니다', {
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
    console.error('Signup error:', error);
    return errorResponse(error.message || '회원가입 중 오류가 발생했습니다', 500);
  }
}
