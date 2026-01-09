# AI 프롬프팅 가이드

## 개요

이 문서는 다른 환경(새로운 윈도우)에서 AI에게 townE 프로젝트를 이해시키고 작업을 요청하기 위한 프롬프트 작성 가이드를 제공합니다.

## 1. 초기 컨텍스트 제공

### 1.1 기본 프롬프트 템플릿

```
나는 townE 프로젝트를 새롭게 구축하려고 합니다.

프로젝트 정보:
- 현재 상태: JSP + Spring MVC + MariaDB
- Phase 1 목표: Next.js + Spring Boot REST API + MariaDB (첫 번째 리뉴얼)
- Phase 2 목표: Next.js + Spring Boot REST API + Supabase (두 번째 리뉴얼)

문서 위치:
- 프로젝트 루트의 /new_analysis_docs 폴더에 모든 가이드 문서가 있습니다.

주요 문서:
1. 18_Migration_Roadmap.md - 단계별 마이그레이션 로드맵 (전체 계획)
2. 15_NextJS_MariaDB_Start_Guide.md - Phase 1 시작 가이드
3. 11_NextJS_Frontend_Guide.md - Next.js 프론트엔드 가이드
4. 13_Spring_Boot_REST_API_Guide.md - Spring Boot REST API 가이드
5. 04_Database_DDL_Script.md - 데이터베이스 스키마

먼저 18_Migration_Roadmap.md를 읽고 전체 마이그레이션 계획을 이해한 후,
Phase 1부터 단계별로 구현을 도와주세요.
```

### 1.2 문서 구조 설명 프롬프트

```
townE 프로젝트의 문서 구조를 이해해주세요.

/new_analysis_docs 폴더에 다음 문서들이 있습니다:

[기본 구축 문서]
- 04_Database_DDL_Script.md: MariaDB 스키마 DDL
- 05_Project_Structure_Configuration.md: 프로젝트 구조 및 설정
- 06_API_Specification.md: API 명세서
- 07_Implementation_Code_Examples.md: 구현 코드 예시
- 08_Deployment_Guide.md: 배포 가이드
- 09_Quick_Start_Guide.md: 빠른 시작 가이드

[마이그레이션 문서]
- 10_PostgreSQL_Migration_Guide.md: PostgreSQL 마이그레이션
- 11_React_Frontend_Guide.md: React 프론트엔드 가이드
- 12_Complete_Migration_Strategy.md: 통합 마이그레이션 전략
- 13_Spring_Boot_REST_API_Guide.md: Spring Boot REST API 가이드
- 15_React_MariaDB_Start_Guide.md: React + MariaDB 시작 가이드

[분석 문서]
- 01_Rendering_Engine.md: 렌더링 엔진 분석
- 02_Service_Logic_Analysis.md: 비즈니스 로직 분석
- 03_Migration_Risk_Report.md: 마이그레이션 리스크 리포트

먼저 README.md를 읽어 전체 구조를 파악해주세요.
```

## 2. 단계별 프롬프트 예시

### 2.1 프로젝트 초기 설정

```
다음 단계로 townE 프로젝트를 시작하겠습니다:

1. 데이터베이스: MariaDB 사용 (추후 Supabase 마이그레이션 예정)
2. 백엔드: Spring Boot 3.x + REST API
3. 프론트엔드: Next.js 14 + TypeScript (App Router)

15_NextJS_MariaDB_Start_Guide.md를 참고하여:
1. Spring Boot 프로젝트 구조 생성
2. Next.js 프로젝트 구조 생성 (App Router)
3. 기본 설정 파일 생성

단계별로 진행하면서 각 파일을 생성해주세요.
```

### 2.2 특정 기능 구현 요청

```
회원 관리 기능을 구현하겠습니다.

참고 문서:
- 15_NextJS_MariaDB_Start_Guide.md의 Member Entity 예시
- 07_Implementation_Code_Examples.md의 MemberVO, Service, Controller 예시
- 06_API_Specification.md의 회원 관리 API 명세
- 11_NextJS_Frontend_Guide.md의 Next.js 컴포넌트 예시

다음 순서로 구현해주세요:
1. Member Entity 클래스 (JPA)
2. MemberRepository 인터페이스
3. MemberService 구현
4. MemberController (REST API)
5. Next.js의 app/admin/members/page.tsx (Server Component)
6. Next.js의 components/member/MemberList.tsx (Client Component)
7. Next.js의 components/member/MemberForm.tsx (Client Component)

각 단계마다 코드를 생성하고 설명해주세요.
```

### 2.3 데이터베이스 관련 요청

```
데이터베이스 스키마를 생성하겠습니다.

04_Database_DDL_Script.md를 참고하여:
1. MariaDB 데이터베이스 생성
2. 모든 테이블 CREATE 문 실행
3. 외래키 제약조건 설정
4. 인덱스 생성
5. 초기 데이터 INSERT

단계별로 SQL 스크립트를 생성해주세요.
```

