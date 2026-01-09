# REST API 명세서

## 개요

이 문서는 townE 시스템의 모든 API 엔드포인트를 정의합니다. 실제 Controller 코드를 분석하여 작성되었습니다.

## API 기본 정보

- **Base URL**: `http://localhost:8080`
- **인코딩**: UTF-8
- **응답 형식**: JSON (일부는 JSP 뷰 반환)
- **인증 방식**: Spring Security Session 기반

## 공통 응답 형식

### 성공 응답
```json
{
  "success": true,
  "data": {},
  "message": "성공 메시지",
  "timestamp": 1234567890
}
```

### 실패 응답
```json
{
  "success": false,
  "error": "에러 메시지",
  "timestamp": 1234567890
}
```

## 1. 회원 관리 API

### 1.1 관리자 회원 관리

#### 1.1.1 회원 목록 조회
- **URL**: `/admin/member/list.do`
- **Method**: `GET`
- **권한**: `ROLE_USER` 이상
- **Request Parameters**:
  ```
  currentPage: int (기본값: 1)
  searchType: string (USERID, NAME, EMAIL 등)
  searchKeyword: string
  ```
- **Response**: JSP 뷰 (`/admin/member/list`)

#### 1.1.2 회원 상세 조회
- **URL**: `/admin/member/getData.do`
- **Method**: `GET`
- **권한**: `ROLE_USER` 이상
- **Request Parameters**:
  ```
  key: int (회원 키)
  ```
- **Response**: JSP 뷰 (`/admin/member/read`)

#### 1.1.3 회원 등록 (GET)
- **URL**: `/admin/member/insert.do`
- **Method**: `GET`
- **권한**: `ROLE_USER` 이상
- **Request Parameters**:
  ```
  gubun: string (P=개인, C=법인)
  ```
- **Response**: JSP 뷰 (`/admin/member/insertPerson` 또는 `/admin/member/insertCompany`)

#### 1.1.4 회원 등록 (POST)
- **URL**: `/admin/member/insert.do`
- **Method**: `POST`
- **권한**: `ROLE_USER` 이상
- **Content-Type**: `application/x-www-form-urlencoded`
- **Request Body**:
  ```json
  {
    "memberType": "P",           // P=개인, C=법인
    "userId": "testuser",
    "userPw": "password123",
    "name": "홍길동",
    "nickName": "길동이",
    "tel1": "02",
    "tel2": "1234",
    "tel3": "5678",
    "phone1": "010",
    "phone2": "1234",
    "phone3": "5678",
    "email1": "test",
    "email2": "example.com",
    "zipCode": "12345",
    "address1": "서울시 강남구",
    "address2": "테헤란로 123",
    "birthDay": "1990-01-01",
    "birthDayType": "S",        // S=양력, L=음력
    "gender": "M",              // M=남성, F=여성
    "emailAgree": "Y",          // Y=동의, N=비동의
    "smsAgree": "Y",
    "memberLevel": "1",
    "status": "U",
    // 법인 회원인 경우 추가
    "businessNumber": "123-45-67890",
    "companyName": "회사명"
  }
  ```
- **Response**: Redirect (`/admin/member/list.do`)

#### 1.1.5 회원 수정
- **URL**: `/admin/member/update.do`
- **Method**: `POST`
- **권한**: `ROLE_USER` 이상
- **Request Body**: 회원 등록과 동일 (key 필수)
- **Response**: Redirect (`/admin/member/list.do`)

#### 1.1.6 회원 삭제
- **URL**: `/admin/member/delete.do`
- **Method**: `GET`
- **권한**: `ROLE_USER` 이상
- **Request Parameters**:
  ```
  key: int (회원 키)
  ```
- **Response**: Redirect (`/admin/member/list.do`)

#### 1.1.7 아이디 중복 체크
- **URL**: `/admin/member/overlapCheck.do`
- **Method**: `POST`
- **권한**: 없음
- **Request Body**:
  ```json
  {
    "userId": "testuser"
  }
  ```
