/**
 * IP 주소 추출 유틸리티
 */

import { NextRequest } from 'next/server';

export function getClientIpAddress(request: NextRequest): string {
  // X-Forwarded-For 헤더 확인 (프록시 환경)
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  // X-Real-IP 헤더 확인
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  
  // 기본 IP (로컬 개발 환경)
  return '127.0.0.1';
}
