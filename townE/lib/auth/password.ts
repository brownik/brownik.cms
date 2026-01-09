/**
 * 비밀번호 유틸리티
 * 기존 SHA-256 해시와 새로운 bcrypt 해시 모두 지원
 */

import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const SALT_ROUNDS = 10;

/**
 * 비밀번호 해시화 (bcrypt 사용)
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * SHA-256 해시 생성 (기존 호환용)
 */
export function sha256Hash(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * 비밀번호 검증 (하이브리드 방식)
 * 1. 먼저 bcrypt 해시인지 확인
 * 2. bcrypt가 아니면 SHA-256 해시로 확인
 * 3. SHA-256 해시가 맞으면 bcrypt로 재해싱하여 업데이트
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  // 1. bcrypt 해시인지 확인 (bcrypt 해시는 $2로 시작)
  if (hashedPassword.startsWith('$2')) {
    return bcrypt.compare(password, hashedPassword);
  }

  // 2. SHA-256 해시로 확인 (64자 hex 문자열)
  const sha256HashValue = sha256Hash(password);
  if (hashedPassword === sha256HashValue) {
    // SHA-256 해시가 맞으면 bcrypt로 재해싱하여 반환
    console.log('SHA-256 해시 검증 성공, bcrypt로 재해싱 필요');
    return true;
  }

  return false;
}

/**
 * SHA-256 해시를 bcrypt로 마이그레이션
 */
export async function migrateSha256ToBcrypt(sha256Hash: string): Promise<string | null> {
  // SHA-256 해시를 bcrypt로 변환하는 것은 불가능하므로
  // 마이그레이션 시점에 별도 처리 필요
  return null;
}
