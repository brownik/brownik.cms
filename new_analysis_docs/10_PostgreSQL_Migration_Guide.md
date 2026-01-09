# PostgreSQL 마이그레이션 가이드

## 개요

이 문서는 townE 시스템을 MariaDB에서 PostgreSQL로 마이그레이션하기 위한 전략과 가이드를 제공합니다.

## 1. 마이그레이션 전략

### 1.1 단계별 마이그레이션 접근법

```
Phase 1: 준비 단계
├── PostgreSQL 스키마 설계
├── 데이터 타입 매핑 정의
└── 마이그레이션 스크립트 작성

Phase 2: 개발 환경 마이그레이션
├── PostgreSQL 개발 DB 구축
├── 스키마 마이그레이션 테스트
└── 애플리케이션 코드 수정

Phase 3: 스테이징 환경 검증
├── 데이터 마이그레이션 테스트
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

### 2.1 MariaDB → PostgreSQL 타입 매핑

| MariaDB/MySQL | PostgreSQL | 비고 |
|--------------|------------|------|
| `INT` | `INTEGER` | 동일 |
| `BIGINT` | `BIGINT` | 동일 |
| `VARCHAR(n)` | `VARCHAR(n)` | 동일 |
| `TEXT` | `TEXT` | 동일 |
| `LONGTEXT` | `TEXT` | 크기 제한 없음 |
| `TIMESTAMP` | `TIMESTAMP` | 타임존 주의 |
| `DATETIME` | `TIMESTAMP` | PostgreSQL에는 DATETIME 없음 |
| `CHAR(1)` | `CHAR(1)` | 동일 |
| `TINYINT` | `SMALLINT` | -128~127 → -32768~32767 |
| `AUTO_INCREMENT` | `SERIAL` 또는 `GENERATED ALWAYS AS IDENTITY` | 시퀀스 사용 |
| `ENUM` | `VARCHAR` + CHECK 제약조건 | 또는 별도 테이블 |
| `JSON` | `JSONB` | JSONB 권장 (인덱싱 가능) |

### 2.2 주요 차이점

#### AUTO_INCREMENT
```sql
-- MariaDB
`KEY` INT NOT NULL AUTO_INCREMENT PRIMARY KEY

-- PostgreSQL
`KEY` INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY
-- 또는
`KEY` SERIAL PRIMARY KEY
```

#### TIMESTAMP 기본값
```sql
-- MariaDB
INSERTDATE TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

