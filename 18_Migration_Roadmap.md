# townE 리뉴얼 프로젝트 마이그레이션 로드맵

## 프로젝트 개요
- **목표**: JSP/Spring MVC 기반 시스템을 Next.js(App Router) + Spring Boot 3.x REST API로 전환
- **기간**: Phase 1 (Framework 전환)
- **DB**: 기존 MariaDB 유지 (스키마 변경 최소화)

## 기술 스택
- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, TanStack Query, Zustand
- **Backend**: Spring Boot 3.x, Java 17, Spring Data JPA, Spring Security (JWT), Querydsl
- **DB**: MariaDB

## 마이그레이션 전략
1. **인프라 구축** → **인증 시스템** → **핵심 기능** → **UI 컴포넌트화** → **테스트 및 최적화**
2. 점진적 개발: MVP 단위로 기능 완성
3. 기존 기능 우선순위화 후 단계적 마이그레이션

