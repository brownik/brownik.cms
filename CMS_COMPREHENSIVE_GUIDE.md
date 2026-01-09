# TownE CMS 시스템 종합 가이드

## 목차
1. [시스템 개요](#1-시스템-개요)
2. [Admin/Home 사이트 관계](#2-adminhome-사이트-관계)
3. [CMS 핵심 개념](#3-cms-핵심-개념)
4. [CMS 테이블 구조](#4-cms-테이블-구조)
5. [CMS 워크플로우](#5-cms-워크플로우)
6. [게시판 시스템](#6-게시판-시스템)
7. [마이그레이션 가이드](#7-마이그레이션-가이드)

---

## 1. 시스템 개요

### 1.1 TownE 시스템 구조

TownE 시스템은 **두 개의 독립적인 사이트**로 구성되어 있으며, **동일한 데이터베이스를 공유**합니다:

```
┌─────────────────────────────────────────────────────────┐
│                    TownE 시스템                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────┐      ┌──────────────────┐       │
│  │  Admin 사이트    │      │  Home 사이트      │       │
│  │  (관리자)        │      │  (일반 사용자)    │       │
│  │                  │      │                  │       │
│  │  CMS 관리        │      │  CMS 사용        │       │
│  │  - 레이아웃      │      │  - 컨텐츠 표시    │       │
│  │  - 메뉴          │      │  - 게시글 작성   │       │
│  │  - 컨텐츠        │      │  - 프로그램 사용 │       │
│  │  - 게시판 설정   │      │                  │       │
│  └────────┬─────────┘      └────────┬─────────┘       │
│           │                         │                  │
│           └──────────┬───────────────┘                  │
│                     │                                   │
│           ┌─────────▼─────────┐                        │
│           │   공통 데이터베이스  │                        │
│           │   (MariaDB)       │                        │
│           │                    │                        │
│           │  - NU_MENU        │                        │
│           │  - NU_CONTENTS    │                        │
│           │  - NU_LAYOUT      │                        │
│           │  - NU_BOARD       │                        │
│           │  - NU_BOARD_ITEM  │                        │
│           │  - NU_BOARD_SKIN  │                        │
│           └───────────────────┘                        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 1.2 사이트별 역할

| 구분 | Admin 사이트 | Home 사이트 |
|------|-------------|------------|
| **URL** | `/townE/admin/` | `/townE/` 또는 `/home/**` |
| **대상 사용자** | 관리자, 운영자 | 일반 주민, 마을 공동체 회원 |
| **인증 방식** | ID/PW 로그인 (Spring Security) | SNS 로그인 (카카오, 네이버, 전화번호) |
| **CMS 관리** | ✅ 가능 (CRUD) | ❌ 불가능 (읽기 전용) |
| **게시판 관리** | ✅ 설정 및 게시글 관리 가능 | ✅ 게시글 작성/조회만 가능 |
| **기본 계정** | ID: `master`, PW: `master` | - |

---

## 2. Admin/Home 사이트 관계

### 2.1 CMS 관리 흐름

```
[Admin 사이트]                    [Home 사이트]
     │                                 │
     │ 1. 레이아웃 생성/수정            │
     │    (NU_LAYOUT)                  │
     │                                 │
     │ 2. 메뉴 생성/수정               │
     │    (NU_MENU)                    │
     │                                 │
     │ 3. 컨텐츠 작성/수정              │
     │    (NU_CONTENTS)                │
     │    → 파일 생성 (.jsp, .js, .css)│
     │                                 │
     │ 4. 게시판 생성/설정             │
     │    (NU_BOARD, NU_BOARD_SKIN)    │
     │                                 │
     │                                 │ 5. 사용자 접근
     │                                 │    /home/content.do?menu=XXX
     │                                 │
     │                                 │ 6. 컨텐츠 표시
     │                                 │    (생성된 파일 렌더링)
     │                                 │
     │                                 │ 7. 게시글 작성
     │                                 │    (NU_BOARD_ITEM)
     │                                 │
     │ 8. 게시글 관리                  │
     │    (NU_BOARD_ITEM)              │
     │                                 │
```

### 2.2 데이터 접근 패턴

**Admin 사이트**:
- CMS 테이블에 대한 **CRUD 작업**
- 레이아웃, 메뉴, 컨텐츠, 게시판 설정 관리
- 게시글 관리 (선택적)

**Home 사이트**:
- CMS 테이블에 대한 **읽기 작업** (컨텐츠 표시)
- 게시글 작성/조회 (`NU_BOARD_ITEM`)
- 프로그램 데이터 CRUD (마을활동, 마을의제 등)

---

## 3. CMS 핵심 개념

### 3.1 CMS의 정의

**CMS (Content Management System)**는 Admin 사이트에서만 관리되며, Home 사이트에서 사용됩니다.

**CMS 관리 항목**:
1. **레이아웃** (`NU_LAYOUT`): 사이트 전체 구조 (HEADER, FOOTER, LEFT 메뉴)
2. **메뉴** (`NU_MENU`): 사이트 메뉴 구조 및 메타 정보
3. **컨텐츠** (`NU_CONTENTS`): 각 메뉴별 HTML/JS/CSS 소스 코드
4. **게시판 설정** (`NU_BOARD`): 게시판 설정 및 상단/하단 HTML
5. **게시판 스킨** (`NU_BOARD_SKIN`): 게시판 목록/상세보기 스킨

### 3.2 컨텐츠 타입 (CONTENTTYPE)

| CONTENTTYPE | 설명 | 데이터 저장소 | 관리 위치 | 사용 위치 |
|------------|------|--------------|----------|----------|
| **C** | CMS 컨텐츠 | `NU_CONTENTS` (HTML/JS/CSS) | Admin | Home |
| **B** | 게시판 | `NU_BOARD`, `NU_BOARD_ITEM` | Admin | Home |
| **P** | 프로그램 | 별도 테이블 (동적 데이터) | Admin | Home |
| **L** | 링크 | `NU_MENU.URL` | Admin | Home |
| **M** | 메뉴 | `NU_MENU.LINKMENUKEY` | Admin | Home |

### 3.3 CMS와 일반 컨텐츠의 차이

| 구분 | CMS 컨텐츠 (`NU_CONTENTS`) | 일반 컨텐츠 |
|------|--------------------------|------------|
| **관리 위치** | Admin 사이트에서만 관리 | - |
| **데이터 저장** | HTML/JS/CSS 소스 코드를 DB에 저장 | - |
| **파일 생성** | 저장 시 JSP/JS/CSS 파일로 생성 | - |
| **렌더링** | 생성된 파일 또는 DB에서 직접 렌더링 | - |
| **사용 위치** | Home 사이트에서 표시 | - |

---

## 4. CMS 테이블 구조

### 4.1 NU_LAYOUT (레이아웃)

**용도**: 사이트 전체 레이아웃 관리

**관리 위치**: Admin 사이트 (`/admin/site/layout/list.do`)

**주요 필드**:
- `KEY`: 레이아웃 키 (PK)
- `SITEKEY`: 사이트 키 (FK)
- `HEADER`: 헤더 HTML
- `FOOTER`: 푸터 HTML
- `LEFT`: 좌측 메뉴 HTML
- `JS`: JavaScript 소스 코드
- `CSS`: CSS 스타일 코드
- `META`: 메타 태그

**사용 위치**: Home 사이트 (모든 페이지의 기본 레이아웃)

### 4.2 NU_MENU (메뉴 구조)

**용도**: 사이트 메뉴 구조 및 메타 정보 관리

**관리 위치**: Admin 사이트 (`/admin/site/menu/list.do`)

**주요 필드**:
- `KEY`: 메뉴 키 (PK)
- `SITEKEY`: 사이트 키 (FK)
- `TITLE`: 메뉴 제목
- `CONTENTTYPE`: 컨텐츠 타입 (C, B, L, M, P)
- `LAYOUTKEY`: 레이아웃 키 (FK → NU_LAYOUT)
- `BOARDKEY`: 게시판 키 (FK → NU_BOARD, CONTENTTYPE='B'인 경우)
- `URL`: 프로그램 URL (CONTENTTYPE='P'인 경우)
- `ACCESSROLE`: 접근 권한

**사용 위치**: Home 사이트 (메뉴 네비게이션 및 라우팅)

### 4.3 NU_CONTENTS (컨텐츠 소스 코드)

**용도**: 각 메뉴별 HTML/JS/CSS 소스 코드 저장

**관리 위치**: Admin 사이트 (`/admin/site/content/list.do`)

**사용 위치**: Home 사이트 (`/home/content.do?menu=XXX`)

**주요 필드**:
- `MENUKEY`: 메뉴 키 (PK, FK → NU_MENU)
- `HTML`: HTML 소스 코드
- `JS`: JavaScript 소스 코드
- `CSS`: CSS 스타일 코드

**특징**:
- DB에 HTML/JS/CSS를 직접 저장
- Admin에서 저장 시 파일로 생성 (`.jsp`, `.js`, `.css`)
- Home에서 생성된 파일 렌더링 또는 DB에서 직접 렌더링

### 4.4 NU_BOARD (게시판 설정)

**용도**: 게시판 설정 및 상단/하단 HTML 저장

**관리 위치**: Admin 사이트 (`/admin/site/board/board/list.do`)

**사용 위치**: Home 사이트 (`/home/board/list.do?boardKey=XXX`)

**주요 필드**:
- `KEY`: 게시판 키 (PK)
- `SITEKEY`: 사이트 키 (FK)
- `TITLE`: 게시판명
- `BOARDTYPE`: 게시판 종류
- `SKINKEY`: 스킨 키 (FK → NU_BOARD_SKIN)
- `HEADER`: 게시판 상단 HTML
- `FOOTER`: 게시판 하단 HTML
- `WRITE`: 등록화면 코드
- `MODIFY`: 수정화면 코드
- 권한 설정 필드들 (`LISTACCESSROLE`, `READACCESSROLE`, `CUDACCESSROLE` 등)

### 4.5 NU_BOARD_ITEM (게시글)

**용도**: 게시글 데이터 저장

**관리 위치**: 
- Admin 사이트 (`/admin/site/board/item/list.do`) - 관리자용
- Home 사이트 (`/home/board/**`) - 사용자용

**주요 필드**:
- `KEY`: 게시글 키 (PK)
- `BOARDKEY`: 게시판 키 (FK → NU_BOARD)
- `TITLE`: 제목
- `CONTENT`: 본문
- `WRITER`: 작성자
- `WRITERKEY`: 작성자 키 (FK → NU_MEMBER)

**특징**:
- Admin 사이트에서 게시판을 생성하고, 메뉴에 연결
- Home 사이트에서 사용자가 게시글 작성/조회
- Admin 사이트에서도 게시글 관리 가능

### 4.6 NU_BOARD_SKIN (게시판 스킨)

**용도**: 게시판 목록/상세보기 스킨 HTML/CSS 저장

**관리 위치**: Admin 사이트 (`/admin/site/board/skin/list.do`)

**사용 위치**: Home 사이트 (게시판 렌더링 시)

**주요 필드**:
- `KEY`: 스킨 키 (PK)
- `LIST`: 목록 스킨 HTML/CSS
- `VIEW`: 상세보기 스킨 HTML/CSS

---

## 5. CMS 워크플로우

### 5.1 컨텐츠 페이지 생성 프로세스

```
[Admin 사이트]
1. 메뉴 생성 (NU_MENU)
   - 메뉴 제목, 설명 입력
   - CONTENTTYPE='C' 선택
   - 레이아웃 선택

2. 컨텐츠 작성 (NU_CONTENTS)
   - HTML 소스 코드 작성
   - JavaScript 소스 코드 작성
   - CSS 스타일 코드 작성
   - 저장 시 파일로 생성
     → /WEB-INF/jsp/view/site/{siteKey}/content/{menuKey}/{menuKey}.jsp
     → /WEB-INF/jsp/view/site/{siteKey}/content/{menuKey}/{menuKey}.js
     → /WEB-INF/jsp/view/site/{siteKey}/content/{menuKey}/{menuKey}.css

[Home 사이트]
3. 사용자 접근
   - /home/content.do?menu=XXX 접근
   - HomeController에서 NU_MENU 조회
   - CONTENTTYPE='C' 확인
   - NU_CONTENTS에서 HTML/JS/CSS 조회
   - 생성된 파일 렌더링 또는 직접 렌더링
```

### 5.2 게시판 페이지 생성 프로세스

```
[Admin 사이트]
1. 게시판 생성 (NU_BOARD)
   - 게시판 설정 (권한, 기능 등)
   - 게시판 스킨 선택 또는 작성 (NU_BOARD_SKIN)

2. 메뉴 연결 (NU_MENU)
   - 메뉴 생성 시 CONTENTTYPE='B' 선택
   - 생성한 게시판과 연결 (BOARDKEY 설정)

[Home 사이트]
3. 사용자 접근
   - /home/content.do?menu=XXX 접근
   - HomeController에서 NU_MENU 조회
   - CONTENTTYPE='B' 확인
   - BOARDKEY 확인
   - NU_BOARD에서 게시판 설정 조회
   - NU_BOARD_ITEM에서 게시글 목록 조회
   - 게시판 스킨(NU_BOARD_SKIN)으로 렌더링

4. 사용자 게시글 작성
   - /home/board/write.do 접근
   - 게시글 작성 후 NU_BOARD_ITEM에 저장
```

---

## 6. 게시판 시스템

### 6.1 게시판의 정체

**Sprint 4에서 작업 중인 `NU_BOARD_ITEM` 게시물은:**

- ✅ **CMS에서 관리되는 게시판의 게시글**
- ✅ **Admin 사이트**에서 게시판을 생성하고, 메뉴에 연결하여 사용
- ✅ 게시판 스킨(`NU_BOARD_SKIN`)으로 렌더링됨
- ✅ **Home 사이트**에서 사용자가 직접 게시글을 작성/수정/삭제하는 동적 컨텐츠
- ✅ **Admin 사이트**에서도 게시글 관리 가능

### 6.2 게시판 관리 흐름

```
[Admin 사이트]
1. 게시판 생성
   - NU_BOARD에 게시판 설정 저장
   - NU_BOARD_SKIN에 스킨 저장

2. 메뉴에 연결
   - NU_MENU에 메뉴 생성
   - CONTENTTYPE='B' 설정
   - BOARDKEY 설정

[Home 사이트]
3. 사용자 게시글 작성
   - NU_BOARD_ITEM에 게시글 저장

[Admin 사이트]
4. 게시글 관리 (선택적)
   - NU_BOARD_ITEM에서 게시글 조회/수정/삭제
```

### 6.3 CMS 컨텐츠 vs 게시판

| 구분 | CMS 컨텐츠 (`NU_CONTENTS`) | 게시판 (`NU_BOARD_ITEM`) |
|------|--------------------------|-------------------------|
| **관리 위치** | Admin 사이트에서만 관리 | Admin 사이트에서 설정 관리, Home 사이트에서 게시글 작성 |
| **데이터 저장** | HTML/JS/CSS 소스 코드 | 게시글 데이터 (제목, 내용, 작성자) |
| **관리 방식** | 관리자만 편집 가능 | 사용자가 게시글 작성/수정 가능 |
| **렌더링** | 저장된 HTML 그대로 렌더링 | 스킨 템플릿 + 데이터 조합 렌더링 |
| **동적성** | 정적 (관리자가 수정해야 변경) | 동적 (사용자가 실시간 작성) |
| **CMS 관리** | ✅ CMS의 핵심 | ✅ CMS의 일부 (게시판 설정 및 스킨) |

---

## 7. 마이그레이션 가이드

### 7.1 CMS 컨텐츠 (`NU_CONTENTS`)

**현재 구조**:
- Admin 사이트에서 HTML/JS/CSS를 DB에 저장
- 저장 시 JSP 파일로 생성
- Home 사이트에서 생성된 파일 렌더링

**마이그레이션 전략**:
- **Sprint 7-9**: DB 저장형 HTML/JS/CSS를 React 컴포넌트로 변환
- **전략**: HTML 파싱 → React 컴포넌트 생성
- **Admin 사이트**: Next.js Admin 페이지에서 컨텐츠 편집 (WYSIWYG 에디터)
- **Home 사이트**: Next.js Server Component로 렌더링

### 7.2 게시판 (`NU_BOARD_ITEM`)

**현재 구조**:
- Admin 사이트에서 게시판 설정 및 스킨 관리
- Home 사이트에서 게시글 작성/조회

**마이그레이션 전략**:
- **Sprint 4-6**: REST API + React 컴포넌트로 구현
- **전략**: 기존 게시판 데이터를 그대로 사용, UI만 React로 재구현
- **중요**: 게시판 스킨(`NU_BOARD_SKIN`)도 함께 마이그레이션 필요
- **Admin 사이트**: Next.js Admin 페이지에서 게시판 설정 관리
- **Home 사이트**: Next.js Server Component + Client Component로 게시판 구현

### 7.3 레이아웃 (`NU_LAYOUT`)

**현재 구조**:
- Admin 사이트에서 HEADER, FOOTER, LEFT 메뉴 관리
- Home 사이트에서 레이아웃 사용

**마이그레이션 전략**:
- **Sprint 7**: HEADER, FOOTER, LEFT 메뉴를 React 컴포넌트로 변환
- **전략**: HTML 파싱 → React 컴포넌트 생성
- **Admin 사이트**: Next.js Admin 페이지에서 레이아웃 편집
- **Home 사이트**: Next.js Layout 컴포넌트로 구현

### 7.4 메뉴 (`NU_MENU`)

**현재 구조**:
- Admin 사이트에서 메뉴 구조 관리
- Home 사이트에서 메뉴 구조 사용

**마이그레이션 전략**:
- **Sprint 7**: 메뉴 구조를 Next.js App Router 구조로 변환
- **전략**: `NU_MENU` 데이터를 기반으로 동적 라우팅 생성
- **Admin 사이트**: Next.js Admin 페이지에서 메뉴 관리
- **Home 사이트**: Next.js App Router의 동적 라우팅 사용

---

## 8. 핵심 정리

### 8.1 CMS의 역할

**CMS는 Admin 사이트에서만 관리되고, Home 사이트에서 사용됩니다:**

1. **Admin 사이트**:
   - 레이아웃 관리 (`NU_LAYOUT`)
   - 메뉴 관리 (`NU_MENU`)
   - 컨텐츠 관리 (`NU_CONTENTS`)
   - 게시판 설정 관리 (`NU_BOARD`, `NU_BOARD_SKIN`)
   - 게시글 관리 (`NU_BOARD_ITEM`, 선택적)

2. **Home 사이트**:
   - Admin에서 관리된 컨텐츠를 사용자에게 표시
   - 게시글 작성/조회 (`NU_BOARD_ITEM`)

### 8.2 게시판의 정체

**Sprint 4에서 작업 중인 `NU_BOARD_ITEM` 게시물은:**

- ✅ **CMS에서 관리되는 게시판의 게시글**
- ✅ Admin 사이트에서 게시판을 생성하고, 메뉴에 연결하여 사용
- ✅ 게시판 스킨(`NU_BOARD_SKIN`)으로 렌더링됨
- ✅ 사용자가 직접 게시글을 작성/수정/삭제하는 동적 컨텐츠
- ✅ Admin 사이트에서도 게시글 관리 가능

**따라서:**
- CMS에서 만드는 게시판이 맞습니다!
- 하지만 게시글 데이터는 `NU_BOARD_ITEM`에 저장되는 동적 데이터입니다.
- CMS는 게시판 설정과 스킨을 관리하고, 실제 게시글은 사용자가 작성합니다.

### 8.3 두 사이트의 관계

| 구분 | Admin 사이트 | Home 사이트 |
|------|-------------|------------|
| **역할** | CMS 관리 | 컨텐츠 사용 |
| **CMS 관리** | 가능 (CRUD) | 불가능 (읽기 전용) |
| **게시판 관리** | 설정 및 게시글 관리 가능 | 게시글 작성/조회만 가능 |
| **인증** | ID/PW (Spring Security) | SNS 로그인 |
| **데이터베이스** | 동일한 데이터베이스 공유 | 동일한 데이터베이스 공유 |

---

## 참고 문서

- `21_TownE_System_Architecture.md`: 시스템 아키텍처 종합 분석
- `21_TownE_Admin_Home_Relationship.md`: Admin/Home 사이트 상관관계 분석 (소스 코드 기반)
- `CMS_STRUCTURE_ANALYSIS.md`: CMS 구조 분석 (사이트 분석 기반)
- `CMS_ADMIN_ANALYSIS.md`: CMS 관리자 시스템 분석
- `01_Rendering_Engine.md`: 렌더링 엔진 분석
- `16_CMS_DB_Source_Analysis.md`: CMS DB 소스 분석