-- PostgreSQL
INSERTDATE TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
-- 동일하지만 타임존 설정 확인 필요
```

#### 문자열 연결
```sql
-- MariaDB
CONCAT('%', #{searchKeyword}, '%')

-- PostgreSQL
'%' || #{searchKeyword} || '%'
-- 또는 CONCAT 함수 사용 가능 (PostgreSQL 9.1+)
```

#### LIMIT/OFFSET
```sql
-- MariaDB
LIMIT #{startLimit}, #{recordCountPerPage}

-- PostgreSQL
LIMIT #{recordCountPerPage} OFFSET #{startLimit}
```

## 3. PostgreSQL 스키마 설계

### 3.1 네이밍 컨벤션 변경

#### 옵션 1: 기존 네이밍 유지 (권장)
- 장점: 코드 변경 최소화
- 단점: PostgreSQL 관례와 다름

#### 옵션 2: PostgreSQL 관례 적용
- 장점: 표준 관례 준수
- 단점: 코드 대량 변경 필요

**권장**: 옵션 1 (기존 네이밍 유지)

### 3.2 스키마 변환 예시

#### NU_MEMBER 테이블 변환

```sql
-- MariaDB 원본
CREATE TABLE NU_MEMBER (
    `KEY` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    MEMBERTYPE VARCHAR(1) NOT NULL DEFAULT 'P',
    USERID VARCHAR(50) NOT NULL,
    USERPW VARCHAR(255) NOT NULL,
    ...
    INSERTDATE TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ...
    UNIQUE KEY uk_userid (USERID),
    INDEX idx_status (`STATUS`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- PostgreSQL 변환
CREATE TABLE NU_MEMBER (
    "KEY" INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    MEMBERTYPE VARCHAR(1) NOT NULL DEFAULT 'P',
    USERID VARCHAR(50) NOT NULL,
    USERPW VARCHAR(255) NOT NULL,
    ...
    INSERTDATE TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ...
    CONSTRAINT uk_userid UNIQUE (USERID)
);

-- 인덱스는 별도로 생성
CREATE INDEX idx_status ON NU_MEMBER ("STATUS");
CREATE INDEX idx_membertype ON NU_MEMBER (MEMBERTYPE);
CREATE INDEX idx_insertdate ON NU_MEMBER (INSERTDATE);
```

### 3.3 외래키 제약조건

```sql
-- MariaDB
ALTER TABLE NU_MEMBER_SITE 
    ADD CONSTRAINT FK_MEMBER_SITE_MEMBER 
    FOREIGN KEY (MEMBERKEY) REFERENCES NU_MEMBER(`KEY`) ON DELETE CASCADE;

-- PostgreSQL
ALTER TABLE NU_MEMBER_SITE 
    ADD CONSTRAINT FK_MEMBER_SITE_MEMBER 
    FOREIGN KEY (MEMBERKEY) REFERENCES NU_MEMBER("KEY") ON DELETE CASCADE;
```

## 4. 애플리케이션 코드 변경

### 4.1 데이터소스 설정 변경

#### Spring 설정 (context-datasource.xml)

```xml
<!-- MariaDB -->
<bean id="dataSource" class="org.apache.commons.dbcp.BasicDataSource">
    <property name="driverClassName" value="org.mariadb.jdbc.Driver"/>
    <property name="url" value="jdbc:mariadb://localhost:3306/townE"/>
    <property name="username" value="townE"/>
    <property name="password" value="townE"/>
</bean>

<!-- PostgreSQL -->
<bean id="dataSource" class="org.apache.commons.dbcp.BasicDataSource">
    <property name="driverClassName" value="org.postgresql.Driver"/>
    <property name="url" value="jdbc:postgresql://localhost:5432/townE"/>
    <property name="username" value="townE"/>
    <property name="password" value="townE"/>
</bean>
```

#### pom.xml 의존성 변경

```xml
<!-- MariaDB 의존성 제거 -->
<!-- <dependency>
    <groupId>org.mariadb.jdbc</groupId>
    <artifactId>mariadb-java-client</artifactId>
    <version>1.7.2</version>
</dependency> -->

<!-- PostgreSQL 의존성 추가 -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <version>42.5.4</version>
</dependency>
```

### 4.2 MyBatis Mapper 변경

#### LIMIT/OFFSET 변경

```xml
<!-- MariaDB -->
<select id="getList" resultType="memberVO">
    SELECT * FROM NU_MEMBER
    WHERE STATUS != 'D'
    ORDER BY INSERTDATE DESC
    LIMIT #{startLimit}, #{recordCountPerPage}
</select>

<!-- PostgreSQL -->
<select id="getList" resultType="memberVO">
    SELECT * FROM NU_MEMBER
    WHERE STATUS != 'D'
    ORDER BY INSERTDATE DESC
    LIMIT #{recordCountPerPage} OFFSET #{startLimit}
</select>
```

#### 문자열 연결 변경

```xml
<!-- MariaDB -->
<if test="searchKeyword != null and searchKeyword != ''">
    AND TITLE LIKE CONCAT('%', #{searchKeyword}, '%')
</if>

<!-- PostgreSQL -->
<if test="searchKeyword != null and searchKeyword != ''">
    AND TITLE LIKE '%' || #{searchKeyword} || '%'
</if>
```

#### LAST_INSERT_ID() 변경

```xml
<!-- MariaDB -->
<selectKey keyProperty="key" resultType="int" order="AFTER">
    SELECT LAST_INSERT_ID();
</selectKey>

<!-- PostgreSQL -->
<selectKey keyProperty="key" resultType="int" order="AFTER">
    SELECT CURRVAL(pg_get_serial_sequence('NU_MEMBER', 'KEY'));
</selectKey>
<!-- 또는 -->
<selectKey keyProperty="key" resultType="int" order="BEFORE">
    SELECT nextval('nu_member_key_seq');
</selectKey>
```

### 4.3 Java 코드 변경

#### 예약어 처리

```java
// MariaDB에서는 백틱 사용
@Column(name = "`KEY`")

// PostgreSQL에서는 따옴표 사용
@Column(name = "\"KEY\"")
```

## 5. 마이그레이션 스크립트

### 5.1 스키마 마이그레이션 스크립트

```sql
-- PostgreSQL 스키마 생성 스크립트
-- 04_Database_DDL_Script.md를 PostgreSQL 형식으로 변환

-- 예시: NU_MEMBER 테이블
CREATE TABLE NU_MEMBER (
    "KEY" INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    MEMBERTYPE VARCHAR(1) NOT NULL DEFAULT 'P',
    USERID VARCHAR(50) NOT NULL,
    USERPW VARCHAR(255) NOT NULL,
    NAME VARCHAR(100) NOT NULL,
    NICKNAME VARCHAR(100),
    TEL VARCHAR(100),
    PHONE VARCHAR(100),
    FAX VARCHAR(100),
    EMAIL VARCHAR(200),
    AGE INTEGER,
    GENDER VARCHAR(1),
    ZIPCODE VARCHAR(10),
    ADDRESS1 VARCHAR(200),
    ADDRESS2 VARCHAR(200),
    BIRTHDAY VARCHAR(100),
    BIRTHDAYTYPE VARCHAR(1),
    EMAILAGREE VARCHAR(1) DEFAULT 'N',
    SMSAGREE VARCHAR(1) DEFAULT 'N',
    AGREEMENTDATE TIMESTAMP,
    MEMBERLEVEL VARCHAR(2) NOT NULL DEFAULT '0',
    "STATUS" VARCHAR(1) NOT NULL DEFAULT 'U',
    CERTTYPE VARCHAR(10),
    CERTKEY1 VARCHAR(100),
    CERTKEY2 VARCHAR(100),
    LASTLOGINDATE TIMESTAMP,
    LASTLOGINIP VARCHAR(50),
    LOGINFAILCOUNT INTEGER DEFAULT 0,
    INSERTDATE TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INSERTIP VARCHAR(50),
    INSERTMEMBERKEY INTEGER,
    UPDATEDATE TIMESTAMP,
    UPDATEIP VARCHAR(50),
    UPDATEMEMBERKEY INTEGER,
    DELETEDATE TIMESTAMP,
    DELETEIP VARCHAR(50),
    DELETEMEMBERKEY INTEGER,
    BUSINESSNUMBER VARCHAR(20),
    COMPANYNAME VARCHAR(200),
    CONSTRAINT uk_userid UNIQUE (USERID)
);

-- 인덱스 생성
CREATE INDEX idx_email ON NU_MEMBER (EMAIL);
CREATE INDEX idx_status ON NU_MEMBER ("STATUS");
CREATE INDEX idx_membertype ON NU_MEMBER (MEMBERTYPE);
CREATE INDEX idx_insertdate ON NU_MEMBER (INSERTDATE);
CREATE INDEX idx_memberlevel ON NU_MEMBER (MEMBERLEVEL);
```

### 5.2 데이터 마이그레이션 스크립트

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MariaDB에서 PostgreSQL로 데이터 마이그레이션 스크립트
"""

import pymysql
import psycopg2
from psycopg2.extras import execute_values

# MariaDB 연결
mariadb_conn = pymysql.connect(
    host='192.168.0.141',
    port=3306,
    user='townE',
    password='townE',
    database='townE',
    charset='utf8mb4'
)

# PostgreSQL 연결
postgresql_conn = psycopg2.connect(
    host='localhost',
    port=5432,
    user='townE',
    password='townE',
    database='townE'
)

def migrate_table(table_name, columns, batch_size=1000):
    """테이블 데이터 마이그레이션"""
    mariadb_cursor = mariadb_conn.cursor(pymysql.cursors.DictCursor)
    postgresql_cursor = postgresql_conn.cursor()
    
    # MariaDB에서 데이터 조회
    mariadb_cursor.execute(f"SELECT * FROM {table_name}")
    
    # 배치 단위로 처리
    while True:
        rows = mariadb_cursor.fetchmany(batch_size)
        if not rows:
            break
        
        # 데이터 변환 및 삽입
        values = []
        for row in rows:
            # 타입 변환 필요시 여기서 처리
            values.append(tuple(row.values()))
        
        # PostgreSQL에 삽입
        columns_str = ', '.join([f'"{col}"' for col in columns])
        placeholders = ', '.join(['%s'] * len(columns))
        query = f'INSERT INTO {table_name} ({columns_str}) VALUES ({placeholders})'
        
        execute_values(postgresql_cursor, query, values)
        postgresql_conn.commit()
        print(f"Migrated {len(rows)} rows from {table_name}")

# 마이그레이션 실행
migrate_table('NU_MEMBER', [
    'KEY', 'MEMBERTYPE', 'USERID', 'USERPW', 'NAME', 'NICKNAME',
    'TEL', 'PHONE', 'FAX', 'EMAIL', 'AGE', 'GENDER',
    'ZIPCODE', 'ADDRESS1', 'ADDRESS2', 'BIRTHDAY', 'BIRTHDAYTYPE',
    'EMAILAGREE', 'SMSAGREE', 'AGREEMENTDATE', 'MEMBERLEVEL', 'STATUS',
    'CERTTYPE', 'CERTKEY1', 'CERTKEY2', 'LASTLOGINDATE', 'LASTLOGINIP',
    'LOGINFAILCOUNT', 'INSERTDATE', 'INSERTIP', 'INSERTMEMBERKEY',
    'UPDATEDATE', 'UPDATEIP', 'UPDATEMEMBERKEY', 'DELETEDATE',
    'DELETEIP', 'DELETEMEMBERKEY', 'BUSINESSNUMBER', 'COMPANYNAME'
])

mariadb_conn.close()
postgresql_conn.close()
```

## 6. 검증 및 테스트

### 6.1 데이터 무결성 검증

```sql
-- 레코드 수 비교
SELECT 'NU_MEMBER' as table_name, COUNT(*) as mariadb_count
FROM NU_MEMBER@mariadb_link
UNION ALL
SELECT 'NU_MEMBER', COUNT(*) 
FROM NU_MEMBER;

-- 데이터 샘플 비교
SELECT * FROM NU_MEMBER@mariadb_link WHERE "KEY" = 1;
SELECT * FROM NU_MEMBER WHERE "KEY" = 1;
```

### 6.2 성능 테스트

```sql
-- 인덱스 사용 확인
EXPLAIN ANALYZE
SELECT * FROM NU_MEMBER WHERE USERID = 'testuser';

-- 쿼리 성능 비교
-- MariaDB와 PostgreSQL에서 동일 쿼리 실행 시간 비교
```

## 7. 롤백 계획

### 7.1 롤백 시나리오

1. **스키마 롤백**: PostgreSQL 스키마 삭제
2. **애플리케이션 롤백**: MariaDB 설정으로 복원
3. **데이터 롤백**: MariaDB 백업에서 복원

### 7.2 롤백 체크리스트

- [ ] MariaDB 백업 확인
- [ ] PostgreSQL 스키마 삭제 스크립트 준비
- [ ] 애플리케이션 설정 복원 스크립트 준비
- [ ] 롤백 테스트 완료

## 8. 마이그레이션 체크리스트

### 준비 단계
- [ ] PostgreSQL 설치 및 설정
- [ ] 스키마 설계 완료
- [ ] 데이터 타입 매핑 정의 완료
- [ ] 마이그레이션 스크립트 작성 완료

### 개발 환경
- [ ] PostgreSQL 개발 DB 구축
- [ ] 스키마 마이그레이션 테스트
- [ ] 애플리케이션 코드 수정 완료
- [ ] 단위 테스트 통과

### 스테이징 환경
- [ ] 데이터 마이그레이션 테스트
- [ ] 성능 테스트 완료
- [ ] 기능 테스트 완료
- [ ] 데이터 무결성 검증 완료

### 운영 환경
- [ ] 백업 완료
- [ ] 마이그레이션 실행
- [ ] 검증 완료
- [ ] 모니터링 설정

## 9. 주의사항

1. **대소문자 구분**: PostgreSQL은 따옴표로 감싼 식별자는 대소문자 구분
2. **예약어**: `KEY`, `STATUS` 등은 따옴표로 감싸야 함
3. **타임존**: TIMESTAMP 타입의 타임존 설정 확인
4. **트랜잭션**: 마이그레이션은 트랜잭션으로 처리
5. **백업**: 마이그레이션 전 반드시 백업

## 10. 참고 자료

- [PostgreSQL 공식 문서](https://www.postgresql.org/docs/)
- [PostgreSQL JDBC 드라이버](https://jdbc.postgresql.org/)
- [MariaDB to PostgreSQL Migration Guide](https://www.postgresql.org/docs/current/migration.html)

