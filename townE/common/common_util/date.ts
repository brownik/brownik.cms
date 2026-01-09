/**
 * 날짜 관련 유틸리티
 */

/**
 * 날짜를 한국어 형식으로 포맷
 */
export function formatDate(date: string | Date, format: 'date' | 'datetime' = 'date'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'date') {
    return d.toLocaleDateString('ko-KR');
  }
  
  return d.toLocaleString('ko-KR');
}

/**
 * 상대 시간 표시 (예: 3분 전, 2시간 전)
 */
export function getRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}일 전`;
  if (hours > 0) return `${hours}시간 전`;
  if (minutes > 0) return `${minutes}분 전`;
  return '방금 전';
}
