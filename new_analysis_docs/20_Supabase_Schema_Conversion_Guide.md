# Supabase 스키마 변환 가이드

## 개요

이 문서는 MariaDB 스키마를 Supabase (PostgreSQL)로 마이그레이션할 때 필요한 **실제 스키마 변환** 가이드를 제공합니다.

**중요**: 단순히 연결 주소만 변경하는 것이 아니라, MariaDB와 PostgreSQL 간의 문법 및 기능 차이로 인해 **스키마 변환이 필수**입니다.

## 1. 필수 변환 사항

### 1.1 AUTO_INCREMENT → SERIAL / IDENTITY

**MariaDB**:
```sql
CREATE TABLE NU_MEMBER (
    `KEY` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ...
);
```

**PostgreSQL (Supabase)**:
```sql
CREATE TABLE "NU_MEMBER" (
    "KEY" SERIAL PRIMARY KEY,  -- 또는 GENERATED ALWAYS AS IDENTITY
    ...
);
```

**또는**:
```sql
CREATE TABLE "NU_MEMBER" (
    "KEY" INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ...
);
```

**주의**: 기존 데이터를 마이그레이션할 때는 시퀀스를 수동으로 설정해야 합니다.

### 1.2 예약어 처리: 백틱(`) → 따옴표(")

**MariaDB**:
```sql
CREATE TABLE NU_MEMBER (
    `KEY` INT PRIMARY KEY,
    `STATUS` VARCHAR(1),
    ...
);
```

**PostgreSQL (Supabase)**:
```sql
CREATE TABLE "NU_MEMBER" (
    "KEY" INTEGER PRIMARY KEY,
    "STATUS" VARCHAR(1),
    ...
);
```

**필수 변환 대상**:
- `KEY` → "KEY"
- `STATUS` → "STATUS"
- `VIEW` → "VIEW" (NU_BOARD_SKIN 테이블)

### 1.3 ON UPDATE CURRENT_TIMESTAMP → 트리거

**MariaDB**:
```sql
CREATE TABLE NU_MEMBER (
    ...
    UPDATEDATE TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    ...
);
```

**PostgreSQL (Supabase)**:
```sql
CREATE TABLE "NU_MEMBER" (
    ...
    "UPDATEDATE" TIMESTAMP NULL DEFAULT NULL,
    ...
);

-- 트리거 함수 생성
CREATE OR REPLACE FUNCTION update_updatedate_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."UPDATEDATE" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
CREATE TRIGGER update_nu_member_updatedate
    BEFORE UPDATE ON "NU_MEMBER"
    FOR EACH ROW
    EXECUTE FUNCTION update_updatedate_column();
```

**영향받는 테이블**:
- `NU_MEMBER` (UPDATEDATE)
- `NU_BOARD_ITEM` (UPDATEDATE)
- 기타 UPDATEDATE 필드가 있는 모든 테이블

### 1.4 ENGINE 및 CHARSET 제거

**MariaDB**:
```sql
CREATE TABLE NU_MEMBER (
    ...
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**PostgreSQL (Supabase)**:
```sql
CREATE TABLE "NU_MEMBER" (
    ...
);  -- ENGINE, CHARSET, COLLATE 제거

-- 인코딩은 데이터베이스 레벨에서 설정
CREATE DATABASE towne WITH ENCODING 'UTF8';
```

### 1.5 COMMENT 문법 변경

**MariaDB**:
```sql
CREATE TABLE NU_MEMBER (
    `KEY` INT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '회원 키',
    USERID VARCHAR(50) NOT NULL COMMENT '사용자 ID',
    ...
) COMMENT='회원 정보 테이블';
```

**PostgreSQL (Supabase)**:
```sql
CREATE TABLE "NU_MEMBER" (
    "KEY" SERIAL PRIMARY KEY,
    "USERID" VARCHAR(50) NOT NULL,
    ...
);

