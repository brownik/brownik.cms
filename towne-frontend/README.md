# townE Frontend

townE 리뉴얼 프로젝트 프론트엔드 (Next.js 14+ App Router)

## 기술 스택

- **Next.js 14+**: React 프레임워크 (App Router)
- **TypeScript**: 타입 안정성
- **Tailwind CSS**: 스타일링
- **TanStack Query**: 서버 상태 관리
- **Zustand**: 클라이언트 상태 관리
- **Axios**: HTTP 클라이언트

## 시작하기

### 개발 환경 설정

1. 의존성 설치
```bash
npm install
```

2. 환경 변수 설정
`.env.local` 파일을 생성하고 다음 내용을 추가하세요:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_NAME=townE
```

3. 개발 서버 실행
```bash
npm run dev
```

개발 서버는 `http://localhost:3000`에서 실행됩니다.

## 프로젝트 구조

```
townE-frontend/
├── app/                    # Next.js App Router 페이지
├── components/             # React 컴포넌트
├── lib/                   # 유틸리티 및 라이브러리
│   └── api/              # API 클라이언트
├── hooks/                 # Custom React Hooks
├── stores/                # Zustand 스토어
└── types/                 # TypeScript 타입 정의
```

## 주요 기능

- 인증 상태 관리 (Zustand)
- API 통신 (Axios + TanStack Query)
- JWT 토큰 자동 갱신
- CORS 설정