### 2.4 API 개발 요청

```
게시판 API를 구현하겠습니다.

참고 문서:
- 06_API_Specification.md의 게시판 API 명세
- 13_Spring_Boot_REST_API_Guide.md의 Controller 패턴

구현할 API:
- GET /api/boards/{boardId}/items - 게시물 목록
- GET /api/boards/{boardId}/items/{id} - 게시물 상세
- POST /api/boards/{boardId}/items - 게시물 작성
- PUT /api/boards/{boardId}/items/{id} - 게시물 수정
- DELETE /api/boards/{boardId}/items/{id} - 게시물 삭제

Entity, Repository, Service, Controller를 모두 구현해주세요.
```

### 2.5 React 컴포넌트 개발 요청

```
React로 게시판 목록 페이지를 만들겠습니다.

참고 문서:
- 11_React_Frontend_Guide.md의 컴포넌트 예시
- 15_React_MariaDB_Start_Guide.md의 API 클라이언트 패턴

구현할 컴포넌트:
- BoardList.tsx: 게시물 목록 표시
- BoardItem.tsx: 게시물 아이템
- Pagination.tsx: 페이징 컴포넌트

React Query를 사용하여 서버 상태를 관리하고,
TypeScript 타입을 정의해주세요.
```

## 3. 효과적인 프롬프트 작성법

### 3.1 컨텍스트 제공

#### 좋은 예시 ✅
```
townE 프로젝트의 회원 관리 기능을 구현하겠습니다.

프로젝트 정보:
- 백엔드: Spring Boot 3.x + JPA + MariaDB
- 프론트엔드: React 18 + TypeScript
- 문서 위치: /new_analysis_docs/15_React_MariaDB_Start_Guide.md 참고

요구사항:
1. Member Entity는 기존 스키마(NU_MEMBER)를 사용
2. RESTful API로 구현 (GET, POST, PUT, DELETE)
3. React에서 React Query 사용

15_React_MariaDB_Start_Guide.md의 Member Entity 예시를 참고하여
완전한 코드를 생성해주세요.
```

#### 나쁜 예시 ❌
```
회원 기능 만들어줘
```

### 3.2 단계별 요청

#### 좋은 예시 ✅
```
1단계: Member Entity 클래스를 생성해주세요.
       - 15_React_MariaDB_Start_Guide.md의 예시 참고
       - MariaDB 스키마에 맞게 작성
       
2단계: MemberRepository 인터페이스를 생성해주세요.
       - JPA Repository 사용
       - 검색 기능 포함
       
각 단계마다 코드를 생성하고 다음 단계로 넘어가기 전에 확인해주세요.
```

#### 나쁜 예시 ❌
```
회원 기능 전부 만들어줘
```

### 3.3 참고 문서 명시

#### 좋은 예시 ✅
```
15_React_MariaDB_Start_Guide.md의 "4. JPA Entity 설계" 섹션을 참고하여
Board Entity를 생성해주세요.

특히 다음 사항을 고려해주세요:
- MariaDB용으로 작성 (추후 PostgreSQL 마이그레이션 고려)
- 예약어(KEY, STATUS)는 백틱으로 감싸기
- INSERTDATE, UPDATEDATE 필드 포함
```

#### 나쁜 예시 ❌
```
Board Entity 만들어줘
```

## 4. 상황별 프롬프트 템플릿

### 4.1 프로젝트 시작 시

```
나는 townE 프로젝트를 새롭게 시작하려고 합니다.

프로젝트 목표:
- React + Spring Boot REST API + MariaDB로 구축
- 추후 PostgreSQL로 마이그레이션 예정

문서 위치: /new_analysis_docs 폴더

먼저 다음 문서들을 읽고 프로젝트 구조를 이해해주세요:
1. README.md - 전체 문서 구조
2. 15_React_MariaDB_Start_Guide.md - 시작 가이드
3. 04_Database_DDL_Script.md - 데이터베이스 스키마

이해한 내용을 요약하고, 다음 단계를 제안해주세요.
```

### 4.2 특정 기능 구현 시

```
[기능명] 기능을 구현하겠습니다.

참고 문서:
- [관련 문서 경로]
- [API 명세서 경로]

요구사항:
1. [요구사항 1]
2. [요구사항 2]
3. [요구사항 3]

기존 코드 패턴:
- [참고할 코드 예시 위치]

다음 순서로 구현해주세요:
1. [1단계]
2. [2단계]
3. [3단계]
```

### 4.3 에러 해결 시

```
다음 에러가 발생했습니다:

[에러 메시지]

관련 코드:
[코드 스니펫]

참고 문서:
- [관련 문서]

에러 원인을 분석하고 해결 방법을 제시해주세요.
```

