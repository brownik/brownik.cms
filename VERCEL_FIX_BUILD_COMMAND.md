# Vercel 빌드 명령어 오류 해결

## 문제 상황

빌드 로그에서 `cd townE && npm install` 명령어가 실행되고 있습니다.
이는 Vercel 대시보드의 Build & Development Settings에서 빌드 명령어가 오버라이드되어 있기 때문입니다.

## 해결 방법

### 방법 1: Build & Development Settings에서 빌드 명령어 제거 (권장)

1. **Vercel 대시보드** → 프로젝트 선택
2. **Settings** → **General** (또는 **Build & Development Settings**)
3. **Build Command** 섹션 찾기
4. **Override** 체크박스가 체크되어 있다면:
   - 체크 해제
   - 또는 빌드 명령어를 비워두기
5. **Save** 클릭

### 방법 2: Root Directory 설정 확인

1. **Settings** → **General**
2. **Root Directory** 확인:
   - 값이 `townE`로 설정되어 있는지 확인
   - 없다면 `townE` 입력
3. **Save** 클릭

### 방법 3: 프로젝트 재생성 (최후의 수단)

만약 위 방법이 작동하지 않으면:

1. **Vercel 대시보드**에서 프로젝트 삭제
2. **Add New Project** 클릭
3. 저장소 선택: `brownik/brownik.cms`
4. **Configure Project** 화면에서:
   - **Root Directory**: `townE` 선택
   - **Framework Preset**: Next.js (자동 감지)
   - **Build Command**: 비워두기 (자동 감지)
   - **Output Directory**: 비워두기 (자동 감지)
5. **Deploy** 클릭

## 올바른 설정 상태

### Root Directory 설정 후
- Vercel은 자동으로 `townE` 폴더 내부에서 빌드를 시작합니다
- 빌드 명령어는 자동으로 `npm run build`로 감지됩니다
- 별도의 빌드 명령어 설정이 필요 없습니다

### 확인 방법
빌드 로그에서 다음을 확인:
```
Running "install" command: `npm install`...
```
(not `cd townE && npm install`)

## 체크리스트

- [ ] Settings → General → Root Directory: `townE` 설정됨
- [ ] Settings → Build & Development Settings → Build Command: 비어있거나 자동 감지
- [ ] Override 체크박스: 체크 해제됨
- [ ] 환경 변수: 모두 설정됨

## 참고

Root Directory를 설정하면:
- Vercel이 해당 폴더를 프로젝트 루트로 인식
- Next.js가 자동으로 감지됨
- 빌드 명령어가 자동으로 설정됨
- `vercel.json` 파일 불필요
