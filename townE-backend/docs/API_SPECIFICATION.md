# RESTful API 명세서

## 개요
기존 JSP/Spring MVC 기반 API를 RESTful API로 전환합니다.

## API 기본 정보

- **Base URL**: `http://localhost:8080/api`
- **API Version**: `/v1`
- **인증 방식**: JWT Bearer Token
- **응답 형식**: JSON

## 공통 응답 형식

### 성공 응답
```json
{
  "success": true,
  "message": "성공 메시지",
  "data": {},
  "timestamp": "2024-01-01T12:00:00"
}
```

### 실패 응답
```json
{
  "success": false,
  "message": "에러 메시지",
  "errors": {
    "field": "에러 내용"
  },
  "timestamp": "2024-01-01T12:00:00"
}
```

## 인증 API (v1/auth)

### 회원가입
- **POST** `/api/v1/auth/signup`
- **권한**: 없음
- **Request Body**:
```json
{
  "memberType": "P",
  "userId": "testuser",
  "userPw": "password123",
  "name": "홍길동",
  "email": "test@example.com"
}
```
- **Response**: `ApiResponse<AuthResponse>`

### 로그인
- **POST** `/api/v1/auth/login`
- **권한**: 없음
- **Request Body**:
```json
{
  "userId": "testuser",
  "userPw": "password123"
}
```
- **Response**: `ApiResponse<AuthResponse>`
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "userId": "testuser",
      "name": "홍길동",
      "memberLevel": "1"
    }
  }
}
```

### 토큰 갱신
- **POST** `/api/v1/auth/refresh`
- **권한**: 없음 (Refresh Token 필요)
- **Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
- **Response**: `ApiResponse<AuthResponse>`

## 회원 API (v1/members)

### 회원 정보 조회
- **GET** `/api/v1/members/me`
- **권한**: 인증 필요
- **Response**: `ApiResponse<MemberResponse>`

### 회원 정보 수정
- **PUT** `/api/v1/members/me`
- **권한**: 본인만 수정 가능
- **Request Body**:
```json
{
  "name": "홍길동",
  "email": "newemail@example.com"
}
```
- **Response**: `ApiResponse<MemberResponse>`

## 게시판 API (v1/boards)

### 게시글 목록 조회
- **GET** `/api/v1/boards/{boardKey}/items`
- **권한**: 게시판 설정에 따라 다름
- **Query Parameters**:
  - `page`: 페이지 번호 (기본값: 0)
  - `size`: 페이지 크기 (기본값: 10)
  - `searchType`: 검색 타입 (TITLE, CONTENT, WRITER, ALL)
  - `searchKeyword`: 검색 키워드
  - `categoryKey`: 카테고리 키
- **Response**: `ApiResponse<Page<BoardItemResponse>>`

### 게시글 상세 조회
- **GET** `/api/v1/boards/{boardKey}/items/{id}`
- **권한**: 게시판 설정에 따라 다름
- **Response**: `ApiResponse<BoardItemResponse>`

### 게시글 작성
- **POST** `/api/v1/boards/{boardKey}/items`
- **권한**: 인증 필요
- **Request Body**:
```json
{
  "title": "게시글 제목",
  "content": "게시글 내용",
  "categoryKey": 0,
  "notice": "N",
  "secret": "N"
}
```
- **Response**: `ApiResponse<BoardItemResponse>`

### 게시글 수정
- **PUT** `/api/v1/boards/{boardKey}/items/{id}`
- **권한**: 작성자 또는 관리자
- **Request Body**: 게시글 작성과 동일
- **Response**: `ApiResponse<BoardItemResponse>`

### 게시글 삭제
- **DELETE** `/api/v1/boards/{boardKey}/items/{id}`
- **권한**: 작성자 또는 관리자
- **Response**: `ApiResponse<Void>`

## 댓글 API (v1/comments)

### 댓글 목록 조회
- **GET** `/api/v1/boards/{boardKey}/items/{itemId}/comments`
- **권한**: 게시판 설정에 따라 다름
- **Query Parameters**:
  - `page`: 페이지 번호
  - `size`: 페이지 크기
- **Response**: `ApiResponse<Page<CommentResponse>>`

### 댓글 작성
- **POST** `/api/v1/boards/{boardKey}/items/{itemId}/comments`
- **권한**: 인증 필요
- **Request Body**:
```json
{
  "content": "댓글 내용",
  "parentKey": 0
}
```
- **Response**: `ApiResponse<CommentResponse>`

### 댓글 수정
- **PUT** `/api/v1/comments/{id}`
- **권한**: 작성자 또는 관리자
- **Request Body**:
```json
{
  "content": "수정된 댓글 내용"
}
```
- **Response**: `ApiResponse<CommentResponse>`

### 댓글 삭제
- **DELETE** `/api/v1/comments/{id}`
- **권한**: 작성자 또는 관리자
- **Response**: `ApiResponse<Void>`

## 파일 API (v1/files)

### 파일 업로드
- **POST** `/api/v1/files/upload`
- **권한**: 인증 필요
- **Content-Type**: `multipart/form-data`
- **Request**: 파일
- **Response**: `ApiResponse<FileResponse>`

### 파일 다운로드
- **GET** `/api/v1/files/{id}`
- **권한**: 없음
- **Response**: 파일 스트림

## API 버전 관리

- 현재 버전: v1
- 향후 버전 변경 시: `/api/v2/...` 형태로 관리

## 다음 단계

Sprint 2에서 인증 API부터 구현을 시작합니다.

