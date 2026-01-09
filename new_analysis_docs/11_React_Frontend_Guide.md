# React 프론트엔드 구축 가이드

## 개요

이 문서는 townE 시스템의 프론트엔드를 JSP에서 React로 전환하기 위한 완전한 가이드를 제공합니다.

## 1. 아키텍처 설계

### 1.1 전체 아키텍처

```
┌─────────────────┐
│   React SPA     │  (포트 3000)
│   (Frontend)    │
└────────┬────────┘
         │ HTTP/REST API
         │ (JSON)
┌────────▼────────┐
│  Spring Boot    │  (포트 8080)
│   (Backend)     │
└────────┬────────┘
         │ JDBC
┌────────▼────────┐
│   PostgreSQL    │  (포트 5432)
│   (Database)    │
└─────────────────┘
```

### 1.2 기술 스택

#### Frontend
- **React 18+**: UI 라이브러리
- **TypeScript**: 타입 안정성
- **React Router**: 라우팅
- **Axios**: HTTP 클라이언트
- **React Query**: 서버 상태 관리
- **Zustand/Redux**: 클라이언트 상태 관리
- **Tailwind CSS**: 스타일링
- **Vite**: 빌드 도구

#### Backend
- **Spring Boot 3.x**: RESTful API
- **Spring Security**: 인증/인가
- **JWT**: 토큰 기반 인증
- **PostgreSQL**: 데이터베이스

## 2. 프로젝트 구조

### 2.1 React 프로젝트 구조

```
townE/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── api/                    # API 클라이언트
│   │   ├── axios.ts
│   │   ├── auth.ts
│   │   ├── member.ts
│   │   ├── board.ts
│   │   └── content.ts
│   ├── components/             # 재사용 가능한 컴포넌트
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Pagination.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   └── board/
│   │       ├── BoardList.tsx
│   │       ├── BoardItem.tsx
│   │       └── BoardForm.tsx
│   ├── pages/                  # 페이지 컴포넌트
│   │   ├── admin/
│   │   │   ├── member/
│   │   │   │   ├── MemberList.tsx
│   │   │   │   ├── MemberDetail.tsx
│   │   │   │   └── MemberForm.tsx
│   │   │   └── board/
│   │   ├── home/
│   │   │   ├── Home.tsx
│   │   │   ├── BoardList.tsx
│   │   │   └── BoardDetail.tsx
│   │   └── auth/
│   │       ├── Login.tsx
│   │       └── Register.tsx
│   ├── hooks/                  # 커스텀 훅
│   │   ├── useAuth.ts
│   │   ├── useMember.ts
│   │   └── useBoard.ts
│   ├── store/                  # 상태 관리
│   │   ├── authStore.ts
│   │   └── userStore.ts
│   ├── types/                  # TypeScript 타입
│   │   ├── member.ts
│   │   ├── board.ts
│   │   └── api.ts
│   ├── utils/                  # 유틸리티
│   │   ├── constants.ts
│   │   ├── formatters.ts
│   │   └── validators.ts
│   ├── styles/                 # 스타일
│   │   ├── globals.css
│   │   └── tailwind.css
│   ├── App.tsx                 # 루트 컴포넌트
│   ├── main.tsx                # 진입점
│   └── router.tsx              # 라우터 설정
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
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

## 3. RESTful API 설계

### 3.1 API 엔드포인트 설계

기존 JSP 기반 API를 RESTful API로 변환:

#### 회원 관리 API

```typescript
// 기존: /admin/member/list.do (GET)
// 변환: GET /api/admin/members

// 기존: /admin/member/getData.do?key=1 (GET)
// 변환: GET /api/admin/members/1

// 기존: /admin/member/insert.do (POST)
// 변환: POST /api/admin/members

// 기존: /admin/member/update.do (POST)
// 변환: PUT /api/admin/members/1

// 기존: /admin/member/delete.do?key=1 (GET)
// 변환: DELETE /api/admin/members/1
```

#### 게시판 API

```typescript
// 기존: /home/board/list.do?boardKey=1 (GET)
// 변환: GET /api/boards?boardKey=1

// 기존: /home/board/view.do?boardKey=1&key=1 (GET)
// 변환: GET /api/boards/1/items/1

// 기존: /home/board/insert.do (POST)
// 변환: POST /api/boards/1/items

// 기존: /home/board/update.do (POST)
// 변환: PUT /api/boards/1/items/1

// 기존: /home/board/delete.do?boardKey=1&key=1 (GET)
// 변환: DELETE /api/boards/1/items/1
```

### 3.2 API 응답 형식 표준화

```typescript
// 성공 응답
interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
  timestamp: number;
}

