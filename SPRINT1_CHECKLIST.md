# Sprint 1 완료 체크리스트

## 프로젝트 초기 설정 및 설계 (Week 1)

### ✅ US-001: Spring Boot 3.x 프로젝트 구조 설계
- [x] Spring Boot 3.2.0 프로젝트 생성 완료
- [x] Java 17 설정 완료
- [x] 패키지 구조 설계 완료 (controller, service, repository, dto, entity, config, common)
- [x] application.yml 기본 설정 완료 (MariaDB 연결 정보)
- [x] 공통 예외 처리 클래스(@RestControllerAdvice) 생성 완료
- [x] 공통 응답 DTO 생성 완료

### ✅ US-002: Next.js 14+ 프로젝트 구조 설계
- [x] Next.js 16+ (App Router) 프로젝트 생성 완료
- [x] TypeScript 설정 완료
- [x] Tailwind CSS 설정 완료
- [x] 디렉토리 구조 설계 완료 (app, components, lib, hooks, stores, types)

### ✅ US-003: 개발 환경 구축
- [x] 백엔드 포트 설정 완료 (8080)
- [x] 프론트엔드 포트 설정 완료 (3000)
- [x] CORS 설정 완료 (WebConfig)
- [x] 환경 변수 관리 설정 완료 (.env.local)

### ✅ US-004: API 통신 라이브러리 설정
- [x] axios 설치 및 기본 설정 완료
- [x] TanStack Query 설정 완료 (QueryClient, Provider)
- [x] Zustand 설치 및 기본 스토어 구조 생성 완료
- [x] API 클라이언트 인터셉터 설정 완료 (JWT 토큰 자동 추가, 자동 갱신)

### ✅ US-005: DB 스키마 분석 및 엔티티 설계
- [x] 기존 DB 스키마 분석 완료 (`04_Database_DDL_Script.md` 참고)
- [x] 핵심 엔티티 설계 문서 작성 완료 (ENTITY_DESIGN.md)
- [x] 엔티티 관계 매핑 설계 완료
- [x] JPA Repository 인터페이스 설계 완료

### ✅ US-006: RESTful API 명세 작성
- [x] 기존 API 분석 완료 (`06_API_Specification.md` 참고)
- [x] RESTful API 엔드포인트 설계 완료
- [x] Request/Response DTO 설계 완료
- [x] API 버전 관리 전략 수립 완료 (v1)

## 완료 기준 검증

### 프로젝트 실행 확인
- [ ] Spring Boot 프로젝트가 정상 실행되는지 확인
  ```bash
  cd townE-backend
  mvn spring-boot:run
  ```
  - Health Check: `http://localhost:8080/api/v1/health`

- [ ] Next.js 프로젝트가 정상 실행되는지 확인
  ```bash
  cd townE
  npm run dev
  ```
  - URL: `http://localhost:3000`

### 데이터베이스 연결 확인
- [ ] MariaDB 연결 확인
  ```bash
  curl http://localhost:8080/api/v1/health
  ```
  - 응답 확인: `{"success":true,"message":"서버가 정상적으로 동작 중입니다",...}`

### API 호출 테스트
- [ ] 프론트엔드에서 백엔드 Health Check API 호출 테스트
  - 브라우저 콘솔에서 확인
  - 또는 프론트엔드 페이지에서 API 호출 테스트

## 생성된 파일 구조

### Backend
```
townE-backend/
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/kr/co/nubiz/
│   │   │   ├── TownEApplication.java
│   │   │   ├── config/
│   │   │   │   ├── WebConfig.java
│   │   │   │   └── SecurityConfig.java
│   │   │   ├── common/
│   │   │   │   ├── dto/
│   │   │   │   │   └── ApiResponse.java
│   │   │   │   └── exception/
│   │   │   │       ├── GlobalExceptionHandler.java
│   │   │   │       └── ErrorResponse.java
│   │   │   └── controller/
│   │   │       └── HealthController.java
│   │   └── resources/
│   │       └── application.yml
│   └── test/
└── docs/
    ├── ENTITY_DESIGN.md
    └── API_SPECIFICATION.md
```

### Frontend
```
townE/
├── package.json
├── .env.local
├── app/
│   ├── layout.tsx
│   ├── providers.tsx
│   └── page.tsx
├── lib/
│   └── api/
│       ├── client.ts
│       └── types.ts
├── stores/
│   └── authStore.ts
└── components/
```

## 다음 Sprint (Sprint 2) 준비사항

1. **회원 엔티티 구현**
   - Member 엔티티 클래스 생성
   - MemberRepository 인터페이스 생성

2. **인증 API 구현**
   - 회원가입 API
   - 로그인 API
   - JWT 토큰 생성 및 검증 로직

3. **보안 설정**
   - Spring Security 설정
   - JWT 필터 구현

## 참고 문서

- `new_analysis_docs/04_Database_DDL_Script.md`: DB 스키마
- `new_analysis_docs/06_API_Specification.md`: 기존 API 명세
- `new_analysis_docs/13_Spring_Boot_REST_API_Guide.md`: Spring Boot 가이드
- `new_analysis_docs/15_NextJS_MariaDB_Start_Guide.md`: Next.js 가이드
- `townE-backend/docs/ENTITY_DESIGN.md`: 엔티티 설계 문서
- `townE-backend/docs/API_SPECIFICATION.md`: API 명세서
