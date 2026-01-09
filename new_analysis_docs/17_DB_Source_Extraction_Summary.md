# DB 저장형 소스 코드 추출 완료 보고서

## 추출 일시
2026-01-08

## 추출 결과 요약

### 전체 통계

| 테이블 | 레코드 수 | 추출된 파일 수 |
|--------|----------|---------------|
| NU_CONTENTS | 252개 | 약 500개 이상 |
| NU_LAYOUT | 5개 | 25개 (HEADER, FOOTER, LEFT, JS, CSS, META) |
| NU_BOARD | 7개 | 2개 (HEADER, FOOTER) |
| NU_BOARD_SKIN | 3개 | 12개 (LIST, READ, WRITE, MODIFY) |
| NU_MENU | 33개 | 2개 (JSON, TXT) |
| **합계** | **300개** | **540개 이상** |

### 파일 유형별 통계

- **HTML 파일**: 약 300개 이상
- **JavaScript 파일**: 약 100개 이상
- **CSS 파일**: 약 140개 이상
- **JSON 파일**: 1개 (메뉴 구조)
- **TXT 파일**: 2개 (메뉴 상세, 스키마 정보)

## 추출된 소스 코드 상세

### 1. NU_CONTENTS (컨텐츠 소스 코드)

#### 특징
- **252개 메뉴**에 대한 컨텐츠 소스 코드 추출 완료
- 각 메뉴마다 HTML, JS, CSS 파일이 생성됨
- 일부 메뉴는 HTML만 있거나, JS/CSS만 있는 경우도 있음

#### 파일 예시
```
NU_CONTENTS_MENUKEY_1.html
NU_CONTENTS_MENUKEY_1.js
NU_CONTENTS_MENUKEY_1.css
NU_CONTENTS_MENUKEY_3.html
NU_CONTENTS_MENUKEY_3.css
...
```

#### 주요 발견 사항
- 대부분의 메뉴에 HTML 소스 코드가 존재
- JavaScript는 일부 메뉴에만 존재 (약 40개)
- CSS는 많은 메뉴에 존재 (약 100개 이상)

### 2. NU_LAYOUT (레이아웃 소스 코드)

#### 특징
- **5개 레이아웃** 추출 완료
- 각 레이아웃마다 HEADER, FOOTER, LEFT, JS, CSS, META 파일 생성

#### 추출된 레이아웃
- Layout KEY 11 (SITE 1): HEADER, FOOTER, JS, CSS, META
- Layout KEY 21 (SITE 1): HEADER, FOOTER, JS, CSS, META
- Layout KEY 22 (SITE 1): HEADER, FOOTER, JS, CSS, META
- Layout KEY 25 (SITE 1): HEADER, FOOTER, LEFT, JS, CSS, META

#### 파일 예시
```
NU_LAYOUT_KEY_11_SITE_1_header.html
NU_LAYOUT_KEY_11_SITE_1_footer.html
NU_LAYOUT_KEY_11_SITE_1.js
NU_LAYOUT_KEY_11_SITE_1.css
NU_LAYOUT_KEY_11_SITE_1_meta.html
```

### 3. NU_BOARD (게시판 소스 코드)

#### 특징
- **7개 게시판** 중 **1개 게시판**에 HEADER/FOOTER 소스 코드 존재
- Board KEY 7 (SITE 5): HEADER, FOOTER

#### 파일 예시
```
NU_BOARD_KEY_7_SITE_5_header.html
NU_BOARD_KEY_7_SITE_5_footer.html
```

### 4. NU_BOARD_SKIN (게시판 스킨 소스 코드)

#### 특징
- **3개 스킨** 추출 완료
- 각 스킨마다 LIST, READ, WRITE, MODIFY 파일 생성

#### 추출된 스킨
- Skin KEY 7 (SITE 1): LIST, READ, WRITE, MODIFY
- Skin KEY 8 (SITE 5): LIST, READ, WRITE, MODIFY

#### 파일 예시
```
NU_BOARD_SKIN_KEY_7_SITE_1_list.html
NU_BOARD_SKIN_KEY_7_SITE_1_read.html
NU_BOARD_SKIN_KEY_7_SITE_1_write.html
NU_BOARD_SKIN_KEY_7_SITE_1_modify.html
```

