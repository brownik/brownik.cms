# townE 시스템 구축 문서

## 📚 문서 개요

이 폴더에는 townE 시스템을 처음부터 구축하기 위한 모든 문서가 포함되어 있습니다.

## 🗺️ 마이그레이션 로드맵

### 현재 상태
- **프론트엔드**: JSP
- **데이터베이스**: MariaDB

### 1단계: 첫 번째 리뉴얼 (Migration 및 신규 개발)
- **프론트엔드**: Next.js
- **데이터베이스**: MariaDB (기존 DB 유지, 연결 주소만 변경)
- **기간**: 약 12-16주

### 2단계: 두 번째 리뉴얼 (Migration 및 디자인 리뉴얼)
- **프론트엔드**: Next.js (유지)
- **데이터베이스**: Supabase (스키마 변환 필수)
- **기간**: 약 8-12주

**중요**: MariaDB와 PostgreSQL(Supabase) 간 문법 차이로 인해 **스키마 변환이 필수**입니다. 자세한 내용은 `20_Supabase_Schema_Conversion_Guide.md`를 참고하세요.

**상세 계획**: `18_Migration_Roadmap.md` 참고

## 📋 문서 목록

### 시작 가이드

0. **[00_Quick_Start_Prompt.md](./00_Quick_Start_Prompt.md)** 🚀 **시작하기** (새 환경에서 첫 프롬프트)
   - 복사해서 바로 사용할 수 있는 프롬프트 템플릿
   - 단계별 작업 프롬프트
   - 상황별 프롬프트 예시
   - 빠른 참조 가이드

0-1. **[00_AI_Prompting_Guide.md](./00_AI_Prompting_Guide.md)** 📖 상세 가이드 (AI 사용 시)
   - AI에게 프로젝트를 이해시키는 방법
   - 효과적인 프롬프트 작성법
   - 상황별 프롬프트 템플릿
   - 단계별 요청 예시

### 필수 문서 (구축에 반드시 필요)

1. **[04_Database_DDL_Script.md](./04_Database_DDL_Script.md)** 🔴 필수
   - 완전한 데이터베이스 DDL 스크립트
   - 모든 테이블 CREATE 문
   - 외래키 제약조건
   - 인덱스 설정
   - 초기 데이터 (시드 데이터)

2. **[05_Project_Structure_Configuration.md](./05_Project_Structure_Configuration.md)** 🔴 필수
   - Maven 프로젝트 구조
   - 완전한 pom.xml
   - web.xml 설정
   - Spring 설정 파일들 (context-*.xml)
   - MyBatis 설정
   - Tiles 설정
   - 로깅 설정

3. **[06_API_Specification.md](./06_API_Specification.md)** 🔴 필수
   - 모든 API 엔드포인트 정의
   - Request/Response 스키마
   - 인증 및 권한
   - 페이징 및 검색
   - 에러 코드

4. **[07_Implementation_Code_Examples.md](./07_Implementation_Code_Examples.md)** 🔴 필수
   - 핵심 기능 구현 코드 예시
   - MemberVO, Service, Controller 완전한 예시
   - MyBatis Mapper XML 예시
   - 암호화 유틸리티
   - 세션 유틸리티

5. **[08_Deployment_Guide.md](./08_Deployment_Guide.md)** 🔴 필수
   - 시스템 요구사항
   - 환경 설정 (Java, MariaDB, Tomcat, Maven)
   - 빌드 및 배포 절차
   - Nginx 리버스 프록시 설정
   - SSL 인증서 설정
   - 백업 전략
   - 성능 튜닝
   - 문제 해결

6. **[09_Quick_Start_Guide.md](./09_Quick_Start_Guide.md)** 🟡 권장
   - 빠른 시작 가이드
   - 단계별 체크리스트
   - 예상 소요 시간
   - 문제 해결

### 마이그레이션 로드맵

7. **[18_Migration_Roadmap.md](./18_Migration_Roadmap.md)** 🗺️ **필수** (전체 계획)
   - 단계별 마이그레이션 계획
   - Phase 1: Next.js + MariaDB (첫 번째 리뉴얼)
   - Phase 2: Next.js + Supabase (두 번째 리뉴얼)
   - 일정 및 체크리스트
   - 리스크 관리

