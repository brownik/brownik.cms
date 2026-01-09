/**
 * 회원 정보 API
 * GET /api/v1/members/me - 회원 정보 조회
 * PUT /api/v1/members/me - 회원 정보 수정
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth/jwt';
import { getClientIpAddress } from '@/lib/utils/ip';

// GET: 회원 정보 조회
export async function GET(request: NextRequest) {
  try {
    // JWT에서 회원 정보 추출
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return errorResponse('인증이 필요합니다', 401);
    }

    const token = extractTokenFromHeader(authHeader);
    if (!token) {
      return errorResponse('유효하지 않은 토큰입니다', 401);
    }

    const payload = verifyToken(token);
    const member = await prisma.member.findUnique({
      where: { key: payload.memberKey },
    });

    if (!member || member.status !== 'U') {
      return errorResponse('존재하지 않는 회원입니다', 404);
    }

    return successResponse('회원 정보 조회 성공', {
      id: member.key,
      userId: member.userId,
      name: member.name,
      nickName: member.nickName,
      memberType: member.memberType,
      email: member.email,
      phone: member.phone,
      memberLevel: member.memberLevel,
      status: member.status,
    });
  } catch (error: any) {
    console.error('Get member info error:', error);
    return errorResponse(error.message || '회원 정보 조회 중 오류가 발생했습니다', 500);
  }
}

// PUT: 회원 정보 수정
export async function PUT(request: NextRequest) {
  try {
    // JWT에서 회원 정보 추출
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return errorResponse('인증이 필요합니다', 401);
    }

    const token = extractTokenFromHeader(authHeader);
    if (!token) {
      return errorResponse('유효하지 않은 토큰입니다', 401);
    }

    const payload = verifyToken(token);
    const body = await request.json();

    const member = await prisma.member.findUnique({
      where: { key: payload.memberKey },
    });

    if (!member || member.status !== 'U') {
      return errorResponse('존재하지 않는 회원입니다', 404);
    }

    const clientIp = getClientIpAddress(request);

    // 회원 정보 업데이트
    const updatedMember = await prisma.member.update({
      where: { key: member.key },
      data: {
        name: body.name ?? member.name,
        nickName: body.nickName ?? member.nickName,
        tel: body.tel ?? member.tel,
        phone: body.phone ?? member.phone,
        fax: body.fax ?? member.fax,
        email: body.email ?? member.email,
        age: body.age ?? member.age,
        gender: body.gender ?? member.gender,
        zipCode: body.zipCode ?? member.zipCode,
        address1: body.address1 ?? member.address1,
        address2: body.address2 ?? member.address2,
        birthday: body.birthday ?? member.birthday,
        birthdayType: body.birthdayType ?? member.birthdayType,
        emailAgree: body.emailAgree ?? member.emailAgree,
        smsAgree: body.smsAgree ?? member.smsAgree,
        updateIp: clientIp,
        updateMemberKey: payload.memberKey,
        updateDate: new Date(),
      },
    });

    return successResponse('회원 정보가 수정되었습니다', {
      id: updatedMember.key,
      userId: updatedMember.userId,
      name: updatedMember.name,
      nickName: updatedMember.nickName,
      memberType: updatedMember.memberType,
      email: updatedMember.email,
      phone: updatedMember.phone,
      memberLevel: updatedMember.memberLevel,
      status: updatedMember.status,
    });
  } catch (error: any) {
    console.error('Update member info error:', error);
    return errorResponse(error.message || '회원 정보 수정 중 오류가 발생했습니다', 500);
  }
}
