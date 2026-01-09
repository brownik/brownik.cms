# 마이그레이션 FAQ

## 자주 묻는 질문

### Q1: 문서만으로 정말 Next.js 프로젝트를 작성할 수 있나요?

**A: 네, 가능합니다!**

다음 문서들이 모두 준비되어 있습니다:
- `11_NextJS_Frontend_Guide.md` - 완전한 Next.js 프로젝트 구조 및 구현 예시
- `13_Spring_Boot_REST_API_Guide.md` - Spring Boot REST API 구현 가이드
- `12_Complete_Migration_Strategy.md` - 전체 마이그레이션 전략

각 문서에는:
- ✅ 실제 실행 가능한 코드 예시
- ✅ 완전한 프로젝트 구조
- ✅ 설정 파일 예시
- ✅ 단계별 가이드

### Q2: Supabase로 마이그레이션하면서 Schema도 변경해야 하나요?

**A: 선택 사항입니다.**

두 가지 옵션이 있습니다:

#### 옵션 1: Schema 유지 (권장 - 빠른 마이그레이션)
- 기존 테이블명과 컬럼명 유지
- 코드 변경 최소화
- 빠른 마이그레이션 가능

#### 옵션 2: Schema 변경 (권장 - 장기적 관점)
- PostgreSQL/Supabase 표준 관례 적용
- `NU_MEMBER` → `members`
- `KEY` → `id`
- `USERID` → `user_id`
- 더 명확하고 유지보수하기 쉬움
- Supabase Auth와의 통합 용이

**문서 제공**: `10_Supabase_Migration_Guide.md`에 두 가지 방법 모두 설명되어 있습니다.

### Q3: MariaDB를 그대로 사용하면서 React로만 전환할 수 있나요?

**A: 네, 가능합니다!**

단계별 접근:
1. **1단계**: Next.js 프론트엔드 개발 (MariaDB 유지)
   - `11_NextJS_Frontend_Guide.md` 참고
   - 기존 Spring MVC를 RESTful API로 변환
   - Next.js로 프론트엔드 개발 (SSR/SSG 활용)

2. **2단계**: Supabase 마이그레이션 (나중에)
   - `10_Supabase_Migration_Guide.md` 참고
   - 데이터베이스만 마이그레이션
   - Supabase Auth, Realtime, Storage 기능 활용 가능

### Q4: 기존 JSP 코드를 Next.js로 변환하는 방법은?

**A: 단계별 변환 가이드가 있습니다.**

`11_NextJS_Frontend_Guide.md`에 다음이 포함되어 있습니다:
- JSP → Next.js 컴포넌트 변환 예시
- Server Component와 Client Component 구분
- SSR/SSG/ISR 전략
- 기존 API를 RESTful API로 변환 방법
- 상태 관리 및 라우팅 설정

### Q5: 마이그레이션 중 서비스 중단이 필요한가요?

**A: 선택 가능합니다.**

`12_Complete_Migration_Strategy.md`에 두 가지 방법이 설명되어 있습니다:

1. **다운타임 마이그레이션** (간단)
   - 서비스 중단 필요
   - 구현이 간단하고 빠름

2. **무중단 마이그레이션** (복잡)
   - Dual Write 방식
   - 서비스 중단 없음
   - 구현이 복잡함

### Q6: 예상 소요 시간은?

**A: 단계별로 다릅니다.**

#### 기존 스택으로 구축
- 빠른 시작: 4-5시간
- 전체 구현: 1-2주

#### 마이그레이션 (Supabase + Next.js)
- 전체 마이그레이션: 12-20주 (3-5개월)
  - 준비: 2주
  - 백엔드: 4주
  - 프론트엔드: 6주 (Next.js SSR/SSG 활용)
  - 통합/테스트: 2주
  - 배포: 1주

### Q7: 기존 데이터는 어떻게 마이그레이션하나요?

**A: 마이그레이션 스크립트가 제공됩니다.**

`10_Supabase_Migration_Guide.md`에 다음이 포함되어 있습니다:
- Python 마이그레이션 스크립트 예시
- 데이터 검증 방법
- Supabase Auth 통합 방법
- RLS 정책 설정
- 롤백 절차

### Q8: Next.js와 Spring Boot를 어떻게 통합하나요?

**A: 두 가지 방법이 있습니다.**