-- COMMENT는 별도로 추가
COMMENT ON TABLE "NU_MEMBER" IS '회원 정보 테이블';
COMMENT ON COLUMN "NU_MEMBER"."KEY" IS '회원 키';
COMMENT ON COLUMN "NU_MEMBER"."USERID" IS '사용자 ID';
```

### 1.6 인덱스 문법 변경

**MariaDB**:
```sql
CREATE TABLE NU_MEMBER (
    ...
    UNIQUE KEY uk_userid (USERID),
    INDEX idx_status (`STATUS`),
    INDEX idx_email (EMAIL(100)),  -- 부분 인덱스
    ...
);
```

**PostgreSQL (Supabase)**:
```sql
CREATE TABLE "NU_MEMBER" (
    ...
);

-- 인덱스는 별도로 생성
CREATE UNIQUE INDEX uk_userid ON "NU_MEMBER" ("USERID");
CREATE INDEX idx_status ON "NU_MEMBER" ("STATUS");
CREATE INDEX idx_email ON "NU_MEMBER" (SUBSTRING("EMAIL", 1, 100));  -- 부분 인덱스
```

### 1.7 TIMESTAMP 타입 차이

**MariaDB**:
```sql
INSERTDATE TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
```

**PostgreSQL (Supabase)**:
```sql
"INSERTDATE" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
-- 또는 타임존 포함
"INSERTDATE" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
```

**권장**: 타임존을 포함하는 `TIMESTAMP WITH TIME ZONE` 사용

### 1.8 외래키 제약조건 문법

**MariaDB**:
```sql
CREATE TABLE NU_MEMBER_SITE (
    `KEY` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    MEMBERKEY INT NOT NULL COMMENT '회원 키 (FK)',
    SITEKEY INT NOT NULL COMMENT '사이트 키 (FK)',
    ...
    FOREIGN KEY (MEMBERKEY) REFERENCES NU_MEMBER(`KEY`),
    FOREIGN KEY (SITEKEY) REFERENCES NU_SITE(`KEY`)
);
```

**PostgreSQL (Supabase)**:
```sql
CREATE TABLE "NU_MEMBER_SITE" (
    "KEY" SERIAL PRIMARY KEY,
    "MEMBERKEY" INTEGER NOT NULL,
    "SITEKEY" INTEGER NOT NULL,
    ...
    CONSTRAINT fk_member FOREIGN KEY ("MEMBERKEY") REFERENCES "NU_MEMBER"("KEY"),
    CONSTRAINT fk_site FOREIGN KEY ("SITEKEY") REFERENCES "NU_SITE"("KEY")
);