### Phase 1: Next.js + MariaDB (첫 번째 리뉴얼)

8. **[15_NextJS_MariaDB_Start_Guide.md](./15_NextJS_MariaDB_Start_Guide.md)** 🔴 필수
    - Next.js + MariaDB 조합으로 시작하는 가이드
    - Spring Boot REST API 설정
    - Next.js 프로젝트 설정
    - 기존 데이터베이스 사용 (연결 주소만 변경)
    - 추후 Supabase 마이그레이션 고려사항 포함

9. **[19_Database_Connection_Guide.md](./19_Database_Connection_Guide.md)** 🟡 권장
    - 데이터베이스 연결 설정 가이드
    - Phase 1: MariaDB 연결 설정
    - Phase 2: Supabase 연결 설정
    - 스키마 유지 전략

10. **[11_NextJS_Frontend_Guide.md](./11_NextJS_Frontend_Guide.md)** 🔴 필수
    - Next.js 프로젝트 구조
    - TypeScript 타입 정의
    - API 클라이언트 구현
    - Server Component 및 Client Component 예시
    - SSR/SSG/ISR 활용
    - 상태 관리 및 라우팅

11. **[13_Spring_Boot_REST_API_Guide.md](./13_Spring_Boot_REST_API_Guide.md)** 🔴 필수
    - Spring Boot 프로젝트 설정
    - JPA Entity 설계 (MariaDB용, 기존 스키마 유지)
    - RESTful API 구현
    - 예외 처리 및 보안 설정

### Phase 2: Next.js + Supabase (두 번째 리뉴얼)

12. **[10_Supabase_Migration_Guide.md](./10_Supabase_Migration_Guide.md)** 🔴 필수 (Phase 2 시)
    - MariaDB → Supabase 마이그레이션 전략
    - 데이터 타입 매핑
    - Supabase Auth, Realtime, Storage 활용
    - Row Level Security (RLS) 설정
    - 마이그레이션 스크립트
    - 검증 및 테스트

13. **[20_Supabase_Schema_Conversion_Guide.md](./20_Supabase_Schema_Conversion_Guide.md)** 🔴 필수 (Phase 2 시)
    - **스키마 변환 필수 가이드**
    - AUTO_INCREMENT → SERIAL 변환
    - ON UPDATE CURRENT_TIMESTAMP → 트리거 생성
    - 예약어 처리 (백틱 → 따옴표)
    - 인덱스 및 제약조건 변환
    - 실제 변환 예시 및 체크리스트
    - 자동 변환 스크립트 예시

14. **[12_Complete_Migration_Strategy.md](./12_Complete_Migration_Strategy.md)** 🔴 필수 (전체 마이그레이션)
    - 통합 마이그레이션 전략
    - 단계별 로드맵
    - 스키마 변환 전략 (필수)
    - 위험 관리 및 롤백 계획
    - Spring Boot REST API (MariaDB용)
    - Supabase 마이그레이션 준비 사항 (Phase 2)
    - 단계별 구축 가이드

12. **[14_Migration_FAQ.md](./14_Migration_FAQ.md)** 🟡 권장
    - 마이그레이션 관련 자주 묻는 질문
    - 문서 사용법 가이드

### 분석 문서 (참고용)

13. **[01_Rendering_Engine.md](./01_Rendering_Engine.md)**
    - 홈페이지 렌더링 엔진 분석
    - DB 저장형 소스 코드 구조
    - Tiles 템플릿 시스템

14. **[02_Service_Logic_Analysis.md](./02_Service_Logic_Analysis.md)**
    - 서비스 비즈니스 로직 심층 분석
    - 인증 및 권한 로직
    - 동적 테이블 생성 시스템

15. **[03_Migration_Risk_Report.md](./03_Migration_Risk_Report.md)**
    - 마이그레이션 차단 요소 식별
    - 리스크 분석
    - 마이그레이션 로드맵

16. **[16_CMS_DB_Source_Analysis.md](./16_CMS_DB_Source_Analysis.md)**
    - CMS DB 저장형 홈페이지 소스 코드 분석
    - 소스 코드 추출 방법
    - 마이그레이션 전략

