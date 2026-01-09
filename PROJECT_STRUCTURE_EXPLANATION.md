# 프로젝트 구조 분리 이유

## 왜 백엔드와 프론트엔드를 별도 폴더로 분리했나요?

이 프로젝트는 **모노레포(Monorepo)** 구조를 따르고 있으며, 백엔드와 프론트엔드를 분리한 이유는 다음과 같습니다:

## 1. 기술 스택의 차이

### Backend (`townE-backend`)
- **언어**: Java 17
- **프레임워크**: Spring Boot 3.x
- **빌드 도구**: Maven (`pom.xml`)
- **실행 환경**: JVM
- **의존성**: Spring Data JPA, Spring Security, Querydsl 등

### Frontend (`townE-frontend`)
- **언어**: TypeScript
- **프레임워크**: Next.js 14+ (App Router)
- **빌드 도구**: npm/yarn (`package.json`)
- **실행 환경**: Node.js
- **의존성**: React, Tailwind CSS, TanStack Query, Zustand 등

**→ 완전히 다른 생태계이므로 분리하는 것이 자연스럽습니다.**

## 2. 독립적인 개발 및 배포

### 개발 환경
- **백엔드**: `mvn spring-boot:run` (포트 8080)
- **프론트엔드**: `npm run dev` (포트 3000)
- 서로 독립적으로 실행 가능

### 배포 환경
- **백엔드**: 서버에 JAR 파일 배포 (Spring Boot)
- **프론트엔드**: Vercel/Netlify 등 정적 호스팅 또는 SSR 서버
- 배포 주기와 방법이 다름

## 3. 빌드 산출물 분리

```
townE-backend/
├── target/              # Maven 빌드 산출물 (.jar)
└── BOOT-INF/           # Spring Boot 실행 파일

townE-frontend/
├── .next/              # Next.js 빌드 산출물
└── out/                # 정적 빌드 산출물 (선택적)
```

**→ 빌드 산출물이 완전히 다르므로 분리하는 것이 합리적입니다.**

## 4. 의존성 관리

### Backend 의존성 (`pom.xml`)
```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <!-- Java 라이브러리들 -->
</dependencies>
```

### Frontend 의존성 (`package.json`)
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    // JavaScript/TypeScript 라이브러리들
  }
}
```

**→ 각각의 의존성 관리 파일이 필요합니다.**

## 5. 팀 협업 및 책임 분리

- **백엔드 개발자**: Java/Spring Boot에 집중
- **프론트엔드 개발자**: TypeScript/Next.js에 집중
- 각자의 영역에서 독립적으로 작업 가능

## 6. Git 히스토리 관리

- 백엔드와 프론트엔드의 변경 이력을 분리하여 추적
- 각 폴더별로 `.gitignore` 설정 가능
- 필요시 서브모듈로 분리 가능

## 7. CI/CD 파이프라인 분리

```yaml
# Backend CI/CD
- Maven 빌드
- Java 테스트 실행
- JAR 파일 생성 및 배포

# Frontend CI/CD  
- npm install
- Next.js 빌드
- 정적 파일 배포 또는 SSR 서버 배포
```

**→ 각각 다른 빌드 및 배포 프로세스가 필요합니다.**

## 모노레포의 장점

하나의 저장소에 두 프로젝트를 둠으로써:

1. **코드 공유**: 공통 타입 정의, 유틸리티 등
2. **원자적 커밋**: 관련된 백엔드/프론트엔드 변경을 한 번에 커밋
3. **버전 관리**: 같은 버전으로 릴리즈 관리 가능
4. **통합 테스트**: 전체 시스템 테스트 용이

## 대안 구조와 비교

### ❌ 단일 폴더 구조 (비추천)
```
project/
├── src/
│   ├── java/          # 백엔드 코드
│   └── typescript/    # 프론트엔드 코드
├── pom.xml
└── package.json
```
**문제점**: 빌드 도구 충돌, 의존성 관리 복잡, 배포 어려움

### ✅ 현재 구조 (추천)
```
maeul-e/
├── townE-backend/     # 독립적인 Spring Boot 프로젝트
│   ├── pom.xml
│   └── src/
└── townE-frontend/    # 독립적인 Next.js 프로젝트
    ├── package.json
    └── app/
```
**장점**: 명확한 분리, 독립적 개발/배포, 표준 구조

## 결론

백엔드와 프론트엔드를 분리한 이유는:
1. **기술 스택이 완전히 다름** (Java vs TypeScript)
2. **빌드 도구가 다름** (Maven vs npm)
3. **실행 환경이 다름** (JVM vs Node.js)
4. **배포 방식이 다름** (JAR vs 정적 파일/SSR)
5. **개발 팀이 다를 수 있음** (백엔드 vs 프론트엔드)

하지만 **모노레포 구조**를 통해 하나의 저장소에서 관리하여 코드 공유와 통합 관리의 이점을 얻고 있습니다.