- **Response**:
  ```json
  true  // 사용 가능
  false // 중복됨
  ```

#### 1.1.8 로그인 페이지
- **URL**: `/admin/member/loginV.do`
- **Method**: `GET`
- **권한**: 없음
- **Response**: JSP 뷰 (`/admin/member/login`)

#### 1.1.9 로그아웃
- **URL**: `/admin/member/logout.do`
- **Method**: `GET`
- **권한**: `ROLE_USER` 이상
- **Response**: Redirect (`/admin/member/loginV.do`)

### 1.2 사용자 회원 관리

#### 1.2.1 회원 가입 페이지
- **URL**: `/home/member/memberInsert.do`
- **Method**: `GET`
- **권한**: 없음
- **Request Parameters**:
  ```
  gubun: string (P=개인, C=법인)
  ```
- **Response**: JSP 뷰 (`/home/member/insertPerson` 또는 `/home/member/insertCompany`)

#### 1.2.2 회원 가입
- **URL**: `/home/member/insert.do`
- **Method**: `POST`
- **권한**: 없음
- **Request Body**: 관리자 회원 등록과 동일
- **Response**: Redirect (`/`)

#### 1.2.3 회원 정보 조회
- **URL**: `/home/member/getData.do`
- **Method**: `GET`
- **권한**: 로그인 필요
- **Response**: JSP 뷰 (`/home/member/read`)

#### 1.2.4 회원 정보 수정
- **URL**: `/home/member/update.do`
- **Method**: `POST`
- **권한**: 본인만 수정 가능
- **Request Body**: 회원 등록과 동일
- **Response**: Redirect (`/`)

#### 1.2.5 로그인 페이지
- **URL**: `/home/member/loginV.do`
- **Method**: `GET`
- **권한**: 없음
- **Response**: JSP 뷰 (`/home/member/login`)

#### 1.2.6 로그아웃
- **URL**: `/home/member/logout.do`
- **Method**: `GET`
- **권한**: 로그인 필요
- **Response**: Redirect (`/`)

#### 1.2.7 FCM 토큰 업데이트
- **URL**: `/home/member/updateFcmtoken`
- **Method**: `POST`
- **권한**: 로그인 필요
- **Request Parameters**:
  ```
  memberKey: int
  fcmToken: string
  ```
- **Response**:
  ```json
  true  // 성공
  false // 실패
  ```

## 2. 게시판 API

### 2.1 게시판 목록

#### 2.1.1 게시물 목록 조회
- **URL**: `/home/board/list.do`
- **Method**: `GET`
- **권한**: 게시판 설정에 따라 다름
- **Request Parameters**:
  ```
  boardKey: int (필수)
  currentPage: int (기본값: 1)
  recordCountPerPage: int (기본값: 10)
  searchType: string (TITLE, CONTENT, WRITER 등)
  searchKeyword: string
  categoryKey: int
  ```
- **Response**: JSP 뷰 (`/home/board/list`)

#### 2.1.2 게시물 상세 조회
- **URL**: `/home/board/view.do`
- **Method**: `GET`
- **권한**: 게시판 설정에 따라 다름
- **Request Parameters**:
  ```
  boardKey: int (필수)
  key: int (게시물 키, 필수)
  ```
- **Response**: JSP 뷰 (`/home/board/view`)

#### 2.1.3 게시물 작성 페이지
- **URL**: `/home/board/write.do`
- **Method**: `GET`
- **권한**: 게시판 설정에 따라 다름
- **Request Parameters**:
  ```
  boardKey: int (필수)
  parentKey: int (답글인 경우)
  ```
- **Response**: JSP 뷰 (`/home/board/write`)