17. **[17_DB_Source_Extraction_Summary.md](./17_DB_Source_Extraction_Summary.md)** ✅ 완료
    - 실제 DB에서 추출된 소스 코드 요약
    - 추출 통계 및 파일 목록
    - 다음 단계 가이드

### 유틸리티

18. **[extract_db_sources.py](./extract_db_sources.py)**
    - DB 저장형 소스 코드 추출 스크립트
    - NU_CONTENTS, NU_LAYOUT, NU_BOARD, NU_BOARD_SKIN, NU_MENU 추출
    - 실제 DB에서 소스 코드를 파일로 추출

## 🚀 빠른 시작

### AI를 사용하는 경우

**먼저 읽어야 할 문서**:
- `00_Quick_Start_Prompt.md` - **바로 사용할 수 있는 프롬프트 템플릿** ⭐
- `00_AI_Prompting_Guide.md` - 상세 프롬프팅 가이드

**초기 프롬프트 (복사해서 사용하세요)**:
```
townE 프로젝트를 새롭게 시작하려고 합니다.

프로젝트 정보:
- 현재: JSP + MariaDB
- Phase 1: Next.js + MariaDB (첫 번째 리뉴얼)
- Phase 2: Next.js + Supabase (두 번째 리뉴얼)
- 문서 위치: /new_analysis_docs 폴더

마이그레이션 계획:
1. Phase 1: 프론트엔드를 Next.js로 전환 (데이터베이스는 MariaDB 유지)
2. Phase 2: 데이터베이스를 Supabase로 전환 및 디자인 리뉴얼

먼저 README.md와 18_Migration_Roadmap.md를 읽고 전체 계획을 파악한 후,
15_NextJS_MariaDB_Start_Guide.md를 읽고,
프로젝트 구조를 이해한 후 시작 가이드를 제시해주세요.
```

### 직접 구축하는 경우

1. **먼저 읽어야 할 문서**:
   - `15_NextJS_MariaDB_Start_Guide.md` - Next.js + MariaDB 시작 가이드 (Supabase 마이그레이션 고려)
   - `04_Database_DDL_Script.md` - 데이터베이스 스키마
   - `09_Quick_Start_Guide.md` - 빠른 시작 가이드

2. **순서대로 진행**:
   ```
   1. 환경 준비 (Java 17, Maven, MariaDB, Node.js)
   2. 데이터베이스 생성 및 DDL 실행
   3. Spring Boot 프로젝트 생성 및 설정
   4. Next.js 프로젝트 생성 및 설정
   5. 핵심 코드 구현
   6. 빌드 및 실행
   7. 초기 데이터 설정
   ```

3. **예상 소요 시간**: 4-5시간 (빠른 시작 기준)

## ✅ 구축 가능 여부

### 현재 상태: **완전히 구축 가능** ✅

다음 문서들이 모두 준비되어 있어 새 환경에서 작업 가능합니다:

#### 기본 구축 (기존 스택)
- ✅ 완전한 DB DDL 스크립트 (MariaDB)
- ✅ 프로젝트 구조 및 설정 파일 (Spring MVC + JSP)
- ✅ API 명세서
- ✅ 구현 코드 예시
- ✅ 배포 가이드
- ✅ 빠른 시작 가이드

#### Phase 2: 두 번째 리뉴얼 (Next.js + Supabase)
- ✅ Supabase 마이그레이션 가이드
- ✅ React 프론트엔드 가이드
- ✅ 통합 마이그레이션 전략
- ✅ Spring Boot REST API 가이드

### 필요한 것

1. **소프트웨어**:
   - Java 8+
   - Maven 3.6+
   - MariaDB 10.3+ 또는 MySQL 5.7+
   - Apache Tomcat 8.5+ (또는 Maven Tomcat Plugin)

2. **문서**:
   - 위의 모든 문서 (이미 준비됨)

3. **시간**:
   - 빠른 시작: 4-5시간
   - 전체 구현: 1-2주

## 📖 문서 사용 가이드

### 개발자용

