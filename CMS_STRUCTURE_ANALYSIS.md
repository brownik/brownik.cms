# CMS 구조 분석 보고서

## 분석 대상 사이트
- **Home 사이트 URL**: https://dev.nubiz.co.kr:11141/townE/
- **Admin 사이트 URL**: https://dev.nubiz.co.kr:11141/townE/admin/
- **제목**: 마을e척척
- **분석 일시**: 2026-01-08

---

## 1. 시스템 아키텍처 개요

### 1.1 이중 사이트 구조

TownE 시스템은 **두 개의 독립적인 사이트**로 구성되어 있습니다:

- **Home 사이트 (일반 사용자)**: CMS에서 관리된 컨텐츠를 사용자에게 표시
- **Admin 사이트 (관리자)**: CMS를 통해 컨텐츠, 메뉴, 레이아웃, 게시판을 관리

**핵심 원칙**: CMS는 **Admin 사이트에서만 관리**되고, **Home 사이트에서 사용**됩니다.

### 1.2 메뉴 시스템 (NU_MENU)
모든 페이지는 **메뉴 키(menu parameter)**로 접근합니다.

**URL 패턴 분석:**
```
[Home 사이트]
/townE/home/content.do?menu=225        → CMS 컨텐츠 (CONTENTTYPE='C')
/townE/home/programs/...?menu=222      → 프로그램 (CONTENTTYPE='P')
/townE/home/content.do?menu=236        → 게시판 (CONTENTTYPE='B', BOARDKEY=1)

[Admin 사이트]
/townE/admin/site/content/list.do      → 컨텐츠 관리 (CMS)
/townE/admin/site/menu/list.do          → 메뉴 관리 (CMS)
/townE/admin/site/layout/list.do        → 레이아웃 관리 (CMS)
/townE/admin/site/board/board/list.do   → 게시판 설정 관리 (CMS)
```

### 1.2 컨텐츠 타입 분류

| CONTENTTYPE | 설명 | URL 패턴 | 데이터 저장소 |
|------------|------|----------|--------------|
| **C** | CMS 컨텐츠 | `/home/content.do?menu=XXX` | `NU_CONTENTS` (HTML/JS/CSS) |
| **B** | 게시판 | `/home/content.do?menu=XXX` | `NU_BOARD`, `NU_BOARD_ITEM` |
| **P** | 프로그램 | `/home/programs/...?menu=XXX` | 별도 테이블 (동적 데이터) |
| **L** | 링크 | - | - |
| **M** | 메뉴 | - | - |

---

## 2. CMS 컨텐츠 시스템 (CONTENTTYPE='C')

### 2.1 특징
- **정적 컨텐츠**: 관리자가 HTML/JS/CSS를 직접 작성하여 DB에 저장
- **읽기 전용**: 사용자는 읽기만 가능 (관리자만 편집)
- **DB 저장형**: `NU_CONTENTS` 테이블에 HTML/JS/CSS 소스 코드 저장

### 2.2 사용 예시
- 메인화면 (`menu=1`)
- 마을영상관 (`menu=239`)
- 마을데이터 (`menu=237`)
- 이용약관 (`menu=235`)

### 2.3 렌더링 방식
1. 사용자가 `/home/content.do?menu=225` 접근
2. 서버가 `NU_CONTENTS`에서 `MENUKEY=225` 조회
3. HTML/JS/CSS 소스 코드를 파일로 생성 (또는 직접 렌더링)
4. 브라우저에 전송

---

## 3. 게시판 시스템 (CONTENTTYPE='B')

### 3.1 특징
- **동적 컨텐츠**: 사용자가 게시글을 작성/수정/삭제
- **데이터 저장**: `NU_BOARD_ITEM` 테이블에 게시글 데이터 저장
- **CMS와 분리**: CMS가 아닌 독립적인 모듈

### 3.2 사용 예시
- 공지사항 (`menu=236`, `BOARDKEY=1`)

### 3.3 렌더링 방식
1. 사용자가 `/home/content.do?menu=236` 접근
2. 서버가 `NU_MENU`에서 `MENUKEY=236` 조회 → `BOARDKEY=1` 확인
3. `NU_BOARD`에서 게시판 설정 조회
4. `NU_BOARD_ITEM`에서 게시글 목록 조회
5. 게시판 스킨(`NU_BOARD_SKIN`)으로 렌더링

---

## 4. 프로그램 시스템 (CONTENTTYPE='P')

### 4.1 특징
- **복잡한 비즈니스 로직**: 마을활동, 마을의제, 마을총회 등
- **별도 컨트롤러**: `/home/programs/...` 경로 사용
- **동적 데이터**: 각 프로그램마다 별도 테이블 사용

