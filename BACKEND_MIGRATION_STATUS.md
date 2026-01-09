# 백엔드 마이그레이션 상태

## 완료된 API 마이그레이션 ✅

### 인증 API
- ✅ `POST /api/v1/auth/login` - 로그인
- ✅ `POST /api/v1/auth/signup` - 회원가입
- ✅ `POST /api/v1/auth/refresh` - 토큰 갱신

### 관리자 인증 API
- ✅ `POST /api/v1/admin/auth/login` - 관리자 로그인

### 회원 API
- ✅ `GET /api/v1/members/me` - 회원 정보 조회
- ✅ `PUT /api/v1/members/me` - 회원 정보 수정

### 게시판 API
- ✅ `GET /api/v1/boards/[boardKey]/items` - 게시글 목록 조회
- ✅ `GET /api/v1/boards/[boardKey]/items/[itemKey]` - 게시글 상세 조회
- ✅ `POST /api/v1/boards/[boardKey]/items` - 게시글 작성
- ✅ `PUT /api/v1/boards/[boardKey]/items/[itemKey]` - 게시글 수정
- ✅ `DELETE /api/v1/boards/[boardKey]/items/[itemKey]` - 게시글 삭제

### 댓글 API
- ✅ `GET /api/v1/comments?boardItemKey={key}` - 댓글 목록 조회
- ✅ `POST /api/v1/comments/create` - 댓글 작성
- ✅ `PUT /api/v1/comments/[commentKey]` - 댓글 수정
- ✅ `DELETE /api/v1/comments/[commentKey]` - 댓글 삭제

## 마이그레이션 완료 ✅

**모든 주요 API가 Next.js API Routes로 마이그레이션되었습니다.**

## townE-backend 폴더 처리 옵션

### 옵션 1: 보관 (권장)
- **이유**: 참고용으로 유지
- **장점**: 
  - 기존 로직 참고 가능
  - 문제 발생 시 비교 가능
  - 문서화된 코드 예시
- **단점**: 저장소 크기 증가

### 옵션 2: 별도 브랜치로 이동
- **이유**: 히스토리 보존하면서 main 브랜치 정리
- **방법**: 
  ```bash
  git checkout -b archive/spring-boot-backend
  git push origin archive/spring-boot-backend
  git checkout main
  git rm -r townE-backend
  git commit -m "Remove Spring Boot backend (migrated to Next.js)"
  ```

### 옵션 3: 완전 삭제
- **이유**: 완전히 Next.js로 전환 완료
- **조건**: 
  - 모든 API 테스트 완료
  - 프로덕션 배포 확인
  - 더 이상 참고할 필요 없음
- **방법**: 
  ```bash
  git rm -r townE-backend
  git commit -m "Remove Spring Boot backend (fully migrated to Next.js)"
  ```

## 권장사항

**현재는 옵션 1 (보관)을 권장합니다:**
1. 아직 프로덕션 배포 전
2. 테스트가 완료되지 않았을 수 있음
3. 참고용으로 유용할 수 있음

**프로덕션 배포 후 안정화되면 옵션 2 (별도 브랜치)로 이동하는 것을 권장합니다.**
