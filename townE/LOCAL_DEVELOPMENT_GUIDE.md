# 로컬 개발 환경 설정 가이드

## 1. 환경 변수 설정

### .env.local 파일 생성

`townE` 폴더에 `.env.local` 파일을 생성하세요:

```bash
cd townE
touch .env.local
```

### 환경 변수 내용

`.env.local` 파일에 다음 내용을 추가하세요:

```env
# 데이터베이스 연결
DATABASE_URL="mysql://townE:townE@192.168.0.153:3306/townE?schema=public"

# JWT 인증
JWT_SECRET=your-secret-key-change-in-production-min-256-bits
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000

# API Base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api

# 앱 이름
NEXT_PUBLIC_APP_NAME=townE
```

**주의**: 
- `DATABASE_URL`의 호스트 주소(`192.168.0.153`)를 실제 데이터베이스 서버 주소로 변경하세요
- `JWT_SECRET`은 프로덕션에서 반드시 변경하세요

## 2. 의존성 설치

```bash
cd townE
npm install
```

## 3. Prisma Client 생성

```bash
npx prisma generate
```

## 4. 데이터베이스 연결 확인 (선택사항)

데이터베이스 스키마를 확인하려면:

```bash
npx prisma db pull
```

**주의**: 이 명령어는 기존 스키마를 덮어쓸 수 있으므로 주의하세요.

## 5. 개발 서버 실행

```bash
npm run dev
```

서버가 `http://localhost:3000`에서 실행됩니다.

## 6. 테스트

### 브라우저에서 확인

1. **홈페이지**: http://localhost:3000
2. **로그인 페이지**: http://localhost:3000/login
3. **관리자 로그인**: http://localhost:3000/admin/login

### API 테스트

#### 로그인 API 테스트
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"userId":"test","userPw":"password"}'
```

#### 게시글 목록 조회
```bash
curl http://localhost:3000/api/v1/boards/1/items
```

## 7. 문제 해결

### Prisma Client 생성 오류

```bash
# Prisma 버전 확인
npx prisma --version

# Prisma Client 재생성
npx prisma generate
```

### 데이터베이스 연결 오류

1. `.env.local`의 `DATABASE_URL` 확인
2. 데이터베이스 서버가 실행 중인지 확인
3. 방화벽 설정 확인

### 포트 충돌

다른 포트에서 실행하려면:

```bash
PORT=3001 npm run dev
```

## 8. 개발 팁

### Hot Reload
- 파일을 저장하면 자동으로 리로드됩니다
- API Routes도 자동으로 재시작됩니다

### 로그 확인
- 서버 콘솔에서 API 호출 로그 확인 가능
- Prisma 쿼리 로그도 확인 가능

### 데이터베이스 확인
- Prisma Studio 사용:
```bash
npx prisma studio
```
- 브라우저에서 http://localhost:5555 접속