### 4.2 사용 예시
- 마을활동: `/home/programs/townlab/listByDefault?menu=225`
- 마을의제: `/home/programs/community/listByDefaultC?menu=231`
- 마을총회: `/home/programs/community/listByDefaultV?menu=224`
- 동네한바퀴: `/home/programs/comap/mapping/listByDefault?menu=222`
- 마을자원지도: `/home/programs/townmap/list?menu=223`

---

## 5. 현재 작업 중인 게시판의 정체

### 5.1 NU_BOARD_ITEM이 사용되는 곳

**게시판 메뉴 (CONTENTTYPE='B'):**
- 공지사항 게시판 (`BOARDKEY=1`)
- 기타 게시판들 (Admin 사이트에서 생성한 게시판)

**프로그램 내부:**
- 마을활동, 마을의제, 마을총회 등은 **별도 테이블** 사용
- `NU_BOARD_ITEM`을 직접 사용하지 않을 가능성 높음

### 5.2 결론

**현재 작업 중인 `NU_BOARD_ITEM` 게시물은:**

- ✅ **CMS에서 관리되는 게시판의 게시글**
- ✅ Admin 사이트에서 게시판을 생성하고, 메뉴에 연결하여 사용
- ✅ 게시판 스킨(`NU_BOARD_SKIN`)으로 렌더링됨
- ✅ 사용자가 직접 게시글을 작성/수정/삭제하는 동적 컨텐츠
- ✅ Admin 사이트에서도 게시글 관리 가능

**CMS 게시판과의 관계:**
- **Admin 사이트**: 게시판 설정(`NU_BOARD`) 및 스킨(`NU_BOARD_SKIN`) 관리
- **Home 사이트**: 게시글 작성/조회 (`NU_BOARD_ITEM`)
- 게시판 스킨(`NU_BOARD_SKIN`)은 CMS처럼 HTML/CSS를 DB에 저장하지만, **게시글 데이터는 별도 테이블(`NU_BOARD_ITEM`) 사용**

---

## 6. 마이그레이션 전략

### 6.1 CMS 컨텐츠 (NU_CONTENTS)
- **Sprint 7-9**: DB 저장형 HTML/JS/CSS를 React 컴포넌트로 변환
- **전략**: HTML 파싱 → React 컴포넌트 생성

### 6.2 게시판 (NU_BOARD_ITEM)
- **Sprint 4-6**: REST API + React 컴포넌트로 구현
- **전략**: 기존 게시판 데이터를 그대로 사용, UI만 React로 재구현

### 6.3 프로그램 (CONTENTTYPE='P')
- **Sprint 11**: 각 프로그램별로 별도 구현
- **전략**: 기존 로직 분석 후 REST API + React로 재구현

---

## 7. 핵심 차이점 정리

| 구분 | CMS (NU_CONTENTS) | 게시판 (NU_BOARD_ITEM) | 프로그램 (P) |
|------|------------------|----------------------|-------------|
| **데이터 타입** | HTML/JS/CSS 소스 코드 | 게시글 데이터 (제목, 내용) | 비즈니스 데이터 |
| **사용자 상호작용** | 읽기 전용 | 작성/수정/삭제 가능 | 복잡한 로직 |
| **URL 패턴** | `/content.do?menu=XXX` | `/content.do?menu=XXX` | `/programs/...` |
| **렌더링** | DB → HTML 파일 생성 | DB → 스킨으로 렌더링 | 컨트롤러 로직 |
| **마이그레이션** | HTML → React 컴포넌트 | REST API + React | REST API + React |

---

## 8. 결론

**현재 Sprint 4에서 작업 중인 게시물(`NU_BOARD_ITEM`)은:**

- ✅ **CMS에서 관리되는 게시판의 게시글**
- ✅ Admin 사이트에서 게시판을 생성하고, 메뉴에 연결하여 사용
- ✅ 게시판 스킨(`NU_BOARD_SKIN`)으로 렌더링됨
- ✅ 사용자가 직접 글을 작성/수정/삭제하는 동적 컨텐츠
- ✅ Admin 사이트에서도 게시글 관리 가능

**CMS와 게시판의 관계:**
- **CMS 컨텐츠 (`NU_CONTENTS`)**: 정적 HTML 컨텐츠 관리 (Admin에서 관리, Home에서 사용)
- **게시판 (`NU_BOARD_ITEM`)**: 동적 게시글 관리 (Admin에서 설정 관리, Home에서 사용자가 작성)
- **둘 다 CMS 시스템의 일부**: Admin 사이트에서 관리되고, Home 사이트에서 사용됨

**핵심 정리:**
- CMS는 Admin 사이트에서만 관리 가능
- 게시판도 CMS의 일부로 Admin 사이트에서 관리됨
- 게시글 데이터는 동적이지만, 게시판 설정과 스킨은 CMS에서 관리됨
