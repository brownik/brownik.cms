/**
 * JWT 유틸리티
 */

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production-min-256-bits';
const JWT_EXPIRATION = parseInt(process.env.JWT_EXPIRATION || '86400000'); // 24시간
const JWT_REFRESH_EXPIRATION = parseInt(process.env.JWT_REFRESH_EXPIRATION || '604800000'); // 7일

export interface JwtPayload {
  memberKey: number;
  userId: string;
  memberLevel: string;
}

/**
 * Access Token 생성
 */
export function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION / 1000, // 초 단위로 변환
  });
}

/**
 * Refresh Token 생성
 */
export function generateRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRATION / 1000,
  });
}

/**
 * Token 검증
 */
export function verifyToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

/**
 * Request에서 Token 추출
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
}
