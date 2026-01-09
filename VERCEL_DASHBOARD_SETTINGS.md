# Vercel 대시보드 설정 가이드

## 현재 문제

빌드 로그에서 `cd townE && npm install` 명령어가 계속 실행되고 있습니다.
이는 Vercel 대시보드의 Build & Development Settings에서 빌드 명령어가 오버라이드되어 있기 때문입니다.

## 해결 방법 (단계별)

### Step 1: 프로젝트 설정 페이지로 이동

1. Vercel 대시보드 접속: https://vercel.com/dashboard
2. 프로젝트 선택: `brownik.cms` (또는 해당 프로젝트 이름)
3. 상단 메뉴에서 **Settings** 클릭

### Step 2: General 설정 확인

1. 좌측 메뉴에서 **General** 클릭
2. **Root Directory** 섹션 찾기
3. **Edit** 버튼 클릭
4. `townE` 입력
5. **Save** 클릭

### Step 3: Build & Development Settings 확인 (중요!)

1. 좌측 메뉴에서 **Build & Development Settings** 클릭
2. 다음 항목들을 확인:

#### Install Command
- **Override** 체크박스 확인
- 체크되어 있다면:
  - 체크 해제 (권장)
  - 또는 값 비우기
- 값이 `cd townE && npm install`로 되어 있다면 삭제

#### Build Command
- **Override** 체크박스 확인
- 체크되어 있다면:
  - 체크 해제 (권장)
  - 또는 값 비우기
- 값이 `cd townE && npm run build`로 되어 있다면 삭제

#### Output Directory
- **Override** 체크박스 확인
- 체크되어 있다면:
  - 체크 해제 (권장)
  - 또는 값 비우기

3. 모든 변경사항 **Save** 클릭

### Step 4: 재배포

1. 상단 메뉴에서 **Deployments** 클릭
2. 최신 배포 항목의 **⋯** 메뉴 클릭
3. **Redeploy** 선택
4. 또는 **Deployments** 탭에서 **Redeploy** 버튼 클릭

## 올바른 설정 상태

### Root Directory 설정 후
- Vercel은 `townE` 폴더를 프로젝트 루트로 인식
- 모든 빌드 명령어는 `townE` 폴더 내부에서 실행됨
- 별도의 `cd townE` 명령어 불필요

### Build & Development Settings
- **Override** 체크박스: 모두 해제됨
- **Install Command**: 비어있음 (자동: `npm install`)
- **Build Command**: 비어있음 (자동: `npm run build`)
- **Output Directory**: 비어있음 (자동: `.next`)

## 빌드 로그 확인

올바르게 설정되면 빌드 로그에서:
```
Running "install" command: `npm install`...
Running "build" command: `npm run build`...
```

다음과 같이 나타나면 안 됩니다:
```
Running "install" command: `cd townE && npm install`...  ❌
```

## 대안: 프로젝트 재생성

만약 위 방법이 작동하지 않으면:

1. **Settings** → **General** → 맨 아래 **Delete Project** 클릭
2. **Add New** → **Project** 클릭
3. 저장소 선택: `brownik/brownik.cms`
4. **Import** 클릭
5. **Configure Project** 화면에서:
   - **Root Directory**: `townE` 선택
   - **Framework Preset**: Next.js (자동 감지)
   - **Build Command**: 비워두기
   - **Output Directory**: 비워두기
   - **Install Command**: 비워두기
6. **Deploy** 클릭

## 체크리스트

배포 전 확인:
- [ ] Root Directory: `townE` 설정됨
- [ ] Install Command Override: 해제됨
- [ ] Build Command Override: 해제됨
- [ ] Output Directory Override: 해제됨
- [ ] 환경 변수: 모두 설정됨