### 5. NU_MENU (메뉴 구조)

#### 특징
- **33개 메뉴** 정보 추출 완료
- JSON 형식과 텍스트 형식으로 저장

#### 파일
- `NU_MENU_structure.json`: 메뉴 구조 (JSON)
- `NU_MENU_details.txt`: 메뉴 상세 정보 (텍스트)

## 저장 위치

모든 추출된 파일은 다음 위치에 저장되었습니다:
```
new_analysis_docs/source_assets/
```

## 파일 명명 규칙

### NU_CONTENTS
- `NU_CONTENTS_MENUKEY_{menuKey}.html`
- `NU_CONTENTS_MENUKEY_{menuKey}.js`
- `NU_CONTENTS_MENUKEY_{menuKey}.css`

### NU_LAYOUT
- `NU_LAYOUT_KEY_{layoutKey}_SITE_{siteKey}_header.html`
- `NU_LAYOUT_KEY_{layoutKey}_SITE_{siteKey}_footer.html`
- `NU_LAYOUT_KEY_{layoutKey}_SITE_{siteKey}_left.html`
- `NU_LAYOUT_KEY_{layoutKey}_SITE_{siteKey}.js`
- `NU_LAYOUT_KEY_{layoutKey}_SITE_{siteKey}.css`
- `NU_LAYOUT_KEY_{layoutKey}_SITE_{siteKey}_meta.html`

### NU_BOARD
- `NU_BOARD_KEY_{boardKey}_SITE_{siteKey}_header.html`
- `NU_BOARD_KEY_{boardKey}_SITE_{siteKey}_footer.html`

### NU_BOARD_SKIN
- `NU_BOARD_SKIN_KEY_{skinKey}_SITE_{siteKey}_list.html`
- `NU_BOARD_SKIN_KEY_{skinKey}_SITE_{siteKey}_read.html`
- `NU_BOARD_SKIN_KEY_{skinKey}_SITE_{siteKey}_write.html`
- `NU_BOARD_SKIN_KEY_{skinKey}_SITE_{siteKey}_modify.html`

## 각 파일의 메타데이터

모든 추출된 파일에는 다음 정보가 주석으로 포함되어 있습니다:

### HTML 파일
```html
<!--
DB PK: MENUKEY={menuKey}
용도: NU_CONTENTS 테이블의 HTML 컨텐츠
생성일: {INSERTDATE}
수정일: {UPDATEDATE}
-->
```

### JavaScript 파일
```javascript
/*
DB PK: MENUKEY={menuKey}
용도: NU_CONTENTS 테이블의 JavaScript 소스
생성일: {INSERTDATE}
수정일: {UPDATEDATE}
*/
```

### CSS 파일
```css
/*
DB PK: MENUKEY={menuKey}
용도: NU_CONTENTS 테이블의 CSS 스타일
생성일: {INSERTDATE}
수정일: {UPDATEDATE}
*/
```

## 다음 단계

### 1. 소스 코드 분석
- 추출된 HTML/JS/CSS 코드의 구조 분석
- 공통 패턴 식별
- 의존성 매핑

### 2. 마이그레이션 계획 수립
- React 컴포넌트 설계
- 변환 우선순위 결정
- 일정 수립

### 3. 프로토타입 개발
- 공통 컴포넌트부터 변환
- 테스트 및 검증

## 참고 문서

- `16_CMS_DB_Source_Analysis.md`: CMS DB 소스 코드 분석 가이드
- `01_Rendering_Engine.md`: 렌더링 엔진 분석
- `extract_db_sources.py`: 소스 코드 추출 스크립트

## 주의사항

1. **보안**: 추출된 소스 코드에 XSS 취약점이 있을 수 있으므로 마이그레이션 시 보안 검토 필수
2. **성능**: DB에서 소스 코드를 읽어서 렌더링하는 방식은 성능 이슈 가능하므로 캐싱 전략 필요
3. **버전 관리**: 현재는 DB에만 저장되어 Git 등 버전 관리 불가하므로 마이그레이션 시 버전 관리 전략 수립 필요

