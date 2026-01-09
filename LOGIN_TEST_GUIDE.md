# 로그인 테스트 가이드

## 현재 상황

기존 DB 덤프 데이터를 사용하여 로그인을 테스트합니다.

## 테스트 방법

### 1. DB에 있는 계정 확인

```bash
# 회원 목록 조회
curl http://localhost:8080/api/v1/test/members

# 특정 계정의 비밀번호 검증 테스트
curl -X POST "http://localhost:8080/api/v1/test/password-check?userId=admin&password=admin123"
```

### 2. 일반 사용자 로그인 테스트

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"userId":"실제DB의아이디","userPw":"실제비밀번호"}'
```

### 3. 관리자 로그인 테스트

```bash
curl -X POST http://localhost:8080/api/v1/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"userId":"admin","userPw":"admin123"}'
```

## 프론트엔드 테스트

1. **일반 사용자 로그인**
   - 브라우저에서 `http://localhost:3000/login` 접속
   - DB에 있는 실제 계정 정보로 로그인 시도

2. **관리자 로그인**
   - 브라우저에서 `http://localhost:3000/admin/login` 접속
   - 관리자 계정으로 로그인 시도

## 문제 해결

### 서버 오류 발생 시

1. 백엔드 서버 로그 확인
2. DB 연결 상태 확인
3. 계정 정보 확인 (`/v1/test/members`)

### 비밀번호 불일치 시

- 기존 DB의 비밀번호는 SHA-256 형식
- 새로 가입한 계정의 비밀번호는 BCrypt 형식
- 두 형식 모두 지원하도록 구현됨

## 참고

- 기존 시스템의 비밀번호는 SHA-256 해시 (64자 hex 문자열)
- 관리자 계정: MEMBERLEVEL 8 이상
- 일반 사용자: MEMBERLEVEL 0-7

