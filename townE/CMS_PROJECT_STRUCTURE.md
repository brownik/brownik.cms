# CMS 프로젝트 구조 설계

## 프로젝트 구조 개요

이 프로젝트는 CMS(Content Management System) 서비스를 위한 구조화된 아키텍처를 따릅니다.

## 디렉토리 구조

```
townE/
├── app/                          # Next.js App Router (라우팅만 담당)
│   ├── (admin)/                  # 관리자 라우트 그룹
│   │   └── admin/
│   ├── (home)/                   # 홈 라우트 그룹
│   │   └── page.tsx
│   └── layout.tsx                # 루트 레이아웃
│
├── common/                       # 공통 모듈
│   ├── common_base/              # 기본 설정 및 상수
│   │   ├── constants.ts
│   │   ├── config.ts
│   │   └── enums.ts
│   ├── common_ui/                # 공통 UI 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Table.tsx
│   │   └── Form/
│   ├── common_model/             # 공통 데이터 모델/타입
│   │   ├── api.ts
│   │   ├── entity.ts
│   │   └── response.ts
│   ├── common_resource/           # 공통 리소스
│   │   ├── icons/
│   │   ├── images/
│   │   └── locales/
│   └── common_util/               # 공통 유틸리티
│       ├── date.ts
│       ├── format.ts
│       ├── validation.ts
│       └── storage.ts
│
├── core/                         # 핵심 비즈니스 로직
│   ├── core_data/                # 데이터 관리
│   │   ├── repositories/
│   │   ├── stores/               # Zustand 스토어
│   │   └── cache/
│   ├── core_network/             # 네트워크 계층
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   ├── interceptors.ts
│   │   │   └── endpoints.ts
│   │   ├── services/             # API 서비스
│   │   │   ├── authService.ts
│   │   │   ├── boardService.ts
│   │   │   └── contentService.ts
│   │   └── hooks/                # 네트워크 관련 훅
│   │       └── useApi.ts
│   └── core_database/            # 데이터베이스 관련 (클라이언트 캐시)
│       ├── cache/
│       ├── storage/
│       └── indexdb/              # IndexedDB (선택적)
│
├── feature/                      # Feature 모듈 (UI/UX 담당)
│   ├── feature_auth/             # 인증 Feature
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   └── pages/
│   │       └── LoginPage.tsx
│   │
│   ├── feature_admin/            # 관리자 Feature
│   │   ├── feature_admin_layout/  # 레이아웃 관리
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── pages/
│   │   ├── feature_admin_menu/    # 메뉴 관리
│   │   ├── feature_admin_content/ # 컨텐츠 관리
│   │   ├── feature_admin_board/  # 게시판 관리
│   │   └── feature_admin_file/   # 파일 관리
│   │
│   ├── feature_board/            # 게시판 Feature
│   │   ├── components/
│   │   │   ├── BoardList.tsx
│   │   │   ├── BoardItem.tsx
│   │   │   └── BoardForm.tsx
│   │   ├── hooks/
│   │   │   ├── useBoardList.ts
│   │   │   └── useBoardItem.ts
│   │   └── pages/
│   │
│   └── feature_content/          # 컨텐츠 Feature
│       ├── components/
│       ├── hooks/
│       └── pages/
│
└── public/                       # 정적 파일
```

## 각 레이어의 역할

### 1. app/ (진입점)
- **역할**: Next.js 라우팅만 담당
- **특징**: 얇은 레이어, feature 컴포넌트를 import하여 사용
- **예시**:
```typescript
// app/(admin)/admin/site/layout/page.tsx
import { LayoutManagementPage } from '@/feature/feature_admin/feature_admin_layout/pages/LayoutManagementPage';

export default function LayoutPage() {
  return <LayoutManagementPage />;
}
```

### 2. common/ (공통 모듈)

#### common_base
- 상수, 설정, 열거형
- 전역 설정값

#### common_ui
- 재사용 가능한 UI 컴포넌트
- Button, Input, Modal, Table 등
- 여러 feature에서 공통으로 사용

#### common_model
- 공통 타입 정의
- API 응답 타입
- 엔티티 타입

#### common_resource
- 아이콘, 이미지, 다국어 파일
- 정적 리소스

#### common_util
- 유틸리티 함수
- 날짜, 포맷팅, 검증, 스토리지 등

### 3. core/ (핵심 비즈니스 로직)

#### core_data
- 데이터 상태 관리
- Zustand 스토어
- 캐시 관리

#### core_network
- API 클라이언트 설정
- 인터셉터 (인증, 에러 처리)
- API 서비스 레이어
- 네트워크 관련 훅

#### core_database
- 클라이언트 사이드 데이터 저장
- LocalStorage, IndexedDB
- 캐시 전략

### 4. feature/ (UI/UX 담당)

각 feature는 독립적인 모듈:
- `components/`: UI 컴포넌트
- `hooks/`: 커스텀 훅
- `pages/`: 페이지 컴포넌트 (선택적)

## 구조의 장점

1. **명확한 책임 분리**
   - common: 공통 코드
   - core: 비즈니스 로직
   - feature: UI/UX

2. **재사용성**
   - common 모듈은 모든 feature에서 사용
   - core는 비즈니스 로직 재사용

3. **확장성**
   - 새 feature 추가가 쉬움
   - 각 feature가 독립적

4. **유지보수성**
   - 관련 코드가 한 곳에 모임
   - 수정 범위가 명확

## 마이그레이션 전략

### Phase 1: 구조 생성
1. 디렉토리 구조 생성
2. common 모듈 정리
3. core 모듈 정리

### Phase 2: Feature 마이그레이션
1. feature_auth부터 시작
2. feature_admin 순차적 마이그레이션
3. feature_board 마이그레이션

### Phase 3: 정리
1. 공통 코드 정리
2. 중복 제거
3. 문서화
