# 데이터베이스 테이블 구조 명세서

## 개요

이 문서는 townE 시스템의 실제 데이터베이스 테이블 구조를 정리한 명세서입니다.

**데이터베이스 정보:**
- DBMS: MariaDB
- Host: 192.168.0.153
- Port: 3306
- Database: TOWNE
- 접속 URL: `jdbc:mariadb://192.168.0.153:3306/TOWNE`
- 사용자 계정: townE
- 비밀번호: townE

---

## 1. 회원 관련 테이블

### 1.1 NU_MEMBER (회원 정보)

| 순번 | 컬럼명 | 설명 | 타입 | NULL | 키 | 기본값 |
|------|--------|------|------|------|-----|--------|
| 1 | KEY | 회원 키 | int(11) | V | PRI | |
| 2 | USERID | 아이디 | varchar(50) | | UNI | |
| 3 | USERPW | 비밀번호 | varchar(100) | | | |
| 4 | NAME | 이름 | varchar(200) | | | |
| 5 | NICKNAME | 닉네임 | varchar(20) | | | |
| 6 | FCMTOKEN | FCM 토큰 | varchar(256) | | | |
| 7 | VOLUNTEERID | 자원봉사 ID | varchar(50) | | | |
| 8 | TEL | 전화번호 | varchar(256) | | | |
| 9 | PHONE | 핸드폰 | varchar(256) | | | |
| 10 | FAX | 팩스 | varchar(256) | | | |
| 11 | EMAIL | 이메일 | varchar(256) | | | |
| 12 | BUSINESSNUMBER | 사업자번호 | varchar(12) | | | |
| 13 | COMPANYNAME | 업체명 | varchar(50) | | | |
| 14 | EMAILAGREE | 이메일수신여부 | char(1) | | | |
| 15 | SMSAGREE | SMS수신여부 | char(1) | | | |
| 16 | CERTTYPE | 실명인증방법 | char(1) | | | |
| 17 | CERTKEY1 | 실명인증키1 | varchar(200) | | | |
| 18 | CERTKEY2 | 실명인증키2 | varchar(200) | | | |
| 19 | ZIPCODE | 우편번호 | varchar(5) | | | |
| 20 | ADDRESS1 | 주소 | varchar(100) | | | |
| 21 | ADDRESS2 | 상세주소 | varchar(100) | | | |
| 22 | GENDER | 성별 | char(1) | | | |
| 23 | BIRTHDAY | 생년월일 | varchar(256) | | | |
| 24 | BIRTHDAYTYPE | 양력/음력 | char(1) | | | |
| 25 | MEMBERLEVEL | 회원등급 | varchar(50) | | | |
| 26 | AGE | 나이 | int(11) | | | |
| 27 | STATUS | 상태 | char(1) | V | | |
| 28 | DROPREASON | 탈퇴사유 | varchar(500) | | | |
| 29 | MEMBERTYPE | 개인/법인 | char(1) | V | | |
| 30 | LASTLOGINDATE | 마지막로그인일 | datetime | | | |
| 31 | LASTLOGINIP | 마지막로그인ip | varchar(15) | | | |
| 32 | LOGINFAILCOUNT | 로그인실패횟수 | int(1) | V | | |
| 33 | AGREEMENTDATE | 회원약관승인일 | datetime | | | |
| 34 | INSERTDATE | 등록일 | datetime | V | | |
| 35 | INSERTIP | 등록IP | varchar(15) | | | |
| 36 | INSERTMEMBERKEY | 등록회원 | int(11) | | MUL | |
| 37 | UPDATEDATE | 수정일 | datetime | | | |
| 38 | UPDATEIP | 수정IP | varchar(15) | | | |
| 39 | UPDATEMEMBERKEY | 수정회원 | int(11) | | MUL | |

### 1.2 NU_MEMBER_HISTORY (회원 히스토리)

회원 정보 변경 이력을 저장하는 테이블입니다.

### 1.3 NU_MEMBER_SITE (회원-사이트 연결)

| 순번 | 컬럼명 | 설명 | 타입 | NULL | 키 |
|------|--------|------|------|------|-----|
| 1 | MEMBERKEY | 회원 키 | int(11) | V | PRI |
| 2 | SITEKEY | 사이트 키 | int(11) | V | PRI |
| 3 | INSERTDATE | 등록일 | datetime | V | |
| 4 | INSERTIP | 등록IP | varchar(15) | V | |
| 5 | INSERTMEMBERKEY | 등록회원 | int(11) | V | MUL |

### 1.4 NU_MEMBER_SNS (회원 SNS 연동)

