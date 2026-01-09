# 완전한 마이그레이션 전략

## 개요

이 문서는 townE 시스템의 단계별 마이그레이션 전략을 제공합니다.

## 마이그레이션 단계

### 현재 상태
- **프론트엔드**: JSP (Java Server Pages)
- **백엔드**: Spring MVC
- **데이터베이스**: MariaDB

### Phase 1: 첫 번째 리뉴얼
- **프론트엔드**: Next.js 14+ (App Router)
- **백엔드**: Spring Boot 3.x (RESTful API)
- **데이터베이스**: MariaDB (유지)

### Phase 2: 두 번째 리뉴얼
- **프론트엔드**: Next.js 14+ (유지)
- **백엔드**: Spring Boot 3.x (유지)
- **데이터베이스**: Supabase (PostgreSQL 기반)

**Supabase란?**
- PostgreSQL 기반의 오픈소스 Firebase 대안
- 자동 생성되는 REST API 및 GraphQL API
- 내장 인증 시스템 (Auth)
- 실시간 기능 (Realtime)
- 파일 스토리지 (Storage)
- Row Level Security (RLS) 지원

**상세 로드맵**: `18_Migration_Roadmap.md` 참고

## 1. 마이그레이션 로드맵

### 1.1 전체 일정

**상세 일정은 `18_Migration_Roadmap.md`를 참고하세요.**

#### Phase 1: 첫 번째 리뉴얼 (Next.js + MariaDB)

```
준비 단계 (2주)
├── Spring Boot 프로젝트 구조 설계
├── Next.js 프로젝트 구조 설계
├── RESTful API 설계
└── 마이그레이션 계획 수립

백엔드 개발 (4주)
├── Spring Boot 전환
├── RESTful API 구현
└── 기존 비즈니스 로직 마이그레이션

프론트엔드 개발 (6주)
├── Next.js 프로젝트 생성 (App Router)
├── Server Component 및 Client Component 개발
├── SSR/SSG/ISR 전략 수립
├── 기존 JSP 기능 마이그레이션
└── 신규 기능 개발

통합 및 배포 (2주)
├── 통합 테스트
├── 성능 테스트
└── 운영 배포
```

#### Phase 2: 두 번째 리뉴얼 (Next.js + Supabase)

```
준비 단계 (2주)
├── Supabase 프로젝트 생성
├── PostgreSQL 스키마 설계
├── 마이그레이션 계획 수립
└── 디자인 리뉴얼 계획

데이터베이스 마이그레이션 (3주)
├── 스키마 마이그레이션
├── 데이터 마이그레이션
├── Supabase Auth 통합
└── RLS 정책 설정

애플리케이션 수정 (3주)
├── Spring Boot 설정 변경
├── JPA Entity 수정
└── 쿼리 수정

디자인 리뉴얼 (2주)
├── UI/UX 디자인
└── 컴포넌트 리뉴얼

통합 및 배포 (2주)
├── 통합 테스트
└── 운영 배포
```

### 1.2 마이그레이션 전략

#### 전략 1: 점진적 마이그레이션 (권장)
- **장점**: 리스크 최소화, 단계별 검증 가능
- **단점**: 기간이 길어짐
- **방법**: 모듈별로 순차적으로 마이그레이션

#### 전략 2: 빅뱅 마이그레이션
- **장점**: 빠른 전환
- **단점**: 리스크 큼, 롤백 어려움
- **방법**: 전체 시스템을 한 번에 전환

**권장**: 전략 1 (점진적 마이그레이션)

## 2. 데이터베이스 마이그레이션 전략

### 2.1 단계별 접근

```
Step 1: PostgreSQL 개발 환경 구축
├── PostgreSQL 설치
├── 스키마 생성 (변경된 스키마)
└── 개발 데이터 마이그레이션

Step 2: 애플리케이션 코드 수정
├── 데이터소스 설정 변경
├── MyBatis 쿼리 수정
└── 타입 매핑 수정

Step 3: 스테이징 환경 검증
├── 데이터 마이그레이션 테스트
├── 성능 테스트
└── 기능 테스트

Step 4: 운영 환경 마이그레이션
├── 백업
├── 다운타임 마이그레이션 또는
└── 무중단 마이그레이션
```

### 2.2 Schema 변경 전략

#### 변경 사항 예시

