# Next.js 프론트엔드 구축 가이드

## 개요

이 문서는 townE 시스템의 프론트엔드를 JSP에서 Next.js로 전환하기 위한 완전한 가이드를 제공합니다.

## 1. 아키텍처 설계

### 1.1 전체 아키텍처

```
┌─────────────────┐
│   Next.js App   │  (포트 3000)
│   (Frontend)    │  SSR/SSG/ISR 지원
└────────┬────────┘
         │ HTTP/REST API
         │ (JSON)
┌────────▼────────┐
│  Spring Boot    │  (포트 8080)
│   (Backend)     │
└────────┬────────┘
         │ JDBC
┌────────▼────────┐
│   Supabase      │  (PostgreSQL)
│   (Database)    │
└─────────────────┘
```

### 1.2 기술 스택

#### Frontend
- **Next.js 14+**: React 프레임워크 (App Router)
- **TypeScript**: 타입 안정성
- **React Server Components**: 서버 컴포넌트
- **React Client Components**: 클라이언트 컴포넌트
- **Next.js API Routes**: 서버리스 API (선택적)
- **TanStack Query (React Query)**: 서버 상태 관리
- **Zustand**: 클라이언트 상태 관리
- **Tailwind CSS**: 스타일링
- **Next.js Image**: 이미지 최적화

#### Backend
- **Spring Boot 3.x**: RESTful API
- **Spring Security**: 인증/인가
- **JWT**: 토큰 기반 인증
- **Supabase**: 데이터베이스 (또는 MariaDB)

## 2. 프로젝트 구조

### 2.1 Next.js 프로젝트 구조 (App Router)

```
townE-frontend/
├── app/                          # App Router (Next.js 13+)
│   ├── (auth)/                  # Route Group
│   │   ├── login/
│   │   │   └── page.tsx         # 로그인 페이지
│   │   └── register/
│   │       └── page.tsx          # 회원가입 페이지
│   ├── (home)/                  # Route Group
│   │   ├── page.tsx             # 홈페이지
│   │   ├── board/
│   │   │   ├── [boardKey]/
│   │   │   │   ├── page.tsx     # 게시판 목록
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx  # 게시물 상세
│   │   │   └── layout.tsx       # 게시판 레이아웃
│   │   └── layout.tsx           # 홈 레이아웃
│   ├── admin/                   # 관리자 페이지
│   │   ├── members/
│   │   │   ├── page.tsx         # 회원 목록
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx     # 회원 상세
│   │   │   └── new/
│   │   │       └── page.tsx      # 회원 등록
│   │   └── layout.tsx           # 관리자 레이아웃
│   ├── api/                     # Next.js API Routes (선택적)
│   │   ├── auth/
│   │   │   └── route.ts         # 인증 API
│   │   └── proxy/
│   │       └── route.ts          # 백엔드 프록시
│   ├── layout.tsx               # 루트 레이아웃
│   ├── loading.tsx              # 로딩 UI
│   ├── error.tsx                # 에러 UI
│   └── not-found.tsx            # 404 페이지
├── components/                  # 재사용 가능한 컴포넌트
│   ├── ui/                      # 기본 UI 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── Pagination.tsx
│   ├── layout/                  # 레이아웃 컴포넌트
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   ├── board/                   # 게시판 컴포넌트
│   │   ├── BoardList.tsx
│   │   ├── BoardItem.tsx
│   │   └── BoardForm.tsx
│   └── member/                  # 회원 컴포넌트
│       ├── MemberList.tsx
│       └── MemberForm.tsx
├── lib/                         # 유틸리티 및 설정
│   ├── api/                     # API 클라이언트
│   │   ├── client.ts            # Axios/Fetch 설정
│   │   ├── auth.ts
│   │   ├── member.ts
│   │   └── board.ts
│   ├── hooks/                   # 커스텀 훅
│   │   ├── useAuth.ts
│   │   ├── useMember.ts
│   │   └── useBoard.ts
│   ├── store/                   # 상태 관리
│   │   ├── authStore.ts
│   │   └── userStore.ts
│   └── utils/                   # 유틸리티 함수
│       ├── constants.ts
│       ├── formatters.ts
│       └── validators.ts
├── types/                       # TypeScript 타입
│   ├── member.ts
│   ├── board.ts
│   └── api.ts
├── public/                      # 정적 파일
│   ├── images/
│   └── favicon.ico
├── styles/                      # 글로벌 스타일
│   └── globals.css
├── next.config.js               # Next.js 설정
├── tailwind.config.js           # Tailwind 설정
├── tsconfig.json                # TypeScript 설정
└── package.json
```

