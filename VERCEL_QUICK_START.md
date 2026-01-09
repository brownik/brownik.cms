# Vercel 배포 빠른 시작 가이드

## 🚀 즉시 해야 할 작업

### 1단계: Vercel 프로젝트 설정 (5분)

1. **Vercel 대시보드 접속**
   - https://vercel.com/dashboard
   - GitHub에서 연동한 프로젝트 선택

2. **Root Directory 설정**
   - **Settings** → **General** → **Root Directory**
   - `townE` 선택
   - **Save** 클릭

### 2단계: 환경 변수 설정 (3분)

**Settings** → **Environment Variables**에서 추가:

```
변수명: NEXT_PUBLIC_API_BASE_URL
값: https://your-backend-api.com/api
환경: Production, Preview, Development 모두 선택
```

```
변수명: NEXT_PUBLIC_APP_NAME
값: townE
환경: Production, Preview, Development 모두 선택
```

**⚠️ 중요**: 백엔드 API URL을 실제 배포된 백엔드 주소로 변경하세요!

### 3단계: 재배포 (2분)

1. **Deployments** 탭으로 이동
2. 최신 배포의 **⋯** 메뉴 클릭
3. **Redeploy** 선택
4. 배포 완료 대기 (약 2-3분)

### 4단계: 확인 (2분)

1. 배포 완료 후 제공된 URL로 접속
2. 브라우저 개발자 도구(F12) 열기
3. Console 탭에서 에러 확인
4. Network 탭에서 API 호출 확인

## ⚠️ 주의사항

### 백엔드 API가 아직 배포되지 않은 경우

현재 프론트엔드만 배포된 상태입니다. 다음 중 하나를 선택하세요:

**옵션 1: 백엔드 배포 (권장)**
- Spring Boot를 별도 서버에 배포 (AWS, Heroku, Railway 등)
- 배포된 백엔드 URL을 환경 변수에 설정

**옵션 2: 개발 환경에서만 테스트**
- 로컬에서 백엔드 실행 (`mvn spring-boot:run`)
- Vercel Preview 환경에서 테스트 (제한적)

## 🔧 문제 해결

### 빌드 실패 시

```bash
# 로컬에서 빌드 테스트
cd townE
npm install
npm run build
```

에러가 발생하면 수정 후 다시 푸시:
```bash
git add .
git commit -m "빌드 에러 수정"
git push origin main
```

### API 호출 실패 시

1. 백엔드 CORS 설정 확인
2. 환경 변수 `NEXT_PUBLIC_API_BASE_URL` 확인
3. 브라우저 콘솔에서 에러 메시지 확인

## 📋 체크리스트

배포 전:
- [ ] Root Directory: `townE` 설정
- [ ] 환경 변수: `NEXT_PUBLIC_API_BASE_URL` 설정
- [ ] 로컬 빌드 테스트 성공

배포 후:
- [ ] 사이트 정상 로드 확인
- [ ] 콘솔 에러 없음 확인
- [ ] API 호출 정상 작동 확인

## 📚 더 자세한 정보

전체 가이드는 `VERCEL_DEPLOYMENT_GUIDE.md` 파일을 참고하세요.