COMMENT ON COLUMN "NU_MEMBER_SITE"."MEMBERKEY" IS '회원 키 (FK)';
COMMENT ON COLUMN "NU_MEMBER_SITE"."SITEKEY" IS '사이트 키 (FK)';
```

## 2. 실제 변환 예시: NU_MEMBER 테이블

### 2.1 MariaDB 원본

```sql
CREATE TABLE NU_MEMBER (
    `KEY` INT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '회원 키',
    MEMBERTYPE VARCHAR(1) NOT NULL DEFAULT 'P' COMMENT '회원 타입',
    USERID VARCHAR(50) NOT NULL COMMENT '사용자 ID',
    USERPW VARCHAR(255) NOT NULL COMMENT '비밀번호',
    NAME VARCHAR(100) NOT NULL COMMENT '이름',
    `STATUS` VARCHAR(1) NOT NULL DEFAULT 'U' COMMENT '상태',
    INSERTDATE TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '등록일',
    UPDATEDATE TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
    UNIQUE KEY uk_userid (USERID),
    INDEX idx_status (`STATUS`),
    INDEX idx_email (EMAIL(100))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='회원 정보 테이블';
```

### 2.2 PostgreSQL (Supabase) 변환본

```sql
-- 테이블 생성
CREATE TABLE "NU_MEMBER" (
    "KEY" SERIAL PRIMARY KEY,
    "MEMBERTYPE" VARCHAR(1) NOT NULL DEFAULT 'P',
    "USERID" VARCHAR(50) NOT NULL,
    "USERPW" VARCHAR(255) NOT NULL,
    "NAME" VARCHAR(100) NOT NULL,
    "STATUS" VARCHAR(1) NOT NULL DEFAULT 'U',
    "INSERTDATE" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UPDATEDATE" TIMESTAMP WITH TIME ZONE NULL DEFAULT NULL
);

-- COMMENT 추가
COMMENT ON TABLE "NU_MEMBER" IS '회원 정보 테이블';
COMMENT ON COLUMN "NU_MEMBER"."KEY" IS '회원 키';
COMMENT ON COLUMN "NU_MEMBER"."MEMBERTYPE" IS '회원 타입';
COMMENT ON COLUMN "NU_MEMBER"."USERID" IS '사용자 ID';
COMMENT ON COLUMN "NU_MEMBER"."USERPW" IS '비밀번호';
COMMENT ON COLUMN "NU_MEMBER"."NAME" IS '이름';
COMMENT ON COLUMN "NU_MEMBER"."STATUS" IS '상태';
COMMENT ON COLUMN "NU_MEMBER"."INSERTDATE" IS '등록일';
COMMENT ON COLUMN "NU_MEMBER"."UPDATEDATE" IS '수정일';

-- 인덱스 생성
CREATE UNIQUE INDEX uk_userid ON "NU_MEMBER" ("USERID");
CREATE INDEX idx_status ON "NU_MEMBER" ("STATUS");
CREATE INDEX idx_email ON "NU_MEMBER" (SUBSTRING("EMAIL", 1, 100));

-- UPDATEDATE 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_nu_member_updatedate()
RETURNS TRIGGER AS $$
BEGIN
    NEW."UPDATEDATE" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_nu_member_updatedate
    BEFORE UPDATE ON "NU_MEMBER"
    FOR EACH ROW
    EXECUTE FUNCTION update_nu_member_updatedate();
```

## 3. 변환 체크리스트

### 3.1 필수 변환 항목

- [ ] `AUTO_INCREMENT` → `SERIAL` 또는 `GENERATED ALWAYS AS IDENTITY`
- [ ] 백틱(`) → 따옴표(") (예약어 컬럼)
- [ ] `ON UPDATE CURRENT_TIMESTAMP` → 트리거 생성
- [ ] `ENGINE=InnoDB` 제거
- [ ] `DEFAULT CHARSET=utf8mb4` 제거
- [ ] `COMMENT` → `COMMENT ON TABLE/COLUMN` 문법으로 변경
- [ ] 인라인 인덱스 → `CREATE INDEX` 문으로 분리
- [ ] `UNIQUE KEY` → `CREATE UNIQUE INDEX` 또는 `UNIQUE` 제약조건
- [ ] `TIMESTAMP` → `TIMESTAMP WITH TIME ZONE` (권장)

### 3.2 선택적 변환 항목

- [ ] 테이블명/컬럼명 대소문자 통일 (소문자 권장)
- [ ] 컬럼명 변경 (`KEY` → `id`, `USERID` → `user_id` 등)
- [ ] 날짜 타입 통일 (`TIMESTAMP WITH TIME ZONE`)

## 4. 자동 변환 스크립트

### 4.1 Python 변환 스크립트 예시

```python
import re

def convert_mariadb_to_postgresql(sql_file):
    """
    MariaDB DDL을 PostgreSQL DDL로 변환
    """
    with open(sql_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # AUTO_INCREMENT → SERIAL
    content = re.sub(r'INT\s+NOT\s+NULL\s+AUTO_INCREMENT', 'SERIAL', content)
    
    # 백틱 → 따옴표
    content = re.sub(r'`([^`]+)`', r'"\1"', content)
    
    # ON UPDATE CURRENT_TIMESTAMP 제거 (트리거로 대체)
    content = re.sub(r'ON\s+UPDATE\s+CURRENT_TIMESTAMP', '', content)
    
    # ENGINE=InnoDB 제거
    content = re.sub(r'ENGINE=InnoDB\s*', '', content)
    
    # DEFAULT CHARSET 제거
    content = re.sub(r'DEFAULT\s+CHARSET=\w+\s*', '', content)
    
    # COLLATE 제거
    content = re.sub(r'COLLATE=\w+\s*', '', content)
    
    # COMMENT 인라인 → 별도 문으로 변환 (복잡하므로 수동 변환 권장)
    
    return content
```

**주의**: 자동 변환은 완벽하지 않으므로 수동 검토 필수

## 5. 데이터 마이그레이션 시 주의사항

### 5.1 시퀀스 설정

기존 데이터를 마이그레이션할 때는 시퀀스를 현재 최대값으로 설정해야 합니다:

```sql
-- NU_MEMBER 테이블의 최대 KEY 값 확인
SELECT MAX("KEY") FROM "NU_MEMBER";

-- 시퀀스 설정
SELECT setval('"NU_MEMBER_KEY_seq"', (SELECT MAX("KEY") FROM "NU_MEMBER"));
```

### 5.2 타임존 처리

MariaDB의 TIMESTAMP는 타임존 정보가 없으므로, 마이그레이션 시 타임존을 명시해야 합니다:

```sql
-- 기존 데이터 마이그레이션 시
INSERT INTO "NU_MEMBER" ("INSERTDATE", ...)
VALUES (TIMESTAMP '2024-01-01 12:00:00' AT TIME ZONE 'Asia/Seoul', ...);
```

## 6. 변환된 전체 DDL 스크립트 생성

실제 변환 작업 시:
1. `04_Database_DDL_Script.md`의 모든 테이블을 변환
2. 트리거 함수 생성 스크립트 작성
3. 인덱스 생성 스크립트 작성
4. 외래키 제약조건 스크립트 작성
5. COMMENT 추가 스크립트 작성

**예상 작업량**: 약 50-100개 테이블 × 변환 작업 = 상당한 작업량

## 7. 검증 방법

### 7.1 스키마 검증

```sql
-- 테이블 목록 확인
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- 컬럼 확인
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'NU_MEMBER';

-- 인덱스 확인
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'NU_MEMBER';
```

### 7.2 데이터 검증

```sql
-- 레코드 수 비교
SELECT COUNT(*) FROM "NU_MEMBER";  -- PostgreSQL
SELECT COUNT(*) FROM NU_MEMBER;    -- MariaDB (원본)

-- 샘플 데이터 비교
SELECT * FROM "NU_MEMBER" ORDER BY "KEY" LIMIT 10;
```

## 8. 참고 문서

- `04_Database_DDL_Script.md` - 원본 MariaDB DDL 스크립트
- `10_Supabase_Migration_Guide.md` - Supabase 마이그레이션 전략
- PostgreSQL 공식 문서: https://www.postgresql.org/docs/

## 결론

**스키마 변환은 필수**입니다. 단순히 연결 주소만 변경하는 것이 아니라, MariaDB와 PostgreSQL 간의 문법 및 기능 차이로 인해 다음과 같은 작업이 필요합니다:

1. ✅ DDL 스크립트 변환 (필수)
2. ✅ 트리거 생성 (ON UPDATE CURRENT_TIMESTAMP 대체)
3. ✅ 시퀀스 설정 (기존 데이터 마이그레이션 시)
4. ✅ 인덱스 재생성
5. ✅ 외래키 제약조건 재생성
6. ✅ COMMENT 추가
7. ✅ 애플리케이션 코드 수정 (JPA Entity 등)

**예상 작업 시간**: 전체 스키마 변환 및 검증에 약 2-3주 소요 예상

