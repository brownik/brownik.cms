# 마이그레이션 차단 요소(Blockers) 식별 및 리스크 리포트

## 개요

이 문서는 townE 시스템을 현대적 스택으로 마이그레이션할 때 **반드시 해결해야 할 차단 요소(Blockers)**와 **높은 리스크를 가진 기술 부채**를 식별합니다.

## 차단 요소 분류

- 🔴 **CRITICAL**: 마이그레이션 불가능 또는 매우 어려움
- 🟠 **HIGH**: 마이그레이션 가능하나 상당한 노력 필요
- 🟡 **MEDIUM**: 마이그레이션 가능하나 주의 필요
- 🟢 **LOW**: 마이그레이션 용이

---

## 1. DB 저장형 소스 코드 시스템 (CRITICAL 🔴)

### 1.1 문제점

**현재 구조:**
- `NU_CONTENTS` 테이블에 HTML/JS/CSS 소스 코드 저장
- 관리자가 저장 시 `ContentFileUtil.makeFile()`로 파일 시스템에 JSP 파일 생성
- 런타임에 생성된 JSP 파일을 Tiles로 렌더링

**코드 위치:**
```java
// ContentFileUtil.java
public static void makeFile(ContentVO content) {
    String savePath = "/WEB-INF/jsp/view/site/{siteKey}/content/{menuKey}/";
    String jspFileName = uploadPath + String.valueOf(content.getMenuKey()) + ".jsp";
    
    // JSP 파일 생성
    osw.write(JSP_HEADER);
    osw.write(content.getHtml());
}
```

### 1.2 차단 이유

1. **런타임 파일 생성**: 서버 재시작 없이 파일 생성/수정
2. **JSP 의존성**: JSP → React/Vue.js로 전환 시 전체 렌더링 파이프라인 재설계 필요
3. **파일 시스템 의존**: 컨테이너 환경(Docker/Kubernetes)에서 파일 영속성 문제
4. **버전 관리 불가**: Git으로 관리 불가능한 동적 파일

### 1.3 마이그레이션 전략

#### 옵션 A: DB에서 직접 렌더링 (권장)
```java
// 기존: 파일 생성 후 JSP 렌더링
ContentFileUtil.makeFile(content);

// 신규: DB에서 직접 읽어서 템플릿 엔진으로 렌더링
ContentVO content = contentService.getData(menuKey);
model.addAttribute("html", content.getHtml());
return "content/view"; // Thymeleaf 템플릿
```

#### 옵션 B: CDN/Static Storage 활용
- DB에서 읽어서 S3/Cloud Storage에 업로드
- CDN으로 서빙
- 캐싱 전략 수립

#### 옵션 C: React/Vue.js 컴포넌트로 변환
- DB의 HTML을 React 컴포넌트로 변환
- 관리자 UI에서 컴포넌트 편집
- 빌드 파이프라인 구축

**예상 작업량**: 3-6개월

---

## 2. 동적 테이블 생성 시스템 (CRITICAL 🔴)

### 2.1 문제점

**현재 구조:**
- 데이터셋 모듈이 런타임에 `CREATE TABLE` 실행
- 테이블명: `PG_DatasetTable_{datasetKey}`
- 컬럼은 사용자 정의 필드로 동적 생성

**코드 위치:**
```xml
<!-- datasetTableAdminMapper_SQL.xml -->
<insert id="createTable" parameterType="datasetTableAdminVO">
    CREATE TABLE `${tableName}` (
        `key` INT NOT NULL AUTO_INCREMENT,
        <foreach collection="fieldsList" item="item">
            `${item.field}` ${item.type}
        </foreach>
        , PRIMARY KEY (`KEY`)
    )
</insert>
```

### 2.2 차단 이유

1. **ORM 매핑 불가**: JPA/Hibernate로 동적 테이블 매핑 불가능
2. **SQL Injection 위험**: 테이블명/컬럼명이 사용자 입력값으로 직접 사용
3. **스키마 관리 어려움**: Flyway/Liquibase와 호환 불가
4. **성능 이슈**: 동적 테이블 생성 시 DB 락 발생

