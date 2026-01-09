# Feature-Based Architecture 실제 구조 예시

## 현재 프로젝트에 적용할 Feature 구조

### 1. Auth Feature (인증)

```
features/auth/
├── components/
│   ├── LoginForm.tsx
│   ├── SignupForm.tsx
│   └── AuthGuard.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useLogin.ts
│   └── useSignup.ts
├── api/
│   ├── authApi.ts
│   └── adminAuthApi.ts
├── stores/
│   ├── authStore.ts
│   └── adminAuthStore.ts
└── types/
    └── index.ts
```

**사용 예시**:
```typescript
// app/(auth)/login/page.tsx
import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  return <LoginForm />;
}
```

### 2. Board Feature (게시판)

```
features/board/
├── components/
│   ├── BoardList.tsx
│   ├── BoardItemCard.tsx
│   ├── BoardItemForm.tsx
│   ├── BoardItemDetail.tsx
│   └── BoardSearch.tsx
├── hooks/
│   ├── useBoardList.ts
│   ├── useBoardItem.ts
│   └── useBoardMutation.ts
├── api/
│   └── boardApi.ts
└── types/
    └── index.ts
```

**사용 예시**:
```typescript
// app/(board)/boards/[boardKey]/page.tsx
import { BoardList } from '@/features/board/components/BoardList';
import { useBoardList } from '@/features/board/hooks/useBoardList';

export default function BoardPage({ params }: { params: { boardKey: string } }) {
  const { data, isLoading } = useBoardList(parseInt(params.boardKey));
  
  return <BoardList items={data} loading={isLoading} />;
}
```

### 3. Admin Feature (관리자)

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
├── content/
│   ├── components/
│   ├── hooks/
│   └── api/
├── board/
│   ├── components/
│   ├── hooks/
│   └── api/
└── shared/
    ├── components/
    │   └── AdminLayout.tsx
    └── hooks/
        └── useAdminAuth.ts
```

**사용 예시**:
```typescript
// app/(admin)/admin/site/layout/page.tsx
import { LayoutEditor } from '@/features/admin/layout/components/LayoutEditor';
import { AdminLayout } from '@/features/admin/shared/components/AdminLayout';

export default function LayoutPage() {
  return (
    <AdminLayout>
      <LayoutEditor />
    </AdminLayout>
  );
}
```

## Route Groups 활용

### Route Groups 구조

```
app/
├── (auth)/              # 인증 관련 라우트 그룹
│   ├── login/
│   │   └── page.tsx
│   └── signup/
│       └── page.tsx
├── (admin)/             # 관리자 라우트 그룹
│   └── admin/
│       ├── site/
│       └── programs/
├── (board)/             # 게시판 라우트 그룹
│   └── boards/
│       └── [boardKey]/
└── (home)/              # 홈 라우트 그룹
    ├── page.tsx
    └── profile/
```

**Route Groups의 장점**:
- URL에 영향을 주지 않음 (`(auth)`는 URL에 나타나지 않음)
- 레이아웃을 그룹별로 적용 가능
- 관련 라우트를 논리적으로 그룹화

## Import 경로 설정

### tsconfig.json 설정

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@/features/*": ["./features/*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"]
    }
  }
}
```

### 사용 예시

```typescript
// Feature 내부에서
import { useAuth } from '@/features/auth/hooks/useAuth';
import { BoardItem } from '@/features/board/types';

// 공통 컴포넌트에서
import { Button } from '@/components/shared/Button';
import { apiClient } from '@/lib/api/client';
```

## 마이그레이션 순서

### 1단계: Feature 폴더 구조 생성
```bash
mkdir -p features/auth/{components,hooks,api,stores,types}
mkdir -p features/board/{components,hooks,api,types}
mkdir -p features/admin/{layout,menu,content,board,shared}/{components,hooks,api}
```

### 2단계: 기존 코드 이동
- `lib/api/auth.ts` → `features/auth/api/authApi.ts`
- `stores/authStore.ts` → `features/auth/stores/authStore.ts`
- `components/common/LoginForm.tsx` → `features/auth/components/LoginForm.tsx`

### 3단계: Route Groups 생성
- `app/login/` → `app/(auth)/login/`
- `app/admin/` → `app/(admin)/admin/`
- `app/boards/` → `app/(board)/boards/`

### 4단계: Import 경로 업데이트
- 모든 import 경로를 새 구조에 맞게 수정

## 주의사항

1. **점진적 마이그레이션**: 한 번에 모든 것을 변경하지 말고 feature별로 진행
2. **공통 코드 관리**: 여러 feature에서 사용하는 코드는 `components/shared/` 또는 `lib/`에 유지
3. **순환 의존성 방지**: Feature 간 직접 import는 피하고 공통 레이어 사용
4. **테스트 코드**: Feature별로 테스트 코드도 함께 이동

## 참고 자료

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Feature-Based Architecture Best Practices](https://kentcdodds.com/blog/colocation)
- [Next.js Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups)
