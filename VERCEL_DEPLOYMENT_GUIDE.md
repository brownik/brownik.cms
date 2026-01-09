# Vercel 배포 가이드

## 1. Vercel 프로젝트 설정

### 1.1 Vercel 대시보드에서 프로젝트 설정

1. **Vercel 대시보드 접속**: https://vercel.com/dashboard
2. **프로젝트 선택**: GitHub에서 연동한 프로젝트 선택
3. **Settings** → **General** 메뉴로 이동

### 1.2 프로젝트 설정

#### Root Directory 설정
- **Root Directory**: `townE` 선택
- 이 설정은 Vercel이 프론트엔드 폴더를 인식하도록 합니다.

#### Build and Output Settings
- **Framework Preset**: Next.js (자동 감지됨)
- **Build Command**: `npm run build` (자동 설정됨)
- **Output Directory**: `.next` (자동 설정됨)
- **Install Command**: `npm install` (자동 설정됨)

## 2. 환경 변수 설정

### 2.1 Vercel 대시보드에서 환경 변수 추가

**Settings** → **Environment Variables** 메뉴로 이동하여 다음 변수들을 추가하세요:

#### 프로덕션 환경 변수
```
NEXT_PUBLIC_API_BASE_URL=https://your-backend-api.com/api
NEXT_PUBLIC_APP_NAME=townE
```

#### 프리뷰 환경 변수 (선택사항)
```
NEXT_PUBLIC_API_BASE_URL=https://your-preview-api.com/api
NEXT_PUBLIC_APP_NAME=townE Preview
```

#### 개발 환경 변수 (선택사항)
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_NAME=townE Dev
```

### 2.2 환경 변수 설명

| 변수명 | 설명 | 예시 값 |
|--------|------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | 백엔드 API 기본 URL | `https://api.example.com/api` |
| `NEXT_PUBLIC_APP_NAME` | 애플리케이션 이름 | `townE` |

**중요**: `NEXT_PUBLIC_` 접두사가 붙은 변수만 클라이언트에서 접근 가능합니다.

## 3. 백엔드 API URL 설정

### 3.1 백엔드 배포 상태 확인

백엔드가 배포되어 있어야 합니다. 다음 중 하나를 선택하세요:

#### 옵션 1: 백엔드를 별도 서버에 배포한 경우
- 백엔드 서버 URL을 `NEXT_PUBLIC_API_BASE_URL`에 설정
- 예: `https://api.yourdomain.com/api`

#### 옵션 2: 백엔드가 로컬에만 있는 경우 (개발용)
- 개발 환경에서만 사용 가능
- 프로덕션에서는 백엔드도 배포 필요

#### 옵션 3: 백엔드를 Vercel Serverless Functions로 배포 (고급)
- Spring Boot를 서버리스로 변환 필요
- 권장하지 않음 (복잡함)

### 3.2 CORS 설정 확인

백엔드에서 Vercel 도메인을 허용해야 합니다:

```yaml
# Spring Boot application.yml 예시
cors:
  allowed-origins:
    - https://your-vercel-app.vercel.app
    - https://your-custom-domain.com
```

## 4. 빌드 및 배포

### 4.1 자동 배포

GitHub에 푸시하면 자동으로 배포됩니다:

```bash
git add .
git commit -m "배포 준비"
git push origin main
```

### 4.2 수동 배포

Vercel 대시보드에서:
1. **Deployments** 탭으로 이동
2. **Redeploy** 버튼 클릭

### 4.3 배포 로그 확인

배포 중 **Deployments** 탭에서 실시간 로그를 확인할 수 있습니다.

## 5. 도메인 설정 (선택사항)

### 5.1 커스텀 도메인 추가

1. **Settings** → **Domains** 메뉴로 이동
2. **Add Domain** 클릭
3. 도메인 입력 (예: `maeul-e.com`)
4. DNS 설정 안내에 따라 DNS 레코드 추가

### 5.2 DNS 설정

