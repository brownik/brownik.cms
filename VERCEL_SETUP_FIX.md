# Vercel 설정 문제 해결 가이드

## 문제 상황
Vercel 대시보드에서 `townE-backend`와 `new_analysis_docs`만 보이고 `towne-frontend`가 보이지 않는 경우

## 해결 방법

### 방법 1: Vercel 대시보드에서 Root Directory 설정 (권장)

1. **Vercel 대시보드 접속**
   - https://vercel.com/dashboard
   - 프로젝트 선택

2. **Settings 메뉴로 이동**
   - 좌측 메뉴에서 **Settings** 클릭

3. **General 탭에서 Root Directory 설정**
   - **Root Directory** 섹션 찾기
   - **Edit** 버튼 클릭
   - `towne-frontend` 입력
   - **Save** 클릭

4. **재배포**
   - **Deployments** 탭으로 이동
   - 최신 배포의 **⋯** 메뉴 클릭
   - **Redeploy** 선택

### 방법 2: 프로젝트 재연동

만약 방법 1이 작동하지 않으면:

1. **Vercel 대시보드에서 프로젝트 삭제** (선택사항)
   - Settings → General → Delete Project

2. **새 프로젝트로 다시 연동**
   - **Add New** → **Project** 클릭
   - GitHub 저장소 선택: `brownik/brownik.cms`
   - **Import** 클릭

3. **프로젝트 설정**
   - **Framework Preset**: Next.js (자동 감지)
   - **Root Directory**: `towne-frontend` 선택
   - **Environment Variables** 추가:
     - `NEXT_PUBLIC_API_BASE_URL`
     - `NEXT_PUBLIC_APP_NAME`

4. **Deploy** 클릭

### 방법 3: vercel.json 확인 및 수정

현재 `vercel.json` 파일이 루트에 있습니다. Vercel이 이를 인식하는지 확인:

1. **Vercel 대시보드** → **Settings** → **General**
2. **Build & Development Settings** 확인
3. **Override** 옵션이 있으면 활성화하여 `vercel.json` 설정 적용

## 확인 사항

### 1. vercel.json 파일 위치 확인
```bash
# 프로젝트 루트에 있어야 함
ls -la vercel.json
```

### 2. 파일 내용 확인
```json
{
  "buildCommand": "cd towne-frontend && npm install && npm run build",
  "outputDirectory": "towne-frontend/.next",
  "devCommand": "cd towne-frontend && npm run dev",
  "installCommand": "cd towne-frontend && npm install",
  "framework": "nextjs",
  "rootDirectory": "towne-frontend"
}
```

### 3. GitHub에 푸시 확인
```bash
git log --oneline -5
# vercel.json이 커밋되어 있는지 확인
```

## 대안: towne-frontend를 루트로 이동 (고급)

만약 계속 문제가 발생하면, 프로젝트 구조를 변경할 수 있습니다:

1. `towne-frontend`의 내용을 루트로 이동
2. 또는 Vercel에서 `towne-frontend` 폴더만 별도 프로젝트로 연동

하지만 이 방법은 프로젝트 구조 변경이 필요하므로 권장하지 않습니다.

## 빠른 해결책

**가장 빠른 해결 방법:**

1. Vercel 대시보드 → Settings → General
2. Root Directory: `towne-frontend` 입력
3. Save
4. Deployments → Redeploy

이렇게 하면 Vercel이 `towne-frontend` 폴더를 프로젝트 루트로 인식합니다.
