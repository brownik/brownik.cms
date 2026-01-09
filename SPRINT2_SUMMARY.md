# Sprint 2 완료 요약

## 완료된 작업

### ✅ US-007: 회원 엔티티 생성
- NU_MEMBER 테이블 기반 Member 엔티티 생성 완료
- JPA 어노테이션 매핑 (기존 컬럼명 유지)
- MemberRepository 인터페이스 생성 완료

### ✅ US-008: 회원가입 API 구현
- 회원가입 API 엔드포인트 생성 (POST /api/v1/auth/signup)
- 비밀번호 암호화 (BCrypt)
- 입력 데이터 검증 (DTO Validation)
- 중복 아이디/이메일 체크
- 개인/법인 회원 구분 처리
- **해결된 이슈**: `ClassCastException` 해결 - `existsBy...` 메서드 대신 `checkUserIdExists`/`checkEmailExists` 사용하여 Integer 반환 타입 문제 해결

### ✅ US-009: 로그인 API 구현
- 로그인 API 엔드포인트 생성 (POST /api/v1/auth/login)
- 사용자 인증 로직 구현
- JWT 토큰 생성 및 반환 (Access Token, Refresh Token)
- 로그인 실패 처리 (실패 횟수 카운트)
- 로그인 성공 시 로그인 정보 업데이트

### ✅ US-010: JWT 인증 필터 구현
- JWT 필터 및 인증 로직 구현 (Spring Security)
- 토큰 검증 및 사용자 정보 추출
- 인증 실패 시 401 응답
- SecurityConfig 설정 완료
- 권한 계층 구조 적용 (ROLE_ADMIN > ROLE_USER > ROLE_GUEST)

### ✅ US-011: 토큰 갱신 API 구현
- 토큰 갱신 API 엔드포인트 생성 (POST /api/v1/auth/refresh)
- Refresh Token 검증 및 새 Access Token 발급

### ✅ US-012: 회원 정보 조회 API 구현
- 회원 정보 조회 API (GET /api/v1/members/me)
- 인증 확인 (JWT)
- 본인 정보만 조회 가능

### ✅ US-013: 회원 정보 수정 API 구현
- 회원 정보 수정 API (PUT /api/v1/members/me)
- 본인 권한 확인
- 입력 데이터 검증

## 생성된 파일

### Entity
- `Member.java`: 회원 엔티티

### Repository
- `MemberRepository.java`: 회원 데이터 접근 계층

### Service
- `MemberService.java`: 회원 비즈니스 로직
- `AuthService.java`: 인증 비즈니스 로직

### Controller
- `AuthController.java`: 인증 API 컨트롤러
- `MemberController.java`: 회원 API 컨트롤러

### DTO
- `SignupRequest.java`: 회원가입 요청 DTO
- `LoginRequest.java`: 로그인 요청 DTO
- `RefreshTokenRequest.java`: 토큰 갱신 요청 DTO
- `AuthResponse.java`: 인증 응답 DTO
- `MemberResponse.java`: 회원 정보 응답 DTO
- `MemberUpdateRequest.java`: 회원 정보 수정 요청 DTO

### Config
- `SecurityConfig.java`: Spring Security 설정 (JWT 필터 포함)
- `JwtAuthenticationFilter.java`: JWT 인증 필터

### Util
- `JwtUtil.java`: JWT 토큰 생성 및 검증 유틸리티

## API 엔드포인트

### 인증 API
- `POST /api/v1/auth/signup`: 회원가입
- `POST /api/v1/auth/login`: 로그인
- `POST /api/v1/auth/refresh`: 토큰 갱신

### 회원 API
- `GET /api/v1/members/me`: 회원 정보 조회 (인증 필요)
- `PUT /api/v1/members/me`: 회원 정보 수정 (인증 필요)

## 보안 기능

1. **비밀번호 암호화**: BCrypt 사용 (기존 SHA-256 대체)
2. **JWT 토큰**: Access Token (24시간) + Refresh Token (7일)
3. **권한 관리**: 회원 등급에 따른 권한 부여
4. **로그인 실패 처리**: 실패 횟수 카운트 및 추적

## 해결된 기술 이슈

### ClassCastException 해결
- **문제**: `existsByUserId` 메서드에서 `Integer`를 `Boolean`으로 캐스팅하는 오류 발생
- **원인**: Spring Data JPA의 자동 쿼리 생성이 Native Query의 `Integer` 반환값을 `Boolean`으로 변환 시도
- **해결**: 
  - `existsByUserId` → `checkUserIdExists`로 메서드명 변경
  - `existsByEmail` → `checkEmailExists`로 메서드명 변경
  - Native Query `SELECT 1 FROM NU_MEMBER WHERE USERID = :userId LIMIT 1` 사용하여 `Integer` 반환
  - `default` 메서드로 `Integer != null` 체크하여 `boolean` 반환
- **결과**: 정상적으로 중복 체크 쿼리 실행 확인 (로그 검증 완료)

## 알려진 제한사항

- **DB 권한 이슈**: 현재 `townE` 사용자에게 `NU_MEMBER` 테이블 INSERT 권한이 없어 실제 회원가입은 실패함 (코드 레벨에서는 정상 작동)

## 다음 단계 (Sprint 3)

Sprint 3에서는 회원 관리 모듈의 프론트엔드 개발을 진행합니다:
- 회원가입 페이지
- 로그인 페이지
- 회원 정보 조회/수정 페이지
- 인증 상태 관리