```sql
-- 기존 MariaDB 스키마
CREATE TABLE NU_MEMBER (
    `KEY` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    USERID VARCHAR(50) NOT NULL,
    ...
);

-- 변경된 PostgreSQL 스키마
CREATE TABLE members (  -- 테이블명 소문자로 변경
    id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,  -- KEY → id
    user_id VARCHAR(50) NOT NULL,  -- USERID → user_id (스네이크 케이스)
    member_type VARCHAR(1) NOT NULL DEFAULT 'P',  -- MEMBERTYPE → member_type
    ...
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- INSERTDATE → created_at
    updated_at TIMESTAMP,  -- UPDATEDATE → updated_at
    ...
);
```

#### 네이밍 컨벤션 변경

| MariaDB (기존) | PostgreSQL (변경) | 비고 |
|---------------|------------------|------|
| `KEY` | `id` | 더 명확한 이름 |
| `USERID` | `user_id` | 스네이크 케이스 |
| `INSERTDATE` | `created_at` | 표준 관례 |
| `UPDATEDATE` | `updated_at` | 표준 관례 |
| `NU_MEMBER` | `members` | 복수형, 소문자 |
| `NU_BOARD` | `boards` | 복수형, 소문자 |

### 2.3 JPA Entity 설계 (PostgreSQL용)

```java
package kr.co.nubiz.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "members")
@Data
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @Column(name = "user_id", nullable = false, unique = true)
    private String userId;
    
    @Column(name = "member_type", nullable = false)
    private String memberType;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "nick_name")
    private String nickName;
    
    @Column(name = "email")
    private String email;
    
    @Column(name = "phone")
    private String phone;
    
    @Column(name = "member_level", nullable = false)
    private String memberLevel;
    
    @Column(name = "status", nullable = false)
    private String status;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

## 3. Spring Boot 전환 전략

### 3.1 Spring Boot 프로젝트 구조

```
townE-backend/
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── kr/co/nubiz/
│   │   │       ├── TownEApplication.java
│   │   │       ├── config/
│   │   │       │   ├── SecurityConfig.java
│   │   │       │   ├── WebConfig.java
│   │   │       │   └── DatabaseConfig.java
│   │   │       ├── controller/
│   │   │       │   └── api/
│   │   │       │       ├── AuthController.java
│   │   │       │       ├── MemberController.java
│   │   │       │       └── BoardController.java
│   │   │       ├── service/
│   │   │       ├── repository/
│   │   │       ├── entity/
│   │   │       └── dto/
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-dev.yml
│   │       └── application-prod.yml
│   └── test/
```

### 3.2 Spring Boot 설정

#### pom.xml (Spring Boot 3.x)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>
    
    <groupId>kr.co.nubiz</groupId>
    <artifactId>townE-backend</artifactId>
    <version>4.0.0</version>
    <packaging>jar</packaging>
    
    <properties>
        <java.version>17</java.version>
        <postgresql.version>42.7.1</postgresql.version>
    </properties>
    
    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        
        <!-- PostgreSQL -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <version>${postgresql.version}</version>
        </dependency>
        
        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.12.3</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.12.3</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.12.3</version>
            <scope>runtime</scope>
        </dependency>
        
        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        
        <!-- Test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

#### application.yml

```yaml
spring:
  application:
    name: townE-backend
  
  datasource:
    url: jdbc:postgresql://localhost:5432/townE
    username: ${DB_USERNAME:townE}
    password: ${DB_PASSWORD:townE}
    driver-class-name: org.postgresql.Driver
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
  
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
        naming:
          physical-strategy: org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl
          implicit-strategy: org.hibernate.boot.model.naming.ImplicitNamingStrategyLegacyJpaImpl
  
  servlet:
    multipart:
      max-file-size: 1GB
      max-request-size: 1GB

server:
  port: 8080
  servlet:
    context-path: /api

logging:
  level:
    root: INFO
    kr.co.nubiz: DEBUG
    org.springframework.web: DEBUG
    org.hibernate.SQL: DEBUG

jwt:
  secret: ${JWT_SECRET:your-secret-key-change-in-production}
  expiration: 86400000  # 24시간
