# Next.js + MariaDB 시작 가이드

## 개요

이 문서는 Next.js 프론트엔드와 MariaDB를 사용하여 townE 시스템을 새롭게 구축하는 완전한 가이드를 제공합니다. 추후 Supabase로 마이그레이션할 때 Schema 변경을 고려한 설계를 포함합니다.

**마이그레이션 계획:**
- 현재: Next.js + Spring Boot + MariaDB
- 추후: Next.js + Spring Boot + Supabase (PostgreSQL 기반)

## 1. 아키텍처 설계

### 1.1 전체 구조

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
│   MariaDB       │  (포트 3306)
│   (Database)    │
└─────────────────┘
```

### 1.2 기술 스택

#### Frontend
- **Next.js 14+**: React 프레임워크 (App Router)
- **TypeScript**: 타입 안정성
- **React Server Components**: 서버 컴포넌트
- **React Client Components**: 클라이언트 컴포넌트
- **Axios**: HTTP 클라이언트
- **TanStack Query (React Query)**: 서버 상태 관리
- **Zustand**: 클라이언트 상태 관리
- **Tailwind CSS**: 스타일링
- **Next.js Image**: 이미지 최적화

#### Backend
- **Spring Boot 3.x**: RESTful API
- **Spring Data JPA**: 데이터 접근
- **Spring Security**: 인증/인가
- **JWT**: 토큰 기반 인증
- **MariaDB**: 데이터베이스

## 2. 데이터베이스 설정 (기존 MariaDB 사용)

### 2.1 중요 사항

**기존 데이터베이스 사용**:
- 기존 MariaDB 데이터베이스를 그대로 사용합니다
- 스키마 변경 없이 연결 주소만 변경합니다
- 모든 기존 데이터가 그대로 유지됩니다

### 2.2 데이터베이스 연결 설정

기존 데이터베이스 연결 정보:
- Host: 192.168.0.141
- Port: 3306
- Database: townE
- User: townE
- Password: townE

**참고**: Phase 2에서 Supabase로 전환할 때도 기존 스키마를 최대한 유지하며 연결 주소만 변경합니다.

### 2.3 기존 데이터베이스 스키마

**기존 스키마 사용**:
- 기존 MariaDB 데이터베이스의 스키마를 그대로 사용합니다
- `04_Database_DDL_Script.md`에 전체 스키마가 정의되어 있습니다
- 스키마 변경 없이 연결 주소만 변경하여 사용합니다

**예시 스키마** (기존과 동일):
```sql
-- 기존 MariaDB 스키마 그대로 사용
CREATE TABLE NU_MEMBER (
    `KEY` INT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT '회원 키',
    MEMBERTYPE VARCHAR(1) NOT NULL DEFAULT 'P' COMMENT '회원 타입',
    USERID VARCHAR(50) NOT NULL COMMENT '사용자 ID',
    USERPW VARCHAR(255) NOT NULL COMMENT '비밀번호',
    -- ... 기타 필드
    `STATUS` VARCHAR(1) NOT NULL DEFAULT 'U' COMMENT '상태',
    INSERTDATE TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UPDATEDATE TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_userid (USERID),
    INDEX idx_status (`STATUS`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**참고**: Phase 2에서 Supabase로 전환할 때도 스키마 변경을 최소화하며, 연결 주소만 변경합니다.

## 3. Spring Boot 프로젝트 설정

### 3.1 pom.xml (MariaDB용)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>
    
    <groupId>kr.co.nubiz</groupId>
    <artifactId>townE-backend</artifactId>
    <version>4.0.0</version>
    <packaging>jar</packaging>
    
    <properties>
        <java.version>17</java.version>
        <mariadb.version>3.2.0</mariadb.version>
    </properties>
    
    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        
        <!-- MariaDB -->
        <dependency>
            <groupId>org.mariadb.jdbc</groupId>
            <artifactId>mariadb-java-client</artifactId>
            <version>${mariadb.version}</version>
        </dependency>
        
        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.12.3</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.12.3</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.12.3</version>
            <scope>runtime</scope>
        </dependency>
        
        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

### 3.2 application.yml (MariaDB)

**중요**: 기존 데이터베이스를 사용하므로 연결 주소만 설정합니다.

```yaml
spring:
  application:
    name: townE-backend
  
  datasource:
    # 기존 데이터베이스 연결 (주소만 변경 가능)
    # 기존 DB 정보: 192.168.0.141:3306/townE
    url: jdbc:mariadb://${DB_HOST:192.168.0.141}:${DB_PORT:3306}/${DB_NAME:townE}?zeroDateTimeBehavior=convertToNull&useUnicode=true&characterEncoding=utf8mb4
    username: ${DB_USERNAME:townE}
    password: ${DB_PASSWORD:townE}
    driver-class-name: org.mariadb.jdbc.Driver
    
    # 참고: Phase 2에서 Supabase로 전환 시 위 URL만 변경하면 됩니다
    # 예: jdbc:postgresql://db.your-project.supabase.co:5432/postgres
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
  
  jpa:
    hibernate:
      ddl-auto: validate  # 운영에서는 validate, 개발에서는 update
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MariaDBDialect
        format_sql: true
        naming:
          physical-strategy: org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl
          implicit-strategy: org.hibernate.boot.model.naming.ImplicitNamingStrategyLegacyJpaImpl
  
  servlet:
    multipart:
      max-file-size: 1GB
      max-request-size: 1GB

server:
  port: 8080
  servlet:
    context-path: /api

logging:
  level:
    root: INFO
    kr.co.nubiz: DEBUG

jwt:
  secret: ${JWT_SECRET:your-secret-key-change-in-production}
  expiration: 86400000  # 24시간
```

## 4. JPA Entity 설계 (MariaDB용, Supabase 마이그레이션 고려)

### 4.1 Member Entity

```java
package kr.co.nubiz.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "NU_MEMBER", indexes = {
    @Index(name = "idx_user_id", columnList = "USERID"),
    @Index(name = "idx_status", columnList = "STATUS"),
    @Index(name = "idx_member_type", columnList = "MEMBERTYPE")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Member {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "`KEY`")  // 예약어이므로 백틱 사용
    private Long id;
    
    @Column(name = "MEMBERTYPE", nullable = false, length = 1)
    private String memberType;
    
    @Column(name = "USERID", nullable = false, unique = true, length = 50)
    private String userId;
    
    @Column(name = "USERPW", nullable = false)
    private String password;
    
    @Column(name = "NAME", nullable = false, length = 100)
    private String name;
    
    @Column(name = "NICKNAME", length = 100)
    private String nickName;
    
    @Column(name = "EMAIL", length = 200)
    private String email; // DES 암호화
    
    @Column(name = "PHONE", length = 100)
    private String phone; // DES 암호화
    
    @Column(name = "MEMBERLEVEL", nullable = false, length = 2)
    @Builder.Default
    private String memberLevel = "0";
    
    @Column(name = "`STATUS`", nullable = false, length = 1)  // 예약어이므로 백틱 사용
    @Builder.Default
    private String status = "U";
    
    @Column(name = "INSERTDATE", nullable = false, updatable = false)
    private LocalDateTime insertDate;
    
    @Column(name = "INSERTIP", length = 50)
    private String insertIp;
    
    @Column(name = "INSERTMEMBERKEY")
    private Long insertMemberKey;
    
    @Column(name = "UPDATEDATE")
    private LocalDateTime updateDate;
    
    @Column(name = "UPDATEIP", length = 50)
    private String updateIp;
    
    @Column(name = "UPDATEMEMBERKEY")
    private Long updateMemberKey;
    
    @PrePersist
    protected void onCreate() {
        insertDate = LocalDateTime.now();
        if (status == null) {
            status = "U";
        }
        if (memberLevel == null) {
            memberLevel = "0";
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updateDate = LocalDateTime.now();
    }
}
```

**Supabase 마이그레이션 시 변경 사항**:
- `@Column(name = "`KEY`")` → `@Column(name = "\"id\"")`
- `@Table(name = "NU_MEMBER")` → `@Table(name = "members")`
- 컬럼명도 스네이크 케이스로 변경

## 5. Repository 구현

### 5.1 MemberRepository

```java
package kr.co.nubiz.repository;

import kr.co.nubiz.entity.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    
    @Query("SELECT m FROM Member m WHERE m.userId = :userId AND m.status != 'D'")
    Optional<Member> findByUserIdAndStatusNot(@Param("userId") String userId);
    
    boolean existsByUserId(String userId);
    
    @Query("SELECT m FROM Member m WHERE m.status != 'D' " +
           "AND (:searchType IS NULL OR :searchKeyword IS NULL OR " +
           "CASE :searchType " +
           "WHEN 'USERID' THEN m.userId LIKE CONCAT('%', :searchKeyword, '%') " +
           "WHEN 'NAME' THEN m.name LIKE CONCAT('%', :searchKeyword, '%') " +
           "WHEN 'EMAIL' THEN m.email LIKE CONCAT('%', :searchKeyword, '%') " +
           "ELSE true END)")
    Page<Member> findBySearchConditions(
        @Param("searchType") String searchType,
        @Param("searchKeyword") String searchKeyword,
        Pageable pageable
    );
}
```

**Supabase 마이그레이션 시 변경**:
- `CONCAT('%', :searchKeyword, '%')` → `'%' || :searchKeyword || '%'`

## 6. Service 구현

### 6.1 MemberService

```java
package kr.co.nubiz.service;

import kr.co.nubiz.dto.MemberCreateRequest;
import kr.co.nubiz.dto.MemberDTO;
import kr.co.nubiz.dto.MemberUpdateRequest;
import kr.co.nubiz.entity.Member;
import kr.co.nubiz.repository.MemberRepository;
import kr.co.nubiz.util.EncryptionUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {
    
    private final MemberRepository memberRepository;
    
    public Page<MemberDTO> getMembers(String searchType, String searchKeyword, Pageable pageable) {
        Page<Member> members = memberRepository.findBySearchConditions(searchType, searchKeyword, pageable);
        return members.map(this::toDTO);
    }
    
    public MemberDTO getMember(Long id) {
        Member member = memberRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("회원을 찾을 수 없습니다."));
        return toDTO(member);
    }
    
    @Transactional
    public MemberDTO createMember(MemberCreateRequest request) {
        if (memberRepository.existsByUserId(request.getUserId().toLowerCase())) {
            throw new RuntimeException("이미 사용 중인 아이디입니다.");
        }
        
        Member member = Member.builder()
            .memberType(request.getMemberType())
            .userId(request.getUserId().toLowerCase())
            .password(EncryptionUtil.encryptSHA256(request.getPassword()))
            .name(request.getName())
            .nickName(request.getNickName())
            .email(EncryptionUtil.encryptDES(request.getEmail1() + "@" + request.getEmail2()))
            .phone(EncryptionUtil.encryptDES(
                request.getPhone1() + request.getPhone2() + request.getPhone3()))
            .memberLevel(request.getMemberLevel() != null ? request.getMemberLevel() : "1")
            .status("U")
            .insertIp(request.getCreatedIp())
            .insertMemberKey(request.getCreatedBy())
            .build();
        
        Member saved = memberRepository.save(member);
        return toDTO(saved);
    }
    
    @Transactional
    public MemberDTO updateMember(Long id, MemberUpdateRequest request) {
        Member member = memberRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("회원을 찾을 수 없습니다."));
        
        if (request.getName() != null) {
            member.setName(request.getName());
        }
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            member.setPassword(EncryptionUtil.encryptSHA256(request.getPassword()));
        }
        // ... 기타 필드 업데이트
        
        member.setUpdateIp(request.getUpdatedIp());
        member.setUpdateMemberKey(request.getUpdatedBy());
        
        Member updated = memberRepository.save(member);
        return toDTO(updated);
    }
    
    @Transactional
    public void deleteMember(Long id) {
        Member member = memberRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("회원을 찾을 수 없습니다."));
        
        // 논리 삭제
        member.setStatus("D");
        member.setUserId(null);
        member.setName("삭제된 회원");
        member.setDeletedAt(LocalDateTime.now());
        
        memberRepository.save(member);
    }
    
    public boolean checkUserId(String userId) {
        return !memberRepository.existsByUserId(userId.toLowerCase());
    }
    
    private MemberDTO toDTO(Member member) {
        return MemberDTO.builder()
            .id(member.getId())
            .memberType(member.getMemberType())
            .userId(member.getUserId())
            .name(member.getName())
            .nickName(member.getNickName())
            .memberLevel(member.getMemberLevel())
            .status(member.getStatus())
            .createdAt(member.getInsertDate())
            .updatedAt(member.getUpdateDate())
            .build();
    }
}
```

## 7. REST API Controller

### 7.1 MemberController

```java
package kr.co.nubiz.controller.api;

import jakarta.validation.Valid;
import kr.co.nubiz.dto.*;
import kr.co.nubiz.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/members")
@RequiredArgsConstructor
public class MemberController {
    
    private final MemberService memberService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<MemberDTO>>> getMembers(
            @RequestParam(required = false) String searchType,
            @RequestParam(required = false) String searchKeyword,
            @PageableDefault(size = 20) Pageable pageable) {
        
        Page<MemberDTO> page = memberService.getMembers(searchType, searchKeyword, pageable);
        return ResponseEntity.ok(ApiResponse.success(PagedResponse.of(page)));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MemberDTO>> getMember(@PathVariable Long id) {
        MemberDTO member = memberService.getMember(id);
        return ResponseEntity.ok(ApiResponse.success(member));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<MemberDTO>> createMember(
            @Valid @RequestBody MemberCreateRequest request) {
        MemberDTO member = memberService.createMember(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(member, "회원이 등록되었습니다."));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MemberDTO>> updateMember(
            @PathVariable Long id,
            @Valid @RequestBody MemberUpdateRequest request) {
        MemberDTO member = memberService.updateMember(id, request);
        return ResponseEntity.ok(ApiResponse.success(member, "회원 정보가 수정되었습니다."));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMember(@PathVariable Long id) {
        memberService.deleteMember(id);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/check-userid")
    public ResponseEntity<ApiResponse<Boolean>> checkUserId(
            @RequestBody UserIdCheckRequest request) {
        boolean available = memberService.checkUserId(request.getUserId());
        return ResponseEntity.ok(ApiResponse.success(available));
    }
}
```

## 8. Next.js 프로젝트 설정

### 8.1 Next.js 프로젝트 생성

```bash
# Next.js 프로젝트 생성 (TypeScript, App Router, Tailwind CSS)
npx create-next-app@latest townE \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*"

cd townE

# 필수 패키지 설치
npm install axios @tanstack/react-query zustand
npm install react-hook-form @hookform/resolvers zod
npm install date-fns clsx
```

### 8.2 package.json

```json
{
  "name": "townE",
  "version": "1.0.0",
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
    "axios": "^1.6.2",
    "@tanstack/react-query": "^5.12.2",
    "zustand": "^4.4.7",
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

### 8.3 환경 변수 (.env.local)

```bash
# 개발 환경
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_NAME=townE
```

## 9. Next.js API 클라이언트

### 9.1 axios 설정

```typescript
// lib/api/client.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키 포함
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### 9.2 회원 API

```typescript
// lib/api/member.ts
import { apiClient } from './client';
import type { Member, MemberCreateRequest, MemberUpdateRequest, PagedResponse } from '@/types/member';

export const memberApi = {
  getMembers: async (params: {
    page?: number;
    size?: number;
    searchType?: string;
    searchKeyword?: string;
  }): Promise<PagedResponse<Member>> => {
    const response = await apiClient.get('/admin/members', { params });
    return response.data.data;
  },

  getMember: async (id: number): Promise<Member> => {
    const response = await apiClient.get(`/admin/members/${id}`);
    return response.data.data;
  },

  createMember: async (data: MemberCreateRequest): Promise<Member> => {
    const response = await apiClient.post('/admin/members', data);
    return response.data.data;
  },

  updateMember: async (id: number, data: MemberUpdateRequest): Promise<Member> => {
    const response = await apiClient.put(`/admin/members/${id}`, data);
    return response.data.data;
  },

  deleteMember: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/members/${id}`);
  },

  checkUserId: async (userId: string): Promise<boolean> => {
    const response = await apiClient.post('/admin/members/check-userid', { userId });
    return response.data.data;
  },
};
```

## 10. Next.js 컴포넌트 예시

### 10.1 회원 목록 페이지 (Server Component)

```typescript
// app/admin/members/page.tsx
import { memberApi } from '@/lib/api/member';
import { MemberList } from '@/components/member/MemberList';