### 2.2 Spring Boot 프로젝트 구조

```
townE-backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── kr/co/nubiz/
│   │   │       ├── config/          # 설정 클래스
│   │   │       │   ├── SecurityConfig.java
│   │   │       │   ├── WebConfig.java
│   │   │       │   └── CorsConfig.java
│   │   │       ├── controller/      # REST Controller
│   │   │       │   ├── api/
│   │   │       │   │   ├── AuthController.java
│   │   │       │   │   ├── MemberController.java
│   │   │       │   │   └── BoardController.java
│   │   │       ├── service/          # 비즈니스 로직
│   │   │       ├── repository/       # 데이터 접근
│   │   │       ├── dto/              # 데이터 전송 객체
│   │   │       ├── entity/           # JPA 엔티티
│   │   │       └── security/         # 보안
│   │   └── resources/
│   │       ├── application.yml
│   │       └── application-prod.yml
│   └── test/
└── pom.xml
```

## 3. Next.js 프로젝트 생성

### 3.1 프로젝트 초기화

```bash
# Next.js 프로젝트 생성 (TypeScript, App Router, Tailwind CSS)
npx create-next-app@latest townE-frontend \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*"

cd townE-frontend
```

### 3.2 필수 패키지 설치

```bash
# API 클라이언트
npm install axios

# 상태 관리
npm install @tanstack/react-query zustand

# 폼 관리
npm install react-hook-form @hookform/resolvers zod

# UI 라이브러리 (선택적)
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu

# 유틸리티
npm install date-fns clsx
```

### 3.3 package.json 예시

```json
{
  "name": "townE-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.2.2",
    "axios": "^1.6.0",
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^4.4.0",
    "react-hook-form": "^7.48.0",
    "@hookform/resolvers": "^3.3.0",
    "zod": "^3.22.0",
    "date-fns": "^2.30.0",
    "clsx": "^2.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.8.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "eslint": "^8.51.0",
    "eslint-config-next": "14.0.0"
  }
}
```

## 4. API 클라이언트 설정

### 4.1 API 클라이언트 기본 설정

```typescript
// lib/api/client.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키 포함
});

// 요청 인터셉터 (토큰 추가)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (에러 처리)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 시 리프레시 또는 로그아웃
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 4.2 회원 API 클라이언트

```typescript
// lib/api/member.ts
import { apiClient } from './client';
import { Member, CreateMemberDto, UpdateMemberDto } from '@/types/member';

