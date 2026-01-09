# Next.js 통합 마이그레이션 가이드

## 개요

Spring Boot 백엔드를 Next.js API Routes로 통합하는 작업을 진행했습니다.

## 완료된 작업

### 1. Prisma 설정
- ✅ Prisma 스키마 생성 (`prisma/schema.prisma`)
- ✅ 데이터베이스 모델 정의 (Member, Board, BoardItem, Comment)
- ✅ Prisma Client 생성

### 2. 인증 API
- ✅ `POST /api/v1/auth/login` - 로그인
- ✅ `POST /api/v1/auth/signup` - 회원가입
- ✅ `POST /api/v1/auth/refresh` - 토큰 갱신

### 3. 게시판 API
- ✅ `GET /api/v1/boards/[boardKey]/items` - 게시글 목록 조회
- ✅ `GET /api/v1/boards/[boardKey]/items/[itemKey]` - 게시글 상세 조회
- ✅ `POST /api/v1/boards/[boardKey]/items` - 게시글 작성
- ✅ `PUT /api/v1/boards/[boardKey]/items/[itemKey]` - 게시글 수정
- ✅ `DELETE /api/v1/boards/[boardKey]/items/[itemKey]` - 게시글 삭제

### 4. 댓글 API
- ✅ `GET /api/v1/comments?boardItemKey={key}` - 댓글 목록 조회
- ✅ `POST /api/v1/comments/create` - 댓글 작성
- ✅ `PUT /api/v1/comments/[commentKey]` - 댓글 수정
- ✅ `DELETE /api/v1/comments/[commentKey]` - 댓글 삭제

## 설정 필요 사항

### 1. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Database
DATABASE_URL="mysql://townE:townE@192.168.0.153:3306/townE?schema=public"

# JWT
JWT_SECRET=your-secret-key-change-in-production-min-256-bits
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000

# API
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

### 2. Prisma Client 생성

```bash
cd townE-frontend
npx prisma generate
```

### 3. 데이터베이스 연결 확인

```bash
npx prisma db pull  # 기존 스키마와 동기화 (선택적)
```

## API 엔드포인트 변경사항

### 기존 (Spring Boot)
- Base URL: `http://localhost:8080/api`
- 예: `http://localhost:8080/api/v1/auth/login`

### 변경 후 (Next.js)
- Base URL: `http://localhost:3000/api`
- 예: `http://localhost:3000/api/v1/auth/login`

## 프론트엔드 API 클라이언트 업데이트

`townE-frontend/lib/api/client.ts`의 `baseURL`을 업데이트하세요:

```typescript
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
  // ...
});
```

## 다음 단계

1. **환경 변수 설정**: `.env.local` 파일 생성
2. **Prisma Client 생성**: `npx prisma generate` 실행
3. **프론트엔드 API 클라이언트 업데이트**: baseURL 변경
4. **테스트**: 각 API 엔드포인트 테스트
5. **기존 Spring Boot 백엔드 정리**: 필요시 제거 또는 보관

## 주의사항

- 기존 Spring Boot 백엔드는 참고용으로 보관하는 것을 권장합니다
- 데이터베이스 연결 정보는 환경 변수로 관리하세요
- JWT 시크릿 키는 프로덕션에서 반드시 변경하세요
