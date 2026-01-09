# CMS 프로젝트 구조 가이드

## 프로젝트 구조 개요

이 프로젝트는 CMS(Content Management System) 서비스를 위한 구조화된 아키텍처를 따릅니다.

## 디렉토리 구조

```
townE/
├── app/                          # 진입점: Next.js 라우팅
│   ├── (admin)/                  # 관리자 라우트 그룹
│   ├── (home)/                   # 홈 라우트 그룹
│   └── layout.tsx
│
├── common/                       # 공통 모듈
│   ├── common_base/              # 기본 설정 및 상수
│   ├── common_ui/                # 공통 UI 컴포넌트
│   ├── common_model/             # 공통 데이터 모델/타입
│   ├── common_resource/          # 공통 리소스
│   └── common_util/              # 공통 유틸리티
│
├── core/                         # 핵심 비즈니스 로직
│   ├── core_data/                # 데이터 관리
│   ├── core_network/             # 네트워크 계층
│   └── core_database/            # 데이터베이스 관련
│
└── feature/                      # Feature 모듈 (UI/UX)
    ├── feature_auth/             # 인증 Feature
    ├── feature_admin/             # 관리자 Feature
    ├── feature_board/            # 게시판 Feature
    └── feature_content/          # 컨텐츠 Feature
```

## 각 레이어의 역할

### app/ (진입점)
- Next.js App Router의 라우팅만 담당
- 얇은 레이어로 feature 컴포넌트를 import하여 사용

### common/ (공통 모듈)

#### common_base
- 상수, 설정, 열거형 정의
- `constants.ts`, `config.ts`, `enums.ts`

#### common_ui
- 재사용 가능한 UI 컴포넌트
- Button, Input, Modal, Table 등

#### common_model
- 공통 타입 정의
- API 응답 타입, 엔티티 타입

#### common_resource
- 아이콘, 이미지, 다국어 파일

#### common_util
- 유틸리티 함수
- 날짜, 포맷팅, 검증, 스토리지

### core/ (핵심 비즈니스 로직)

#### core_data
- 데이터 상태 관리 (Zustand 스토어)
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

### feature/ (UI/UX 담당)

각 feature는 독립적인 모듈:
- `components/`: UI 컴포넌트
- `hooks/`: 커스텀 훅
- `pages/`: 페이지 컴포넌트 (선택적)

## 사용 예시

### Feature에서 공통 컴포넌트 사용

```typescript
// feature/feature_board/components/BoardList.tsx
import { Button, Table } from '@/common/common_ui';
import { formatDate } from '@/common/common_util/date';
import { boardService } from '@/core/core_network/services/boardService';
```

### Feature에서 Core 서비스 사용

```typescript
// feature/feature_board/hooks/useBoardList.ts
import { useQuery } from '@tanstack/react-query';
import { boardService } from '@/core/core_network/services/boardService';
```

### App에서 Feature 사용

```typescript
// app/(board)/boards/[boardKey]/page.tsx
import { BoardListPage } from '@/feature/feature_board/pages/BoardListPage';

export default function Page({ params }: { params: { boardKey: string } }) {
  return <BoardListPage boardKey={parseInt(params.boardKey)} />;
}
```

## Import 경로 규칙

- `@/common/*` - 공통 모듈
- `@/core/*` - 핵심 비즈니스 로직
- `@/feature/*` - Feature 모듈
- `@/*` - 루트 레벨 (app, public 등)

## 마이그레이션 상태

현재 구조화 작업이 진행 중입니다. 기존 코드는 점진적으로 새 구조로 이동할 예정입니다.