export const memberApi = {
  // 회원 목록 조회
  getMembers: async (params?: {
    page?: number;
    size?: number;
    search?: string;
  }): Promise<{
    content: Member[];
    totalElements: number;
    totalPages: number;
  }> => {
    const response = await apiClient.get('/api/admin/members', { params });
    return response.data;
  },

  // 회원 상세 조회
  getMember: async (id: number): Promise<Member> => {
    const response = await apiClient.get(`/api/admin/members/${id}`);
    return response.data;
  },

  // 회원 등록
  createMember: async (data: CreateMemberDto): Promise<Member> => {
    const response = await apiClient.post('/api/admin/members', data);
    return response.data;
  },

  // 회원 수정
  updateMember: async (id: number, data: UpdateMemberDto): Promise<Member> => {
    const response = await apiClient.put(`/api/admin/members/${id}`, data);
    return response.data;
  },

  // 회원 삭제
  deleteMember: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/admin/members/${id}`);
  },
};
```

## 5. 타입 정의

### 5.1 회원 타입

```typescript
// types/member.ts
export interface Member {
  id: number;
  memberType: 'P' | 'C'; // P: 개인, C: 법인
  userId: string;
  name: string;
  nickname?: string;
  email?: string;
  phone?: string;
  status: 'U' | 'D'; // U: 사용중, D: 삭제됨
  memberLevel: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateMemberDto {
  memberType: 'P' | 'C';
  userId: string;
  userPw: string;
  name: string;
  nickname?: string;
  email?: string;
  phone?: string;
}

export interface UpdateMemberDto {
  name?: string;
  nickname?: string;
  email?: string;
  phone?: string;
}

export interface MemberListResponse {
  content: Member[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
```

## 6. 서버 컴포넌트 예시

### 6.1 회원 목록 페이지 (Server Component)

```typescript
// app/admin/members/page.tsx
import { memberApi } from '@/lib/api/member';
import { MemberList } from '@/components/member/MemberList';

interface PageProps {
  searchParams: {
    page?: string;
    size?: string;
    search?: string;
  };
}

export default async function MembersPage({ searchParams }: PageProps) {
  const page = Number(searchParams.page) || 1;
  const size = Number(searchParams.size) || 10;
  const search = searchParams.search;

  // 서버에서 데이터 페칭 (SSR)
  const data = await memberApi.getMembers({
    page: page - 1, // Spring Boot는 0-based 페이지네이션
    size,
    search,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">회원 관리</h1>
      <MemberList
        members={data.content}
        totalPages={data.totalPages}
        currentPage={page}
      />
    </div>
  );
}
```

### 6.2 게시판 목록 페이지 (Server Component with ISR)

```typescript
// app/(home)/board/[boardKey]/page.tsx
import { boardApi } from '@/lib/api/board';
import { BoardList } from '@/components/board/BoardList';

interface PageProps {
  params: {
    boardKey: string;
  };
  searchParams: {
    page?: string;
  };
}

// ISR: 60초마다 재생성
export const revalidate = 60;

export default async function BoardPage({ params, searchParams }: PageProps) {
  const page = Number(searchParams.page) || 1;

  const data = await boardApi.getBoardItems(params.boardKey, {
    page: page - 1,
    size: 10,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <BoardList
        items={data.content}
        totalPages={data.totalPages}
        currentPage={page}
        boardKey={params.boardKey}
      />
    </div>
  );
}
```

## 7. 클라이언트 컴포넌트 예시

### 7.1 회원 목록 컴포넌트

```typescript
// components/member/MemberList.tsx
'use client';

import { Member } from '@/types/member';
import { MemberItem } from './MemberItem';
import { Pagination } from '@/components/ui/Pagination';
import Link from 'next/link';

interface MemberListProps {
  members: Member[];
  totalPages: number;
  currentPage: number;
}

export function MemberList({ members, totalPages, currentPage }: MemberListProps) {
  return (
    <div>
      <div className="mb-4">
        <Link
          href="/admin/members/new"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          회원 등록
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">ID</th>
              <th className="px-4 py-2 border-b">사용자 ID</th>
              <th className="px-4 py-2 border-b">이름</th>
              <th className="px-4 py-2 border-b">이메일</th>
              <th className="px-4 py-2 border-b">상태</th>
              <th className="px-4 py-2 border-b">작업</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <MemberItem key={member.id} member={member} />
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        basePath="/admin/members"
      />
    </div>
  );
}
```

### 7.2 회원 등록 폼 컴포넌트

```typescript
// components/member/MemberForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { memberApi } from '@/lib/api/member';
import { useRouter } from 'next/navigation';

const memberSchema = z.object({
  memberType: z.enum(['P', 'C']),
  userId: z.string().min(4, '최소 4자 이상'),
  userPw: z.string().min(8, '최소 8자 이상'),
  name: z.string().min(1, '이름을 입력하세요'),
  nickname: z.string().optional(),
  email: z.string().email('올바른 이메일 형식이 아닙니다').optional(),
  phone: z.string().optional(),
});

type MemberFormData = z.infer<typeof memberSchema>;

export function MemberForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
  });

  const onSubmit = async (data: MemberFormData) => {
    try {
      await memberApi.createMember(data);
      router.push('/admin/members');
      router.refresh(); // 서버 컴포넌트 재검증
    } catch (error) {
      console.error('회원 등록 실패:', error);
      alert('회원 등록에 실패했습니다.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block mb-1">회원 타입</label>
        <select {...register('memberType')} className="w-full px-3 py-2 border rounded">
          <option value="P">개인</option>
          <option value="C">법인</option>
        </select>
        {errors.memberType && (
          <p className="text-red-500 text-sm">{errors.memberType.message}</p>
        )}
      </div>

      <div>
        <label className="block mb-1">사용자 ID *</label>
        <input
          {...register('userId')}
          className="w-full px-3 py-2 border rounded"
        />
        {errors.userId && (
          <p className="text-red-500 text-sm">{errors.userId.message}</p>
        )}
      </div>

      <div>
        <label className="block mb-1">비밀번호 *</label>
        <input
          type="password"
          {...register('userPw')}
          className="w-full px-3 py-2 border rounded"
        />
        {errors.userPw && (
          <p className="text-red-500 text-sm">{errors.userPw.message}</p>
        )}
      </div>

      <div>
        <label className="block mb-1">이름 *</label>
        <input
          {...register('name')}
          className="w-full px-3 py-2 border rounded"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isSubmitting ? '등록 중...' : '등록'}
      </button>
    </form>
  );
}
```

## 8. React Query 활용

### 8.1 React Query Provider 설정

```typescript
// app/layout.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1분
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

### 8.2 커스텀 훅 예시

```typescript
// lib/hooks/useMember.ts
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { memberApi } from '@/lib/api/member';
import { Member, CreateMemberDto, UpdateMemberDto } from '@/types/member';

export function useMembers(params?: {
  page?: number;
  size?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: ['members', params],
    queryFn: () => memberApi.getMembers(params),
  });
}

