# Vercel 배포 완전 가이드

## 현재 프로젝트 구조

```
maeul-e/
├── townE/              # Next.js 프로젝트 (프론트엔드 + API Routes)
└── new_analysis_docs/   # 분석 문서
```

## Vercel 배포 단계

### 1. Vercel 프로젝트 생성

1. [Vercel](https://vercel.com) 접속 후 GitHub 로그인
2. "Add New Project" 클릭
3. GitHub 저장소 선택: `brownik/brownik.cms`
4. **중요**: Root Directory를 `townE`로 설정
   - Settings → Root Directory → `townE` 입력

### 2. 환경 변수 설정

Vercel 대시보드 → Project Settings → Environment Variables에서 다음 변수들을 설정하세요:

#### 필수 환경 변수

```env
# 데이터베이스 연결
DATABASE_URL=mysql://townE:townE@192.168.0.153:3306/townE?schema=public

# JWT 인증
JWT_SECRET=your-secret-key-change-in-production-min-256-bits
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000

# API Base URL (프로덕션 도메인으로 자동 설정됨)
NEXT_PUBLIC_API_BASE_URL=https://your-project.vercel.app/api
```

#### 환경별 설정

- **Production**: 프로덕션 환경 변수
- **Preview**: 프리뷰/PR 환경 변수
- **Development**: 로컬 개발 환경 변수

### 3. 빌드 설정 확인

`vercel.json` 파일이 이미 설정되어 있습니다:

```json
{
  "buildCommand": "cd townE && npm install && npm run build",
  "outputDirectory": "townE/.next",
  "devCommand": "cd townE && npm run dev",
  "installCommand": "cd townE && npm install",
  "framework": "nextjs",
  "rootDirectory": "townE"
}
```

**중요**: Vercel 대시보드에서도 Root Directory를 `townE`로 설정해야 합니다.

### 4. 배포

1. 환경 변수 설정 완료 후 "Deploy" 클릭
2. 자동으로 빌드 및 배포 진행
3. 배포 완료 후 공유 가능한 URL 제공 (예: `your-project.vercel.app`)

### 5. Prisma 마이그레이션 (필요시)

프로덕션 데이터베이스에 스키마를 적용하려면:

```bash
# Vercel 대시보드 → Settings → Build & Development Settings
# Build Command에 추가:
cd townE && npx prisma generate && npm run build
```

또는 Vercel의 Post-Deploy Hook을 사용할 수 있습니다.

## 자동 배포 설정

### GitHub 연동 시 자동 배포

- **main 브랜치**: 프로덕션 자동 배포
- **다른 브랜치/PR**: 프리뷰 자동 배포

### 배포 알림

- Vercel 대시보드에서 배포 상태 확인
- GitHub PR에 배포 링크 자동 추가

## 도메인 연결 (선택사항)

### 커스텀 도메인 추가

1. Vercel 대시보드 → Project Settings → Domains
2. 원하는 도메인 입력
3. DNS 설정 안내에 따라 도메인 제공자에서 설정

### 예시
- `townE.yourdomain.com`
- `www.yourdomain.com`

## 환경 변수 관리

### 프로덕션 vs 개발

**로컬 개발** (`.env.local`):
```env
DATABASE_URL=mysql://townE:townE@192.168.0.153:3306/townE?schema=public
JWT_SECRET=local-secret-key
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

**Vercel 프로덕션**:
```env
DATABASE_URL=mysql://user:password@production-db:3306/townE?schema=public
JWT_SECRET=production-secret-key-min-256-bits
NEXT_PUBLIC_API_BASE_URL=https://your-project.vercel.app/api
```

## 트러블슈팅

### 빌드 실패 시

1. **Build Logs 확인**
   - Vercel 대시보드 → Deployments → 실패한 배포 클릭
   - Build Logs에서 에러 확인

2. **일반적인 문제들**
   - 환경 변수 누락: `DATABASE_URL`, `JWT_SECRET` 확인
   - Prisma Client 미생성: Build Command에 `npx prisma generate` 추가
   - Root Directory 오류: Vercel 대시보드에서 Root Directory 확인

### Root Directory가 보이지 않는 경우

1. Project Settings → General
2. Root Directory 섹션에서 `townE` 입력
3. 저장 후 재배포

### 데이터베이스 연결 오류

- `DATABASE_URL` 형식 확인: `mysql://user:password@host:port/database`
- 방화벽 설정 확인 (프로덕션 DB가 외부 접근 허용하는지)
- Vercel의 IP 화이트리스트 설정 (필요시)

## 배포 확인

### 배포 성공 후 확인사항

1. **홈페이지 접속**: `https://your-project.vercel.app`
2. **API 테스트**: `https://your-project.vercel.app/api/v1/health` (있다면)
3. **로그인 테스트**: 실제 기능 동작 확인

### 성능 모니터링

- Vercel 대시보드 → Analytics에서 성능 지표 확인
- Function Logs에서 API 호출 로그 확인

## 다음 단계

1. ✅ Vercel 프로젝트 생성
2. ✅ 환경 변수 설정
3. ✅ Root Directory 설정 (`townE`)
4. ✅ 배포 실행
5. ✅ 도메인 연결 (선택)
6. ✅ 모니터링 설정

## 참고사항

- Vercel은 Next.js를 기본 지원하므로 추가 설정 최소화
- API Routes는 자동으로 서버리스 함수로 배포됨
- 환경 변수는 빌드 시점에 주입됨
- Prisma Client는 빌드 시 자동 생성됨
