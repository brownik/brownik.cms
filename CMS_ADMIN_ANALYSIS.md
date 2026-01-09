# CMS 관리자 시스템 분석 보고서

## 분석 대상
- **Admin 사이트 URL**: https://dev.nubiz.co.kr:11141/townE/admin/
- **Home 사이트 URL**: https://dev.nubiz.co.kr:11141/townE/
- **로그인 계정**: master / master
- **분석 일시**: 2026-01-08

---

## 0. 핵심 개념

**CMS는 Admin 사이트에서만 관리되고, Home 사이트에서 사용됩니다:**

- **Admin 사이트**: CMS를 통해 컨텐츠, 메뉴, 레이아웃, 게시판을 관리 (CRUD)
- **Home 사이트**: CMS에서 관리된 컨텐츠를 사용자에게 표시 (읽기 전용)

**게시판의 경우:**
- **Admin 사이트**: 게시판 설정(`NU_BOARD`) 및 스킨(`NU_BOARD_SKIN`) 관리
- **Home 사이트**: 게시글 작성/조회 (`NU_BOARD_ITEM`)

---

## 1. CMS 관리자 메뉴 구조

### 1.1 사이트별 관리 메뉴 (마을e척척 [사용] 선택 시)

#### 핵심 CMS 메뉴

| 메뉴명 | URL | 설명 | 관련 테이블 |
|--------|-----|------|------------|
| **레이아웃** | `/admin/site/layout/list.do` | 사이트 레이아웃 관리 (HEADER, FOOTER, LEFT, JS, CSS, META) | `NU_LAYOUT` |
| **메뉴** | `/admin/site/menu/list.do` | 사이트 메뉴 구조 관리 | `NU_MENU` |
| **컨텐츠** | `/admin/site/content/list.do` | 컨텐츠 소스 코드 관리 (HTML, JS, CSS) | `NU_CONTENTS` |
| **게시판** | - | 게시판 관리 | `NU_BOARD`, `NU_BOARD_ITEM`, `NU_BOARD_SKIN` |
| ├ 게시판 | `/admin/site/board/board/list.do` | 게시판 설정 관리 | `NU_BOARD` |
| ├ 게시물 | `/admin/site/board/item/list.do` | 게시글 관리 | `NU_BOARD_ITEM` |
| ├ 게시판스킨 | `/admin/site/board/skin/list.do` | 게시판 스킨 관리 | `NU_BOARD_SKIN` |
| └ 게시판담당자 | `/admin/site/board/manager/list.do` | 게시판 담당자 관리 | - |
| **파일** | `/admin/site/siteFile/list.do` | 파일 관리 | - |

#### 프로그램 메뉴

| 메뉴명 | URL | 설명 |
|--------|-----|------|
| 필드관리 | `/admin/programs/fields/list` | 동적 필드 관리 |
| 데이터셋 | - | 데이터셋 관리 |
| 마을관리 | `/admin/programs/towninfo/list` | 마을 정보 관리 |
| 마을자원지도 | `/admin/programs/townmap/list` | 마을 자원 지도 관리 |
| 그래프 템플릿 | `/admin/programs/graphTemplates/list` | 그래프 템플릿 관리 |
| 커뮤니티 맵핑 | - | 커뮤니티 맵핑 관리 |
| 공동체 관리 | `/admin/programs/community/list.nbz` | 공동체 관리 |
| 투표관리 | `/admin/programs/vote/list` | 투표 관리 |

---

## 2. CMS 핵심 기능 분석

### 2.1 레이아웃 관리 (`NU_LAYOUT`)

**용도**: 사이트 전체 레이아웃 관리
- HEADER HTML
- FOOTER HTML
- LEFT 메뉴 HTML
- JS 소스 코드
- CSS 스타일 코드
- META 태그

**관리 URL**: `/admin/site/layout/list.do`

### 2.2 메뉴 관리 (`NU_MENU`)

**용도**: 사이트 메뉴 구조 및 메타 정보 관리
- 메뉴 제목, 설명
- 컨텐츠 타입 (C: 컨텐츠, B: 게시판, L: 링크, M: 메뉴, P: 프로그램)
- 레이아웃 연결
- 게시판 연결 (CONTENTTYPE='B'인 경우)
- 접근 권한 설정

**관리 URL**: `/admin/site/menu/list.do`

### 2.3 컨텐츠 관리 (`NU_CONTENTS`)

