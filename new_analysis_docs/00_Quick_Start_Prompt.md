# 새로운 환경에서 시작하기 - 프롬프트 가이드

## 🚀 빠른 시작 프롬프트

### 1단계: 프로젝트 이해 및 초기 설정

**복사해서 사용하세요:**

```
townE 프로젝트의 첫 번째 리뉴얼(Phase 1)을 시작하려고 합니다.

현재 상태: JSP + Spring MVC + MariaDB
Phase 1 목표: Next.js + Spring Boot REST API + MariaDB
Phase 2 목표: Next.js + Spring Boot REST API + Supabase (추후 진행)

프로젝트 정보:
- 현재 상태: JSP + Spring MVC + MariaDB
- Phase 1 목표: Next.js + Spring Boot REST API + MariaDB (첫 번째 리뉴얼)
- Phase 2 목표: Next.js + Spring Boot REST API + Supabase (두 번째 리뉴얼)

마이그레이션 계획:
1. Phase 1: 프론트엔드를 Next.js로 전환 (데이터베이스는 MariaDB 유지)
2. Phase 2: 데이터베이스를 Supabase로 전환 및 디자인 리뉴얼

문서 위치:
- 프로젝트 루트의 /new_analysis_docs 폴더에 모든 가이드 문서가 있습니다.

주요 문서:
1. README.md - 전체 문서 구조 및 빠른 시작 가이드
2. 18_Migration_Roadmap.md - 단계별 마이그레이션 로드맵 (필수)
3. 15_NextJS_MariaDB_Start_Guide.md - Phase 1 시작 가이드
4. 11_NextJS_Frontend_Guide.md - Next.js 프론트엔드 가이드
5. 13_Spring_Boot_REST_API_Guide.md - Spring Boot REST API 가이드
6. 04_Database_DDL_Script.md - 데이터베이스 스키마

먼저 README.md와 18_Migration_Roadmap.md를 읽고 전체 마이그레이션 계획을 이해한 후,
Phase 1부터 단계별로 구현을 도와주세요.
```

---

## 📋 단계별 프롬프트

### Phase 1 시작하기

**먼저 전체 계획 파악**:
```
18_Migration_Roadmap.md를 읽고 전체 마이그레이션 계획을 이해해주세요.

현재 상태: JSP + MariaDB
Phase 1 목표: Next.js + MariaDB (첫 번째 리뉴얼)
Phase 2 목표: Next.js + Supabase (두 번째 리뉴얼)

Phase 1부터 시작하겠습니다.
```

### 2단계: 데이터베이스 설정

```
데이터베이스를 설정하겠습니다.

중요: 기존 데이터베이스를 사용하므로 스키마 변경 없이 연결 주소만 설정합니다.

참고 문서:
- 04_Database_DDL_Script.md - 완전한 DDL 스크립트 (참고용)

기존 데이터베이스 정보:
- Host: 192.168.0.141
- Port: 3306
- Database: townE
- User: townE
- Password: townE

다음 작업을 도와주세요:
1. Spring Boot의 application.yml에 데이터베이스 연결 설정
2. 연결 테스트
3. 기존 스키마 확인 (필요시)

스키마 변경은 필요 없으며, 연결 주소만 설정하면 됩니다.
```

---

### 3단계: Spring Boot 백엔드 프로젝트 생성

```
Spring Boot 백엔드 프로젝트를 생성하겠습니다.

참고 문서:
- 15_React_MariaDB_Start_Guide.md의 "2. Spring Boot 프로젝트 설정" 섹션
- 13_Spring_Boot_REST_API_Guide.md - REST API 구현 가이드
- 05_Project_Structure_Configuration.md - 프로젝트 구조 참고

구현할 내용:
1. Spring Boot 3.x 프로젝트 생성 (Maven)
2. pom.xml 설정 (MariaDB 의존성 포함)
3. application.yml 설정 (DB 연결 정보)
4. 기본 패키지 구조 생성
5. JPA Entity 예시 (Member Entity)

단계별로 진행하면서 각 파일을 생성해주세요.
```

---

### 4단계: Next.js 프론트엔드 프로젝트 생성