#### 2.1.4 게시물 작성
- **URL**: `/home/board/insert.do`
- **Method**: `POST`
- **권한**: 게시판 설정에 따라 다름
- **Content-Type**: `multipart/form-data`
- **Request Body**:
  ```json
  {
    "boardKey": 1,
    "categoryKey": 0,
    "title": "게시물 제목",
    "content": "게시물 내용",
    "notice": "N",              // Y=공지, N=일반
    "secret": "N",             // Y=비밀글, N=공개
    "passwd": "",              // 비밀글 비밀번호
    "openDate": "",            // 공개 시작일 (YYYY-MM-DD HH:mm:ss)
    "closeDate": "",           // 공개 종료일
    "parentKey": 0,            // 부모 게시물 키 (답글인 경우)
    "files": []                // 첨부파일 배열
  }
  ```
- **Response**: Redirect (`/home/board/list.do?boardKey={boardKey}`)

#### 2.1.5 게시물 수정 페이지
- **URL**: `/home/board/modify.do`
- **Method**: `GET`
- **권한**: 작성자 또는 관리자
- **Request Parameters**:
  ```
  boardKey: int (필수)
  key: int (게시물 키, 필수)
  ```
- **Response**: JSP 뷰 (`/home/board/modify`)

#### 2.1.6 게시물 수정
- **URL**: `/home/board/update.do`
- **Method**: `POST`
- **권한**: 작성자 또는 관리자
- **Request Body**: 게시물 작성과 동일 (key 필수)
- **Response**: Redirect (`/home/board/view.do?boardKey={boardKey}&key={key}`)

#### 2.1.7 게시물 삭제
- **URL**: `/home/board/delete.do`
- **Method**: `GET`
- **권한**: 작성자 또는 관리자
- **Request Parameters**:
  ```
  boardKey: int (필수)
  key: int (게시물 키, 필수)
  ```
- **Response**: Redirect (`/home/board/list.do?boardKey={boardKey}`)

### 2.2 게시판 댓글

#### 2.2.1 댓글 목록 조회
- **URL**: `/home/board/comment/list.do`
- **Method**: `GET`
- **권한**: 게시판 설정에 따라 다름
- **Request Parameters**:
  ```
  boardItemKey: int (필수)
  currentPage: int
  recordCountPerPage: int
  ```
- **Response**: JSON
  ```json
  {
    "success": true,
    "data": {
      "list": [
        {
          "key": 1,
          "boardItemKey": 1,
          "content": "댓글 내용",
          "writer": "작성자",
          "insertDate": "2024-01-01 12:00:00",
          "depth": 1,
          "parentKey": 0
        }
      ],
      "totalCount": 10,
      "currentPage": 1
    }
  }
  ```

#### 2.2.2 댓글 작성
- **URL**: `/home/board/comment/insert.do`
- **Method**: `POST`
- **권한**: 게시판 설정에 따라 다름
- **Request Body**:
  ```json
  {
    "boardItemKey": 1,
    "content": "댓글 내용",
    "parentKey": 0  // 대댓글인 경우 부모 댓글 키
  }
  ```
- **Response**: JSON
  ```json
  {
    "success": true,
    "message": "댓글이 등록되었습니다."
  }
  ```

#### 2.2.3 댓글 수정
- **URL**: `/home/board/comment/update.do`
- **Method**: `POST`
- **권한**: 작성자 또는 관리자
- **Request Body**:
  ```json
  {
    "key": 1,
    "content": "수정된 댓글 내용"
  }
  ```
- **Response**: JSON

#### 2.2.4 댓글 삭제
- **URL**: `/home/board/comment/delete.do`
- **Method**: `GET`
- **권한**: 작성자 또는 관리자
- **Request Parameters**:
  ```
  key: int (댓글 키)
  ```
- **Response**: JSON

## 3. 컨텐츠 관리 API

### 3.1 컨텐츠 조회
- **URL**: `/site/{siteKey}/content/{menuKey}/{menuKey}`
- **Method**: `GET`
- **권한**: 메뉴 설정에 따라 다름
- **Path Parameters**:
  ```
  siteKey: int (사이트 키)
  menuKey: int (메뉴 키)
  ```
