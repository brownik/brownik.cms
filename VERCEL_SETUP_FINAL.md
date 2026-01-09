# Vercel 배포 최종 가이드

## 중요: vercel.json 제거됨

Root Directory를 설정하면 `vercel.json`의 빌드 명령어가 무시되거나 충돌할 수 있습니다.
따라서 `vercel.json` 파일을 제거하고, **Vercel 대시보드에서만 설정**합니다.

## 배포 단계

### 1. Vercel 프로젝트 생성

1. [vercel.com](https://vercel.com) 접속 → GitHub 로그인
2. "Add New Project" 클릭
3. 저장소 선택: `brownik/brownik.cms`

### 2. 프로젝트 설정 (중요!)

프로젝트 생성 시 "Configure Project" 화면에서:

#### Root Directory 설정 (필수!)
- **Root Directory**: `townE` 선택 또는 입력
- 이 설정이 가장 중요합니다!

#### Framework Preset
- 자동 감지: Next.js
- 변경 불필요

#### Build and Output Settings
- **Build Command**: (비워두거나) `npm run build`
- **Output Directory**: (비워두거나) `.next`
- **Install Command**: (비워두거나) `npm install`

**참고**: Root Directory를 설정하면 Next.js가 자동으로 감지되어 기본값이 적용됩니다.

### 3. 환경 변수 설정

Settings → Environment Variables에서 추가:

```env
DATABASE_URL=mysql://townE:townE@192.168.0.153:3306/townE?schema=public
JWT_SECRET=your-secret-key-change-in-production-min-256-bits
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000
NEXT_PUBLIC_API_BASE_URL=https://your-project.vercel.app/api
```

### 4. 배포

1. "Deploy" 버튼 클릭
2. 빌드 완료 대기
3. 배포 완료 후 URL 확인

## Root Directory 설정 확인

배포 실패 시 다음을 확인하세요:

1. **Settings → General → Root Directory**
   - 값이 `townE`로 설정되어 있는지 확인
   - 없다면 `townE` 입력 후 Save

2. **Build Logs 확인**
   - Deployments → 실패한 배포 클릭
   - Build Logs에서 작업 디렉토리 확인
   - `townE` 폴더 내부에서 실행되는지 확인

## 자동 배포

- `main` 브랜치에 push → 자동 배포
- PR 생성 → 프리뷰 자동 배포

## 문제 해결

### 빌드 실패: "Cannot find module"

**원인**: Root Directory가 설정되지 않아 루트에서 빌드 시도

**해결**:
1. Settings → General → Root Directory → `townE` 설정
2. Save 후 재배포

### 빌드 실패: "No such file or directory"

**원인**: Root Directory 설정 후에도 vercel.json의 빌드 명령어가 실행됨

**해결**:
- `vercel.json` 파일이 있다면 제거 (이미 제거됨)
- Root Directory만으로 충분함

## 확인 체크리스트

- [ ] Root Directory: `townE` 설정됨
- [ ] 환경 변수: 모두 설정됨
- [ ] vercel.json: 없음 (제거됨)
- [ ] Framework: Next.js 자동 감지됨