// 에러 응답
interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: number;
}

// 페이징 응답
interface PagedResponse<T> {
  success: true;
  data: {
    content: T[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalElements: number;
      pageSize: number;
    };
  };
  timestamp: number;
}
```

## 4. React 프로젝트 생성

### 4.1 프로젝트 초기화

```bash
# Vite로 React + TypeScript 프로젝트 생성
npm create vite@latest townE -- --template react-ts

cd townE
npm install

# 추가 패키지 설치
npm install react-router-dom axios @tanstack/react-query zustand
npm install -D tailwindcss postcss autoprefixer
npm install -D @types/node
```

### 4.2 package.json

```json
{
  "name": "townE",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.2",
    "@tanstack/react-query": "^5.12.2",
    "zustand": "^4.4.7"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
```

### 4.3 TypeScript 타입 정의

```typescript
// src/types/member.ts
export interface Member {
  key: number;
  memberType: 'P' | 'C';
  userId: string;
  name: string;
  nickName?: string;
  email?: string;
  phone?: string;
  memberLevel: string;
  status: 'U' | 'D';
  insertDate: string;
  updateDate?: string;
}

export interface MemberCreateRequest {
  memberType: 'P' | 'C';
  userId: string;
  userPw: string;
  name: string;
  nickName?: string;
  email1: string;
  email2: string;
  phone1: string;
  phone2: string;
  phone3: string;
  memberLevel?: string;
  // ... 기타 필드
}

export interface MemberUpdateRequest extends Partial<MemberCreateRequest> {
  key: number;
}

// src/types/board.ts
export interface Board {
  key: number;
  siteKey: number;
  title: string;
  boardType: string;
  listAccessRole: string;
  readAccessRole: string;
  cudAccessRole: string;
}

export interface BoardItem {
  key: number;
  boardKey: number;
  categoryKey?: number;
  title: string;
  content: string;
  notice: 'Y' | 'N';
  secret: 'Y' | 'N';
  writer: string;
  hit: number;
  commentCount: number;
  insertDate: string;
  updateDate?: string;
}

export interface BoardItemCreateRequest {
  boardKey: number;
  categoryKey?: number;
  title: string;
  content: string;
  notice?: 'Y' | 'N';
  secret?: 'Y' | 'N';
  files?: File[];
}

// src/types/api.ts
export interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
  timestamp: number;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: number;
}

export interface PagedResponse<T> {
  success: true;
  data: {
    content: T[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalElements: number;
      pageSize: number;
    };
  };
  timestamp: number;
}
```

## 5. API 클라이언트 구현

### 5.1 Axios 설정

```typescript
// src/api/axios.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
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
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 시 재로그인
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 5.2 회원 API

```typescript
// src/api/member.ts
import apiClient from './axios';
import type { Member, MemberCreateRequest, MemberUpdateRequest, PagedResponse } from '../types/member';

export const memberApi = {
  // 회원 목록 조회
  getMembers: async (params: {
    currentPage?: number;
    searchType?: string;
    searchKeyword?: string;
  }): Promise<PagedResponse<Member>> => {
    const response = await apiClient.get('/admin/members', { params });
    return response.data;
  },

  // 회원 상세 조회
  getMember: async (key: number): Promise<Member> => {
    const response = await apiClient.get(`/admin/members/${key}`);
    return response.data.data;
  },

  // 회원 등록
  createMember: async (data: MemberCreateRequest): Promise<Member> => {
    const response = await apiClient.post('/admin/members', data);
    return response.data.data;
  },

  // 회원 수정
  updateMember: async (key: number, data: MemberUpdateRequest): Promise<Member> => {
    const response = await apiClient.put(`/admin/members/${key}`, data);
    return response.data.data;
  },

  // 회원 삭제
  deleteMember: async (key: number): Promise<void> => {
    await apiClient.delete(`/admin/members/${key}`);
  },

  // 아이디 중복 체크
  checkUserId: async (userId: string): Promise<boolean> => {
    const response = await apiClient.post('/admin/members/check-userid', { userId });
    return response.data.data;
  },
};
```

### 5.3 게시판 API

