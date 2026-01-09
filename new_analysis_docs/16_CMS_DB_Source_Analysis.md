# CMS DB 저장형 홈페이지 소스 코드 분석

## 개요

이 문서는 CMS 시스템 내 DB에 저장된 실제 홈페이지 소스 코드를 분석한 결과입니다.

## 분석 대상 테이블

### 1. NU_CONTENTS (컨텐츠 소스 코드)
- **용도**: 메뉴별 HTML, JS, CSS 소스 코드 저장
- **주요 필드**:
  - `MENUKEY`: 메뉴 키 (PK)
  - `HTML`: HTML 소스 코드
  - `JS`: JavaScript 소스 코드
  - `CSS`: CSS 스타일 코드

### 2. NU_LAYOUT (레이아웃 소스 코드)
- **용도**: 사이트 레이아웃의 HEADER, FOOTER, LEFT 메뉴, JS, CSS, META 태그 저장
- **주요 필드**:
  - `KEY`: 레이아웃 키 (PK)
  - `SITEKEY`: 사이트 키 (FK)
  - `HEADER`: 헤더 HTML
  - `FOOTER`: 푸터 HTML
  - `LEFT`: 좌측 메뉴 HTML
  - `JS`: JavaScript 소스
  - `CSS`: CSS 스타일
  - `META`: 메타 태그

### 3. NU_BOARD (게시판 소스 코드)
- **용도**: 게시판 상단/하단 HTML 저장
- **주요 필드**:
  - `KEY`: 게시판 키 (PK)
  - `SITEKEY`: 사이트 키 (FK)
  - `HEADER`: 게시판 상단 HTML
  - `FOOTER`: 게시판 하단 HTML

### 4. NU_BOARD_SKIN (게시판 스킨 소스 코드)
- **용도**: 게시판 목록/상세보기 스킨 HTML/CSS 저장
- **주요 필드**:
  - `KEY`: 스킨 키 (PK)
  - `LIST`: 목록 스킨 HTML/CSS
  - `VIEW`: 상세보기 스킨 HTML/CSS

### 5. NU_MENU (메뉴 구조)
- **용도**: 사이트 메뉴 구조 및 메타 정보 저장
- **주요 필드**:
  - `KEY`: 메뉴 키 (PK)
  - `SITEKEY`: 사이트 키 (FK)
  - `TITLE`: 메뉴 제목
  - `CONTENTTYPE`: 컨텐츠 타입 (C: 컨텐츠, B: 게시판, L: 링크, M: 메뉴, P: 프로그램)
  - `LAYOUTKEY`: 레이아웃 키 (FK)
  - `BOARDKEY`: 게시판 키 (FK)

### 6. NU_CONTENTS_HISTORY (컨텐츠 변경 이력)
- **용도**: 컨텐츠 변경 이력 저장
- **주요 필드**:
  - `HISTORYKEY`: 이력 키 (PK)
  - `MENUKEY`: 메뉴 키 (FK)
  - `HTML`: 변경 전 HTML 소스 코드
  - `JS`: 변경 전 JavaScript 소스 코드
  - `CSS`: 변경 전 CSS 스타일 코드

## 소스 코드 추출 방법

### Python 스크립트 실행

```bash
cd new_analysis_docs
python3 extract_db_sources.py
```

### 추출 결과물 위치

모든 추출된 소스 코드는 `/new_analysis_docs/source_assets/` 폴더에 저장됩니다.

#### 파일 명명 규칙

1. **NU_CONTENTS**:
   - `NU_CONTENTS_MENUKEY_{menuKey}.html`
   - `NU_CONTENTS_MENUKEY_{menuKey}.js`
   - `NU_CONTENTS_MENUKEY_{menuKey}.css`

2. **NU_LAYOUT**:
   - `NU_LAYOUT_KEY_{layoutKey}_SITE_{siteKey}_header.html`
   - `NU_LAYOUT_KEY_{layoutKey}_SITE_{siteKey}_footer.html`
   - `NU_LAYOUT_KEY_{layoutKey}_SITE_{siteKey}_left.html`
   - `NU_LAYOUT_KEY_{layoutKey}_SITE_{siteKey}.js`
   - `NU_LAYOUT_KEY_{layoutKey}_SITE_{siteKey}.css`
   - `NU_LAYOUT_KEY_{layoutKey}_SITE_{siteKey}_meta.html`

3. **NU_BOARD**:
   - `NU_BOARD_KEY_{boardKey}_SITE_{siteKey}_header.html`
   - `NU_BOARD_KEY_{boardKey}_SITE_{siteKey}_footer.html`

4. **NU_BOARD_SKIN**:
   - `NU_BOARD_SKIN_KEY_{skinKey}_list.html`
   - `NU_BOARD_SKIN_KEY_{skinKey}_view.html`

5. **NU_MENU**:
   - `NU_MENU_structure.json`: 메뉴 구조 (JSON)
   - `NU_MENU_details.txt`: 메뉴 상세 정보 (텍스트)

## 소스 코드 구조 분석

### 1. 컨텐츠 소스 코드 (NU_CONTENTS)

#### 특징
- 각 메뉴마다 독립적인 HTML, JS, CSS 소스 코드 저장
- 관리자가 웹 UI에서 직접 편집 가능
- 저장 시 자동으로 파일 시스템에 JSP 파일로 생성됨

#### 파일 생성 경로
```
/WEB-INF/jsp/view/site/{siteKey}/content/{menuKey}/
  ├── {menuKey}.jsp    (HTML 소스 + JSP 헤더)
  ├── {menuKey}.js     (JavaScript 소스)
  └── {menuKey}.css    (CSS 스타일)
```

