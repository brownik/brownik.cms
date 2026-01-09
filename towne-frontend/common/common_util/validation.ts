/**
 * 검증 유틸리티
 */

/**
 * 이메일 형식 검증
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 비밀번호 강도 검증
 */
export function isValidPassword(password: string): {
  valid: boolean;
  message?: string;
} {
  if (password.length < 8) {
    return { valid: false, message: '비밀번호는 8자 이상이어야 합니다.' };
  }
  
  if (!/[A-Za-z]/.test(password)) {
    return { valid: false, message: '비밀번호에 영문자가 포함되어야 합니다.' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: '비밀번호에 숫자가 포함되어야 합니다.' };
  }
  
  return { valid: true };
}

/**
 * 필수 필드 검증
 */
export function validateRequired(value: any, fieldName: string): string | null {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName}은(는) 필수입니다.`;
  }
  return null;
}