interface PageProps {
  searchParams: {
    page?: string;
    size?: string;
    searchType?: string;
    searchKeyword?: string;
  };
}

export default async function MembersPage({ searchParams }: PageProps) {
  const page = Number(searchParams.page) || 1;
  const size = Number(searchParams.size) || 10;
  const searchType = searchParams.searchType;
  const searchKeyword = searchParams.searchKeyword;

  // 서버에서 데이터 페칭 (SSR)
  const data = await memberApi.getMembers({
    page: page - 1, // Spring Boot는 0-based 페이지네이션
    size,
    searchType,
    searchKeyword,
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

### 10.2 회원 목록 컴포넌트 (Client Component)

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
        />
        <Button onClick={() => setCurrentPage(1)}>검색</Button>
      </div>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">번호</th>
            <th className="border p-2">아이디</th>
            <th className="border p-2">이름</th>
            <th className="border p-2">등급</th>
            <th className="border p-2">등록일</th>
            <th className="border p-2">관리</th>
          </tr>
        </thead>
        <tbody>
          {data?.content.map((member) => (
            <tr key={member.id}>
              <td className="border p-2">{member.id}</td>
              <td className="border p-2">{member.userId}</td>
              <td className="border p-2">{member.name}</td>
              <td className="border p-2">{member.memberLevel}</td>
              <td className="border p-2">{member.createdAt}</td>
              <td className="border p-2">
                <Button
                  size="sm"
                  onClick={() => navigate(`/admin/members/${member.id}`)}
                >
                  상세
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {data?.pagination && (
        <Pagination
          currentPage={data.pagination.currentPage}
          totalPages={data.pagination.totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
```

## 11. CORS 설정

### 11.1 Spring Boot CORS 설정

```java
package kr.co.nubiz.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(
            "http://localhost:3000",  // React 개발 서버
            "http://localhost:5173"    // Vite 기본 포트
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
}
```

## 12. 빌드 및 실행

### 12.1 백엔드 실행

```bash
cd townE-backend
mvn spring-boot:run
# 또는
mvn clean package
java -jar target/townE-backend-4.0.0.jar
```

### 12.2 프론트엔드 실행

```bash
cd townE
npm run dev
# http://localhost:3000 또는 http://localhost:5173 접속
```

## 13. PostgreSQL 마이그레이션 준비

### 13.1 마이그레이션 전략

현재 MariaDB로 개발하면서 PostgreSQL 마이그레이션을 준비:

1. **코드에서 DB 특화 기능 최소화**
   - `CONCAT()` 대신 표준 SQL 사용
   - 예약어 사용 최소화

2. **매핑 테이블 작성**
   - MariaDB 컬럼명 → Supabase 컬럼명 매핑
   - 예: `NU_MEMBER.KEY` → `members.id`

3. **마이그레이션 스크립트 준비**
   - `10_PostgreSQL_Migration_Guide.md` 참고

### 13.2 추후 변경 사항

PostgreSQL 마이그레이션 시:
1. Entity의 `@Column(name = "...")` 변경
2. Repository의 쿼리 수정 (CONCAT → ||)
3. application.yml의 datasource 설정 변경
4. pom.xml의 의존성 변경

## 14. 체크리스트

### 데이터베이스
- [ ] MariaDB 설치 및 데이터베이스 생성
- [ ] DDL 스크립트 실행 (`04_Database_DDL_Script.md`)
- [ ] 초기 데이터 입력

### 백엔드
- [ ] Spring Boot 프로젝트 생성
- [ ] application.yml 설정 완료
- [ ] Entity 클래스 생성
- [ ] Repository 인터페이스 생성
- [ ] Service 구현 완료
- [ ] Controller 구현 완료
- [ ] CORS 설정 완료

### 프론트엔드
- [ ] React 프로젝트 생성
- [ ] TypeScript 타입 정의
- [ ] API 클라이언트 구현
- [ ] 주요 페이지 컴포넌트 구현
- [ ] 라우팅 설정 완료
- [ ] 상태 관리 설정 완료

### 통합
- [ ] API 연동 테스트 완료
- [ ] 인증/인가 테스트 완료
- [ ] 빌드 및 실행 확인

## 15. 다음 단계

React + MariaDB 구축이 완료되면:

1. **Supabase 마이그레이션 준비**:
   - `10_Supabase_Migration_Guide.md` 읽기
   - Schema 변경 계획 수립

2. **마이그레이션 실행**:
   - `12_Complete_Migration_Strategy.md`의 Phase 2 참고
   - 데이터 마이그레이션 스크립트 실행

3. **검증**:
   - 기능 테스트
   - 성능 테스트
   - 데이터 무결성 검증

## 16. 참고 문서

- `04_Database_DDL_Script.md` - MariaDB 스키마
- `11_React_Frontend_Guide.md` - React 상세 가이드
- `13_Spring_Boot_REST_API_Guide.md` - Spring Boot 상세 가이드
- `10_Supabase_Migration_Guide.md` - Supabase 마이그레이션 (추후)
- `12_Complete_Migration_Strategy.md` - 전체 마이그레이션 전략