### 4.4 코드 리뷰 요청

```
다음 코드를 리뷰해주세요:

[코드]

참고 문서:
- 15_React_MariaDB_Start_Guide.md의 패턴
- 07_Implementation_Code_Examples.md의 예시

다음 관점에서 리뷰해주세요:
1. 기존 패턴과의 일관성
2. Supabase 마이그레이션 고려사항
3. 개선 사항
```

## 5. 문서 참조 방법

### 5.1 문서 읽기 요청

```
/new_analysis_docs/15_React_MariaDB_Start_Guide.md 파일을 읽고
다음 내용을 요약해주세요:
1. 프로젝트 구조
2. 주요 설정 파일
3. 구현 순서
4. 주의사항
```

### 5.2 특정 섹션 참조

```
15_React_MariaDB_Start_Guide.md의 "4. JPA Entity 설계" 섹션을 참고하여
Member Entity를 생성해주세요.

기존 스키마는 04_Database_DDL_Script.md의 NU_MEMBER 테이블 정의를 따르되,
JPA Entity 형식으로 변환해주세요.
```

### 5.3 여러 문서 통합 참조

```
다음 문서들을 종합하여 회원 관리 기능을 구현하겠습니다:

1. 04_Database_DDL_Script.md - NU_MEMBER 테이블 스키마
2. 15_React_MariaDB_Start_Guide.md - Entity 및 Repository 패턴
3. 06_API_Specification.md - API 명세
4. 11_React_Frontend_Guide.md - React 컴포넌트 패턴

각 문서의 관련 부분을 참고하여 완전한 구현을 제공해주세요.
```

## 6. 주의사항 및 팁

### 6.1 명확한 요청

#### ✅ 좋은 예시
```
15_React_MariaDB_Start_Guide.md를 참고하여:
- Spring Boot 프로젝트의 pom.xml 생성
- application.yml 설정 (MariaDB 연결)
- Member Entity 클래스 생성

각 파일의 내용을 완전히 생성해주세요.
```

#### ❌ 나쁜 예시
```
프로젝트 설정해줘
```

### 6.2 단계별 확인

```
1단계: Member Entity 생성
       - 코드 생성 후 설명
       
2단계: MemberRepository 생성
       - 1단계 완료 확인 후 진행
       
각 단계마다 생성된 코드를 보여주고, 다음 단계로 진행하기 전에 확인해주세요.
```

### 6.3 컨텍스트 유지

```
이전 대화에서 townE 프로젝트의 React + MariaDB 구축을 진행하고 있습니다.

현재 상태:
- Spring Boot 프로젝트 생성 완료
- Member Entity 생성 완료
- 다음: MemberService 구현 필요

15_React_MariaDB_Start_Guide.md의 Service 구현 예시를 참고하여
MemberService를 구현해주세요.
```

## 7. 프롬프트 체크리스트

프롬프트 작성 시 다음을 확인하세요:

- [ ] 프로젝트 컨텍스트 제공 (목표, 기술 스택)
- [ ] 참고 문서 명시 (파일 경로 포함)
- [ ] 구체적인 요구사항 제시
- [ ] 단계별 진행 계획 명시
- [ ] 기존 패턴/코드 참조 명시
- [ ] 예상 결과물 명시

## 8. 예시 대화 시나리오

### 시나리오 1: 프로젝트 시작

**사용자**:
```
나는 townE 프로젝트를 새롭게 시작하려고 합니다.

프로젝트 정보:
- 목표: React + Spring Boot REST API + MariaDB
- 추후: PostgreSQL 마이그레이션 예정
- 문서 위치: /new_analysis_docs 폴더

먼저 README.md와 15_React_MariaDB_Start_Guide.md를 읽고,
프로젝트 구조를 이해한 후 시작 가이드를 제시해주세요.
```

**AI 응답** (예상):
- 문서 읽기 및 요약
- 프로젝트 구조 설명
- 단계별 진행 계획 제시

### 시나리오 2: 기능 구현

**사용자**:
```
회원 관리 기능을 구현하겠습니다.

참고 문서:
- 15_React_MariaDB_Start_Guide.md의 Member Entity 예시
- 06_API_Specification.md의 회원 관리 API 명세

구현할 내용:
1. Backend: Entity, Repository, Service, Controller
2. Frontend: 회원 목록, 회원 등록/수정 폼

단계별로 진행하면서 각 파일을 생성해주세요.
```

**AI 응답** (예상):
- 각 단계별 코드 생성
- 설명 및 다음 단계 안내

### 시나리오 3: 문제 해결

**사용자**:
```
다음 에러가 발생했습니다:

Caused by: java.sql.SQLSyntaxErrorException: 
You have an error in your SQL syntax near 'KEY'

관련 코드:
@Column(name = "KEY")
private Long id;

참고 문서:
- 15_React_MariaDB_Start_Guide.md의 Entity 예시

해결 방법을 제시해주세요.
```

