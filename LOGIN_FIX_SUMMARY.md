# 로그인 문제 수정 완료 요약

## 완료된 작업

### 1. 관리자/일반 사용자 로그인 분리 ✅

#### 백엔드
- **일반 사용자 로그인**: `POST /api/v1/auth/login`
- **관리자 로그인**: `POST /api/v1/admin/auth/login`
  - 관리자 권한 확인 (MEMBERLEVEL 8 이상)
  - 별도의 `AdminAuthService` 및 `AdminAuthController` 생성

#### 프론트엔드
- **일반 사용자 로그인 페이지**: `/login`
- **관리자 로그인 페이지**: `/admin/login`
- **관리자 대시보드**: `/admin` (관리자 권한 확인)

### 2. 비밀번호 암호화 호환성 개선 ✅

- **기존 시스템**: SHA-256 (Salt 없음)
- **새 시스템**: BCrypt
- **해결**: `PasswordUtil` 클래스 생성하여 두 방식 모두 지원
  - SHA-256 형식 감지 및 검증
  - BCrypt 형식 검증
  - 자동 형식 감지 및 적절한 검증 방법 선택

### 3. 에러 처리 개선 ✅

- **예외 처리 개선**: `GlobalExceptionHandler`에 `RuntimeException` 핸들러 추가
- **에러 메시지 전달**: 명확한 에러 메시지 반환
- **로깅 강화**: 상세한 로그 추가로 디버깅 용이성 향상

### 4. 보안 설정 개선 ✅

- **관리자 API 보호**: `/v1/admin/**` 경로는 `ROLE_ADMIN` 또는 `ROLE_USER` 필요
- **인증 필터**: JWT 인증 필터가 모든 요청에 적용

## 생성된 파일

### 백엔드
- `dto/auth/AdminLoginRequest.java`: 관리자 로그인 요청 DTO
- `service/AdminAuthService.java`: 관리자 인증 서비스
- `controller/api/AdminAuthController.java`: 관리자 인증 컨트롤러
- `util/PasswordUtil.java`: 비밀번호 유틸리티 (SHA-256/BCrypt 지원)

### 프론트엔드
- `lib/api/adminAuth.ts`: 관리자 인증 API 클라이언트
- `app/admin/login/page.tsx`: 관리자 로그인 페이지
- `app/admin/page.tsx`: 관리자 대시보드 페이지

## API 엔드포인트

### 일반 사용자
- `POST /api/v1/auth/login`: 일반 사용자 로그인
- `POST /api/v1/auth/signup`: 회원가입
- `POST /api/v1/auth/refresh`: 토큰 갱신

### 관리자
- `POST /api/v1/admin/auth/login`: 관리자 로그인

## 다음 단계

1. **SNS 로그인 구현** (추후)
   - 카카오 로그인 API 연동
   - 네이버 로그인 API 연동

2. **전화번호 로그인 구현** (추후)
   - 전화번호 인증 시스템 연동

3. **테스트 계정 생성**
   - 일반 사용자 테스트 계정
   - 관리자 테스트 계정 (MEMBERLEVEL 8 이상)

## 테스트 방법

### 일반 사용자 로그인
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"userId":"testuser","userPw":"password"}'
```

### 관리자 로그인
```bash
curl -X POST http://localhost:8080/api/v1/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"userId":"admin","userPw":"admin123"}'
```

## 주의사항

1. **기존 DB 비밀번호**: SHA-256 형식으로 저장된 비밀번호는 그대로 사용 가능
2. **새 비밀번호**: 회원가입 시 BCrypt로 암호화되어 저장됨
3. **관리자 권한**: MEMBERLEVEL이 8 이상이어야 관리자 로그인 가능