### 2.3 마이그레이션 전략

#### 옵션 A: NoSQL 전환 (권장)
```java
// MongoDB 예시
@Document(collection = "dataset_{datasetKey}")
public class DatasetData {
    @Id
    private String id;
    private Map<String, Object> fields; // 동적 필드
}
```

#### 옵션 B: JSON 컬럼 활용
```sql
-- MariaDB 10.2+ JSON 컬럼
CREATE TABLE PG_DatasetData (
    `key` INT PRIMARY KEY AUTO_INCREMENT,
    `datasetKey` INT,
    `data` JSON,  -- 동적 필드를 JSON으로 저장
    INDEX idx_dataset (datasetKey)
);
```

#### 옵션 C: EAV 패턴 (Entity-Attribute-Value)
```sql
CREATE TABLE PG_DatasetValue (
    `key` INT PRIMARY KEY,
    `datasetKey` INT,
    `fieldKey` INT,
    `value` TEXT
);
```

**예상 작업량**: 2-4개월

---

## 3. Tiles 템플릿 시스템 (HIGH 🟠)

### 3.1 문제점

**현재 구조:**
- Apache Tiles 3.x 사용
- XML 기반 템플릿 정의
- JSP와 강하게 결합

**코드 위치:**
```xml
<!-- tiles.xml -->
<definition name="/site/*/content/*/*" extends="userContentTemplate">
    <put-attribute name="content" value="/WEB-INF/jsp/view/site/{1}/content/{2}/{3}.jsp" />
</definition>
```

### 3.2 차단 이유

1. **JSP 의존성**: SPA 전환 시 Tiles 불필요
2. **서버 사이드 렌더링**: 클라이언트 사이드 렌더링으로 전환 필요
3. **템플릿 재사용 어려움**: React/Vue.js 컴포넌트로 변환 필요

### 3.3 마이그레이션 전략

#### 옵션 A: Thymeleaf로 전환 (서버 사이드 유지)
- Tiles → Thymeleaf 템플릿
- 점진적 마이그레이션 가능

#### 옵션 B: SPA 전환 (권장)
- React/Vue.js로 프론트엔드 분리
- REST API로 백엔드 분리
- 템플릿 시스템 제거

**예상 작업량**: 2-3개월

---

## 4. 하드코딩된 DB 연결 정보 (HIGH 🟠)

### 4.1 문제점

**현재 구조:**
```xml
<!-- context-datasource.xml -->
<property name="url" value="jdbc:mariadb://192.168.0.141:3306/townE"/>
<property name="username" value="townE"/>
<property name="password" value="townE"/>
```

### 4.2 차단 이유

1. **환경별 설정 불가**: 개발/스테이징/프로덕션 분리 어려움
2. **보안 위험**: 소스 코드에 인증 정보 노출
3. **컨테이너 환경 부적합**: Docker/Kubernetes 환경 변수 활용 불가

### 4.3 마이그레이션 전략

```yaml
# application.yml (Spring Boot)
spring:
  datasource:
    url: ${DB_URL:jdbc:mariadb://localhost:3306/townE}
    username: ${DB_USERNAME:townE}
    password: ${DB_PASSWORD:townE}
```

**예상 작업량**: 1주일

---

## 5. SQL Injection 위험 (HIGH 🟠)

### 5.1 문제점

**동적 컬럼명 사용:**
```xml
<!-- boardItemMapper_SQL.xml -->
<if test="searchType != 'ALL' and searchKeyword!=null">
    AND `${searchType}` LIKE CONCAT('%',#{searchKeyword},'%')
</if>
```

**동적 테이블명 사용:**
```xml
<!-- datasetTableAdminMapper_SQL.xml -->
SELECT * FROM `${tableName}` WHERE ...
```

### 5.2 차단 이유

