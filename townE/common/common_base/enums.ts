/**
 * 공통 열거형 정의
 */

// 게시글 상태
export enum BoardItemStatus {
  APPROVED = 'U',  // 승인
  PENDING = 'N',   // 미승인
  DELETED = 'D',   // 삭제
}

// 댓글 상태
export enum CommentStatus {
  ACTIVE = 'U',    // 사용
  DELETED = 'D',   // 삭제
}

// 컨텐츠 타입
export enum ContentType {
  CONTENT = 'C',   // 컨텐츠
  BOARD = 'B',     // 게시판
  PROGRAM = 'P',   // 프로그램
  LINK = 'L',      // 링크
  MENU = 'M',      // 메뉴
}

// 사용 여부
export enum UseYn {
  YES = 'Y',
  NO = 'N',
}

// 공지사항 여부
export enum NoticeYn {
  YES = 'Y',
  NO = 'N',
}

// 비밀글 여부
export enum SecretYn {
  YES = 'Y',
  NO = 'N',
}