#### 기존 스택으로 구축 (MariaDB + JSP)
1. **처음 시작하는 경우**:
   - `09_Quick_Start_Guide.md` → `04_Database_DDL_Script.md` → `05_Project_Structure_Configuration.md` → `07_Implementation_Code_Examples.md`

2. **API 개발 시**:
   - `06_API_Specification.md` 참고

3. **배포 시**:
   - `08_Deployment_Guide.md` 참고

#### Phase 1: 첫 번째 리뉴얼 (Next.js + MariaDB)
1. **전체 계획 파악**:
   - `18_Migration_Roadmap.md` 먼저 읽기 (전체 마이그레이션 계획)
   
2. **Next.js + MariaDB 시작**:
   - `15_NextJS_MariaDB_Start_Guide.md` 읽기
   - Spring Boot REST API (MariaDB) + Next.js 프론트엔드
   - 기존 JSP 기능을 Next.js로 마이그레이션

#### Phase 2: 두 번째 리뉴얼 (Next.js + Supabase)
1. **전체 마이그레이션 계획**:
   - `18_Migration_Roadmap.md`의 Phase 2 섹션 먼저 읽기
   - `12_Complete_Migration_Strategy.md` 참고

2. **Supabase 마이그레이션**:
   - `10_Supabase_Migration_Guide.md` 참고
   - MariaDB → Supabase 데이터베이스 마이그레이션
   - Schema 변경 포함

3. **디자인 리뉴얼**:
   - Next.js 컴포넌트 리뉴얼
   - UI/UX 개선

4. **통합 및 배포**:
   - `18_Migration_Roadmap.md`의 Phase 2 체크리스트 참고

### 아키텍트/기획자용

1. **시스템 이해**:
   - `01_Rendering_Engine.md` - 렌더링 엔진 구조
   - `02_Service_Logic_Analysis.md` - 비즈니스 로직

2. **마이그레이션 계획**:
   - `18_Migration_Roadmap.md` - 단계별 마이그레이션 로드맵 (필수)
   - `03_Migration_Risk_Report.md` - 기존 리스크 분석
   - `12_Complete_Migration_Strategy.md` - 완전한 마이그레이션 전략

## 🔧 문제 해결

### 문서 관련 문제

- **문서가 부족한 경우**: 각 문서의 "다음 단계" 섹션 확인
- **설명이 부족한 경우**: 해당 문서의 코드 예시 참고

### 기술적 문제

- **빌드 실패**: `08_Deployment_Guide.md`의 문제 해결 섹션 참고
- **데이터베이스 연결 실패**: `08_Deployment_Guide.md`의 환경 설정 섹션 참고
- **애플리케이션 실행 실패**: `09_Quick_Start_Guide.md`의 문제 해결 섹션 참고

## 📝 문서 업데이트 이력

- **2024-01-XX**: 초기 문서 작성
  - DB DDL 스크립트 완성
  - 프로젝트 구조 및 설정 파일 완성
  - API 명세서 완성
  - 구현 코드 예시 완성
  - 배포 가이드 완성
  - 빠른 시작 가이드 추가

- **2024-01-XX**: 마이그레이션 문서 추가
  - Supabase 마이그레이션 가이드 추가
  - Next.js 프론트엔드 가이드 추가
  - 통합 마이그레이션 전략 추가
  - Spring Boot REST API 가이드 추가
  - Next.js + MariaDB 시작 가이드 추가
  - 마이그레이션 FAQ 추가

- **2026-01-08**: 단계별 마이그레이션 계획 명확화
  - 마이그레이션 로드맵 문서 추가 (`18_Migration_Roadmap.md`)
  - Phase 1: Next.js + MariaDB (첫 번째 리뉴얼)
  - Phase 2: Next.js + Supabase (두 번째 리뉴얼)
  - 프롬프트 가이드 업데이트
  - 모든 문서에 단계별 계획 반영

## 🤝 기여

문서에 오류가 있거나 개선 사항이 있으면 알려주세요.

## 📞 문의

문서 관련 문의사항이 있으면 이슈를 등록해주세요.

## 📄 라이선스

이 문서는 프로젝트 내부 사용을 위한 것입니다.