```

## 4. RESTful API 설계 원칙

### 4.1 RESTful API 규칙

#### 리소스 중심 설계
```
GET    /api/members          # 회원 목록
GET    /api/members/{id}     # 회원 상세
POST   /api/members          # 회원 등록
PUT    /api/members/{id}     # 회원 수정
DELETE /api/members/{id}     # 회원 삭제
```

#### 중첩 리소스
```
GET    /api/boards/{boardId}/items        # 게시물 목록
GET    /api/boards/{boardId}/items/{id}   # 게시물 상세
POST   /api/boards/{boardId}/items        # 게시물 등록
PUT    /api/boards/{boardId}/items/{id}   # 게시물 수정
DELETE /api/boards/{boardId}/items/{id}   # 게시물 삭제
```

### 4.2 API 버전 관리

```
/api/v1/members
/api/v2/members
```

## 5. React 프로젝트 통합

### 5.1 개발 환경 설정

#### 개발 모드 (CORS)
- React: `http://localhost:3000`
- Spring Boot: `http://localhost:8080`
- CORS 설정으로 통신

#### 운영 환경
- React 빌드 결과물을 Spring Boot의 `static/` 폴더에 배치
- 단일 JAR 파일로 배포

### 5.2 환경 변수 설정

#### React (.env)
```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=townE
```

#### Spring Boot (application.yml)
```yaml
frontend:
  url: ${FRONTEND_URL:http://localhost:3000}
```

## 6. 마이그레이션 체크리스트

### 데이터베이스 마이그레이션
- [ ] PostgreSQL 스키마 설계 완료
- [ ] 스키마 변경 사항 문서화 완료
- [ ] 데이터 마이그레이션 스크립트 작성 완료
- [ ] 개발 환경 마이그레이션 테스트 완료
- [ ] 스테이징 환경 마이그레이션 테스트 완료

### 백엔드 마이그레이션
- [ ] Spring Boot 프로젝트 생성 완료
- [ ] JPA Entity 설계 완료
- [ ] RESTful API Controller 구현 완료
- [ ] JWT 인증 구현 완료
- [ ] CORS 설정 완료
- [ ] 단위 테스트 작성 완료

### 프론트엔드 개발
- [ ] React 프로젝트 생성 완료
- [ ] TypeScript 타입 정의 완료
- [ ] API 클라이언트 구현 완료
- [ ] 주요 페이지 컴포넌트 구현 완료
- [ ] 상태 관리 설정 완료
- [ ] 라우팅 설정 완료

### 통합 및 테스트
- [ ] API 연동 테스트 완료
- [ ] 인증/인가 테스트 완료
- [ ] 통합 테스트 완료
- [ ] 성능 테스트 완료
- [ ] 사용자 테스트 완료

### 배포
- [ ] 빌드 스크립트 작성 완료
- [ ] 배포 자동화 설정 완료
- [ ] 모니터링 설정 완료
- [ ] 롤백 계획 수립 완료

## 7. 위험 관리

### 7.1 주요 리스크

1. **데이터 손실**
   - 완전한 백업 필수
   - 마이그레이션 검증 절차 수립

2. **성능 저하**
   - 성능 테스트 필수
   - 인덱스 최적화

3. **호환성 문제**
   - API 버전 관리
   - 점진적 마이그레이션

4. **일정 지연**
   - 충분한 버퍼 시간 확보
   - 우선순위 설정

### 7.2 롤백 계획

1. **데이터베이스 롤백**
   - MariaDB 백업에서 복원
   - PostgreSQL 스키마 삭제

2. **애플리케이션 롤백**
   - 이전 버전 WAR 파일로 배포
   - 설정 파일 복원

3. **프론트엔드 롤백**
   - 이전 React 빌드로 교체
   - 또는 JSP 버전으로 복귀

## 8. 예상 소요 시간

### 전체 마이그레이션
- **최소**: 12주 (3개월)
- **권장**: 16주 (4개월)
- **여유**: 20주 (5개월)

### 단계별 예상 시간
- Phase 1 (준비): 2주
- Phase 2 (백엔드): 4주
- Phase 3 (프론트엔드): 6주
- Phase 4 (통합/테스트): 2주
- Phase 5 (배포): 1주

## 9. 참고 문서

- `10_PostgreSQL_Migration_Guide.md` - PostgreSQL 마이그레이션 상세 가이드
- `11_React_Frontend_Guide.md` - React 프론트엔드 상세 가이드
- `04_Database_DDL_Script.md` - 기존 DB 스키마 (참고용)
- `06_API_Specification.md` - 기존 API 명세 (참고용)

## 10. 다음 단계

1. **즉시 시작**: `10_PostgreSQL_Migration_Guide.md`와 `11_React_Frontend_Guide.md` 참고
2. **스키마 설계**: PostgreSQL 스키마 설계 시작
3. **프로토타입**: 작은 모듈부터 시작하여 검증
4. **점진적 확장**: 검증된 모듈을 기준으로 확장

