# 빠른 시작 가이드 (Quick Start Guide)

## 개요

이 문서는 새로운 환경에서 townE 시스템을 빠르게 구축하고 실행하기 위한 단계별 가이드를 제공합니다.

## 필수 문서 확인

다음 문서들이 모두 준비되어 있어야 합니다:

- ✅ `04_Database_DDL_Script.md` - 데이터베이스 스키마
- ✅ `05_Project_Structure_Configuration.md` - 프로젝트 구조 및 설정
- ✅ `06_API_Specification.md` - API 명세서
- ✅ `07_Implementation_Code_Examples.md` - 구현 코드 예시
- ✅ `08_Deployment_Guide.md` - 배포 가이드

## 1단계: 환경 준비 (30분)

### 1.1 필수 소프트웨어 설치

```bash
# Java 8 설치 확인
java -version
# 출력: openjdk version "1.8.0_xxx"

# Maven 설치 확인
mvn -version
# 출력: Apache Maven 3.6.x

# MariaDB 설치 확인
mysql --version
# 출력: mysql Ver 15.1 Distrib 10.x.x-MariaDB
```

### 1.2 데이터베이스 생성

```bash
# MariaDB 접속
mysql -u root -p

# 데이터베이스 생성
CREATE DATABASE townE DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 사용자 생성
CREATE USER 'townE'@'localhost' IDENTIFIED BY 'townE';
GRANT ALL PRIVILEGES ON townE.* TO 'townE'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# DDL 스크립트 실행
mysql -u townE -p townE < 04_Database_DDL_Script.md
# 또는 직접 SQL 파일로 변환하여 실행
```

## 2단계: 프로젝트 생성 (1시간)

### 2.1 Maven 프로젝트 생성

```bash
# 프로젝트 디렉토리 생성
mkdir -p townE/src/main/{java/kr/co/nubiz,resources/nubiz/{spring,sqlmap,message},webapp/WEB-INF/{config/nubiz/{springmvc,tiles},jsp/{tiles,view}}}

# pom.xml 복사
# 05_Project_Structure_Configuration.md의 pom.xml 내용을 복사하여 생성
```

### 2.2 설정 파일 생성

`05_Project_Structure_Configuration.md`의 다음 파일들을 생성:

1. `pom.xml` - 프로젝트 루트
2. `src/main/webapp/WEB-INF/web.xml`
3. `src/main/webapp/WEB-INF/config/nubiz/springmvc/dispatcher-servlet.xml`
4. `src/main/resources/nubiz/spring/context-*.xml` (모든 Spring 설정 파일)
5. `src/main/resources/nubiz/sqlmap/sql-mapper-config.xml`
6. `src/main/webapp/WEB-INF/config/nubiz/tiles/tiles.xml`

### 2.3 데이터베이스 연결 설정

`src/main/resources/nubiz/spring/context-datasource.xml` 수정:

```xml
<property name="url" value="jdbc:mariadb://localhost:3306/townE?zeroDateTimeBehavior=convertToNull"/>
<property name="username" value="townE"/>
<property name="password" value="townE"/>
```

## 3단계: 핵심 코드 구현 (2-3시간)

### 3.1 VO 클래스 생성

`07_Implementation_Code_Examples.md`의 다음 클래스들을 생성:

1. `MemberVO.java`
2. 기타 필요한 VO 클래스들

### 3.2 Service 계층 구현

1. `IMemberService.java` (인터페이스)
2. `MemberServiceImpl.java` (구현체)
3. `IMemberMapper.java` (Mapper 인터페이스)

### 3.3 Mapper XML 생성

`src/main/resources/nubiz/sqlmap/admin/member/mappers/memberMapper_SQL.xml` 생성

`07_Implementation_Code_Examples.md`의 MyBatis Mapper 예시 참고

### 3.4 Controller 구현

`MemberController.java` 생성

`07_Implementation_Code_Examples.md`의 Controller 예시 참고

### 3.5 유틸리티 클래스 생성

1. `EncryptionUtil.java` - 암호화 유틸리티
2. `SessionUtil.java` - 세션 유틸리티
3. 기타 공통 유틸리티

## 4단계: 빌드 및 실행 (30분)

### 4.1 의존성 다운로드

```bash
cd townE
mvn clean install -DskipTests
```

### 4.2 WAR 파일 생성

```bash
mvn clean package
# target/townE-3.5.0.war 파일 생성 확인
```