도메인 제공업체에서 다음 DNS 레코드를 추가:

```
Type: CNAME
Name: @ 또는 www
Value: cname.vercel-dns.com
```

## 6. 배포 후 확인 사항

### 6.1 기본 확인

- [ ] 사이트가 정상적으로 로드되는가?
- [ ] API 호출이 정상적으로 작동하는가?
- [ ] 로그인 기능이 작동하는가?
- [ ] 관리자 페이지가 접근 가능한가?

### 6.2 콘솔 에러 확인

브라우저 개발자 도구(F12)에서:
- Console 탭: JavaScript 에러 확인
- Network 탭: API 호출 상태 확인

### 6.3 Vercel 로그 확인

**Deployments** → **Functions** 탭에서 서버 로그 확인

## 7. 문제 해결

### 7.1 빌드 실패

**증상**: 배포가 실패하고 빌드 에러 발생

**해결 방법**:
1. 로컬에서 빌드 테스트:
   ```bash
   cd townE
   npm install
   npm run build
   ```
2. 빌드 에러 수정 후 다시 푸시
3. Vercel 빌드 로그에서 상세 에러 확인

### 7.2 API 호출 실패 (CORS 에러)

**증상**: 브라우저 콘솔에 CORS 에러 발생

**해결 방법**:
1. 백엔드 CORS 설정에 Vercel 도메인 추가
2. `NEXT_PUBLIC_API_BASE_URL` 환경 변수 확인

### 7.3 환경 변수 미적용

**증상**: 환경 변수가 적용되지 않음

**해결 방법**:
1. 환경 변수 이름이 `NEXT_PUBLIC_`로 시작하는지 확인
2. 배포 후 재배포 (환경 변수 변경 시)
3. 브라우저 캐시 삭제 후 확인

### 7.4 404 에러 (라우팅 문제)

**증상**: 페이지 새로고침 시 404 에러

**해결 방법**:
- Next.js는 자동으로 처리하지만, 필요시 `vercel.json`에 rewrites 추가:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

## 8. 성능 최적화

### 8.1 이미지 최적화

Next.js Image 컴포넌트 사용:
```tsx
import Image from 'next/image';

<Image src="/image.jpg" alt="설명" width={500} height={300} />
```

### 8.2 빌드 최적화

- 불필요한 의존성 제거
- 코드 스플리팅 활용
- 정적 페이지는 `generateStaticParams` 사용

## 9. 모니터링 및 분석

### 9.1 Vercel Analytics (선택사항)

**Settings** → **Analytics**에서 활성화

### 9.2 에러 모니터링

- Vercel Logs에서 에러 확인
- Sentry 등 외부 서비스 연동 고려

## 10. CI/CD 워크플로우

### 10.1 브랜치별 배포

- `main` 브랜치 → 프로덕션 배포
- `develop` 브랜치 → 프리뷰 배포
- Pull Request → 프리뷰 배포 (자동)

### 10.2 배포 알림

**Settings** → **Git**에서 알림 설정 가능

## 11. 다음 단계

1. ✅ Vercel 프로젝트 설정 완료
2. ✅ 환경 변수 설정 완료
3. ⏳ 백엔드 API 배포 (별도 서버 필요)
4. ⏳ 도메인 연결 (선택사항)
5. ⏳ 모니터링 설정 (선택사항)

## 12. 체크리스트

배포 전 확인:
- [ ] Root Directory가 `townE`로 설정됨
- [ ] 환경 변수가 올바르게 설정됨
- [ ] 로컬에서 빌드가 성공함
- [ ] 백엔드 API가 접근 가능함
- [ ] CORS 설정이 완료됨

배포 후 확인:
- [ ] 사이트가 정상적으로 로드됨
- [ ] API 호출이 정상 작동함
- [ ] 로그인 기능이 작동함
- [ ] 관리자 페이지가 접근 가능함
- [ ] 모바일 반응형이 정상 작동함