```typescript
// src/api/board.ts
import apiClient from './axios';
import type { Board, BoardItem, BoardItemCreateRequest, PagedResponse } from '../types/board';

export const boardApi = {
  // 게시판 정보 조회
  getBoard: async (boardKey: number): Promise<Board> => {
    const response = await apiClient.get(`/boards/${boardKey}`);
    return response.data.data;
  },

  // 게시물 목록 조회
  getBoardItems: async (boardKey: number, params: {
    currentPage?: number;
    searchType?: string;
    searchKeyword?: string;
    categoryKey?: number;
  }): Promise<PagedResponse<BoardItem>> => {
    const response = await apiClient.get(`/boards/${boardKey}/items`, { params });
    return response.data;
  },

  // 게시물 상세 조회
  getBoardItem: async (boardKey: number, itemKey: number): Promise<BoardItem> => {
    const response = await apiClient.get(`/boards/${boardKey}/items/${itemKey}`);
    return response.data.data;
  },

  // 게시물 작성
  createBoardItem: async (boardKey: number, data: BoardItemCreateRequest): Promise<BoardItem> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'files' && Array.isArray(value)) {
        value.forEach((file) => formData.append('files', file));
      } else {
        formData.append(key, value as string);
      }
    });
    
    const response = await apiClient.post(`/boards/${boardKey}/items`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  // 게시물 수정
  updateBoardItem: async (
    boardKey: number,
    itemKey: number,
    data: Partial<BoardItemCreateRequest>
  ): Promise<BoardItem> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'files' && Array.isArray(value)) {
        value.forEach((file) => formData.append('files', file));
      } else if (value !== undefined) {
        formData.append(key, value as string);
      }
    });
    
    const response = await apiClient.put(`/boards/${boardKey}/items/${itemKey}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  // 게시물 삭제
  deleteBoardItem: async (boardKey: number, itemKey: number): Promise<void> => {
    await apiClient.delete(`/boards/${boardKey}/items/${itemKey}`);
  },
};
```

## 6. React 컴포넌트 구현

### 6.1 회원 목록 컴포넌트

```typescript
// src/pages/admin/member/MemberList.tsx
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { memberApi } from '../../../api/member';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Pagination from '../../../components/common/Pagination';

