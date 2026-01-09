# 프로젝트 실행 상태

## 현재 상태

### ✅ Sprint 1 완료
- **목표**: JSP/Spring MVC → Next.js + Spring Boot REST API 전환
- **Phase**: Phase 1 진행 중
- **현재 Sprint**: Sprint 1 완료 ✅

### Sprint 1 완료 항목
- ✅ Spring Boot 3.x 프로젝트 구조 설계 및 생성
- ✅ Next.js 14+ 프로젝트 구조 설계 및 생성
- ✅ 개발 환경 구축 (포트 설정, CORS, 환경 변수)
- ✅ API 통신 라이브러리 설정 (axios, TanStack Query, Zustand)
- ✅ DB 스키마 분석 및 엔티티 설계 문서 작성
- ✅ RESTful API 명세서 작성

## 프로젝트 실행 방법

### 백엔드 실행
```bash
cd townE-backend
mvn spring-boot:run
```
- Health Check: `http://localhost:8080/api/v1/health`
- DB 연결 테스트: `http://localhost:8080/api/v1/test/db`

### 프론트엔드 실행
```bash
cd townE-frontend
npm install  # 처음 실행 시
npm run dev
```
- URL: `http://localhost:3000`

### 환경 변수 설정
프론트엔드 `.env.local` 파일 생성 (이미 생성됨):
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

## 다음 단계

### Sprint 2 시작 준비
1. 회원 엔티티 구현
2. 회원가입/로그인 API 구현
3. JWT 인증 시스템 구축

## 참고 문서

- `SPRINT_PLAN.md`: 전체 스프린트 계획
- `new_analysis_docs/18_Migration_Roadmap.md`: 마이그레이션 로드맵
- `new_analysis_docs/15_NextJS_MariaDB_Start_Guide.md`: 시작 가이드
- `new_analysis_docs/13_Spring_Boot_REST_API_Guide.md`: Spring Boot 가이드
- `new_analysis_docs/11_NextJS_Frontend_Guide.md`: Next.js 가이드