1. **보안 취약점**: SQL Injection 공격 가능
2. **데이터 유출 위험**: 전체 DB 접근 가능
3. **규정 준수**: 보안 규정 위반 가능

### 5.3 마이그레이션 전략

#### 화이트리스트 검증
```java
private static final Set<String> ALLOWED_SEARCH_TYPES = Set.of("TITLE", "CONTENT", "WRITER");

public void validateSearchType(String searchType) {
    if (!ALLOWED_SEARCH_TYPES.contains(searchType)) {
        throw new IllegalArgumentException("Invalid search type");
    }
}
```

#### PreparedStatement 사용
```java
// MyBatis에서도 파라미터화된 쿼리 사용
WHERE ${searchType} LIKE CONCAT('%', #{searchKeyword}, '%')
// → 화이트리스트 검증 후 사용
```

**예상 작업량**: 2-4주

---

## 6. 비밀번호 암호화 방식 (HIGH 🟠)

### 6.1 문제점

**현재 구조:**
```java
// UserAuthenticationProvider.java
String encPassword = EncryptionUtil.ENC_SHA256(password);
if (!userDetails.getPassword().equals(encPassword)) {
    throw new BadCredentialsException("...");
}
```

### 6.2 차단 이유

1. **Salt 미사용**: 레인보우 테이블 공격에 취약
2. **단방향 해시**: 비밀번호 변경 시 전체 재암호화 필요
3. **보안 표준 미준수**: BCrypt/Argon2 등 적응형 해시 미사용

### 6.3 마이그레이션 전략

```java
// Spring Security BCrypt
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}

// 기존 비밀번호 마이그레이션
public boolean matches(String rawPassword, String encodedPassword) {
    if (encodedPassword.startsWith("$2a$")) {
        // BCrypt로 암호화된 경우
        return bcryptEncoder.matches(rawPassword, encodedPassword);
    } else {
        // 기존 SHA-256으로 암호화된 경우
        String sha256 = EncryptionUtil.ENC_SHA256(rawPassword);
        if (sha256.equals(encodedPassword)) {
            // 로그인 성공 시 BCrypt로 재암호화
            String newPassword = bcryptEncoder.encode(rawPassword);
            memberService.updatePassword(userId, newPassword);
            return true;
        }
    }
    return false;
}
```

**예상 작업량**: 2-3주

---

## 7. 세션 기반 권한 체크 (MEDIUM 🟡)

### 7.1 문제점

**현재 구조:**
```java
// HomeController.java
MemberHomeVO memberData = SessionUtil.getCurrentHomeMember();
int memberLevel = Integer.parseInt(memberData.getMemberLevel());

if(memberLevel < Integer.valueOf(menuData.getAccessRole())) {
    return "redirect:/home/member/loginV.do";
}
```

### 7.2 차단 이유

1. **세션 하이재킹 위험**: 세션 토큰 탈취 시 권한 우회 가능
2. **스케일 아웃 어려움**: 세션 공유 필요 (Redis 등)
3. **마이크로서비스 부적합**: 세션 기반 인증은 분산 환경에 부적합

### 7.3 마이그레이션 전략

#### JWT 기반 인증
```java
// JWT 토큰 발급
String token = Jwts.builder()
    .setSubject(userId)
    .claim("memberLevel", memberLevel)
    .setExpiration(new Date(System.currentTimeMillis() + 3600000))
    .signWith(SignatureAlgorithm.HS512, secretKey)
    .compact();

// JWT 토큰 검증
Claims claims = Jwts.parser()
    .setSigningKey(secretKey)
    .parseClaimsJws(token)
    .getBody();
```

**예상 작업량**: 3-4주

---

## 8. 동적 SQL 쿼리 성능 (MEDIUM 🟡)

### 8.1 문제점

**LIKE 검색:**
```xml
WHERE TITLE LIKE CONCAT('%', #{searchKeyword}, '%')
```

**동적 테이블 조회:**
```xml
SELECT * FROM `${tableName}` WHERE ...
```

