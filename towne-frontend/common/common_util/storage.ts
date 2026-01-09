/**
 * 스토리지 유틸리티
 */

/**
 * LocalStorage에 안전하게 저장
 */
export function setStorage(key: string, value: any): void {
  if (typeof window === 'undefined') return;
  
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error('Storage set error:', error);
  }
}

/**
 * LocalStorage에서 안전하게 가져오기
 */
export function getStorage<T>(key: string, defaultValue?: T): T | null {
  if (typeof window === 'undefined') return defaultValue || null;
  
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue || null;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error('Storage get error:', error);
    return defaultValue || null;
  }
}

/**
 * LocalStorage에서 안전하게 삭제
 */
export function removeStorage(key: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Storage remove error:', error);
  }
}

/**
 * LocalStorage 전체 삭제
 */
export function clearStorage(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Storage clear error:', error);
  }
}