#### 생성 로직
- `ContentFileUtil.makeFile()` 메서드에서 파일 생성
- JSP 헤더 자동 추가: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>`

### 2. 레이아웃 소스 코드 (NU_LAYOUT)

#### 특징
- 사이트 전체 레이아웃 구조 저장
- HEADER, FOOTER, LEFT 메뉴는 각각 독립적인 HTML 파일로 생성
- JS, CSS는 전역 스타일/스크립트로 사용

#### 파일 생성 경로
```
/WEB-INF/jsp/view/site/{siteKey}/layout/{layoutKey}/
  ├── {layoutKey}_header.jsp
  ├── {layoutKey}_footer.jsp
  ├── {layoutKey}_left.jsp
  ├── {layoutKey}.js
  └── {layoutKey}.css
```

#### 생성 로직
- `LayoutFileUtil.makeFile()` 메서드에서 파일 생성
- JSP 헤더 자동 추가

### 3. 게시판 소스 코드 (NU_BOARD)

#### 특징
- 게시판 상단/하단에 표시될 HTML 저장
- 게시판별로 커스터마이징 가능

### 4. 게시판 스킨 소스 코드 (NU_BOARD_SKIN)

#### 특징
- 게시판 목록/상세보기 화면의 스킨 저장
- HTML과 CSS가 함께 저장됨

## 실제 DB 데이터 분석

### 추출 전 확인 사항

1. **DB 연결 정보 확인**
   - Host: 192.168.0.141
   - Port: 3306
   - Database: townE
   - User: townE
   - Password: townE

2. **테이블 존재 여부 확인**
   ```sql
   SHOW TABLES LIKE 'NU_%';
   ```

3. **데이터 존재 여부 확인**
   ```sql
   SELECT COUNT(*) FROM NU_CONTENTS;
   SELECT COUNT(*) FROM NU_LAYOUT;
   SELECT COUNT(*) FROM NU_BOARD;
   SELECT COUNT(*) FROM NU_BOARD_SKIN;
   SELECT COUNT(*) FROM NU_MENU;
   ```

### 추출 후 분석 항목

1. **소스 코드 통계**
   - 각 테이블별 레코드 수
   - 실제 소스 코드가 있는 레코드 수
   - 평균 소스 코드 크기

2. **소스 코드 품질 분석**
   - HTML 구조 분석
   - JavaScript 라이브러리 사용 현황
   - CSS 프레임워크 사용 현황
   - 인라인 스타일/스크립트 사용 빈도

3. **의존성 분석**
   - 외부 라이브러리 의존성
   - 내부 공통 컴포넌트 사용
   - API 호출 패턴

4. **마이그레이션 복잡도 분석**
   - React 컴포넌트로 변환 가능 여부
   - 재사용 가능한 컴포넌트 식별
   - 하드코딩된 값 식별

## 마이그레이션 전략

### 1. 소스 코드 분류

#### A. 재사용 가능한 컴포넌트
- 공통 레이아웃 (HEADER, FOOTER, LEFT)
- 공통 UI 컴포넌트 (버튼, 폼 등)

#### B. 컨텐츠별 독립 컴포넌트
- 메뉴별 컨텐츠 페이지
- 게시판 스킨

#### C. 동적 생성 컴포넌트
- 관리자가 직접 편집한 HTML/JS/CSS

### 2. 변환 전략

#### 단계 1: 정적 분석
- 추출된 소스 코드를 분석하여 구조 파악
- 공통 패턴 식별
- 의존성 매핑

#### 단계 2: 컴포넌트 설계
- React 컴포넌트 구조 설계
- Props 인터페이스 정의
- 상태 관리 전략 수립

#### 단계 3: 점진적 변환
- 공통 컴포넌트부터 변환
- 컨텐츠별 컴포넌트 변환
- 동적 생성 컴포넌트는 CMS로 관리

### 3. CMS 기능 유지

#### 옵션 1: React 기반 CMS
- 관리자가 React 컴포넌트를 직접 편집
- JSX 형식으로 저장
- 빌드 시 컴포넌트로 변환

#### 옵션 2: HTML 기반 CMS (권장)
- 관리자가 HTML/JS/CSS를 편집
- 런타임에 React 컴포넌트로 렌더링
- `dangerouslySetInnerHTML` 사용 (보안 주의)

#### 옵션 3: 하이브리드
- 공통 컴포넌트는 React 컴포넌트로 관리
- 컨텐츠는 HTML로 관리
- 필요시 동적 컴포넌트 로딩

## 주의사항

### 1. 보안
- DB에 저장된 소스 코드에 XSS 취약점이 있을 수 있음
- 마이그레이션 시 보안 검토 필수

### 2. 성능
- DB에서 소스 코드를 읽어서 렌더링하는 방식은 성능 이슈 가능
- 캐싱 전략 필요

### 3. 버전 관리
- 현재는 DB에만 저장되어 Git 등 버전 관리 불가
- 마이그레이션 시 버전 관리 전략 수립 필요

## 다음 단계

1. **실제 DB 데이터 추출**
   ```bash
   python3 extract_db_sources.py
   ```

2. **추출된 소스 코드 분석**
   - 각 파일의 구조 분석
   - 공통 패턴 식별
   - 의존성 매핑

3. **마이그레이션 계획 수립**
   - 컴포넌트 설계
   - 변환 우선순위 결정
   - 일정 수립

4. **프로토타입 개발**
   - 공통 컴포넌트부터 변환
   - 테스트 및 검증

## 참고 문서

- `01_Rendering_Engine.md`: 렌더링 엔진 분석
- `04_Database_DDL_Script.md`: 데이터베이스 스키마
- `extract_db_sources.py`: 소스 코드 추출 스크립트