| 순번 | 컬럼명 | 설명 | 타입 | NULL | 키 |
|------|--------|------|------|------|-----|
| 1 | MEMBERKEY | 회원 키 | int(11) | V | PRI |
| 2 | SNSTYPE | SNS종류 | varchar(50) | V | PRI |
| 3 | SNSID | SNS 계정 | varchar(100) | | |
| 4 | SNSCERTKEY | 인증키 | varchar(256) | V | |
| 5 | THUMBNAIL | SNS 프로필 | varchar(300) | | |
| 6 | STATUS | 상태 | char(1) | V | |
| 7 | INSERTDATE | 등록일 | datetime | V | |
| 8 | INSERTIP | 등록IP | varchar(15) | | |
| 9 | INSERTMEMBERKEY | 등록회원 | int(11) | | MUL |

---

## 2. 게시판 관련 테이블

### 2.1 NU_BOARD (게시판)

| 순번 | 컬럼명 | 설명 | 타입 | NULL | 키 |
|------|--------|------|------|------|-----|
| 1 | KEY | 게시판키 | int(11) | V | PRI |
| 2 | SITEKEY | 사이트키 | int(11) | V | MUL |
| 3 | TITLE | 게시판명 | varchar(50) | V | |
| 4 | BOARDTYPE | 게시판 종류 | varchar(50) | V | |
| 5 | SKINKEY | 스킨 | int(11) | V | MUL |
| 6 | LISTACCESSROLE | 목록권한 | varchar(50) | V | |
| 7 | READACCESSROLE | 읽기권한 | varchar(50) | V | |
| 8 | CUDACCESSROLE | C/U/D권한 | varchar(50) | V | |
| 9 | COMMENTACCESSROLE | 댓글권한 | varchar(50) | V | |
| 10 | REPLYACCESSROLE | 답글권한 | varchar(50) | V | |
| 11 | COMMENTUSEYN | 댓글사용여부 | char(1) | V | |
| 12 | REPLYUSEYN | 답글사용여부 | char(1) | V | |
| 13 | SECRETUSEYN | 비밀글사용여부 | char(1) | V | |
| 14 | OKEYUSEYN | 관리자승인여부 | char(1) | V | |
| 15 | RESERVATIONYN | 예약기능사용여부 | char(1) | V | |
| 16 | UPLOADUSEYN | 업로드사용여부 | char(1) | V | |
| 17 | UPLOADCOUNT | 업로드갯수 | int(11) | V | |
| 18 | UPLOADSIZE | 업로드크기 | int(11) | V | |
| 19 | UPLOADFILEEXTENSION | 허용확장자 | varchar(100) | | |
| 20 | HEADER | 상단코드 | text | | |
| 21 | FOOTER | 하단코드 | text | | |
| 22 | WRITE | 등록화면코드 | text | | |
| 23 | MODIFY | 수정화면코드 | text | | |
| 24 | STATUS | 상태 - 사용(U), 미사용(N), 삭제(D) | char(1) | V | |
| 25 | INSERTDATE | 등록일 | datetime | V | |
| 26 | INSERTIP | 등록IP | varchar(15) | V | |
| 27 | INSERTMEMBERKEY | 등록회원키 | int(11) | V | MUL |
| 28 | UPDATEDATE | 수정일 | datetime | | |
| 29 | UPDATEIP | 수정IP | varchar(15) | | |
| 30 | UPDATEMEMBERKEY | 수정회원키 | int(11) | | MUL |

### 2.2 NU_BOARD_ITEM (게시물)

| 순번 | 컬럼명 | 설명 | 타입 | NULL | 키 |
|------|--------|------|------|------|-----|
| 1 | KEY | 게시물 키 | int(11) | V | PRI |
| 2 | BOARDKEY | 게시판 키 | int(11) | V | MUL |
| 3 | CATEGORYKEY | 카테고리 키 | int(11) | V | MUL |
| 4 | TITLE | 제목 | varchar(50) | V | |
| 5 | CONTENT | 본문 | mediumtext | V | |
| 6 | WRITER | 작성자 | varchar(50) | V | |
| 7 | NOTICE | 공지사항 | char(1) | V | |
| 8 | OPENDATE | 공개기간_시작 | datetime | | |
| 9 | CLOSEDATE | 공개기간_종료 | datetime | | |
| 10 | PASSWD | 비밀번호 | varchar(30) | | |
| 11 | SECRET | 비밀글여부 | char(1) | V | |
| 12 | PARENTKEY | 부모 키 | int(11) | | MUL |
| 13 | PARENTTOPKEY | 최상위부모 키 | int(11) | | MUL |
| 14 | PARENTALLKEY | 최상위까지의 부모 키 | varchar(250) | | |
| 15 | HIT | 조회수 | int(11) | V | |
| 16 | COMMENTCOUNT | 댓글수 | int(11) | V | |
| 17 | DEPTH | 뎁스 | int(11) | V | |
| 18 | STATUS | U:승인, N:미승인, D:삭제 | char(1) | V | |
| 19 | INSERTDATE | 등록일 | datetime | V | |
| 20 | INSERTIP | 등록IP | varchar(15) | V | |
| 21 | INSERTMEMBERKEY | 등록회원 | int(11) | | MUL |
| 22 | UPDATEDATE | 수정일 | datetime | | |
| 23 | UPDATEIP | 수정IP | varchar(15) | | |
| 24 | UPDATEMEMBERKEY | 수정회원 | int(11) | | MUL |