**AI 응답** (예상):
- 에러 원인 분석 (예약어 문제)
- 해결 방법 제시 (백틱 사용)
- 수정된 코드 제공

## 9. 빠른 참조 프롬프트

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

### API 개발
```
[API명] API를 구현하겠습니다.
참고: 
- /new_analysis_docs/06_API_Specification.md - API 명세
- /new_analysis_docs/13_Spring_Boot_REST_API_Guide.md - 구현 패턴
완전한 코드를 생성해주세요.
```

## 10. 주의사항

### 10.1 문서 경로 명시
- 항상 `/new_analysis_docs/` 경로를 명시
- 파일명을 정확히 기재

### 10.2 단계별 진행
- 한 번에 모든 것을 요청하지 말고 단계별로 진행
- 각 단계마다 확인 후 다음 단계 진행

### 10.3 컨텍스트 유지
- 이전 대화 내용을 간단히 요약
- 현재 진행 상황 명시

### 10.4 구체적 요청
- "만들어줘"보다는 "어떻게 만들지" 구체적으로 명시
- 참고 문서와 섹션 명시

## 11. 템플릿 모음

### 템플릿 1: 프로젝트 시작
```
townE 프로젝트를 시작하겠습니다.

목표: React + Spring Boot REST API + MariaDB
문서: /new_analysis_docs/15_React_MariaDB_Start_Guide.md

[구체적인 요청사항]
```

### 템플릿 2: 기능 구현
```
[기능명] 기능을 구현하겠습니다.

참고 문서:
- [문서1]: [용도]
- [문서2]: [용도]

구현할 내용:
1. [내용1]
2. [내용2]

[기존 패턴/코드 참조]
```

### 템플릿 3: 문제 해결
```
[문제 설명]

에러 메시지:
[에러]

관련 코드:
[코드]

참고 문서:
[문서]

해결 방법을 제시해주세요.
```

## 12. 효과적인 프롬프트 예시 모음

### 예시 1: 완전한 컨텍스트 제공
```
townE 프로젝트의 회원 관리 기능을 구현하겠습니다.

프로젝트 정보:
- 백엔드: Spring Boot 3.x + JPA + MariaDB
- 프론트엔드: React 18 + TypeScript + Vite
- 목표: React + MariaDB로 시작, 추후 PostgreSQL 마이그레이션

참고 문서:
- /new_analysis_docs/15_React_MariaDB_Start_Guide.md - 시작 가이드
- /new_analysis_docs/04_Database_DDL_Script.md - NU_MEMBER 테이블 스키마
- /new_analysis_docs/06_API_Specification.md - 회원 관리 API 명세
- /new_analysis_docs/07_Implementation_Code_Examples.md - 구현 예시

구현할 내용:
1. Backend:
   - Member Entity (JPA, MariaDB용)
   - MemberRepository
   - MemberService
   - MemberController (REST API)

2. Frontend:
   - MemberList 컴포넌트 (목록)
   - MemberForm 컴포넌트 (등록/수정)
   - API 클라이언트

요구사항:
- 기존 스키마(NU_MEMBER) 사용
- RESTful API 설계
- React Query 사용
- TypeScript 타입 정의

15_React_MariaDB_Start_Guide.md의 패턴을 따라 구현해주세요.
```

### 예시 2: 단계별 진행
```
1단계: Member Entity 생성
       - 15_React_MariaDB_Start_Guide.md의 "4. JPA Entity 설계" 참고
       - MariaDB 스키마에 맞게 작성
       - 예약어는 백틱 사용
       
       코드 생성 후 설명해주세요.

2단계: 1단계 완료 확인 후 MemberRepository 생성
       - JPA Repository 인터페이스
       - 검색 메서드 포함
       
각 단계마다 생성된 코드를 보여주고 확인해주세요.
```

### 예시 3: 문서 기반 요청
```
/new_analysis_docs/15_React_MariaDB_Start_Guide.md 파일을 읽고,
"5. Repository 구현" 섹션의 패턴을 따라
BoardRepository를 생성해주세요.

기존 Board Entity는 이미 생성되어 있습니다.
BoardItem과의 관계를 고려하여 작성해주세요.
```

## 13. 결론

효과적인 프롬프트 작성 요약:

1. **컨텍스트 제공**: 프로젝트 목표, 기술 스택 명시
2. **문서 참조**: 정확한 파일 경로와 섹션 명시
3. **구체적 요청**: 무엇을 어떻게 만들지 명확히
4. **단계별 진행**: 한 번에 모든 것을 요청하지 않기
5. **패턴 준수**: 기존 코드 패턴 참조

이 가이드를 따라 프롬프트를 작성하면 AI가 더 정확하고 효율적으로 작업할 수 있습니다.