### 4.3 로컬 실행 (Tomcat Maven Plugin)

```bash
mvn tomcat7:run
# 또는
mvn tomcat7:run-war
```

### 4.4 접속 확인

브라우저에서 접속:
- 관리자: `http://localhost:8080/admin/member/loginV.do`
- 사용자: `http://localhost:8080/`

## 5단계: 초기 데이터 설정 (30분)

### 5.1 관리자 계정 생성

데이터베이스에서 직접 생성:

```sql
-- 관리자 계정 (비밀번호: admin123)
-- 실제 비밀번호는 SHA-256 해시로 변환 필요
INSERT INTO NU_MEMBER (
    MEMBERTYPE, USERID, USERPW, NAME, MEMBERLEVEL, `STATUS`, 
    EMAILAGREE, SMSAGREE, INSERTDATE, INSERTIP
) VALUES (
    'P', 'admin', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 
    '관리자', '9', 'U', 'N', 'N', NOW(), '127.0.0.1'
);

-- 관리자-사이트 연결
INSERT INTO NU_MEMBER_SITE (MEMBERKEY, SITEKEY, `STATUS`, INSERTDATE) 
VALUES (1, 1, 'U', NOW());
```

### 5.2 기본 사이트 및 메뉴 확인

`04_Database_DDL_Script.md`의 초기 데이터 섹션 확인

## 체크리스트

### 환경 준비
- [ ] Java 8 설치 완료
- [ ] Maven 설치 완료
- [ ] MariaDB 설치 완료
- [ ] 데이터베이스 생성 완료
- [ ] DDL 스크립트 실행 완료

### 프로젝트 설정
- [ ] pom.xml 생성 완료
- [ ] web.xml 생성 완료
- [ ] Spring 설정 파일 생성 완료
- [ ] MyBatis 설정 파일 생성 완료
- [ ] Tiles 설정 파일 생성 완료
- [ ] 데이터베이스 연결 설정 완료

### 코드 구현
- [ ] VO 클래스 생성 완료
- [ ] Service 인터페이스 생성 완료
- [ ] Service 구현체 생성 완료
- [ ] Mapper 인터페이스 생성 완료
- [ ] Mapper XML 생성 완료
- [ ] Controller 생성 완료
- [ ] 유틸리티 클래스 생성 완료

### 빌드 및 실행
- [ ] Maven 빌드 성공
- [ ] WAR 파일 생성 확인
- [ ] 애플리케이션 실행 확인
- [ ] 웹 브라우저 접속 확인

### 초기 데이터
- [ ] 관리자 계정 생성 완료
- [ ] 기본 사이트 데이터 확인
- [ ] 기본 메뉴 데이터 확인
- [ ] 공통코드 데이터 확인

## 예상 소요 시간

- **환경 준비**: 30분
- **프로젝트 생성**: 1시간
- **코드 구현**: 2-3시간
- **빌드 및 실행**: 30분
- **초기 데이터 설정**: 30분

**총 예상 시간: 4-5시간**

## 문제 해결

### 빌드 실패 시

```bash
# 의존성 강제 업데이트
mvn clean install -U -DskipTests

# 특정 의존성 확인
mvn dependency:tree | grep [라이브러리명]
```

### 데이터베이스 연결 실패 시

```bash
# 연결 테스트
mysql -u townE -p townE

# 방화벽 확인
sudo ufw status

# MariaDB 서비스 확인
sudo systemctl status mariadb
```

### 애플리케이션 실행 실패 시

```bash
# 로그 확인
tail -f /opt/tomcat9/logs/catalina.out
# 또는
tail -f target/tomcat/logs/catalina.out

# 포트 확인
netstat -tulpn | grep 8080
```

## 다음 단계

빠른 시작이 완료되면:

1. **전체 기능 구현**: `07_Implementation_Code_Examples.md` 참고
2. **API 개발**: `06_API_Specification.md` 참고
3. **운영 배포**: `08_Deployment_Guide.md` 참고
4. **성능 튜닝**: `08_Deployment_Guide.md`의 성능 튜닝 섹션 참고

## 참고 문서

- `04_Database_DDL_Script.md` - 데이터베이스 스키마
- `05_Project_Structure_Configuration.md` - 프로젝트 구조 및 설정
- `06_API_Specification.md` - API 명세서
- `07_Implementation_Code_Examples.md` - 구현 코드 예시
- `08_Deployment_Guide.md` - 배포 가이드

