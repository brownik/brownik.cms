# townE 리뉴얼 프로젝트

JSP/Spring MVC 기반 시스템을 Next.js(App Router)로 전환하는 프로젝트입니다.

## 프로젝트 구조

```
maeul-e/
├── townE-frontend/     # Next.js 프론트엔드 + API Routes (백엔드 통합)
└── new_analysis_docs/   # 분석 문서 및 가이드
```

## 기술 스택

### Full-Stack (Next.js)
- Next.js 14+ (App Router)
- TypeScript
- Prisma (ORM)
- MariaDB
- JWT 인증
- Tailwind CSS
- TanStack Query
- Zustand
- Axios

## 시작하기

### 개발 서버 실행
```bash
cd townE-frontend
npm install
npm run dev
```

애플리케이션은 `http://localhost:3000`에서 실행됩니다.
API는 `http://localhost:3000/api`에서 제공됩니다.

## 주요 기능

### CMS/DMS 관리자 시스템
- 레이아웃 관리
- 메뉴 관리
- 컨텐츠 관리
- 게시판 관리
- 파일 관리

### 게시판 모듈
- 게시글 CRUD
- 댓글 기능
- 페이징 및 검색

## 문서

자세한 내용은 `new_analysis_docs/` 폴더의 문서를 참고하세요.

## 라이선스

Private Project