**용도**: 각 메뉴별 HTML/JS/CSS 소스 코드 관리
- HTML 소스 코드
- JavaScript 소스 코드
- CSS 스타일 코드

**관리 URL**: `/admin/site/content/list.do`

**특징**:
- DB에 HTML/JS/CSS를 직접 저장
- 관리자가 에디터를 통해 소스 코드를 작성/수정
- 저장 시 파일로 생성되어 실제 사이트에 반영

### 2.4 게시판 관리

#### 2.4.1 게시판 설정 (`NU_BOARD`)
- 게시판명, 종류
- 스킨 설정
- 권한 설정 (목록, 읽기, 작성, 수정, 삭제, 댓글, 답글)
- 기능 설정 (댓글, 답글, 비밀글, 관리자승인, 예약, 업로드)
- 상단/하단 HTML 코드
- 등록/수정 화면 코드

#### 2.4.2 게시물 관리 (`NU_BOARD_ITEM`)
- 게시글 작성/수정/삭제
- 카테고리 관리
- 첨부파일 관리

#### 2.4.3 게시판 스킨 (`NU_BOARD_SKIN`)
- 목록 스킨 HTML/CSS
- 상세보기 스킨 HTML/CSS

---

## 3. CMS 워크플로우

### 3.1 컨텐츠 페이지 생성 프로세스

1. **메뉴 생성** (`NU_MENU`)
   - 메뉴 제목, 설명 입력
   - 컨텐츠 타입 선택 (C: 컨텐츠)
   - 레이아웃 선택

2. **컨텐츠 작성** (`NU_CONTENTS`)
   - HTML 소스 코드 작성
   - JavaScript 소스 코드 작성
   - CSS 스타일 코드 작성
   - 저장 시 파일로 생성

3. **사이트 반영**
   - DB에 저장된 소스 코드가 파일로 생성
   - 사용자가 해당 메뉴 접근 시 생성된 파일 렌더링

### 3.2 게시판 페이지 생성 프로세스

1. **게시판 생성** (`NU_BOARD`)
   - 게시판 설정 (권한, 기능 등)
   - 게시판 스킨 선택 또는 작성

2. **메뉴 연결** (`NU_MENU`)
   - 메뉴 생성 시 컨텐츠 타입을 'B' (게시판)로 선택
   - 생성한 게시판과 연결 (BOARDKEY)

3. **게시글 작성** (`NU_BOARD_ITEM`)
   - 사용자가 게시글 작성
   - 게시판 스킨으로 렌더링

---

## 4. CMS와 게시판의 관계

### 4.1 공통점
- 둘 다 CMS 관리자에서 관리됨
- 둘 다 `NU_MENU`를 통해 메뉴에 연결됨
- 둘 다 HTML/CSS를 DB에 저장할 수 있음

### 4.2 차이점

| 구분 | CMS 컨텐츠 (`NU_CONTENTS`) | 게시판 (`NU_BOARD_ITEM`) |
|------|--------------------------|-------------------------|
| **데이터 저장** | HTML/JS/CSS 소스 코드 | 게시글 데이터 (제목, 내용, 작성자) |
| **관리 방식** | 관리자만 편집 가능 | 사용자가 게시글 작성/수정 가능 |
| **렌더링** | 저장된 HTML 그대로 렌더링 | 스킨 템플릿 + 데이터 조합 렌더링 |
| **동적성** | 정적 (관리자가 수정해야 변경) | 동적 (사용자가 실시간 작성) |

### 4.3 CMS에서 게시판을 만드는 방법

1. **게시판 생성** (`NU_BOARD`)
   - 게시판 설정 및 스킨 작성

2. **메뉴에 연결** (`NU_MENU`)
   - `CONTENTTYPE='B'`
   - `BOARDKEY` 설정

3. **게시판 스킨 작성** (`NU_BOARD_SKIN`)
   - 목록 스킨 HTML/CSS
   - 상세보기 스킨 HTML/CSS

**결론**: 게시판도 CMS에서 관리되지만, 실제 게시글 데이터는 `NU_BOARD_ITEM`에 저장되는 **동적 데이터**입니다.

---

## 5. 실제 사이트 구조 확인

### 5.1 홈페이지 (`https://dev.nubiz.co.kr:11141/townE/`)

