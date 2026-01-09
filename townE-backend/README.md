# townE Backend

townE 리뉴얼 프로젝트 백엔드 (Spring Boot 3.x + MariaDB)

## 기술 스택

- **Spring Boot 3.2.0**: RESTful API 프레임워크
- **Java 17**: 프로그래밍 언어
- **Spring Data JPA**: 데이터 접근 계층
- **Spring Security**: 인증/인가
- **JWT**: 토큰 기반 인증
- **MariaDB**: 데이터베이스
- **Lombok**: 보일러플레이트 코드 제거

## 시작하기

### 개발 환경 설정

1. Java 17 설치 확인
```bash
java -version
```

2. Maven 설치 확인
```bash
mvn -version
```

3. 데이터베이스 연결 설정
`src/main/resources/application.yml` 파일에서 데이터베이스 연결 정보를 확인하세요:
```yaml
spring:
  datasource:
    url: jdbc:mariadb://192.168.0.141:3306/townE
    username: townE
    password: townE
```

4. 환경 변수 설정 (선택)
`.env` 파일을 생성하거나 환경 변수로 설정:
- `DB_USERNAME`: 데이터베이스 사용자명
- `DB_PASSWORD`: 데이터베이스 비밀번호
- `JWT_SECRET`: JWT 시크릿 키 (최소 256비트)

5. 애플리케이션 실행
```bash
mvn spring-boot:run
```

애플리케이션은 `http://localhost:8080/api`에서 실행됩니다.

## 프로젝트 구조

```
townE-backend/
├── src/
│   ├── main/
│   │   ├── java/kr/co/nubiz/
│   │   │   ├── config/          # 설정 클래스
│   │   │   ├── common/           # 공통 기능
│   │   │   │   ├── dto/         # 공통 DTO
│   │   │   │   └── exception/   # 예외 처리
│   │   │   ├── controller/      # REST 컨트롤러
│   │   │   ├── service/         # 비즈니스 로직
│   │   │   ├── repository/      # 데이터 접근 계층
│   │   │   ├── entity/          # JPA 엔티티
│   │   │   └── dto/             # 데이터 전송 객체
│   │   └── resources/
│   │       └── application.yml  # 설정 파일
│   └── test/                    # 테스트 코드
└── pom.xml                      # Maven 설정
```

## 주요 기능

- RESTful API
- JWT 기반 인증
- 공통 예외 처리
- CORS 설정
- 데이터베이스 연결 (MariaDB)