### 8.2 차단 이유

1. **인덱스 활용 불가**: LIKE '%keyword%' 패턴은 인덱스 사용 불가
2. **쿼리 플랜 캐싱 불가**: 동적 테이블명으로 인한 플랜 캐싱 어려움
3. **대용량 데이터 성능 저하**: Full Table Scan 발생 가능

### 8.3 마이그레이션 전략

#### Full-Text Search 엔진 도입
```java
// Elasticsearch 예시
@Document(indexName = "board_items")
public class BoardItemDocument {
    @Field(type = FieldType.Text, analyzer = "korean")
    private String title;
    
    @Field(type = FieldType.Text, analyzer = "korean")
    private String content;
}
```

**예상 작업량**: 1-2개월

---

## 9. 파일 업로드 시스템 (MEDIUM 🟡)

### 9.1 문제점

**현재 구조:**
- 파일이 서버 파일 시스템에 저장
- DB에는 파일 경로만 저장
- 컨테이너 환경에서 파일 영속성 문제

### 9.2 차단 이유

1. **파일 영속성**: 컨테이너 재시작 시 파일 손실
2. **스케일 아웃**: 여러 서버 간 파일 공유 필요
3. **백업 복잡**: 파일 시스템 백업 별도 필요

### 9.3 마이그레이션 전략

#### Object Storage 활용
```java
// AWS S3 예시
@Autowired
private AmazonS3 s3Client;

public void uploadFile(MultipartFile file, String key) {
    s3Client.putObject(bucketName, key, file.getInputStream(), metadata);
}
```

**예상 작업량**: 2-3주

---

## 10. 공통코드 JSON 파일 (LOW 🟢)

### 10.1 문제점

**현재 구조:**
```json
// commonCode.json
[
    {"groupCode":"", "code":"MEMBERLEVEL", "codeName":"회원등급"},
    {"groupCode":"MEMBERLEVEL", "code":"0", "codeName":"비회원"},
    ...
]
```

**초기화 로직:**
```java
// DefaultSettingController.java
Object obj = parser.parse(new FileReader("commonCode.json"));
// DB에 삽입
```

### 10.2 차단 이유

1. **하드코딩**: 코드 변경 시 재배포 필요
2. **버전 관리**: JSON 파일과 DB 동기화 어려움

### 10.3 마이그레이션 전략

- DB에서 직접 관리
- 관리자 UI에서 CRUD 가능
- JSON 파일 제거

**예상 작업량**: 1주일

---

## 마이그레이션 우선순위 및 로드맵

### Phase 1: Critical Blockers (3-6개월)
1. ✅ DB 저장형 소스 코드 시스템 재설계
2. ✅ 동적 테이블 생성 시스템 전환
3. ✅ SQL Injection 방지 로직 추가

### Phase 2: High Risk (2-3개월)
4. ✅ 하드코딩된 설정값 외부화
5. ✅ 비밀번호 암호화 방식 개선
6. ✅ Tiles 템플릿 시스템 전환

### Phase 3: Medium Risk (1-2개월)
7. ✅ 세션 기반 인증 → JWT 전환
8. ✅ 검색 성능 개선 (Elasticsearch)
9. ✅ 파일 업로드 시스템 개선

### Phase 4: Low Risk (1개월)
10. ✅ 공통코드 관리 개선
11. ✅ 기타 기술 부채 해결

---

## 결론

townE 시스템의 마이그레이션은 **약 6-12개월**의 작업이 필요하며, 특히 **DB 저장형 소스 코드 시스템**과 **동적 테이블 생성 시스템**은 근본적인 재설계가 필요합니다.

**권장 접근법:**
1. **Strangler Pattern**: 기존 시스템과 병행 운영하며 점진적 전환
2. **API Gateway**: 신규 시스템과 레거시 시스템 통합
3. **데이터 마이그레이션**: 단계적 데이터 이전
4. **롤백 전략**: 각 단계별 롤백 계획 수립