### 2.3 NU_BOARD_COMMENT (댓글)

| 순번 | 컬럼명 | 설명 | 타입 | NULL | 키 |
|------|--------|------|------|------|-----|
| 1 | KEY | 댓글 키 | int(11) | V | PRI |
| 2 | BOARDITEMKEY | 게시물 키 | int(11) | V | MUL |
| 3 | PARENTKEY | 부모 키 | int(11) | | MUL |
| 4 | PARENTTOPKEY | 최상위부모 키 | int(11) | | MUL |
| 5 | PARENTALLKEY | 최상위까지의 부모 키 | varchar(250) | | |
| 6 | COMMENT | 본문 | varchar(500) | V | |
| 7 | WRITER | 작성자 | varchar(50) | V | |
| 8 | PASSWD | 비밀번호 | varchar(100) | | |
| 9 | DEPTH | 뎁스 | int(11) | V | |
| 10 | STATUS | U:사용, D:삭제 | char(1) | V | |
| 11 | INSERTDATE | 등록일 | datetime | V | |
| 12 | INSERTIP | 등록IP | varchar(15) | V | |
| 13 | INSERTMEMBERKEY | 등록회원 | int(11) | | MUL |
| 14 | UPDATEDATE | 수정일 | datetime | | |
| 15 | UPDATEIP | 수정IP | varchar(15) | | |
| 16 | UPDATEMEMBERKEY | 수정회원 | int(11) | | MUL |

### 2.4 NU_BOARD_FILE (첨부파일)

| 순번 | 컬럼명 | 설명 | 타입 | NULL | 키 |
|------|--------|------|------|------|-----|
| 1 | KEY | 첨부파일 키 | int(11) | V | PRI |
| 2 | BOARDITEMKEY | 게시물 키 | int(11) | V | |
| 3 | REALFILENAME | 실제파일명 | varchar(100) | V | |
| 4 | SAVEFILENAME | 저장파일명 | varchar(100) | V | |
| 5 | SIZE | 용량 | int(11) | V | |
| 6 | EXTENSION | 확장자 | varchar(5) | V | |
| 7 | MIMETYPE | MIMETYPE | varchar(50) | V | |
| 8 | DOWNLOAD | 다운로드수 | int(11) | V | |
| 9 | PATH | 저장위치 | varchar(100) | V | |
| 10 | INSERTDATE | 등록일 | datetime | V | |
| 11 | INSERTIP | 등록IP | varchar(15) | V | |
| 12 | INSERTMEMBERKEY | 등록회원 | int(11) | | |

### 2.5 NU_BOARD_CATEGORY (게시판 카테고리)

### 2.6 NU_BOARD_SKIN (게시판 스킨)

---

## 3. CMS 관련 테이블

### 3.1 NU_CONTENTS (컨텐츠)

| 순번 | 컬럼명 | 설명 | 타입 | NULL | 키 |
|------|--------|------|------|------|-----|
| 1 | MENUKEY | 메뉴키 | int(11) | V | PRI |
| 2 | HTML | HTML | longtext | | |
| 3 | JS | JS | longtext | | |
| 4 | CSS | CSS | longtext | | |
| 5 | INSERTDATE | 등록일 | datetime | V | |
| 6 | INSERTIP | 등록IP | varchar(15) | V | |
| 7 | INSERTMEMBERKEY | 등록회원키 | int(11) | V | |
| 8 | UPDATEDATE | 수정일 | datetime | | |
| 9 | UPDATEIP | 수정IP | varchar(15) | | |
| 10 | UPDATEMEMBERKEY | 수정회원키 | int(11) | | |

**중요:** HTML, JS, CSS가 DB에 저장되어 동적으로 생성됩니다. 이는 마이그레이션 시 주요 고려사항입니다.

### 3.2 NU_LAYOUT (레이아웃)

