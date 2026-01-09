# Vercel Root Directory 설정 완전 해결 가이드

## 현재 문제

빌드 로그에서:
- `cd townE && npm install` 실행됨 (Build Command Override가 여전히 활성화됨)
- Next.js 버전을 찾을 수 없음 (Root Directory가 제대로 설정되지 않음)

## 근본 원인

Vercel 대시보드에서 **Root Directory**를 설정했지만, **Build & Development Settings**의 **Override** 설정이 여전히 활성화되어 있어서 충돌이 발생하고 있습니다.

## 완전한 해결 방법

### 방법 1: Build & Development Settings 완전 초기화 (권장)

1. **Vercel 대시보드** → 프로젝트 선택
2. **Settings** → **Build & Development Settings**
3. 다음 항목들을 확인하고 수정:

#### Install Command
- **Override** 체크박스: **반드시 해제**
- 값: **완전히 비우기**

#### Build Command  
- **Override** 체크박스: **반드시 해제**
- 값: **완전히 비우기**

#### Output Directory
- **Override** 체크박스: **반드시 해제**
- 값: **완전히 비우기**

4. **Save** 클릭

### 방법 2: Root Directory 재설정

1. **Settings** → **General**
2. **Root Directory** 섹션:
   - 기존 값 삭제 (비우기)
   - **Save** 클릭
   - 다시 **Edit** 클릭
   - `townE` 입력
   - **Save** 클릭

### 방법 3: 프로젝트 완전 재생성 (가장 확실한 방법)

만약 위 방법이 계속 실패하면:

1. **Settings** → **General** → 맨 아래 **Delete Project** 클릭
2. **Add New** → **Project** 클릭
3. 저장소 선택: `brownik/brownik.cms`
4. **Import** 클릭
5. **Configure Project** 화면에서:

   **중요**: 이 단계를 정확히 따라하세요!
   
   - **Root Directory**: 드롭다운에서 `townE` 선택
   - **Framework Preset**: Next.js (자동 감지되어야 함)
   - **Build Command**: **비워두기** (Override 체크하지 않기)
   - **Output Directory**: **비워두기** (Override 체크하지 않기)
   - **Install Command**: **비워두기** (Override 체크하지 않기)

6. **Environment Variables** 추가:
   ```
   DATABASE_URL=mysql://townE:townE@192.168.0.153:3306/townE?schema=public
   JWT_SECRET=your-secret-key-change-in-production-min-256-bits
   JWT_EXPIRATION=86400000
   JWT_REFRESH_EXPIRATION=604800000
   NEXT_PUBLIC_API_BASE_URL=https://your-project.vercel.app/api
   ```

7. **Deploy** 클릭

## 올바른 빌드 로그

설정이 올바르면 빌드 로그에서:
```
Running "install" command: `npm install`...
Detected Next.js version: 16.1.1
Running "build" command: `npm run build`...
```

다음과 같이 나타나면 안 됩니다:
```
Running "install" command: `cd townE && npm install`...  ❌
Warning: Could not identify Next.js version  ❌
```

## 확인 체크리스트

- [ ] Root Directory: `townE` 설정됨
- [ ] Install Command Override: **해제됨** (체크 안 함)
- [ ] Build Command Override: **해제됨** (체크 안 함)
- [ ] Output Directory Override: **해제됨** (체크 안 함)
- [ ] 모든 빌드 명령어 필드: **비어있음**
- [ ] 환경 변수: 모두 설정됨

## 핵심 포인트

**Root Directory를 설정하면:**
- Vercel이 해당 폴더를 프로젝트 루트로 인식
- 모든 빌드 명령어는 자동으로 해당 폴더 내부에서 실행됨
- **Override를 활성화하면 Root Directory 설정이 무시됨**
- 따라서 **Override를 반드시 해제**해야 합니다
