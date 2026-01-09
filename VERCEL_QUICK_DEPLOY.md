# Vercel 배포 빠른 가이드

## 1. Vercel 프로젝트 생성

1. [Vercel](https://vercel.com) 접속 후 GitHub 로그인
2. "Add New Project" 클릭
3. GitHub 저장소 선택: `brownik/brownik.cms`
4. **중요**: Root Directory를 `townE-frontend`로 설정
   - Settings → Root Directory → `townE-frontend` 입력

## 2. 환경 변수 설정 (선택사항)

Vercel 대시보드 → Project Settings → Environment Variables에서 설정:

```
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com/api
NEXT_PUBLIC_APP_NAME=townE
```

## 3. 배포

- Root Directory 설정 후 "Deploy" 클릭
- 자동으로 빌드 및 배포 진행
- 배포 완료 후 공유 가능한 URL 제공

## 4. 자동 배포

- `main` 브랜치에 push하면 자동으로 배포됩니다
- Preview 배포: PR 생성 시 자동으로 Preview URL 생성

## 5. 도메인 연결 (선택사항)

- Project Settings → Domains에서 커스텀 도메인 추가 가능

## 트러블슈팅

### Root Directory가 보이지 않는 경우
- Project Settings → General → Root Directory에서 설정

### 빌드 실패 시
- Build Logs에서 에러 확인
- `vercel.json` 파일 확인 (이미 설정되어 있음)