#### 방법 1: 분리 배포 (권장 - 개발 환경)
- Next.js: `http://localhost:3000`
- Spring Boot: `http://localhost:8080`
- CORS 설정으로 통신

#### 방법 2: 통합 배포 (권장 - 운영 환경)
- Next.js 빌드 결과물을 Spring Boot의 `static/` 폴더에 배치
- 단일 JAR 파일로 배포
- 또는 Next.js를 독립적으로 배포 (Vercel 등)

#### 방법 3: Next.js API Routes 활용 (선택적)
- 일부 API를 Next.js API Routes로 구현
- Spring Boot는 주요 비즈니스 로직만 처리

`11_NextJS_Frontend_Guide.md`에 두 방법 모두 설명되어 있습니다.

### Q9: 기존 암호화 로직은 그대로 사용할 수 있나요?

**A: 네, 가능합니다.**

`07_Implementation_Code_Examples.md`에 다음이 포함되어 있습니다:
- `EncryptionUtil.java` - SHA-256, DES 암호화/복호화
- 기존 암호화 로직 그대로 사용 가능

### Q10: 동적 테이블 생성 기능은 어떻게 처리하나요?

**A: Supabase(PostgreSQL)에서도 가능합니다.**

`02_Service_Logic_Analysis.md`에 동적 테이블 생성 로직이 분석되어 있고,
Supabase(PostgreSQL)에서도 동일한 방식으로 구현 가능합니다:

```sql
-- Supabase(PostgreSQL)에서도 CREATE TABLE 동적 실행 가능
EXECUTE format('CREATE TABLE %I (...)', table_name);
```

**주의**: Supabase의 RLS 정책도 동적으로 생성해야 할 수 있습니다.

### Q11: 문서만으로 정말 처음부터 만들 수 있나요?

**A: 네, 가능합니다!**

다음 문서들이 완전한 가이드를 제공합니다:

1. **데이터베이스**: `04_Database_DDL_Script.md` (MariaDB) 또는 `10_Supabase_Migration_Guide.md` (Supabase)
2. **백엔드**: `05_Project_Structure_Configuration.md` (Spring MVC) 또는 `13_Spring_Boot_REST_API_Guide.md` (Spring Boot)
3. **프론트엔드**: `11_NextJS_Frontend_Guide.md` (Next.js)
4. **API**: `06_API_Specification.md` (기존) + `13_Spring_Boot_REST_API_Guide.md` (RESTful)
5. **코드 예시**: `07_Implementation_Code_Examples.md`
6. **배포**: `08_Deployment_Guide.md`

각 문서에는 실제 실행 가능한 코드와 설정 파일이 포함되어 있습니다.

### Q12: 마이그레이션 중 기존 시스템과 병행 운영이 가능한가요?

**A: 가능합니다!**

`12_Complete_Migration_Strategy.md`에 점진적 마이그레이션 전략이 설명되어 있습니다:

- 모듈별로 순차적으로 마이그레이션
- 기존 시스템과 새 시스템 병행 운영
- 검증 후 점진적 전환

### Q13: 문서에 없는 기능은 어떻게 하나요?

**A: 패턴을 따라 확장하세요.**

문서에 제공된 패턴을 따라:
1. Entity 설계 패턴 (`13_Spring_Boot_REST_API_Guide.md`)
2. Service 구현 패턴 (`07_Implementation_Code_Examples.md`)
3. Controller 구현 패턴 (`13_Spring_Boot_REST_API_Guide.md`)
4. Next.js 컴포넌트 패턴 (`11_NextJS_Frontend_Guide.md`)
5. Server Component 및 Client Component 구분 (`11_NextJS_Frontend_Guide.md`)

이 패턴들을 따라 새로운 기능을 구현할 수 있습니다.

## 결론

**문서만으로 완전히 구축 가능합니다!**

- ✅ 기존 스택 (MariaDB + JSP) 구축 가능
- ✅ 마이그레이션 (Supabase + Next.js) 구축 가능
- ✅ 모든 코드 예시와 설정 파일 제공
- ✅ 단계별 가이드 제공
- ✅ Next.js SSR/SSG/ISR 전략 포함

**시작 방법**:
1. `12_Complete_Migration_Strategy.md` 읽기 (전체 계획 파악)
2. `09_Quick_Start_Guide.md` 또는 `11_NextJS_Frontend_Guide.md` 따라하기
3. 단계별로 진행

