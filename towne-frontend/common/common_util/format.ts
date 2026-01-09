/**
 * 포맷팅 유틸리티
 */

/**
 * 파일 크기를 읽기 쉬운 형식으로 변환
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * 숫자를 천 단위 콤마로 포맷
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('ko-KR');
}

/**
 * 텍스트를 특정 길이로 자르고 말줄임표 추가
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
