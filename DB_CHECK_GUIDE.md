# DB 확인 가이드

## 확인할 데이터베이스 정보

### 연결 정보
- **Host**: 192.168.0.153
- **Port**: 3306
- **Database**: townE
- **사용자**: townE
- **비밀번호**: townE

### 확인할 테이블
**NU_MEMBER** 테이블

## 확인할 항목

### 1. NU_MEMBER 테이블 구조 확인
다음 쿼리로 테이블 구조를 확인하세요:

```sql
DESCRIBE NU_MEMBER;
-- 또는
SHOW CREATE TABLE NU_MEMBER;
```

### 2. 특별히 확인할 컬럼들

다음 컬럼들이 **TINYINT(1)** 또는 **BOOLEAN** 타입인지 확인하세요:

- `EMAILAGREE` (이메일 수신 동의)
- `SMSAGREE` (SMS 수신 동의)
- `LOGINFAILCOUNT` (로그인 실패 횟수)
- `STATUS` (상태)
- `MEMBERTYPE` (회원 타입)
- `GENDER` (성별)
- `BIRTHDAYTYPE` (양력/음력)
- `CERTTYPE` (실명인증방법)

### 3. 실제 데이터 타입 확인

다음 쿼리로 실제 컬럼 타입을 확인하세요:

```sql
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    COLUMN_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'townE' 
  AND TABLE_NAME = 'NU_MEMBER'
ORDER BY ORDINAL_POSITION;
```

### 4. 문제가 될 수 있는 경우

다음과 같은 경우 문제가 발생할 수 있습니다:

1. **TINYINT(1) 타입**: MariaDB에서 TINYINT(1)은 Boolean으로 인식될 수 있지만, 실제 값이 0, 1이 아닌 다른 정수일 수 있습니다.

2. **CHAR(1) 타입**: CHAR(1) 컬럼에 'Y', 'N' 대신 숫자 값이 들어있는 경우

3. **ENUM 타입**: ENUM 타입이 Integer로 저장되는 경우

### 5. 확인 후 알려주실 정보

다음 정보를 알려주시면 문제를 해결하는데 도움이 됩니다:

1. `EMAILAGREE`, `SMSAGREE`, `LOGINFAILCOUNT` 컬럼의 실제 타입
2. 해당 컬럼들에 저장된 실제 값의 예시 (샘플 데이터)
3. TINYINT(1) 또는 BOOLEAN 타입으로 정의된 컬럼이 있는지 여부

## 예상되는 문제

에러 메시지 `ClassCastException: class java.lang.Integer cannot be cast to class java.lang.Boolean`는 다음 중 하나일 수 있습니다:

1. **TINYINT(1) 컬럼**: DB에서는 TINYINT(1)인데 JPA가 Boolean으로 매핑하려고 함
2. **CHAR(1) 컬럼**: '0', '1' 같은 문자 값이 Integer로 해석됨
3. **Spring Data JPA 자동 생성**: `existsBy...` 메서드가 자동 생성될 때 COUNT 쿼리 결과를 Boolean으로 변환하려고 함

## 빠른 확인 쿼리

```sql
-- NU_MEMBER 테이블의 모든 컬럼 타입 확인
SELECT COLUMN_NAME, DATA_TYPE, COLUMN_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'townE' AND TABLE_NAME = 'NU_MEMBER'
ORDER BY ORDINAL_POSITION;

-- 샘플 데이터 확인 (처음 5개 행)
SELECT * FROM NU_MEMBER LIMIT 5;
```