- **Response**: JSP 뷰 (동적으로 생성된 컨텐츠)

### 3.2 컨텐츠 다운로드

#### 3.2.1 컨텐츠 JS 다운로드
- **URL**: `/download/content/js/{menuKey}.do`
- **Method**: `GET`
- **권한**: 없음
- **Path Parameters**:
  ```
  menuKey: int (메뉴 키)
  ```
- **Response**: JavaScript 파일

#### 3.2.2 컨텐츠 CSS 다운로드
- **URL**: `/download/content/css/{menuKey}.do`
- **Method**: `GET`
- **권한**: 없음
- **Path Parameters**:
  ```
  menuKey: int (메뉴 키)
  ```
- **Response**: CSS 파일

## 4. 파일 관리 API

### 4.1 파일 업로드
- **URL**: `/home/file/upload.do`
- **Method**: `POST`
- **권한**: 로그인 필요
- **Content-Type**: `multipart/form-data`
- **Request Body**:
  ```
  file: File (업로드할 파일)
  uploadDir: string (업로드 디렉토리)
  ```
- **Response**: JSON
  ```json
  {
    "success": true,
    "data": {
      "fileName": "원본파일명.jpg",
      "savedFileName": "uuid_파일명.jpg",
      "filePath": "/upload/2024/01/01/uuid_파일명.jpg",
      "fileSize": 1024000,
      "extension": "jpg"
    }
  }
  ```

### 4.2 파일 다운로드
- **URL**: `/home/file/download.do`
- **Method**: `GET`
- **권한**: 없음
- **Request Parameters**:
  ```
  filePath: string (파일 경로)
  fileName: string (다운로드할 파일명)
  ```
- **Response**: 파일 스트림

## 5. 앱 API

### 5.1 커뮤니티맵핑 API

#### 5.1.1 맵핑 전체 목록
- **URL**: `/app/api/comap/mapping/getAllList`
- **Method**: `POST`
- **권한**: 없음
- **Request Body**:
  ```json
  {
    "memberKey": 1
  }
  ```
- **Response**: JSON
  ```json
  {
    "success": true,
    "data": {
      "list": [
        {
          "key": 1,
          "title": "맵핑 제목",
          "content": "맵핑 내용",
          "latitude": 37.5665,
          "longitude": 126.9780,
          "regDate": "2024-01-01 12:00:00"
        }
      ]
    },
    "timestamp": 1234567890
  }
  ```

#### 5.1.2 맵핑 상세 조회
- **URL**: `/app/api/comap/mapping/getView`
- **Method**: `POST`
- **권한**: 없음
- **Request Body**:
  ```json
  {
    "key": 1,
    "memberKey": 1
  }
  ```
- **Response**: JSON

### 5.2 안심귀가 API

#### 5.2.1 안심귀가 상태 조회
- **URL**: `/app/api/guard/status`
- **Method**: `POST`
- **권한**: 없음
- **Response**: JSON
  ```json
  {
    "success": true,
    "data": {
      "second": 60,
      "meter": 50
    },
    "timestamp": 1234567890
  }
  ```

#### 5.2.2 안심귀가 기록 목록
- **URL**: `/app/api/guard/history/list`
- **Method**: `POST`
- **권한**: 로그인 필요
- **Request Body**:
  ```json
  {
    "memberKey": 1,
    "currentPage": 1,
    "recordCountPerPage": 10
  }
  ```
- **Response**: JSON

## 6. 공통 API

### 6.1 공통코드 조회
- **URL**: `/admin/code/getList.do`
- **Method**: `GET`
- **권한**: 없음
- **Request Parameters**:
  ```
  code: string (코드 그룹, 예: MEMBERLEVEL, TEL, PHONE, EMAIL)
  ```
- **Response**: JSON
  ```json
  {
    "success": true,
    "data": [
      {
        "key": 1,
        "code": "0",
        "codeName": "비회원",
        "group": 1,
        "step": 10
      }
    ]
  }
  ```

