# Sprint 4 테스트 가이드

## Sprint 4 완료 확인 방법

Sprint 4는 게시판 모듈의 백엔드 API 구현이 완료되었습니다. 프론트엔드에서 테스트할 수 있도록 테스트 페이지를 생성했습니다.

## 구현된 기능

### 백엔드 API (완료)
- ✅ US-022: 게시글 목록 조회 API (`GET /api/v1/boards/{boardKey}/items`)
- ✅ US-023: 게시글 상세 조회 API (`GET /api/v1/boards/{boardKey}/items/{itemKey}`)
- ✅ US-024: 게시글 작성 API (`POST /api/v1/boards/{boardKey}/items`)
- ✅ US-025: 게시글 수정 API (`PUT /api/v1/boards/{boardKey}/items/{itemKey}`)
- ✅ US-026: 게시글 삭제 API (`DELETE /api/v1/boards/{boardKey}/items/{itemKey}`)

### 프론트엔드 테스트 페이지 (생성 완료)
- ✅ 게시판 목록 페이지: `/boards/[boardKey]`
- ✅ 게시글 상세 페이지: `/boards/[boardKey]/items/[itemKey]`
- ✅ 게시글 작성/수정/삭제 기능

## 테스트 방법

### 1. 백엔드 서버 실행

```bash
cd townE-backend
mvn spring-boot:run
```

백엔드 서버는 `http://localhost:8080`에서 실행됩니다.

### 2. 프론트엔드 서버 실행

```bash
cd townE-frontend
npm run dev
```

프론트엔드 서버는 `http://localhost:3000`에서 실행됩니다.

### 3. 브라우저에서 테스트

1. **게시판 목록 페이지 접속**
   - URL: `http://localhost:3000/boards/1`
   - 게시판 키는 1번을 사용 (실제 DB에 있는 게시판 키로 변경 가능)

2. **게시글 작성 테스트**
   - "글쓰기" 버튼 클릭
   - 작성자, 제목, 내용 입력 후 "작성하기" 클릭
   - 목록에 새 게시글이 표시되는지 확인

3. **게시글 상세 조회 테스트**
   - 목록에서 게시글 제목 클릭
   - 상세 페이지에서 게시글 내용 확인
   - 조회수가 증가하는지 확인

4. **게시글 수정 테스트**
   - 상세 페이지에서 "수정" 버튼 클릭
   - 내용 수정 후 "수정하기" 클릭
   - 수정된 내용이 반영되는지 확인

5. **게시글 삭제 테스트**
   - 상세 페이지 또는 목록에서 "삭제" 버튼 클릭
   - 확인 후 삭제
   - 목록에서 게시글이 사라지는지 확인 (논리 삭제)

6. **검색 기능 테스트**
   - 검색어 입력 후 "검색" 버튼 클릭
   - 검색 결과가 표시되는지 확인

7. **페이지네이션 테스트**
   - 게시글이 많은 경우 "다음" 버튼 클릭
   - 페이지 이동이 정상 작동하는지 확인

## API 엔드포인트 확인

### 게시글 목록 조회
```bash
curl 'http://localhost:8080/api/v1/boards/1/items?page=0&size=10'
```

### 게시글 상세 조회
```bash
curl 'http://localhost:8080/api/v1/boards/1/items/1'
```

### 게시글 작성
```bash
curl -X POST 'http://localhost:8080/api/v1/boards/1/items' \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "테스트 게시글",
    "content": "테스트 내용",
    "writer": "테스트 작성자"
  }'
```

### 게시글 수정
```bash
curl -X PUT 'http://localhost:8080/api/v1/boards/1/items/1' \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "수정된 제목",
    "content": "수정된 내용"
  }'
```

### 게시글 삭제
```bash
curl -X DELETE 'http://localhost:8080/api/v1/boards/1/items/1'
```

## 생성된 파일

### 백엔드
- `townE-backend/src/main/java/kr/co/nubiz/controller/api/BoardItemController.java`
- `townE-backend/src/main/java/kr/co/nubiz/service/BoardItemService.java`
- `townE-backend/src/main/java/kr/co/nubiz/repository/BoardItemRepository.java`
- `townE-backend/src/main/java/kr/co/nubiz/entity/BoardItem.java`
- `townE-backend/src/main/java/kr/co/nubiz/dto/board/*.java`
- `townE-backend/src/test/java/kr/co/nubiz/service/BoardItemServiceTest.java`

### 프론트엔드
- `townE-frontend/lib/api/board.ts` - 게시판 API 클라이언트
- `townE-frontend/app/boards/[boardKey]/page.tsx` - 게시판 목록 페이지
- `townE-frontend/app/boards/[boardKey]/items/[itemKey]/page.tsx` - 게시글 상세 페이지

## 주의사항

1. **게시판 키 (boardKey)**: 실제 DB에 존재하는 게시판 키를 사용해야 합니다. 기본값은 1입니다.
2. **인증**: 현재는 인증 없이도 테스트 가능하도록 구현되어 있습니다. 추후 JWT 인증이 완료되면 로그인이 필요합니다.
3. **권한 확인**: 작성자 권한 확인 로직은 TODO로 남아있습니다. 현재는 모든 사용자가 수정/삭제 가능합니다.

## 다음 단계

Sprint 4가 완료되었으므로, 다음 Sprint로 진행하거나 추가 기능을 구현할 수 있습니다.