export default function MemberList() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchType, setSearchType] = useState('USERID');
  const [searchKeyword, setSearchKeyword] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['members', currentPage, searchType, searchKeyword],
    queryFn: () => memberApi.getMembers({
      currentPage,
      searchType,
      searchKeyword,
    }),
  });

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">회원 관리</h1>
        <Button onClick={() => navigate('/admin/members/new')}>
          회원 등록
        </Button>
      </div>

      <div className="mb-4 flex gap-2">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="USERID">아이디</option>
          <option value="NAME">이름</option>
          <option value="EMAIL">이메일</option>
        </select>
        <Input
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="검색어 입력"
          className="flex-1"
        />
        <Button onClick={() => setCurrentPage(1)}>검색</Button>
      </div>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">번호</th>
            <th className="border p-2">아이디</th>
            <th className="border p-2">이름</th>
            <th className="border p-2">이메일</th>
            <th className="border p-2">등급</th>
            <th className="border p-2">등록일</th>
            <th className="border p-2">관리</th>
          </tr>
        </thead>
        <tbody>
          {data?.data.content.map((member) => (
            <tr key={member.key}>
              <td className="border p-2">{member.key}</td>
              <td className="border p-2">{member.userId}</td>
              <td className="border p-2">{member.name}</td>
              <td className="border p-2">{member.email}</td>
              <td className="border p-2">{member.memberLevel}</td>
              <td className="border p-2">{member.insertDate}</td>
              <td className="border p-2">
                <Button
                  size="sm"
                  onClick={() => navigate(`/admin/members/${member.key}`)}
                >
                  상세
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {data?.data.pagination && (
        <Pagination
          currentPage={data.data.pagination.currentPage}
          totalPages={data.data.pagination.totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
```

### 6.2 게시판 목록 컴포넌트

```typescript
// src/pages/home/BoardList.tsx
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { boardApi } from '../../api/board';
import Button from '../../components/common/Button';

export default function BoardList() {
  const { boardKey } = useParams<{ boardKey: string }>();
  const navigate = useNavigate();
  const boardKeyNum = parseInt(boardKey || '0');

  const { data: board } = useQuery({
    queryKey: ['board', boardKeyNum],
    queryFn: () => boardApi.getBoard(boardKeyNum),
  });

  const { data: items, isLoading } = useQuery({
    queryKey: ['boardItems', boardKeyNum],
    queryFn: () => boardApi.getBoardItems(boardKeyNum, { currentPage: 1 }),
  });

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{board?.title}</h1>

      <div className="mb-4">
        <Button onClick={() => navigate(`/boards/${boardKey}/write`)}>
          글쓰기
        </Button>
      </div>

      <div className="space-y-2">
        {items?.data.content.map((item) => (
          <div
            key={item.key}
            className="border p-4 rounded cursor-pointer hover:bg-gray-50"
            onClick={() => navigate(`/boards/${boardKey}/items/${item.key}`)}
          >
            <div className="flex justify-between">
              <h3 className="font-semibold">
                {item.notice === 'Y' && '[공지] '}
                {item.title}
              </h3>
              <span className="text-sm text-gray-500">{item.insertDate}</span>
            </div>
            <div className="text-sm text-gray-600 mt-2">
              {item.writer} | 조회 {item.hit} | 댓글 {item.commentCount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 7. Spring Boot REST API 구현

### 7.1 MemberController (REST API)

```java
package kr.co.nubiz.controller.api;

import kr.co.nubiz.dto.MemberDTO;
import kr.co.nubiz.dto.MemberCreateRequest;
import kr.co.nubiz.dto.MemberUpdateRequest;
import kr.co.nubiz.dto.ApiResponse;
import kr.co.nubiz.dto.PagedResponse;
import kr.co.nubiz.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/members")
@RequiredArgsConstructor
public class MemberController {
    
    private final MemberService memberService;
    
    @GetMapping
    public ResponseEntity<PagedResponse<MemberDTO>> getMembers(
            @RequestParam(required = false) String searchType,
            @RequestParam(required = false) String searchKeyword,
            Pageable pageable) {
        Page<MemberDTO> page = memberService.getMembers(searchType, searchKeyword, pageable);
        return ResponseEntity.ok(PagedResponse.of(page));
    }
    
    @GetMapping("/{key}")
    public ResponseEntity<ApiResponse<MemberDTO>> getMember(@PathVariable Long key) {
        MemberDTO member = memberService.getMember(key);
        return ResponseEntity.ok(ApiResponse.success(member));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<MemberDTO>> createMember(
            @RequestBody MemberCreateRequest request) {
        MemberDTO member = memberService.createMember(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(member));
    }
    
    @PutMapping("/{key}")
    public ResponseEntity<ApiResponse<MemberDTO>> updateMember(
            @PathVariable Long key,
            @RequestBody MemberUpdateRequest request) {
        MemberDTO member = memberService.updateMember(key, request);
        return ResponseEntity.ok(ApiResponse.success(member));
    }
    
    @DeleteMapping("/{key}")
    public ResponseEntity<Void> deleteMember(@PathVariable Long key) {
        memberService.deleteMember(key);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/check-userid")
    public ResponseEntity<ApiResponse<Boolean>> checkUserId(
            @RequestBody Map<String, String> request) {
        boolean available = memberService.checkUserId(request.get("userId"));
        return ResponseEntity.ok(ApiResponse.success(available));
    }
}
```

### 7.2 CORS 설정

```java
package kr.co.nubiz.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {
    
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:3000"); // React 개발 서버
        config.addAllowedOrigin("https://yourdomain.com"); // 운영 도메인
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        
        source.registerCorsConfiguration("/api/**", config);
        return new CorsFilter(source);
    }
}
```

## 8. 인증 및 인가

### 8.1 JWT 기반 인증

```java
// JWT 토큰 생성 및 검증 로직
// Spring Security 설정에서 JWT 필터 추가
```

### 8.2 React 인증 처리

```typescript
// src/hooks/useAuth.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi } from '../api/auth';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const navigate = useNavigate();
  
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.token);
      navigate('/admin');
    },
  });
  
  const logout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };
  
  return {
    login: loginMutation.mutate,
    logout,
    isAuthenticated: !!localStorage.getItem('accessToken'),
  };
}
```

## 9. 빌드 및 배포

### 9.1 React 빌드

```bash
npm run build
# dist/ 폴더에 빌드 결과물 생성
```

### 9.2 Spring Boot에 정적 파일 서빙

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/");
    }
}
```

### 9.3 통합 배포

React 빌드 결과물을 Spring Boot의 `src/main/resources/static/`에 복사하여 단일 WAR 파일로 배포

## 10. 마이그레이션 체크리스트

### 프론트엔드
- [ ] React 프로젝트 생성 완료
- [ ] TypeScript 타입 정의 완료
- [ ] API 클라이언트 구현 완료
- [ ] 주요 페이지 컴포넌트 구현 완료
- [ ] 라우팅 설정 완료
- [ ] 상태 관리 설정 완료

### 백엔드
- [ ] RESTful API Controller 구현 완료
- [ ] CORS 설정 완료
- [ ] JWT 인증 구현 완료
- [ ] API 응답 형식 표준화 완료

### 통합
- [ ] API 연동 테스트 완료
- [ ] 인증/인가 테스트 완료
- [ ] 빌드 및 배포 테스트 완료

## 11. 참고 자료

- [React 공식 문서](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [TanStack Query](https://tanstack.com/query)
- [Spring Boot REST API](https://spring.io/guides/tutorials/rest/)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)