export function useMember(id: number) {
  return useQuery({
    queryKey: ['member', id],
    queryFn: () => memberApi.getMember(id),
    enabled: !!id,
  });
}

export function useCreateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMemberDto) => memberApi.createMember(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
}

export function useUpdateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMemberDto }) =>
      memberApi.updateMember(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['member', variables.id] });
    },
  });
}
```

## 9. 인증 처리

### 9.1 인증 상태 관리

```typescript
// lib/store/authStore.ts
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: {
    id: number;
    userId: string;
    name: string;
  } | null;
  token: string | null;
  setAuth: (user: AuthState['user'], token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        localStorage.setItem('accessToken', token);
        set({ user, token });
      },
      clearAuth: () => {
        localStorage.removeItem('accessToken');
        set({ user: null, token: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

### 9.2 미들웨어로 인증 체크

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;

  // 관리자 페이지 접근 시 인증 체크
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

## 10. 환경 변수 설정

### 10.1 .env.local

```env
# API 서버 URL
NEXT_PUBLIC_API_URL=http://localhost:8080

# Supabase 설정 (추후 마이그레이션 시)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## 11. 빌드 및 배포

### 11.1 빌드

```bash
# 개발 모드
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 실행
npm start
```

### 11.2 배포 옵션

#### 옵션 1: Vercel (권장)
- Next.js 최적화
- 자동 배포
- Edge Functions 지원

#### 옵션 2: Docker
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

## 12. SSR/SSG/ISR 전략

### 12.1 렌더링 전략 선택

- **SSR (Server-Side Rendering)**: 동적 데이터, 실시간 업데이트 필요
  - 회원 목록 (검색, 필터링)
  - 관리자 페이지

- **SSG (Static Site Generation)**: 정적 콘텐츠
  - 공지사항
  - 도움말 페이지

- **ISR (Incremental Static Regeneration)**: 주기적 업데이트
  - 게시판 목록 (60초마다 재생성)
  - 인기 게시물

## 13. 성능 최적화

### 13.1 이미지 최적화

```typescript
import Image from 'next/image';

<Image
  src="/images/logo.png"
  alt="로고"
  width={200}
  height={50}
  priority // 중요 이미지 우선 로딩
/>
```

### 13.2 코드 스플리팅

```typescript
import dynamic from 'next/dynamic';

// 동적 임포트 (코드 스플리팅)
const MemberForm = dynamic(() => import('@/components/member/MemberForm'), {
  loading: () => <p>로딩 중...</p>,
  ssr: false, // 클라이언트에서만 렌더링
});
```

## 14. 다음 단계

1. **API 통합**: Spring Boot REST API와 연동
2. **인증 구현**: JWT 토큰 기반 인증
3. **상태 관리**: React Query + Zustand 설정
4. **UI 컴포넌트**: 재사용 가능한 컴포넌트 개발
5. **테스트**: 단위 테스트 및 통합 테스트
6. **배포**: Vercel 또는 Docker로 배포

## 참고 자료

- [Next.js 공식 문서](https://nextjs.org/docs)
- [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)
- [TanStack Query](https://tanstack.com/query/latest)
- [Next.js App Router](https://nextjs.org/docs/app)

