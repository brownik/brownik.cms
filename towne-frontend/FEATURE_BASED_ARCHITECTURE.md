# Next.js App Router에서 Feature-Based Architecture 적용 가이드

## 개요

Next.js App Router는 파일 시스템 기반 라우팅을 사용하지만, feature-based architecture를 적용할 수 있습니다. App Router의 라우팅 구조와 feature 모듈을 분리하여 관리하는 하이브리드 접근 방식을 사용합니다.

## 현재 구조 vs Feature-Based 구조

### 현재 구조 (Layer-Based)
```
towne-frontend/
├── app/                    # 라우트 (URL 기반)
├── components/             # 컴포넌트 (타입별)
│   ├── admin/
│   └── common/
├── lib/                   # 유틸리티
│   └── api/              # API 클라이언트
├── stores/                # 상태 관리
└── hooks/                 # 커스텀 훅
```

### Feature-Based 구조 (제안)
```
towne-frontend/
├── app/                    # 라우트 (URL 기반) - 유지
│   ├── (auth)/            # 인증 관련 라우트
│   ├── (admin)/           # 관리자 라우트
│   └── (board)/           # 게시판 라우트
├── features/               # Feature 모듈
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── stores/
│   │   └── types/
│   ├── admin/
│   │   ├── layout/
│   │   ├── menu/
│   │   ├── content/
│   │   └── board/
│   └── board/
│       ├── components/
│       ├── hooks/
│       ├── api/
│       └── types/
├── components/             # 공통 컴포넌트
│   └── shared/
├── lib/                   # 공통 유틸리티
└── stores/                # 전역 상태 (선택적)
```

## Feature-Based Architecture의 장점

1. **관심사 분리**: 각 feature가 독립적으로 관리됨
2. **재사용성**: Feature를 다른 프로젝트로 쉽게 이동 가능
3. **확장성**: 새 feature 추가가 쉬움
4. **유지보수**: 관련 코드가 한 곳에 모여있어 수정이 쉬움
5. **협업**: 팀원들이 feature별로 작업 분리 가능

## Next.js App Router와의 통합

### 핵심 원칙

1. **`app/` 폴더**: 라우팅만 담당 (얇은 레이어)
2. **`features/` 폴더**: 비즈니스 로직과 컴포넌트
3. **Route Groups**: 관련 라우트를 그룹화 (`(auth)`, `(admin)`)

### 예시: 인증 Feature

```
features/auth/
├── components/
│   ├── LoginForm.tsx
│   ├── SignupForm.tsx
│   └── AuthGuard.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useLogin.ts
├── api/
│   ├── authApi.ts
│   └── types.ts
├── stores/
│   └── authStore.ts
└── types/
    └── index.ts

app/(auth)/
├── login/
│   └── page.tsx          # features/auth 컴포넌트 사용
└── signup/
    └── page.tsx          # features/auth 컴포넌트 사용
```

## 마이그레이션 전략

### 단계별 접근

1. **Phase 1**: 새 feature부터 feature-based로 시작
2. **Phase 2**: 기존 코드를 점진적으로 리팩토링
3. **Phase 3**: 공통 컴포넌트 정리

### 예시: 게시판 Feature 리팩토링

**Before (현재)**:
```
app/boards/[boardKey]/page.tsx
lib/api/board.ts
components/common/BoardList.tsx (없을 수도 있음)
```

**After (Feature-Based)**:
```
features/board/
├── components/
│   ├── BoardList.tsx
│   ├── BoardItem.tsx
│   └── BoardForm.tsx
├── hooks/
│   ├── useBoardList.ts
│   └── useBoardItem.ts
├── api/
│   └── boardApi.ts
└── types/
    └── index.ts

app/(board)/
└── boards/
    └── [boardKey]/
        └── page.tsx      # features/board 컴포넌트 import
```

## 실제 적용 예시

### 1. 게시판 Feature 구조

```
features/board/
├── components/
│   ├── BoardList.tsx
│   ├── BoardItemCard.tsx
│   ├── BoardItemForm.tsx
│   └── BoardSearch.tsx
├── hooks/
│   ├── useBoardList.ts
│   ├── useBoardItem.ts
│   └── useBoardMutation.ts
├── api/
│   └── boardApi.ts
├── stores/
│   └── boardStore.ts (선택적)
└── types/
    └── index.ts
```

### 2. 관리자 Feature 구조

```
features/admin/
├── layout/
│   ├── components/
│   │   └── LayoutEditor.tsx
│   ├── hooks/
│   │   └── useLayout.ts
│   └── api/
│       └── layoutApi.ts
├── menu/
│   ├── components/
│   │   └── MenuManager.tsx
│   ├── hooks/
│   │   └── useMenu.ts
│   └── api/
│       └── menuApi.ts
└── board/
    ├── components/
    ├── hooks/
    └── api/
```

## Best Practices

### 1. Feature 간 의존성 최소화

```typescript
// ❌ 나쁜 예: Feature 간 직접 import
import { useAuth } from '@/features/auth/hooks/useAuth';
import { BoardItem } from '@/features/board/types';

// ✅ 좋은 예: 공통 인터페이스 사용
import { useAuth } from '@/lib/auth'; // 공통 레이어
import { BoardItem } from '@/types/board'; // 공통 타입
```

### 2. Route Groups 활용

```typescript
// app/(auth)/login/page.tsx
import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  return <LoginForm />;
}
```

### 3. Feature 내부 구조 일관성

각 feature는 동일한 구조를 유지:
- `components/`: UI 컴포넌트
- `hooks/`: 커스텀 훅
- `api/`: API 클라이언트
- `types/`: TypeScript 타입
- `stores/`: 로컬 상태 (선택적)
- `utils/`: 유틸리티 함수 (선택적)

### 4. 공통 코드 분리

- **`components/shared/`**: 여러 feature에서 사용하는 컴포넌트
- **`lib/`**: 공통 유틸리티
- **`types/`**: 공통 타입 정의

## 장단점 비교

### 장점
✅ 코드 조직화 및 유지보수성 향상
✅ Feature별 독립적 개발 가능
✅ 재사용성 증가
✅ 테스트 작성 용이
✅ 팀 협업 효율성 향상

### 단점
⚠️ 초기 설정 복잡도 증가
⚠️ Feature 간 공유 코드 관리 필요
⚠️ 학습 곡선 존재
⚠️ 작은 프로젝트에는 과할 수 있음

## 마이그레이션 체크리스트

- [ ] Feature 구조 설계
- [ ] 공통 컴포넌트 식별
- [ ] 첫 번째 feature 리팩토링 (예: auth)
- [ ] 두 번째 feature 리팩토링 (예: board)
- [ ] 관리자 feature 리팩토링
- [ ] 공통 코드 정리
- [ ] 문서화 업데이트

## 결론

Next.js App Router에서 feature-based architecture는 **완전히 적용 가능**합니다. `app/` 폴더는 라우팅에만 집중하고, 실제 비즈니스 로직은 `features/` 폴더에서 관리하는 하이브리드 접근 방식이 효과적입니다.