| 순번 | 컬럼명 | 설명 | 타입 | NULL | 키 |
|------|--------|------|------|------|-----|
| 1 | KEY | 레이아웃키 | int(11) | V | PRI |
| 2 | SITEKEY | 사이트키 | int(11) | V | |
| 3 | TITLE | 레이아웃명 | varchar(50) | V | |
| 4 | HEADER | HEADER | text | | |
| 5 | FOOTER | FOOTER | text | | |
| 6 | LEFT | LEFT | text | | |
| 7 | JS | JS | text | | |
| 8 | CSS | CSS | mediumtext | | |
| 9 | META | META | text | | |
| 10 | STATUS | 상태 | char(1) | V | |
| 11 | INSERTDATE | 등록일 | datetime | V | |
| 12 | INSERTIP | 등록IP | varchar(15) | V | |
| 13 | INSERTMEMBERKEY | 등록회원키 | int(11) | V | |
| 14 | UPDATEDATE | 수정일 | datetime | | |
| 15 | UPDATEIP | 수정IP | varchar(15) | | |
| 16 | UPDATEMEMBERKEY | 수정회원키 | int(11) | | |

---

## 4. 공동체 관련 테이블

### 4.1 COMMUNITY (공동체)

### 4.2 COMMUNITY_ITEM (공동체글)

### 4.3 COMMUNITY_BOARD (공동체 게시판)

### 4.4 COMMUNITY_MEMBER (공동체 회원)

### 4.5 COMMUNITY_LIKE (공동체 관심)

---

## 5. 마을랩 관련 테이블

### 5.1 PG_TOWNLAB (마을랩)

### 5.2 LAB_METTINGLOG (회의록)

### 5.3 LAB_RUNRECORD (진행기록)

### 5.4 LAB_METTINGNOTICE (모임공지)

---

## 6. 정책 관련 테이블

### 6.1 PG_CM_MAPPING (맵핑)

### 6.2 PG_CM_COMAPDAY (커맵데이)

### 6.3 PG_CM_CATEGORY (카테고리)

---

## 7. 투표 관련 테이블

### 7.1 VOTE (투표)

### 7.2 VOTE_QUESTION (투표 문항)

### 7.3 VOTE_EXAMPLE (투표 보기)

### 7.4 VOTE_ANSWER_OBJECTIVE (객관식 답변)

### 7.5 VOTE_ANSWER_SUBJECTIVE (주관식 답변)

---

## 8. 데이터셋 관련 테이블

### 8.1 PG_DATASET (데이터셋)

### 8.2 PG_DATASETCATEGORY (데이터셋 카테고리)

### 8.3 PG_DATASETFIELDS (데이터셋 필드)

### 8.4 PG_FIELDS (필드 정의)

### 8.5 ZD_DATA_* (동적 데이터셋 테이블)

**중요:** `ZD_DATA_*` 형태의 테이블들은 동적으로 생성되는 데이터셋 테이블입니다. 이는 마이그레이션 시 주요 고려사항입니다.

예시:
- ZD_DATA_628
- ZD_DATA_629
- ZD_DATA_630
- ... (다수의 동적 테이블)

---

## 9. 관리자 관련 테이블

### 9.1 NU_ADMINMENU (관리자 메뉴)

### 9.2 NU_ADMIN_IP (관리자 IP)

### 9.3 NU_LOG_ADMINLOGIN (관리자 로그인 로그)

### 9.4 NU_LOG_ADMINPAGE (관리자 페이지 로그)

---

## 10. 사이트/메뉴 관련 테이블

### 10.1 NU_SITE (사이트)

### 10.2 NU_MENU (메뉴)

### 10.3 NU_DOMAIN (도메인)

---

## 11. 파일 관련 테이블

### 11.1 NU_FILE (파일)

### 11.2 file (파일)

---

## 12. 기타 테이블

### 12.1 NU_CODE (공통코드)

### 12.2 NU_DEPART (조직도)

### 12.3 NU_POPUP (팝업)

### 12.4 push (푸시)

### 12.5 tag (태그)

### 12.6 seq_* (시퀀스 테이블)

---

## 마이그레이션 시 주요 고려사항

1. **DB 저장 소스 코드**: `NU_CONTENTS`, `NU_LAYOUT`, `NU_BOARD_SKIN` 등에 HTML/JS/CSS가 저장되어 있습니다. 이를 React 컴포넌트로 변환해야 합니다.

2. **동적 테이블 생성**: `ZD_DATA_*` 형태의 테이블들이 동적으로 생성됩니다. 이는 SQL Injection 위험이 있으므로 마이그레이션 시 검증 로직을 강화해야 합니다.

3. **대소문자 구분**: 테이블명과 컬럼명이 대문자로 되어 있습니다. Hibernate 설정 시 주의가 필요합니다.

4. **히스토리 테이블**: 대부분의 주요 테이블에 `*_HISTORY` 테이블이 존재합니다. 이는 변경 이력을 추적하기 위한 것입니다.

5. **논리 삭제**: 대부분의 테이블에서 `STATUS` 컬럼을 사용하여 논리 삭제를 구현하고 있습니다.
