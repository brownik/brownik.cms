# Supabase 마이그레이션 가이드

## 개요

이 문서는 townE 시스템을 MariaDB에서 Supabase로 마이그레이션하기 위한 전략과 가이드를 제공합니다.

**중요 사항**:
- **스키마 변환이 필수**입니다. MariaDB와 PostgreSQL(Supabase) 간 문법 차이로 인해 DDL 변환이 필요합니다.
- 자세한 스키마 변환 가이드는 `20_Supabase_Schema_Conversion_Guide.md`를 참고하세요.
- 주요 변환 사항: AUTO_INCREMENT → SERIAL, ON UPDATE CURRENT_TIMESTAMP → 트리거, 예약어 처리 등

**Supabase란?**
- PostgreSQL 기반의 오픈소스 Firebase 대안
- 자동 생성되는 REST API 및 GraphQL API
- 내장 인증 시스템 (Auth)
- 실시간 기능 (Realtime)
- 파일 스토리지 (Storage)
- Row Level Security (RLS) 지원

## 1. 마이그레이션 전략

### 1.1 중요 원칙

**스키마 변환 필수**:
- MariaDB와 PostgreSQL(Supabase) 간 문법 차이로 인해 **스키마 변환이 필수**입니다
- 단순히 연결 주소만 변경하는 것이 아닙니다
- 주요 변환 사항:
  - `AUTO_INCREMENT` → `SERIAL` 또는 `GENERATED ALWAYS AS IDENTITY`
  - `ON UPDATE CURRENT_TIMESTAMP` → 트리거 생성
  - 백틱(`) → 따옴표(") (예약어 처리)
  - `ENGINE=InnoDB`, `CHARSET` 제거
  - 인덱스 문법 변경

### 1.2 단계별 마이그레이션 접근법

```
Phase 1: 준비 단계
├── Supabase 프로젝트 생성
├── 스키마 변환 계획 수립 (필수)
│   ├── DDL 스크립트 변환 (AUTO_INCREMENT → SERIAL 등)
│   ├── 트리거 생성 (ON UPDATE CURRENT_TIMESTAMP 대체)
│   ├── 인덱스 변환
│   └── 외래키 제약조건 변환
├── 데이터 타입 매핑 정의
├── Supabase Auth 전략 수립 (선택적)
└── 데이터 마이그레이션 스크립트 작성

Phase 2: 개발 환경 마이그레이션
├── Supabase 개발 프로젝트 구축
├── 변환된 스키마 적용 (DDL 실행)
├── 트리거 생성
├── 인덱스 및 제약조건 생성
├── 데이터 마이그레이션
├── 연결 주소 변경 (application.yml)
├── JPA Entity 수정 (필요시)
├── Auth 시스템 통합 (선택적)
├── RLS 정책 설정 (선택적)
└── 애플리케이션 코드 수정 및 테스트

Phase 3: 스테이징 환경 검증
├── 데이터 마이그레이션 테스트
├── Auth 기능 테스트
├── Realtime 기능 테스트
├── 성능 테스트
└── 기능 테스트

Phase 4: 운영 환경 마이그레이션
├── 백업
├── 다운타임 마이그레이션 또는
└── 무중단 마이그레이션 (Dual Write)
```

### 1.2 마이그레이션 방식 선택

#### 옵션 1: 다운타임 마이그레이션 (간단, 빠름)
- **장점**: 구현이 간단하고 빠름
- **단점**: 서비스 중단 필요
- **적용**: 트래픽이 적은 시간대

#### 옵션 2: 무중단 마이그레이션 (복잡, 안전)
- **장점**: 서비스 중단 없음
- **단점**: 구현이 복잡하고 시간 소요
- **적용**: 24/7 서비스 운영

## 2. 데이터 타입 매핑

### 2.1 MariaDB → Supabase (PostgreSQL) 타입 매핑

| MariaDB/MySQL | Supabase (PostgreSQL) | 비고 |
|--------------|----------------------|------|
| `INT` | `INTEGER` | 동일 |
| `BIGINT` | `BIGINT` | 동일 |
| `VARCHAR(n)` | `VARCHAR(n)` | 동일 |
| `TEXT` | `TEXT` | 동일 |
| `DATETIME` | `TIMESTAMP` | 타임존 고려 |
| `TIMESTAMP` | `TIMESTAMP WITH TIME ZONE` | 타임존 포함 |
| `DATE` | `DATE` | 동일 |
| `TIME` | `TIME` | 동일 |
| `DECIMAL(m,n)` | `NUMERIC(m,n)` | 동일 |
| `FLOAT` | `REAL` | 정밀도 차이 |
| `DOUBLE` | `DOUBLE PRECISION` | 동일 |
| `BOOLEAN` | `BOOLEAN` | MariaDB는 TINYINT(1) 사용 |
| `BLOB` | `BYTEA` | 바이너리 데이터 |
| `JSON` | `JSONB` | JSONB 권장 (인덱싱 가능) |
| `ENUM` | `CHECK` 제약조건 또는 별도 테이블 | ENUM 제한적 지원 |

### 2.2 주의사항

#### 예약어 처리
- MariaDB의 `KEY`, `STATUS` 등 예약어는 백틱(`)으로 감싸지 않음
- PostgreSQL에서는 따옴표(")로 감싸거나 이름 변경 권장

```sql
-- MariaDB
CREATE TABLE NU_MEMBER (
    `KEY` INT PRIMARY KEY,
    `STATUS` VARCHAR(1)
);

-- Supabase (PostgreSQL)
CREATE TABLE nu_member (
    id INT PRIMARY KEY,  -- KEY를 id로 변경 권장
    status VARCHAR(1)    -- 소문자로 변경
);
```

#### AUTO_INCREMENT → SERIAL/IDENTITY
```sql
-- MariaDB
`KEY` INT NOT NULL AUTO_INCREMENT PRIMARY KEY

-- Supabase (PostgreSQL)
id SERIAL PRIMARY KEY
-- 또는
id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY
```

## 3. Supabase 프로젝트 설정

### 3.1 Supabase 프로젝트 생성

1. [Supabase Dashboard](https://app.supabase.com) 접속
2. 새 프로젝트 생성
3. 프로젝트 설정:
   - Database Password 설정
   - Region 선택 (가장 가까운 지역)
   - Pricing Plan 선택

### 3.2 연결 정보 확인

```javascript
// .env 파일
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 4. 스키마 마이그레이션

### 4.1 스키마 유지 전략 (권장)

**기존 스키마 최대한 유지**:
- 테이블명과 컬럼명을 그대로 유지하는 것을 권장합니다
- PostgreSQL에서도 대문자와 예약어를 따옴표로 감싸면 사용 가능합니다

#### 옵션 1: 스키마 유지 (권장)

```sql
-- Supabase에서도 기존 스키마 그대로 사용 가능
CREATE TABLE "NU_MEMBER" (
    "KEY" SERIAL PRIMARY KEY,
    "USERID" VARCHAR(50),
    "INSERTDATE" TIMESTAMP DEFAULT NOW()
);
```

**장점**:
- 코드 변경 최소화
- 빠른 마이그레이션
- 리스크 최소화

#### 옵션 2: 스키마 변경 (선택적)

테이블명과 컬럼명을 PostgreSQL 표준에 맞게 변경:

```sql
-- Supabase (PostgreSQL 표준)
CREATE TABLE nu_member (
    id SERIAL PRIMARY KEY,  -- KEY → id
    user_id VARCHAR(50),    -- USERID → user_id
    created_at TIMESTAMP DEFAULT NOW()  -- INSERTDATE → created_at
);
```

**장점**:
- PostgreSQL 표준 준수
- 장기적 유지보수 용이

**단점**:
- 코드 변경 필요
- 마이그레이션 시간 증가

### 4.2 외래키 제약조건

```sql
-- MariaDB
ALTER TABLE NU_BOARD_ITEM
ADD CONSTRAINT fk_board
FOREIGN KEY (BOARDKEY) REFERENCES NU_BOARD(`KEY`);

-- Supabase
ALTER TABLE nu_board_item
ADD CONSTRAINT fk_board
FOREIGN KEY (board_key) REFERENCES nu_board(id)
ON DELETE CASCADE;
```

### 4.3 인덱스 생성

```sql
-- MariaDB
CREATE INDEX idx_userid ON NU_MEMBER(USERID);

-- Supabase
CREATE INDEX idx_user_id ON nu_member(user_id);
```

## 5. Supabase Auth 통합

### 5.1 기존 인증 시스템 마이그레이션

#### 옵션 1: Supabase Auth 사용 (권장)
- Supabase의 내장 인증 시스템 활용
- 소셜 로그인 (Google, GitHub 등) 지원
- 이메일/비밀번호 인증
- JWT 토큰 자동 관리

#### 옵션 2: 기존 인증 유지
- 기존 NU_MEMBER 테이블 유지
- Spring Boot에서 인증 처리
- Supabase는 데이터베이스로만 사용

### 5.2 Supabase Auth 설정

```sql
-- Supabase Auth는 자동으로 auth.users 테이블 생성
-- 기존 NU_MEMBER와 연동하는 방법:

-- 1. auth.users와 nu_member 연결
ALTER TABLE nu_member
ADD COLUMN auth_user_id UUID REFERENCES auth.users(id);

-- 2. 또는 auth.users를 직접 사용
-- 기존 NU_MEMBER 데이터를 auth.users로 마이그레이션
```

### 5.3 Row Level Security (RLS) 설정

```sql
-- RLS 활성화
ALTER TABLE nu_member ENABLE ROW LEVEL SECURITY;

-- 정책 생성 예시
CREATE POLICY "Users can view own profile"
ON nu_member
FOR SELECT
USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own profile"
ON nu_member
FOR UPDATE
USING (auth.uid() = auth_user_id);
```

## 6. 데이터 마이그레이션

### 6.1 마이그레이션 스크립트 예시

```python
# migrate_to_supabase.py
import pymysql
from supabase import create_client, Client
import os

# MariaDB 연결
mariadb_conn = pymysql.connect(
    host='192.168.0.141',
    port=3306,
    user='townE',
    password='townE',
    database='townE'
)

# Supabase 연결
supabase: Client = create_client(
    os.environ.get("SUPABASE_URL"),
    os.environ.get("SUPABASE_KEY")
)

# 데이터 마이그레이션
def migrate_members():
    cursor = mariadb_conn.cursor(pymysql.cursors.DictCursor)
    cursor.execute("SELECT * FROM NU_MEMBER")
    
    for row in cursor.fetchall():
        # 데이터 변환
        data = {
            'id': row['KEY'],
            'user_id': row['USERID'],
            'name': row['NAME'],
            'email': row['EMAIL'],
            'created_at': row['INSERTDATE']
        }
        
        # Supabase에 삽입
        supabase.table('nu_member').insert(data).execute()

migrate_members()
```

### 6.2 데이터 검증

```sql
-- 레코드 수 비교
SELECT COUNT(*) FROM NU_MEMBER;  -- MariaDB
SELECT COUNT(*) FROM nu_member;  -- Supabase

-- 데이터 무결성 검증
SELECT 
    (SELECT COUNT(*) FROM NU_MEMBER) as mariadb_count,
    (SELECT COUNT(*) FROM nu_member) as supabase_count;
```

## 7. 애플리케이션 코드 수정

### 7.1 Spring Boot 설정

#### application.yml (연결 주소만 변경)

**기존 MariaDB 설정**:
```yaml
spring:
  datasource:
    url: jdbc:mariadb://192.168.0.141:3306/townE?zeroDateTimeBehavior=convertToNull
    username: townE
    password: townE
    driver-class-name: org.mariadb.jdbc.Driver
```

**Supabase로 변경** (연결 주소만 변경):
```yaml
spring:
  datasource:
    # Supabase 연결 주소로 변경
    url: jdbc:postgresql://db.your-project.supabase.co:5432/postgres
    username: postgres
    password: ${SUPABASE_DB_PASSWORD}
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: validate  # 스키마 자동 생성 비활성화 (기존 스키마 사용)
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
```

**중요**: 스키마를 유지하는 경우, JPA Entity의 `@Table`과 `@Column` 이름을 그대로 유지하면 됩니다.

#### pom.xml
```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

### 7.2 JPA Entity 수정

#### 옵션 1: 기존 스키마 유지 (권장)

```java
@Entity
@Table(name = "NU_MEMBER")  // 기존 테이블명 유지
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "`KEY`")  // 기존 컬럼명 유지 (예약어는 따옴표 사용)
    private Long id;
    
    @Column(name = "USERID")  // 기존 컬럼명 유지
    private String userId;
    
    @Column(name = "INSERTDATE")  // 기존 컬럼명 유지
    private LocalDateTime insertDate;
    
    // ...
}
```

#### 옵션 2: 스키마 변경 (선택적)

```java
@Entity
@Table(name = "nu_member")  // 소문자로 변경
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")  // KEY → id
    private Long id;
    
    @Column(name = "user_id")  // USERID → user_id
    private String userId;
    
    @Column(name = "created_at")  // INSERTDATE → created_at
    private LocalDateTime createdAt;
    
    // ...
}
```

**권장**: 옵션 1 (기존 스키마 유지)을 권장합니다. 코드 변경이 최소화됩니다.

### 7.3 React 클라이언트 설정

```typescript
// supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## 8. Supabase 고급 기능 활용

### 8.1 Realtime 기능

```typescript
// 실시간 구독 예시
const channel = supabase
  .channel('board-items')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'nu_board_item' },
    (payload) => {
      console.log('New board item:', payload.new)
    }
  )
  .subscribe()