```
Next.js 프론트엔드 프로젝트를 생성하겠습니다.

참고 문서:
- 15_NextJS_MariaDB_Start_Guide.md의 "8. Next.js 프로젝트 설정" 섹션
- 11_NextJS_Frontend_Guide.md - Next.js 상세 가이드

구현할 내용:
1. Next.js 14 + TypeScript + App Router 프로젝트 생성
2. 기본 폴더 구조 설정 (app 디렉토리)
3. API 클라이언트 설정 (axios)
4. TypeScript 타입 정의 예시
5. Server Component 및 Client Component 예시
6. 기본 페이지 및 컴포넌트 예시 (MemberList, MemberForm)

단계별로 진행하면서 각 파일을 생성해주세요.
```

---

### 5단계: 회원 관리 기능 구현

```
회원 관리 기능을 구현하겠습니다.

참고 문서:
- 15_NextJS_MariaDB_Start_Guide.md의 "4. JPA Entity 설계" 및 "5. Repository 구현" 섹션
- 07_Implementation_Code_Examples.md의 MemberVO, Service, Controller 예시
- 06_API_Specification.md의 회원 관리 API 명세
- 11_NextJS_Frontend_Guide.md의 컴포넌트 예시

구현할 내용:

Backend:
1. Member Entity 클래스 (JPA, MariaDB용)
2. MemberRepository 인터페이스
3. MemberService 구현
4. MemberController (REST API)

Frontend (Next.js):
1. app/admin/members/page.tsx (Server Component - 목록 페이지)
2. components/member/MemberList.tsx (Client Component - 목록 컴포넌트)
3. components/member/MemberForm.tsx (Client Component - 등록/수정 폼)
4. lib/api/member.ts (API 클라이언트)

각 단계마다 코드를 생성하고 설명해주세요.
```

---

### 6단계: 게시판 기능 구현

```
게시판 기능을 구현하겠습니다.

참고 문서:
- 06_API_Specification.md의 게시판 API 명세
- 13_Spring_Boot_REST_API_Guide.md의 Controller 패턴
- 11_NextJS_Frontend_Guide.md의 Next.js 컴포넌트 패턴

구현할 API:
- GET /api/boards/{boardId}/items - 게시물 목록
- GET /api/boards/{boardId}/items/{id} - 게시물 상세
- POST /api/boards/{boardId}/items - 게시물 작성
- PUT /api/boards/{boardId}/items/{id} - 게시물 수정
- DELETE /api/boards/{boardId}/items/{id} - 게시물 삭제

Backend:
Entity, Repository, Service, Controller를 모두 구현해주세요.

Frontend (Next.js):
- app/(home)/board/[boardKey]/page.tsx (Server Component - 목록)
- app/(home)/board/[boardKey]/[id]/page.tsx (Server Component - 상세)
- components/board/BoardList.tsx (Client Component)
- components/board/BoardForm.tsx (Client Component)

Next.js의 SSR/SSG/ISR을 활용하여 구현해주세요.
```

---

## 🎯 특정 상황별 프롬프트

### CMS DB 소스 코드 분석이 필요한 경우

```
CMS DB에 저장된 홈페이지 소스 코드를 분석하겠습니다.

참고 문서:
- 16_CMS_DB_Source_Analysis.md - CMS DB 소스 코드 분석 가이드
- 17_DB_Source_Extraction_Summary.md - 추출 완료 보고서

소스 코드 위치:
- new_analysis_docs/source_assets/ 폴더

다음 작업을 도와주세요:
1. 추출된 HTML/JS/CSS 코드 구조 분석
2. 공통 패턴 식별
3. React 컴포넌트로 변환 가능 여부 판단
4. 마이그레이션 계획 수립
```

---

### 에러 해결이 필요한 경우

```
다음 에러가 발생했습니다:

[에러 메시지 붙여넣기]

관련 코드:
[코드 스니펫 붙여넣기]

참고 문서:
- [관련 문서 경로]

에러 원인을 분석하고 해결 방법을 제시해주세요.
```

---

### 코드 리뷰가 필요한 경우

```
다음 코드를 리뷰해주세요:

[코드 붙여넣기]

참고 문서:
- 15_React_MariaDB_Start_Guide.md의 패턴
- 07_Implementation_Code_Examples.md의 예시

다음 관점에서 리뷰해주세요:
1. 기존 패턴과의 일관성
2. PostgreSQL 마이그레이션 고려사항
3. 개선 사항
```

---

## 📝 프롬프트 작성 체크리스트

프롬프트 작성 시 다음을 확인하세요:

- [ ] 프로젝트 컨텍스트 제공 (목표, 기술 스택)
- [ ] 참고 문서 명시 (파일 경로 포함)
- [ ] 구체적인 요구사항 제시
- [ ] 단계별 진행 계획 명시
- [ ] 기존 패턴/코드 참조 명시
- [ ] 예상 결과물 명시

