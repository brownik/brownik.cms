# TownE 시스템 아키텍처 종합 분석 문서

## 목차
1. [시스템 개요](#1-시스템-개요)
2. [이중 사이트 구조](#2-이중-사이트-구조)
3. [CMS 시스템 구조](#3-cms-시스템-구조)
4. [데이터베이스 구조](#4-데이터베이스-구조)
5. [렌더링 엔진](#5-렌더링-엔진)
6. [인증 및 권한 관리](#6-인증-및-권한-관리)
7. [세션 관리](#7-세션-관리)
8. [라우팅 및 URL 구조](#8-라우팅-및-url-구조)
9. [마이그레이션 전략](#9-마이그레이션-전략)

---

## 1. 시스템 개요

### 1.1 TownE 시스템 구조

TownE 시스템은 **두 개의 독립적인 사이트**로 구성되어 있으며, **동일한 데이터베이스를 공유**합니다:

- **일반 사용자 사이트 (Home)**: `https://dev.nubiz.co.kr:11141/townE`
- **관리자 사이트 (Admin)**: `https://dev.nubiz.co.kr:11141/townE/admin/`

### 1.2 핵심 특징

| 항목 | 일반 사용자 사이트 (Home) | 관리자 사이트 (Admin) |
|------|-------------------------|---------------------|
| **URL** | `/townE` 또는 `/home/**` | `/townE/admin/` 또는 `/admin/**` |
| **대상 사용자** | 일반 주민, 마을 공동체 회원 | 관리자, 운영자 |
| **인증 방식** | SNS 로그인 (카카오, 네이버, 전화번호) | ID/PW 로그인 (Spring Security) |
| **접근 제어** | 선택적 (일부 기능만 로그인 필요) | 필수 (모든 페이지 로그인 필요) |
| **CMS 관리** | 사용 불가 (읽기 전용) | CMS 관리 가능 (CRUD) |
| **기본 계정** | - | ID: `master`, PW: `master` |

### 1.3 CMS의 역할

**CMS (Content Management System)**는 **Admin 사이트에서만 관리**되며, **Home 사이트에서 사용**됩니다:

1. **Admin 사이트**: CMS를 통해 컨텐츠, 메뉴, 레이아웃, 게시판을 관리
2. **Home 사이트**: CMS에서 관리된 컨텐츠를 사용자에게 표시

---

## 2. 이중 사이트 구조

### 2.1 일반 사용자 사이트 (Home)

**경로**: `/townE` 또는 `/home/**`

**주요 기능**:
- 마을활동 관리
- 마을의제 제안 및 토론
- 마을총회 참여
- 동네한바퀴 (참여형 지도)
- 마을영상관
- 마을데이터 조회
- 마을자원지도

**컨트롤러 구조**:
```
kr.co.nubiz.home.web.HomeController
kr.co.nubiz.home.programs.* (각 프로그램별 컨트롤러)
```

**주요 컨트롤러 예시**:
- `HomeController`: 메인 페이지 및 컨텐츠 라우팅
- `TownmapHomeController`: 마을 지도 기능
- `CommunityHomeController`: 마을 공동체 관리
- `CmMappingHomeController`: 동네한바퀴 매핑
- `VoteHomeController`: 투표 기능

### 2.2 관리자 사이트 (Admin)

**경로**: `/townE/admin/` 또는 `/admin/**`

**주요 기능**:
- **CMS 관리**: 레이아웃, 메뉴, 컨텐츠, 게시판 관리
- 회원 관리
- 사이트 설정 관리
- 프로그램 설정
- 데이터셋 관리
- 통계 및 분석

**컨트롤러 구조**:
```
kr.co.nubiz.admin.web.adminController
kr.co.nubiz.admin.member.web.MemberController
kr.co.nubiz.admin.site.* (CMS 관리 컨트롤러)
kr.co.nubiz.admin.programs.* (각 프로그램별 관리 컨트롤러)
```

**주요 컨트롤러 예시**:
- `adminController`: 관리자 메인 진입점
- `MemberController`: 회원 관리
- `SiteController`: 사이트 설정 관리
- `ContentController`: 컨텐츠 관리 (CMS)
- `MenuController`: 메뉴 관리 (CMS)
- `LayoutController`: 레이아웃 관리 (CMS)
- `BoardController`: 게시판 관리 (CMS)

---

## 3. CMS 시스템 구조

### 3.1 CMS 핵심 테이블

#### 3.1.1 NU_LAYOUT (레이아웃)
- **용도**: 사이트 전체 레이아웃 관리
- **관리 위치**: Admin 사이트 (`/admin/site/layout/list.do`)
- **주요 필드**:
  - `KEY`: 레이아웃 키 (PK)
  - `SITEKEY`: 사이트 키 (FK)
  - `HEADER`: 헤더 HTML
  - `FOOTER`: 푸터 HTML
  - `LEFT`: 좌측 메뉴 HTML
  - `JS`: JavaScript 소스 코드
  - `CSS`: CSS 스타일 코드
  - `META`: 메타 태그

#### 3.1.2 NU_MENU (메뉴 구조)
- **용도**: 사이트 메뉴 구조 및 메타 정보 관리
- **관리 위치**: Admin 사이트 (`/admin/site/menu/list.do`)
- **주요 필드**:
  - `KEY`: 메뉴 키 (PK)
  - `SITEKEY`: 사이트 키 (FK)
  - `TITLE`: 메뉴 제목
  - `CONTENTTYPE`: 컨텐츠 타입 (C: 컨텐츠, B: 게시판, L: 링크, M: 메뉴, P: 프로그램)
  - `LAYOUTKEY`: 레이아웃 키 (FK)
  - `BOARDKEY`: 게시판 키 (FK, CONTENTTYPE='B'인 경우)
  - `URL`: 프로그램 URL (CONTENTTYPE='P'인 경우)
  - `ACCESSROLE`: 접근 권한

#### 3.1.3 NU_CONTENTS (컨텐츠 소스 코드)
- **용도**: 각 메뉴별 HTML/JS/CSS 소스 코드 저장
- **관리 위치**: Admin 사이트 (`/admin/site/content/list.do`)
- **사용 위치**: Home 사이트 (`/home/content.do?menu=XXX`)
- **주요 필드**:
  - `MENUKEY`: 메뉴 키 (PK, FK → NU_MENU)
  - `HTML`: HTML 소스 코드
  - `JS`: JavaScript 소스 코드
  - `CSS`: CSS 스타일 코드

#### 3.1.4 NU_BOARD (게시판 설정)
- **용도**: 게시판 설정 및 상단/하단 HTML 저장
- **관리 위치**: Admin 사이트 (`/admin/site/board/board/list.do`)
- **주요 필드**:
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

#### 3.1.5 NU_BOARD_ITEM (게시글)
- **용도**: 게시글 데이터 저장
- **관리 위치**: 
  - Admin 사이트 (`/admin/site/board/item/list.do`) - 관리자용
  - Home 사이트 (`/home/board/**`) - 사용자용
- **주요 필드**:
  - `KEY`: 게시글 키 (PK)
  - `BOARDKEY`: 게시판 키 (FK → NU_BOARD)
  - `TITLE`: 제목
  - `CONTENT`: 본문
  - `WRITER`: 작성자
  - `WRITERKEY`: 작성자 키 (FK → NU_MEMBER)

#### 3.1.6 NU_BOARD_SKIN (게시판 스킨)
- **용도**: 게시판 목록/상세보기 스킨 HTML/CSS 저장
- **관리 위치**: Admin 사이트 (`/admin/site/board/skin/list.do`)
- **주요 필드**:
  - `KEY`: 스킨 키 (PK)
  - `LIST`: 목록 스킨 HTML/CSS
  - `VIEW`: 상세보기 스킨 HTML/CSS

### 3.2 컨텐츠 타입 (CONTENTTYPE)

| CONTENTTYPE | 설명 | 데이터 저장소 | 관리 위치 | 사용 위치 |
|------------|------|--------------|----------|----------|
| **C** | CMS 컨텐츠 | `NU_CONTENTS` (HTML/JS/CSS) | Admin | Home |
| **B** | 게시판 | `NU_BOARD`, `NU_BOARD_ITEM` | Admin | Home |
| **P** | 프로그램 | 별도 테이블 (동적 데이터) | Admin | Home |
| **L** | 링크 | `NU_MENU.URL` | Admin | Home |
| **M** | 메뉴 | `NU_MENU.LINKMENUKEY` | Admin | Home |

### 3.3 CMS 워크플로우

#### 3.3.1 컨텐츠 페이지 생성 프로세스

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

[Home 사이트]
3. 사용자 접근
   - /home/content.do?menu=XXX 접근
   - NU_MENU에서 메뉴 정보 조회
   - NU_CONTENTS에서 HTML/JS/CSS 조회
   - 생성된 파일 렌더링 또는 직접 렌더링
```

#### 3.3.2 게시판 페이지 생성 프로세스

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
   - NU_MENU에서 메뉴 정보 조회 → BOARDKEY 확인
   - NU_BOARD에서 게시판 설정 조회
   - NU_BOARD_ITEM에서 게시글 목록 조회
   - 게시판 스킨(NU_BOARD_SKIN)으로 렌더링

4. 사용자 게시글 작성
   - /home/board/write.do 접근
   - 게시글 작성 후 NU_BOARD_ITEM에 저장
```

---

## 4. 데이터베이스 구조

### 4.1 공통 테이블

두 사이트는 **동일한 데이터베이스**를 사용하며, 주요 공통 테이블은 다음과 같습니다:

#### 4.1.1 회원 관련 테이블

**NU_MEMBER (회원 테이블)**:
- 두 사이트 모두 동일한 회원 테이블 사용
- `USERID`: 관리자 로그인용 ID (Admin 사이트)
- `USERPW`: 관리자 로그인용 비밀번호 (SHA-256 해시, Admin 사이트)
- `MEMBERLEVEL`: 회원 레벨 (권한 관리)
- `STATUS`: 회원 상태 (U: 사용, D: 삭제)

**NU_MEMBER_SNS (SNS 연동 테이블)**:
- 일반 사용자 사이트의 SNS 로그인 정보 저장
- `SNSTYPE`: SNS 타입 (KAKAO, NAVER 등)
- `SNSCERTKEY`: SNS 인증 키

**NU_MEMBER_SITE (회원-사이트 연결)**:
- 회원과 사이트 간 다대다 관계
- 관리자가 특정 사이트만 관리할 수 있도록 제어

#### 4.1.2 CMS 관련 테이블

**NU_SITE (사이트)**:
- 사이트 기본 정보
- 두 사이트 모두 동일한 사이트 정보 참조

**NU_DOMAIN (도메인)**:
- 도메인 URL 정보
- 세션 관리에 사용

**NU_MENU (메뉴)**:
- 사이트 메뉴 구조
- Admin에서 관리, Home에서 사용

**NU_LAYOUT (레이아웃)**:
- 사이트 레이아웃
- Admin에서 관리, Home에서 사용

**NU_CONTENTS (컨텐츠)**:
- 컨텐츠 소스 코드
- Admin에서 관리, Home에서 사용

**NU_BOARD (게시판)**:
- 게시판 설정
- Admin에서 관리, Home에서 사용

**NU_BOARD_ITEM (게시글)**:
- 게시글 데이터
- Admin에서 관리 가능, Home에서 사용자가 작성

**NU_BOARD_SKIN (게시판 스킨)**:
- 게시판 스킨
- Admin에서 관리, Home에서 사용

#### 4.1.3 프로그램 공통 테이블

다음 테이블들은 두 사이트에서 공유됩니다:
- `NU_COMMUNITY`: 마을 공동체
- `NU_COMAP_MAPPING`: 동네한바퀴 매핑
- `NU_VOTE`: 투표
- `NU_DATASET`: 데이터셋
- 기타 프로그램별 테이블

### 4.2 데이터 접근 패턴

**일반 사용자 사이트 (Home)**:
- 주로 **읽기 중심** 작업
- 일부 기능에서 **쓰기 작업** (게시글 작성, 댓글 등)
- SNS 로그인 사용자 정보 기반 데이터 조회
- CMS 컨텐츠는 읽기 전용

**관리자 사이트 (Admin)**:
- **CRUD 전반** 작업
- CMS 관리 (레이아웃, 메뉴, 컨텐츠, 게시판 설정)
- 회원 관리, 사이트 설정, 프로그램 설정 등
- ID/PW 로그인 사용자 정보 기반 데이터 관리

---

## 5. 렌더링 엔진

### 5.1 DB 저장형 CMS 렌더링 방식

TownE 시스템은 **DB 저장형 CMS**로, HTML/JS/CSS 소스 코드를 데이터베이스에 저장하고, 런타임에 이를 파일로 생성하여 동적으로 화면을 렌더링합니다.

### 5.2 파일 생성 프로세스

#### 5.2.1 관리자에서 컨텐츠 저장 시

```java
// ContentServiceImpl.java (Admin 사이트)
@Override
public void insert(ContentVO cvo){
    // 1. DB에 저장
    cMapper.insert(cvo);
    
    // 2. Context Path 치환
    String html = ContextPathUtil.replaceContextPath(cvo.getHtml());
    String css = ContextPathUtil.replaceContextPath(cvo.getCss());
    String js = ContextPathUtil.replaceContextPath(cvo.getJs());
    
    cvo.setHtml(html);
    cvo.setCss(css);
    cvo.setJs(js);
    
    // 3. 파일로 생성
    ContentFileUtil.makeFile(cvo);
}
```

#### 5.2.2 파일 생성 로직

```java
// ContentFileUtil.java
public static void makeFile(ContentVO content) {
    int siteKey = SessionUtil.getCurrentSite().getKey();
    
    // 저장 경로: /WEB-INF/jsp/view/site/{siteKey}/content/{menuKey}/
    String savePath = File.separator + "WEB-INF" + File.separator + "jsp" 
                    + File.separator + "view" + File.separator + "site" 
                    + File.separator + String.valueOf(siteKey) 
                    + File.separator + "content" 
                    + File.separator + String.valueOf(content.getMenuKey()) 
                    + File.separator;
    
    String uploadPath = CommonUtil.getRealPath() + savePath;
    
    // JSP 파일 생성 (HTML + JSP 헤더)
    String jspFileName = uploadPath + String.valueOf(content.getMenuKey()) + ".jsp";
    osw = new OutputStreamWriter(new FileOutputStream(jspFileName), Charset.forName("UTF-8").newEncoder());
    osw.write(JSP_HEADER);  // JSP 디렉티브 추가
    osw.write(content.getHtml());
    osw.close();
    
    // JS 파일 생성
    String jsFileName = uploadPath + String.valueOf(content.getMenuKey()) + ".js";
    osw = new OutputStreamWriter(new FileOutputStream(jsFileName), Charset.forName("UTF-8").newEncoder());
    osw.write(content.getJs());
    osw.close();
    
    // CSS 파일 생성
    String cssFileName = uploadPath + String.valueOf(content.getMenuKey()) + ".css";
    osw = new OutputStreamWriter(new FileOutputStream(cssFileName), Charset.forName("UTF-8").newEncoder());
    osw.write(content.getCss());
    osw.close();
}
```

### 5.3 Home 사이트 렌더링 프로세스

#### 5.3.1 요청 흐름

```
[사용자] → [Home 사이트] → [HomeController]
    ↓
[NU_MENU 조회] → [메뉴 정보 확인]
    ↓
[CONTENTTYPE 확인]
    ↓
[C: 컨텐츠] → [NU_CONTENTS 조회] → [생성된 JSP 파일 렌더링]
[B: 게시판] → [NU_BOARD 조회] → [NU_BOARD_ITEM 조회] → [게시판 스킨 렌더링]
[P: 프로그램] → [프로그램 컨트롤러 호출] → [동적 데이터 렌더링]
```

#### 5.3.2 HomeController 라우팅 로직

```java
// HomeController.java (Home 사이트)
@RequestMapping("/")
public String mainA(Model model, HttpServletRequest req, Device device) {
    String returnUrl = "";
    int siteKey = SessionUtil.getCurrentHomeSite().getKey();
    
    // 메뉴 정보 조회
    MenuHomeVO mvo = new MenuHomeVO();
    mvo.setSiteKey(siteKey);
    MenuHomeVO menuData = menuService.getMainMenu(mvo);
    LayoutVO layoutData = layoutService.getData(menuData.getLayoutKey());
    
    // 세션에 저장
    SessionUtil.setCurrentMenu(menuData);
    SessionUtil.setCurrentHomeLayout(layoutData);
    
    // 컨텐츠 타입에 따른 라우팅
    if(menuData.getContentType().equals("C")) {  // CMS 컨텐츠
        returnUrl = "/site/"+siteKey+"/content/"+menuData.getKey()+"/"+menuData.getKey();
    } else if(menuData.getContentType().equals("B")) {  // 게시판
        returnUrl = "redirect:/home/board/list.do?boardKey="+ menuData.getBoardKey();
    } else if(menuData.getContentType().equals("P")) {  // 프로그램
        returnUrl = "redirect:/home/programs/" + menuData.getUrl() + "?menu=" + menuData.getKey();
    }
    
    return returnUrl;
}
```

### 5.4 Tiles 템플릿 시스템

#### 5.4.1 Tiles 설정

```xml
<!-- tiles.xml -->
<definition name="userContentTemplate" template="/WEB-INF/jsp/tiles/home/layout.jsp">
    <put-attribute name="header" value="/WEB-INF/jsp/tiles/home/header.jsp" />
    <put-attribute name="left" value="/WEB-INF/jsp/tiles/home/left.jsp" />
    <put-attribute name="content"/>
    <put-attribute name="footer" value="/WEB-INF/jsp/tiles/home/footer.jsp" />
</definition>

<definition name="/site/*/content/*/*" extends="userContentTemplate">
    <put-attribute name="content" value="/WEB-INF/jsp/view/site/{1}/content/{2}/{3}.jsp" />
</definition>
```

#### 5.4.2 레이아웃 템플릿 구조

```jsp
<!-- /WEB-INF/jsp/tiles/home/layout.jsp -->
<!DOCTYPE html>
<html lang="${currentHomeSite.lang}">
<head>
    ${currentLayout.meta}
    <title>${currentHomeSite.title}</title>
    
    <!-- 레이아웃 JS/CSS (NU_LAYOUT에서) -->
    <script src="${_url}/download/layout/js/${currentLayout.key}.do"></script>
    <link rel="stylesheet" href="${_url}/download/layout/css/${currentLayout.key}.do" />
    
    <!-- 컨텐츠 JS/CSS (NU_CONTENTS에서) -->
    <script src="${_url}/download/content/js/${currentMenu.key}.do"></script>
    <link rel="stylesheet" href="${_url}/download/content/css/${currentMenu.key}.do" />
</head>
<body>
    <!--Header (NU_LAYOUT.HEADER)-->
    <tiles:insertAttribute name="header"/>
    <!--Left (NU_LAYOUT.LEFT)-->
    <tiles:insertAttribute name="left"/>
    <!--Content (NU_CONTENTS.HTML 또는 생성된 JSP)-->
    <tiles:insertAttribute name="content"/>
    <!--Footer (NU_LAYOUT.FOOTER)-->
    <tiles:insertAttribute name="footer"/>
</body>
</html>
```

---

## 6. 인증 및 권한 관리

### 6.1 일반 사용자 사이트 인증 (Home)

**인증 방식**: SNS 로그인 (소셜 로그인)

**지원 로그인 방식**:
1. **카카오 로그인**
2. **네이버 로그인**
3. **전화번호 로그인**
4. **기타**: 페이스북, 트위터, 구글 (선택적)

**로그인 처리 위치**:
- `CmLoginHomeController`: SNS 로그인 처리

**인증 프로세스**:
1. 사용자가 SNS 로그인 선택
2. SNS 인증 완료 후 콜백
3. `CmLoginHomeController`에서 SNS 정보 수신
4. `NU_MEMBER_SNS` 테이블에서 회원 정보 조회
5. 신규 회원인 경우 자동 가입 처리
6. 기존 회원인 경우 로그인 처리
7. 세션에 회원 정보 저장 (`getCurrentHomeMember`)

**보안 설정**:
- Spring Security 적용되지 않음 (선택적 인증)
- 일부 기능만 로그인 필요
- 메뉴별 접근 권한 체크 (`memberLevel` 기반)

### 6.2 관리자 사이트 인증 (Admin)

**인증 방식**: Spring Security 기반 ID/PW 로그인

**로그인 정보**:
- **기본 계정**: ID: `master`, PW: `master`
- **비밀번호 암호화**: SHA-256 해시

**보안 설정**:
```xml
<http auto-config="true" use-expressions="true">
    <intercept-url pattern="/admin/member/loginV.do" access="permitAll"/>
    <intercept-url pattern="/admin/**" access="hasRole('ROLE_USER')"/>
    <form-login login-page="/admin/member/loginV.do" />
    <logout logout-success-url="/admin/member/loginV.do" />
</http>
```

**인증 Provider**:
```java
// UserAuthenticationProvider.java
public Authentication authenticate(Authentication authentication) {
    String password = auth.getCredentials().toString();
    String loginType = (String) request.getSession().getAttribute("login_type");
    
    UserDetail userDetails = this.userDetailsService.loadUserByUsername(auth.getName());
    
    String encPassword = password;
    if(!"sns".equals(loginType)) {
        encPassword = EncryptionUtil.ENC_SHA256(password);
    }
    
    if(!userDetails.getPassword().equals(encPassword)) {
        throw new BadCredentialsException("ID나 비밀번호가 잘못되었습니다.");
    }
    
    return new UsernamePasswordAuthenticationToken(userDetails, auth.getCredentials(), userDetails.getAuthorities());
}
```

**권한 계층 구조**:
```
ROLE_ADMIN > ROLE_USER > ROLE_GUEST > ROLE_ANONYMOUS
```

### 6.3 회원 레벨 시스템

**공통 회원 레벨** (`MEMBERLEVEL` 컬럼):
- `0`: 비회원 (익명)
- `1`: 일반 회원
- `5`: 마을 공동체 회원
- `9`: 관리자
- `10`: 최고 관리자

**일반 사용자 사이트**:
- 메뉴별 접근 권한 체크 (`accessRole`)
- 게시판별 읽기/쓰기 권한 체크 (`listAccessRole`, `writeAccessRole`)

**관리자 사이트**:
- `memberLevel < 9`: 일반 관리자 (특정 사이트만 관리 가능)
- `memberLevel >= 9`: 최고 관리자 (모든 사이트 관리 가능)

---

## 7. 세션 관리

### 7.1 세션 구조

두 사이트는 **독립적인 세션**을 사용하지만, **동일한 세션 객체**를 공유합니다.

**세션 키 구분**:
- `sessionAdminURL`: 관리자 사이트 URL 세션
- `sessionHomeURL`: 일반 사용자 사이트 URL 세션
- `getDataLogin`: 관리자 로그인 정보
- `getCurrentHomeMember`: 일반 사용자 로그인 정보

### 7.2 도메인 체크 인터셉터

**DomainCheckHomeInterceptor**:
```java
@Override
public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object handler) {
    String url = req.getRequestURL().toString();
    
    // 접속 URL과 Session에 저장된 도메인 정보가 일치하는가?
    if(req.getSession().getAttribute("sessionAdminURL") != null && url.matches(".*\\/admin\\/.*")) {
        // Admin 사이트 세션 체크
        if(url.equals(req.getSession().getAttribute("sessionAdminURL").toString())) {
            return true;
        } else {
            return setAdminSession(req, chkURL);
        }
    } else if(req.getSession().getAttribute("sessionHomeURL") != null && url.matches(".*\\/home\\/.*")) {
        // Home 사이트 세션 체크
        if(url.equals(req.getSession().getAttribute("sessionHomeURL").toString())) {
            return true;
        } else {
            return setHomeSession(req, chkURL, null);
        }
    } else {
        // 신규 접속
        if(url.matches(".*\\/admin\\/.*")) {
            return setAdminSession(req, chkURL);
        } else {
            return setHomeSession(req, chkURL, url);
        }
    }
}
```

**세션 설정 로직**:
- `/admin/**` 경로 접근 시: `setAdminSession()` 호출
- `/home/**` 경로 접근 시: `setHomeSession()` 호출
- 도메인 정보를 기반으로 사이트 정보 설정
- 메뉴 및 레이아웃 정보 세션에 저장

### 7.3 SessionUtil 클래스

**공통 세션 유틸리티**:
```java
@Component
public class SessionUtil {
    // 현재 request 정보 반환
    public static HttpServletRequest getCurrentRequest() {
        ServletRequestAttributes sra = (ServletRequestAttributes)RequestContextHolder.currentRequestAttributes();
        return sra.getRequest();
    }
    
    // 사이트 세션 설정
    public static void setSiteSession(String url) {
        DomainVO domain = domainService.getDataByUrl(url);
        // ... 세션 설정 로직
    }
}
```

**주요 세션 메서드**:
- `getCurrentMember()`: 관리자 로그인 정보 (Admin 사이트)
- `getCurrentHomeMember()`: 일반 사용자 로그인 정보 (Home 사이트)
- `getCurrentSite()`: 관리자 사이트 정보 (Admin 사이트)
- `getCurrentHomeSite()`: 일반 사용자 사이트 정보 (Home 사이트)
- `getCurrentMenu()`: 현재 메뉴 정보
- `getCurrentDomain()`: 현재 도메인 정보

---

## 8. 라우팅 및 URL 구조

### 8.1 일반 사용자 사이트 URL 패턴 (Home)

**기본 경로**: `/townE` 또는 `/home/**`

**주요 URL 패턴**:
- `/`: 메인 페이지 (HomeController)
- `/home/content.do?menu={menuKey}`: 메뉴별 컨텐츠
- `/home/programs/{programName}/**`: 각 프로그램 기능
  - `/home/programs/townmap/list`: 마을 지도
  - `/home/programs/community/list`: 마을 공동체
  - `/home/programs/comap/mapping/list`: 동네한바퀴
  - `/home/programs/vote/list`: 투표
- `/home/member/loginV.do`: 로그인 페이지 (SNS 로그인)
- `/home/board/list.do?boardKey={boardKey}`: 게시판 목록
- `/home/board/view.do?boardKey={boardKey}&key={itemKey}`: 게시글 상세

**라우팅 처리**:
```java
// HomeController.java
@RequestMapping("/")
public String mainA(Model model, HttpServletRequest req, Device device) {
    MenuHomeVO menuData = menuService.getMainMenu(mvo);
    
    if(menuData.getContentType().equals("C")) {  // CMS 컨텐츠
        returnUrl = "/site/"+siteKey+"/content/"+menuData.getKey()+"/"+menuData.getKey();
    } else if(menuData.getContentType().equals("B")) {  // 게시판
        returnUrl = "redirect:/home/board/list.do?boardKey="+ menuData.getBoardKey();
    } else if(menuData.getContentType().equals("P")) {  // 프로그램
        returnUrl = "redirect:/home/programs/" + menuData.getUrl() + "?menu=" + menuData.getKey();
    }
    
    return returnUrl;
}
```

### 8.2 관리자 사이트 URL 패턴 (Admin)

**기본 경로**: `/townE/admin/` 또는 `/admin/**`

**주요 URL 패턴**:
- `/admin`: 관리자 진입점 (adminController)
- `/admin/member/loginV.do`: 로그인 페이지
- `/admin/member/**`: 회원 관리
- `/admin/site/**`: 사이트 관리
  - `/admin/site/layout/list.do`: 레이아웃 관리 (CMS)
  - `/admin/site/menu/list.do`: 메뉴 관리 (CMS)
  - `/admin/site/content/list.do`: 컨텐츠 관리 (CMS)
  - `/admin/site/board/board/list.do`: 게시판 설정 관리 (CMS)
  - `/admin/site/board/item/list.do`: 게시글 관리 (CMS)
  - `/admin/site/board/skin/list.do`: 게시판 스킨 관리 (CMS)
- `/admin/programs/**`: 프로그램 관리

**Spring Security 보호**:
- `/admin/**` 경로는 모두 `hasRole('ROLE_USER')` 권한 필요
- `/admin/member/loginV.do`만 `permitAll` 허용

---

## 9. 마이그레이션 전략

### 9.1 CMS 컨텐츠 (`NU_CONTENTS`)

**현재 구조**:
- Admin 사이트에서 HTML/JS/CSS를 DB에 저장
- 저장 시 JSP 파일로 생성
- Home 사이트에서 생성된 파일 렌더링

**마이그레이션 전략**:
- **Sprint 7-9**: DB 저장형 HTML/JS/CSS를 React 컴포넌트로 변환
- **전략**: HTML 파싱 → React 컴포넌트 생성
- **Admin 사이트**: Next.js Admin 페이지에서 컨텐츠 편집 (WYSIWYG 에디터)
- **Home 사이트**: Next.js Server Component로 렌더링

### 9.2 게시판 (`NU_BOARD_ITEM`)

**현재 구조**:
- Admin 사이트에서 게시판 설정 및 스킨 관리
- Home 사이트에서 게시글 작성/조회

**마이그레이션 전략**:
- **Sprint 4-6**: REST API + React 컴포넌트로 구현
- **전략**: 기존 게시판 데이터를 그대로 사용, UI만 React로 재구현
- **중요**: 게시판 스킨(`NU_BOARD_SKIN`)도 함께 마이그레이션 필요
- **Admin 사이트**: Next.js Admin 페이지에서 게시판 설정 관리
- **Home 사이트**: Next.js Server Component + Client Component로 게시판 구현

### 9.3 레이아웃 (`NU_LAYOUT`)

**현재 구조**:
- Admin 사이트에서 HEADER, FOOTER, LEFT 메뉴 관리
- Home 사이트에서 레이아웃 사용

**마이그레이션 전략**:
- **Sprint 7**: HEADER, FOOTER, LEFT 메뉴를 React 컴포넌트로 변환
- **전략**: HTML 파싱 → React 컴포넌트 생성
- **Admin 사이트**: Next.js Admin 페이지에서 레이아웃 편집
- **Home 사이트**: Next.js Layout 컴포넌트로 구현

### 9.4 메뉴 (`NU_MENU`)

**현재 구조**:
- Admin 사이트에서 메뉴 구조 관리
- Home 사이트에서 메뉴 구조 사용

**마이그레이션 전략**:
- **Sprint 7**: 메뉴 구조를 Next.js App Router 구조로 변환
- **전략**: `NU_MENU` 데이터를 기반으로 동적 라우팅 생성
- **Admin 사이트**: Next.js Admin 페이지에서 메뉴 관리
- **Home 사이트**: Next.js App Router의 동적 라우팅 사용

### 9.5 인증 시스템

**현재 구조**:
- Home 사이트: SNS 로그인 (세션 기반)
- Admin 사이트: ID/PW 로그인 (Spring Security, 세션 기반)

**마이그레이션 전략**:
- **Sprint 1-3**: JWT 기반 인증으로 전환 (완료)
- **Home 사이트**: SNS 로그인 → JWT 토큰 발급
- **Admin 사이트**: ID/PW 로그인 → JWT 토큰 발급
- **세션 제거**: JWT 토큰으로 상태 관리

---

## 10. 핵심 정리

### 10.1 CMS의 역할

**CMS는 Admin 사이트에서 관리되고, Home 사이트에서 사용됩니다:**

1. **Admin 사이트**:
   - 레이아웃 관리 (`NU_LAYOUT`)
   - 메뉴 관리 (`NU_MENU`)
   - 컨텐츠 관리 (`NU_CONTENTS`)
   - 게시판 설정 관리 (`NU_BOARD`, `NU_BOARD_SKIN`)

2. **Home 사이트**:
   - Admin에서 관리된 컨텐츠를 사용자에게 표시
   - 게시글 작성/조회 (`NU_BOARD_ITEM`)

### 10.2 게시판의 정체

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

### 10.3 두 사이트의 관계

| 구분 | Admin 사이트 | Home 사이트 |
|------|-------------|------------|
| **역할** | CMS 관리 | 컨텐츠 사용 |
| **CMS 관리** | 가능 (CRUD) | 불가능 (읽기 전용) |
| **게시판 관리** | 설정 및 게시글 관리 가능 | 게시글 작성/조회만 가능 |
| **인증** | ID/PW (Spring Security) | SNS 로그인 |
| **데이터베이스** | 동일한 데이터베이스 공유 | 동일한 데이터베이스 공유 |

---

## 문서 작성 정보

- **작성일**: 2026-01-08
- **작성자**: AI Assistant
- **버전**: 2.0
- **기반 문서**: 
  - `21_TownE_Admin_Home_Relationship.md` (소스 코드 분석)
  - `CMS_STRUCTURE_ANALYSIS.md` (사이트 분석)
  - `CMS_ADMIN_ANALYSIS.md` (CMS 관리자 분석)
  - `01_Rendering_Engine.md` (렌더링 엔진 분석)
  - `16_CMS_DB_Source_Analysis.md` (DB 소스 분석)
