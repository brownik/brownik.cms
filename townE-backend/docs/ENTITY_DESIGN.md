# 엔티티 설계 문서

## 개요
기존 MariaDB 스키마를 기반으로 JPA 엔티티를 설계합니다. 기존 컬럼명을 최대한 유지하여 호환성을 보장합니다.

## 핵심 엔티티

### 1. Member (NU_MEMBER)
회원 정보를 저장하는 엔티티입니다.

**주요 필드:**
- `key` (KEY): 회원 키 (PK)
- `memberType` (MEMBERTYPE): 회원 타입 (P=개인, C=법인)
- `userId` (USERID): 사용자 ID (UNIQUE)
- `userPw` (USERPW): 비밀번호 (BCrypt 암호화)
- `name` (NAME): 이름
- `nickName` (NICKNAME): 닉네임
- `memberLevel` (MEMBERLEVEL): 회원 등급 (0=일반, 1-8=등급, 9=최고관리자)
- `status` (STATUS): 상태 (U=사용중, D=삭제됨)
- `insertDate` (INSERTDATE): 등록일
- `updateDate` (UPDATEDATE): 수정일

**관계:**
- OneToMany: BoardItem (작성한 게시글)
- OneToMany: Comment (작성한 댓글)

### 2. Board (NU_BOARD)
게시판 정보를 저장하는 엔티티입니다.

**주요 필드:**
- `key` (KEY): 게시판 키 (PK)
- `siteKey` (SITEKEY): 사이트 키 (FK)
- `title` (TITLE): 게시판 제목
- `boardType` (BOARDTYPE): 게시판 타입
- `status` (STATUS): 상태

**관계:**
- ManyToOne: Site
- OneToMany: BoardItem (게시글)

### 3. BoardItem (NU_BOARD_ITEM)
게시글 정보를 저장하는 엔티티입니다.

**주요 필드:**
- `key` (KEY): 게시글 키 (PK)
- `boardKey` (BOARDKEY): 게시판 키 (FK)
- `categoryKey` (CATEGORYKEY): 카테고리 키
- `title` (TITLE): 제목
- `content` (CONTENT): 내용
- `writer` (WRITER): 작성자
- `memberKey` (MEMBERKEY): 회원 키 (FK)
- `notice` (NOTICE): 공지사항 여부 (Y/N)
- `secret` (SECRET): 비밀글 여부 (Y/N)
- `viewCount` (VIEWCOUNT): 조회수
- `openDate` (OPENDATE): 공개 시작일
- `closeDate` (CLOSEDATE): 공개 종료일
- `status` (STATUS): 상태 (U=사용중, D=삭제됨)
- `insertDate` (INSERTDATE): 등록일
- `updateDate` (UPDATEDATE): 수정일

**관계:**
- ManyToOne: Board
- ManyToOne: Member (작성자)
- OneToMany: Comment (댓글)

### 4. Comment (NU_BOARD_COMMENT)
댓글 정보를 저장하는 엔티티입니다.

**주요 필드:**
- `key` (KEY): 댓글 키 (PK)
- `boardItemKey` (BOARDITEMKEY): 게시글 키 (FK)
- `memberKey` (MEMBERKEY): 회원 키 (FK)
- `content` (CONTENT): 댓글 내용
- `writer` (WRITER): 작성자
- `parentKey` (PARENTKEY): 부모 댓글 키
- `parentAllKey` (PARENTALLKEY): 전체 부모 경로
- `depth` (DEPTH): 댓글 깊이
- `status` (STATUS): 상태
- `insertDate` (INSERTDATE): 등록일
- `updateDate` (UPDATEDATE): 수정일

**관계:**
- ManyToOne: BoardItem
- ManyToOne: Member (작성자)

## 엔티티 설계 원칙

1. **기존 컬럼명 유지**: 기존 DB 스키마의 컬럼명을 최대한 유지합니다.
2. **논리 삭제**: STATUS 필드를 사용한 논리 삭제 방식을 유지합니다.
3. **감사 필드**: INSERTDATE, UPDATEDATE 등 감사 필드를 포함합니다.
4. **관계 매핑**: JPA 관계 매핑을 사용하되, 기존 FK 구조를 유지합니다.

## 다음 단계

Sprint 2에서 실제 엔티티 클래스를 구현합니다.