```

### 8.2 Storage 활용

```typescript
// 파일 업로드
const { data, error } = await supabase.storage
  .from('board-files')
  .upload('file-name.pdf', file)

// 파일 다운로드
const { data, error } = await supabase.storage
  .from('board-files')
  .getPublicUrl('file-name.pdf')
```

### 8.3 자동 생성 API 활용

Supabase는 자동으로 REST API와 GraphQL API를 생성합니다:

```typescript
// REST API 사용
const { data, error } = await supabase
  .from('nu_member')
  .select('*')
  .eq('status', 'active')

// GraphQL 사용 (Supabase GraphQL API)
```

## 9. 마이그레이션 체크리스트

### Phase 1: 준비
- [ ] Supabase 프로젝트 생성
- [ ] 스키마 설계 완료
- [ ] 데이터 타입 매핑 정의
- [ ] 마이그레이션 스크립트 작성

### Phase 2: 개발 환경
- [ ] 스키마 마이그레이션 완료
- [ ] 데이터 마이그레이션 완료
- [ ] Auth 시스템 통합
- [ ] RLS 정책 설정
- [ ] 애플리케이션 코드 수정

### Phase 3: 테스트
- [ ] 기능 테스트 완료
- [ ] 성능 테스트 완료
- [ ] 보안 테스트 완료
- [ ] 데이터 무결성 검증

### Phase 4: 운영
- [ ] 백업 완료
- [ ] 운영 환경 마이그레이션
- [ ] 모니터링 설정
- [ ] 롤백 계획 수립

## 10. 주의사항

### 10.1 성능 고려사항
- Supabase는 PostgreSQL 기반이므로 쿼리 성능 최적화 필요
- 인덱스 설계 중요
- Connection Pool 설정

### 10.2 보안 고려사항
- RLS 정책 철저히 설정
- Service Role Key는 서버에서만 사용
- Anon Key는 클라이언트에서 사용

### 10.3 비용 고려사항
- Supabase 무료 플랜 제한 확인
- 데이터베이스 크기 제한
- API 요청 수 제한
- Storage 용량 제한

## 11. 참고 자료

- [Supabase 공식 문서](https://supabase.com/docs)
- [PostgreSQL 문서](https://www.postgresql.org/docs/)
- [Supabase 마이그레이션 가이드](https://supabase.com/docs/guides/migrations)

## 12. 다음 단계

1. **Supabase 프로젝트 생성**: Dashboard에서 프로젝트 생성
2. **스키마 마이그레이션**: SQL Editor에서 스키마 생성
3. **데이터 마이그레이션**: 마이그레이션 스크립트 실행
4. **애플리케이션 통합**: Spring Boot 및 React 코드 수정
5. **테스트 및 검증**: 전체 기능 테스트