---

## 🔄 연속 작업 시 컨텍스트 유지

이전 대화에서 작업을 이어갈 때:

```
이전 대화에서 townE 프로젝트의 React + MariaDB 구축을 진행하고 있습니다.

현재 상태:
- [완료된 작업 나열]
- [다음 작업 명시]

참고 문서:
- [관련 문서 경로]

다음 단계를 진행해주세요.
```

---

## 💡 효과적인 프롬프트 작성 팁

### ✅ 좋은 예시

```
회원 관리 기능을 구현하겠습니다.

프로젝트 정보:
- 백엔드: Spring Boot 3.x + JPA + MariaDB
- 프론트엔드: React 18 + TypeScript
- 문서 위치: /new_analysis_docs 폴더

참고 문서:
- 15_React_MariaDB_Start_Guide.md의 Member Entity 예시
- 06_API_Specification.md의 회원 관리 API 명세

구현할 내용:
1. Backend: Entity, Repository, Service, Controller
2. Frontend: 회원 목록, 회원 등록/수정 폼

요구사항:
- 기존 스키마(NU_MEMBER) 사용
- RESTful API 설계
- React Query 사용
- TypeScript 타입 정의

15_React_MariaDB_Start_Guide.md의 패턴을 따라 구현해주세요.
```

### ❌ 나쁜 예시

```
회원 기능 만들어줘
```

---

## 🎓 학습용 프롬프트

### 코드 이해가 필요한 경우

```
다음 코드를 이해하고 싶습니다:

[코드 붙여넣기]

참고 문서:
- [관련 문서 경로]

다음 내용을 설명해주세요:
1. 코드의 역할과 목적
2. 각 부분의 동작 원리
3. 다른 코드와의 연관성
4. 마이그레이션 시 고려사항
```

---

## 📚 문서 참조 방법

### 특정 문서 읽기 요청

```
/new_analysis_docs/15_React_MariaDB_Start_Guide.md 파일을 읽고
다음 내용을 요약해주세요:
1. 프로젝트 구조
2. 주요 설정 파일
3. 구현 순서
4. 주의사항
```

### 여러 문서 통합 참조

```
다음 문서들을 종합하여 회원 관리 기능을 구현하겠습니다:

1. 04_Database_DDL_Script.md - NU_MEMBER 테이블 스키마
2. 15_React_MariaDB_Start_Guide.md - Entity 및 Repository 패턴
3. 06_API_Specification.md - API 명세
4. 11_React_Frontend_Guide.md - React 컴포넌트 패턴

각 문서의 관련 부분을 참고하여 완전한 구현을 제공해주세요.
```

---

## 🚨 주의사항

1. **문서 경로 명시**: 항상 `/new_analysis_docs/` 경로를 명시하세요
2. **단계별 진행**: 한 번에 모든 것을 요청하지 말고 단계별로 진행하세요
3. **컨텍스트 유지**: 이전 대화 내용을 간단히 요약하세요
4. **구체적 요청**: "만들어줘"보다는 "어떻게 만들지" 구체적으로 명시하세요

---

## 📞 빠른 참조

### 프로젝트 전체 이해
```
/new_analysis_docs/README.md를 읽고 전체 문서 구조를 파악한 후,
townE 프로젝트 구축을 위한 단계별 계획을 제시해주세요.
```

### 특정 기능 구현
```
[기능명] 기능을 구현하겠습니다.
참고: /new_analysis_docs/15_React_MariaDB_Start_Guide.md
[기능명]에 해당하는 섹션을 찾아 구현해주세요.
```

### 데이터베이스 설정
```
MariaDB 데이터베이스를 설정하겠습니다.
참고: /new_analysis_docs/04_Database_DDL_Script.md
DDL 스크립트를 실행할 수 있는 SQL 파일을 생성해주세요.
```

---

## 🎯 마지막 팁

**가장 효과적인 프롬프트 구조:**

1. **상황 설명** (프로젝트 정보, 목표)
2. **참고 자료** (문서 경로, 관련 섹션)
3. **구체적 요청** (무엇을 어떻게 만들지)
4. **제약사항** (기존 패턴, 마이그레이션 고려사항)
5. **예상 결과** (원하는 출력물)

이 구조를 따르면 AI가 더 정확하고 효율적으로 작업할 수 있습니다!