### 6.2 이미지 다운로드
- **URL**: `/image/{year}/{month}/{day}/{fileName}`
- **Method**: `GET`
- **권한**: 없음
- **Path Parameters**:
  ```
  year: int
  month: int
  day: int
  fileName: string
  ```
- **Response**: 이미지 파일

## 7. 에러 코드

### 7.1 HTTP 상태 코드
- `200`: 성공
- `400`: 잘못된 요청
- `401`: 인증 필요
- `403`: 권한 없음
- `404`: 리소스 없음
- `500`: 서버 오류

### 7.2 커스텀 에러 코드
- `E001`: 필수 파라미터 누락
- `E002`: 데이터 없음
- `E003`: 권한 없음
- `E004`: 중복된 데이터
- `E005`: 유효하지 않은 데이터

## 8. 인증 및 권한

### 8.1 세션 기반 인증
- Spring Security를 사용한 세션 기반 인증
- 로그인 시 세션에 사용자 정보 저장
- 세션 타임아웃: 30분 (기본값)

### 8.2 권한 레벨
- `0`: 비회원
- `1-8`: 일반 회원 (등급별)
- `9`: 최고관리자

### 8.3 Role 계층
```
ROLE_ADMIN > ROLE_USER > ROLE_GUEST > ROLE_ANONYMOUS
```

## 9. 페이징

### 9.1 페이징 파라미터
```
currentPage: int (현재 페이지, 기본값: 1)
recordCountPerPage: int (페이지당 레코드 수, 기본값: 10)
pageSize: int (페이지 그룹 크기, 기본값: 10)
```

### 9.2 페이징 응답
```json
{
  "paging": {
    "currentPageNo": 1,
    "totalRecordCount": 100,
    "recordCountPerPage": 10,
    "pageSize": 10,
    "firstRecordIndex": 0,
    "lastRecordIndex": 9,
    "firstPageNo": 1,
    "lastPageNo": 10
  }
}
```

## 10. 검색

### 10.1 검색 파라미터
```
searchType: string (검색 타입: TITLE, CONTENT, WRITER 등)
searchKeyword: string (검색 키워드)
```

### 10.2 검색 예시
```
GET /home/board/list.do?boardKey=1&searchType=TITLE&searchKeyword=테스트
```

## 11. 파일 업로드 제한

- **최대 파일 크기**: 1GB (기본값)
- **허용 확장자**: 게시판 설정에 따라 다름
- **업로드 경로**: `/upload/{year}/{month}/{day}/`

## 12. API 사용 예시

### 12.1 회원 가입 예시
```bash
curl -X POST http://localhost:8080/home/member/insert.do \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "memberType=P&userId=testuser&userPw=password123&name=홍길동&email1=test&email2=example.com"
```

### 12.2 게시물 작성 예시
```bash
curl -X POST http://localhost:8080/home/board/insert.do \
  -H "Content-Type: multipart/form-data" \
  -F "boardKey=1" \
  -F "title=게시물 제목" \
  -F "content=게시물 내용" \
  -F "files=@/path/to/file.jpg"
```

### 12.3 JSON API 호출 예시
```bash
curl -X POST http://localhost:8080/app/api/comap/mapping/getAllList \
  -H "Content-Type: application/json" \
  -d '{"memberKey": 1}'
```

## 13. 주의사항

1. **인코딩**: 모든 요청/응답은 UTF-8 인코딩 사용
2. **세션**: 세션 기반 인증이므로 쿠키 필요
3. **CSRF**: Spring Security CSRF 보호 활성화 (필요시 토큰 필요)
4. **파일 업로드**: multipart/form-data 형식 사용
5. **리다이렉트**: 대부분의 POST 요청은 리다이렉트 응답

## 14. 다음 단계

이제 다음 문서를 참고하여 실제 구현을 진행하세요:
- `07_Implementation_Code_Examples.md` - 구현 코드 예시
- `08_Deployment_Guide.md` - 배포 가이드