**구성 요소**:
- **레이아웃**: `NU_LAYOUT`에서 HEADER, FOOTER, LEFT 메뉴 관리
- **메뉴**: `NU_MENU`에서 메뉴 구조 관리
- **컨텐츠**: `NU_CONTENTS`에서 각 메뉴별 HTML/JS/CSS 관리
- **게시판**: `NU_BOARD`, `NU_BOARD_ITEM`에서 게시글 관리

### 5.2 메뉴 타입별 예시

| 메뉴명 | CONTENTTYPE | 데이터 소스 |
|--------|------------|------------|
| 메인화면 | C | `NU_CONTENTS` (HTML/JS/CSS) |
| 마을영상관 | C | `NU_CONTENTS` (HTML/JS/CSS) |
| 공지사항 | B | `NU_BOARD_ITEM` (게시글 데이터) |
| 마을활동 | P | 별도 프로그램 테이블 |
| 마을의제 | P | 별도 프로그램 테이블 |

---

## 6. 마이그레이션 전략

### 6.1 CMS 컨텐츠 (`NU_CONTENTS`)
- **Sprint 7-9**: DB 저장형 HTML/JS/CSS를 React 컴포넌트로 변환
- **전략**: HTML 파싱 → React 컴포넌트 생성

### 6.2 게시판 (`NU_BOARD_ITEM`)
- **Sprint 4-6**: REST API + React 컴포넌트로 구현
- **전략**: 기존 게시판 데이터를 그대로 사용, UI만 React로 재구현
- **중요**: 게시판 스킨(`NU_BOARD_SKIN`)도 함께 마이그레이션 필요

### 6.3 레이아웃 (`NU_LAYOUT`)
- **Sprint 7**: HEADER, FOOTER, LEFT 메뉴를 React 컴포넌트로 변환
- **전략**: HTML 파싱 → React 컴포넌트 생성

### 6.4 메뉴 (`NU_MENU`)
- **Sprint 7**: 메뉴 구조를 Next.js App Router 구조로 변환
- **전략**: `NU_MENU` 데이터를 기반으로 동적 라우팅 생성

---

## 7. 결론

### 7.1 CMS 구조 요약

**CMS는 다음을 관리합니다:**
1. **레이아웃** (`NU_LAYOUT`): 사이트 전체 구조
2. **메뉴** (`NU_MENU`): 사이트 메뉴 구조
3. **컨텐츠** (`NU_CONTENTS`): 정적 HTML/JS/CSS 페이지
4. **게시판** (`NU_BOARD`, `NU_BOARD_ITEM`, `NU_BOARD_SKIN`): 동적 게시판

### 7.2 현재 작업 중인 게시물의 정체

**Sprint 4에서 작업 중인 `NU_BOARD_ITEM` 게시물은:**

- ✅ **CMS에서 관리되는 게시판의 게시글**
- ✅ **Admin 사이트**에서 게시판을 생성하고, 메뉴에 연결하여 사용
- ✅ 게시판 스킨(`NU_BOARD_SKIN`)으로 렌더링됨
- ✅ **Home 사이트**에서 사용자가 직접 게시글을 작성/수정/삭제하는 동적 컨텐츠
- ✅ **Admin 사이트**에서도 게시글 관리 가능

**따라서:**
- ✅ CMS에서 만드는 게시판이 맞습니다!
- ✅ Admin 사이트에서 게시판 설정(`NU_BOARD`)과 스킨(`NU_BOARD_SKIN`)을 관리합니다.
- ✅ Home 사이트에서 사용자가 게시글을 작성하고, Admin 사이트에서도 관리할 수 있습니다.
- ✅ 게시글 데이터는 `NU_BOARD_ITEM`에 저장되는 동적 데이터입니다.

**Admin/Home 사이트 역할:**
- **Admin 사이트**: 게시판 생성, 설정, 스킨 관리, 게시글 관리 (CRUD)
- **Home 사이트**: 게시글 작성, 조회, 수정, 삭제 (일반 사용자)

---

## 8. 다음 단계

1. **컨텐츠 관리 화면 상세 분석**: 실제 HTML/JS/CSS 편집 화면 확인
2. **게시판 관리 화면 상세 분석**: 게시판 생성 및 스킨 작성 화면 확인
3. **메뉴 관리 화면 상세 분석**: 메뉴 생성 및 구조 관리 화면 확인
4. **레이아웃 관리 화면 상세 분석**: 레이아웃 편집 화면 확인
