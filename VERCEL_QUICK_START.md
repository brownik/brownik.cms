# Vercel 빠른 시작 가이드

## 1단계: Vercel 프로젝트 생성

1. [vercel.com](https://vercel.com) 접속 → GitHub 로그인
2. "Add New Project" 클릭
3. 저장소 선택: `brownik/brownik.cms`

## 2단계: 프로젝트 설정

### Root Directory 설정 (중요!)
- Settings → General → Root Directory
- `townE` 입력
- 저장

### Framework Preset
- 자동 감지: Next.js
- 변경 불필요

## 3단계: 환경 변수 설정

Settings → Environment Variables에서 추가:

```
DATABASE_URL = mysql://townE:townE@192.168.0.153:3306/townE?schema=public
JWT_SECRET = your-secret-key-change-in-production-min-256-bits
JWT_EXPIRATION = 86400000
JWT_REFRESH_EXPIRATION = 604800000
NEXT_PUBLIC_API_BASE_URL = https://your-project.vercel.app/api
```

**주의**: `NEXT_PUBLIC_API_BASE_URL`은 배포 후 실제 도메인으로 업데이트 필요

## 4단계: 배포

1. "Deploy" 버튼 클릭
2. 빌드 완료 대기 (약 2-3분)
3. 배포 완료 후 URL 확인

## 5단계: 배포 확인

배포된 URL로 접속하여 확인:
- 홈페이지: `https://your-project.vercel.app`
- API: `https://your-project.vercel.app/api/v1/auth/login`

## 자동 배포

- `main` 브랜치에 push하면 자동 배포
- PR 생성 시 프리뷰 URL 자동 생성

## 문제 해결

### 빌드 실패 시
1. Build Logs 확인
2. 환경 변수 확인 (특히 `DATABASE_URL`)
3. Root Directory가 `townE`로 설정되었는지 확인

### Root Directory 설정이 안 보일 때
- Project Settings → General → Root Directory
- 또는 프로젝트 생성 시 "Configure Project"에서 설정
