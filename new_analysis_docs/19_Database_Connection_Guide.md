# 데이터베이스 연결 가이드

## 개요

이 문서는 townE 시스템의 데이터베이스 연결 설정 가이드를 제공합니다.

**중요 원칙**:
- 데이터베이스 스키마 변경 없이 연결 주소만 변경합니다
- 기존 데이터베이스를 그대로 사용합니다
- 모든 기존 데이터가 유지됩니다

## 현재 데이터베이스 정보

### 기존 MariaDB 연결 정보
- **Host**: 192.168.0.153
- **Port**: 3306
- **Database**: TOWNE
- **User**: townE
- **Password**: townE
- **Connection URL**: `jdbc:mariadb://192.168.0.153:3306/TOWNE`

## Phase 1: Next.js + MariaDB

### Spring Boot 설정

#### application.yml

```yaml
spring:
  datasource:
    # 기존 데이터베이스 연결 (주소만 설정)
    url: jdbc:mariadb://192.168.0.153:3306/TOWNE?zeroDateTimeBehavior=convertToNull&useUnicode=true&characterEncoding=utf8mb4
    username: townE
    password: townE
    driver-class-name: org.mariadb.jdbc.Driver
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
  
  jpa:
    hibernate:
      ddl-auto: validate  # 스키마 자동 생성 비활성화 (기존 스키마 사용)
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MariaDBDialect
```

#### 환경 변수 사용 (권장)

```yaml
spring:
  datasource:
    url: jdbc:mariadb://${DB_HOST:192.168.0.153}:${DB_PORT:3306}/${DB_NAME:TOWNE}?zeroDateTimeBehavior=convertToNull&useUnicode=true&characterEncoding=utf8mb4
    username: ${DB_USERNAME:townE}
    password: ${DB_PASSWORD:townE}
    driver-class-name: org.mariadb.jdbc.Driver
```

#### .env 또는 환경 변수

```bash
# 개발 환경
DB_HOST=192.168.0.153
DB_PORT=3306
DB_NAME=townE
DB_USERNAME=townE
DB_PASSWORD=townE

# 운영 환경 (주소만 변경)
DB_HOST=production-db-host
DB_PORT=3306
DB_NAME=townE
DB_USERNAME=townE
DB_PASSWORD=production-password
```

### 연결 테스트

```java
@SpringBootTest
class DatabaseConnectionTest {
    
    @Autowired
    private DataSource dataSource;
    
    @Test
    void testConnection() throws SQLException {
        try (Connection conn = dataSource.getConnection()) {
            assertNotNull(conn);
            assertFalse(conn.isClosed());
            System.out.println("데이터베이스 연결 성공!");
        }
    }
}
```

## Phase 2: Next.js + Supabase

**중요**: Supabase로 전환하기 전에 **스키마 변환이 필수**입니다. `20_Supabase_Schema_Conversion_Guide.md`를 먼저 참고하세요.

### Supabase 연결 정보 확인

1. Supabase Dashboard 접속
2. 프로젝트 설정 → Database → Connection string 확인

예시:
- **Host**: `db.xxxxx.supabase.co`
- **Port**: `5432`
- **Database**: `postgres`
- **User**: `postgres`
- **Password**: `your-password`

### 스키마 변환 (필수)

스키마 변환 작업:
1. DDL 스크립트 변환 (`20_Supabase_Schema_Conversion_Guide.md` 참고)
2. 변환된 스크립트를 Supabase에 실행
3. 트리거 생성
4. 인덱스 및 제약조건 생성

### Spring Boot 설정 변경

#### application.yml (Supabase로 변경)

```yaml
spring:
  datasource:
    # Supabase 연결 주소로 변경 (스키마 변환 후)
    url: jdbc:postgresql://${SUPABASE_HOST:db.xxxxx.supabase.co}:${SUPABASE_PORT:5432}/${SUPABASE_DB:postgres}?sslmode=require
    username: ${SUPABASE_USER:postgres}
    password: ${SUPABASE_PASSWORD:your-password}
    driver-class-name: org.postgresql.Driver
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
  
  jpa:
    hibernate:
      ddl-auto: validate  # 스키마 자동 생성 비활성화 (기존 스키마 사용)
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
```

#### pom.xml (PostgreSQL 드라이버 추가)

```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

### 환경 변수 설정

```bash
# Supabase 연결 정보
SUPABASE_HOST=db.xxxxx.supabase.co
SUPABASE_PORT=5432
SUPABASE_DB=postgres
SUPABASE_USER=postgres
SUPABASE_PASSWORD=your-password
```

## 스키마 변환 (필수)

**중요**: MariaDB와 PostgreSQL(Supabase) 간 문법 차이로 인해 스키마 변환이 필수입니다.

### 필수 변환 사항

1. **AUTO_INCREMENT → SERIAL**
2. **ON UPDATE CURRENT_TIMESTAMP → 트리거**
3. **백틱(`) → 따옴표(")** (예약어 처리)
4. **ENGINE=InnoDB, CHARSET 제거**
5. **인덱스 문법 변경**
6. **COMMENT 문법 변경**

자세한 내용은 `20_Supabase_Schema_Conversion_Guide.md`를 참고하세요.

### JPA Entity 예시 (변환 후)

```java
@Entity
@Table(name = "NU_MEMBER")  // PostgreSQL에서는 따옴표로 감싸야 함
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "\"KEY\"")  // PostgreSQL 예약어는 따옴표 사용
    private Long id;
    
    @Column(name = "\"USERID\"")
    private String userId;
    
    // ...
}
```

또는 Hibernate의 `hibernate.globally_quoted_identifiers=true` 설정 사용 가능

## 연결 주소 변경 체크리스트

### Phase 1 (MariaDB)
- [ ] `application.yml`에 기존 DB 주소 설정
- [ ] 연결 테스트 완료
- [ ] 기존 스키마 확인 완료

### Phase 2 (Supabase)
- [ ] Supabase 프로젝트 생성 완료
- [ ] Supabase 연결 정보 확인 완료
- [ ] `application.yml`의 연결 주소 변경 완료
- [ ] PostgreSQL 드라이버 추가 완료
- [ ] 연결 테스트 완료
- [ ] 기존 스키마 확인 완료

## 문제 해결

### 연결 실패 시

1. **방화벽 확인**: DB 서버의 방화벽 설정 확인
2. **네트워크 확인**: 네트워크 연결 상태 확인
3. **인증 정보 확인**: 사용자명/비밀번호 확인
4. **포트 확인**: 포트가 열려있는지 확인

### Supabase 연결 시

1. **SSL 모드 확인**: `sslmode=require` 설정 확인
2. **Connection Pool 설정**: Supabase의 연결 제한 확인
3. **IP 화이트리스트**: Supabase Dashboard에서 IP 허용 확인

## 참고 문서

- `15_NextJS_MariaDB_Start_Guide.md` - Phase 1 시작 가이드
- `10_Supabase_Migration_Guide.md` - Phase 2 마이그레이션 가이드
- `20_Supabase_Schema_Conversion_Guide.md` - **스키마 변환 필수 가이드**
- `04_Database_DDL_Script.md` - 데이터베이스 스키마 (원본 MariaDB)

