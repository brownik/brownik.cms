# CMS 프로젝트 구조 마이그레이션 계획

## 현재 구조 → 목표 구조 매핑

### common 모듈

#### common_base
```
기존: 없음
신규: common/common_base/
- constants.ts (상수)
- config.ts (설정)
- enums.ts (열거형)
```

#### common_ui
```
기존: components/common/
신규: common/common_ui/
- Header.tsx → common_ui/Header.tsx
- Footer.tsx → common_ui/Footer.tsx
- Button.tsx (신규)
- Input.tsx (신규)
- Modal.tsx (신규)
- Table.tsx (신규)
```

#### common_model
```
기존: lib/api/types.ts
신규: common/common_model/
- api.ts (API 타입)
- entity.ts (엔티티 타입)
- response.ts (응답 타입)
```

#### common_resource
```
기존: public/
신규: common/common_resource/
- icons/ (아이콘 컴포넌트)
- images/ (이미지 파일)
- locales/ (다국어 파일)
```

#### common_util
```
기존: 없음 (분산)
신규: common/common_util/
- date.ts
- format.ts
- validation.ts
- storage.ts
```

### core 모듈

#### core_data
```
기존: stores/
신규: core/core_data/stores/
- authStore.ts → core_data/stores/authStore.ts
- adminAuthStore.ts → core_data/stores/adminAuthStore.ts
```

#### core_network
```
기존: lib/api/
신규: core/core_network/
- api/client.ts → core_network/api/client.ts
- api/adminClient.ts → core_network/api/adminClient.ts
- services/authService.ts (신규)
- services/boardService.ts (신규)
- services/contentService.ts (신규)
- hooks/useApi.ts (신규)
```

#### core_database
```
기존: 없음
신규: core/core_database/
- cache/ (캐시 관리)
- storage/ (스토리지 래퍼)
```

### feature 모듈

#### feature_auth
```
기존: 
- app/login/page.tsx
- app/signup/page.tsx
- components/common/LoginButton.tsx
- lib/api/auth.ts
- lib/api/adminAuth.ts

신규: feature/feature_auth/
- components/LoginForm.tsx
- components/SignupForm.tsx
- hooks/useAuth.ts
- pages/LoginPage.tsx
- pages/SignupPage.tsx
```

#### feature_admin
```
기존:
- app/admin/**/*
- components/admin/AdminLayout.tsx

신규: feature/feature_admin/
- feature_admin_layout/
- feature_admin_menu/
- feature_admin_content/
- feature_admin_board/
- feature_admin_file/
- shared/AdminLayout.tsx
```

#### feature_board
```
기존:
- app/boards/**/*
- lib/api/board.ts

신규: feature/feature_board/
- components/BoardList.tsx
- components/BoardItem.tsx
- hooks/useBoardList.ts
- hooks/useBoardItem.ts
```

## 마이그레이션 순서

### Step 1: common 모듈 생성 (1일)
- [ ] common_base 생성
- [ ] common_ui 생성 및 컴포넌트 이동
- [ ] common_model 생성 및 타입 정리
- [ ] common_resource 생성
- [ ] common_util 생성

### Step 2: core 모듈 생성 (1일)
- [ ] core_data 생성 및 스토어 이동
- [ ] core_network 생성 및 API 클라이언트 이동
- [ ] core_network/services 생성
- [ ] core_database 생성

### Step 3: feature_auth 마이그레이션 (1일)
- [ ] feature_auth 구조 생성
- [ ] 컴포넌트 이동
- [ ] 훅 생성
- [ ] app 라우트 업데이트

### Step 4: feature_admin 마이그레이션 (2일)
- [ ] feature_admin 구조 생성
- [ ] 각 서브 feature 마이그레이션
- [ ] AdminLayout 이동
- [ ] app 라우트 업데이트

### Step 5: feature_board 마이그레이션 (1일)
- [ ] feature_board 구조 생성
- [ ] 컴포넌트 이동
- [ ] 훅 생성
- [ ] app 라우트 업데이트

### Step 6: 정리 및 테스트 (1일)
- [ ] 중복 코드 제거
- [ ] Import 경로 정리
- [ ] 테스트
- [ ] 문서화

## 주의사항

1. **점진적 마이그레이션**: 한 번에 모든 것을 변경하지 말고 단계적으로 진행
2. **기능 유지**: 마이그레이션 중에도 기존 기능이 정상 작동해야 함
3. **Import 경로**: tsconfig.json의 paths 설정 업데이트 필요
4. **테스트**: 각 단계마다 테스트 진행
