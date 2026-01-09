# Spring Boot REST API 완전 가이드

## 개요

이 문서는 townE 시스템을 Spring Boot + PostgreSQL + React로 전환하기 위한 완전한 REST API 구현 가이드를 제공합니다.

## 1. 프로젝트 초기 설정

### 1.1 Spring Boot 프로젝트 생성

```bash
# Spring Initializr 사용
# https://start.spring.io/

# 또는 Maven 프로젝트 직접 생성
mvn archetype:generate \
  -DgroupId=kr.co.nubiz \
  -DartifactId=townE-backend \
  -DarchetypeArtifactId=maven-archetype-quickstart \
  -DinteractiveMode=false
```

### 1.2 의존성 (pom.xml)

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
        <postgresql.version>42.7.1</postgresql.version>
        <jwt.version>0.12.3</jwt.version>
    </properties>
    
    <dependencies>
        <!-- Web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <!-- JPA -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        
        <!-- Security -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        
        <!-- Validation -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        
        <!-- PostgreSQL -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <version>${postgresql.version}</version>
        </dependency>
        
        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>${jwt.version}</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>${jwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>${jwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        
        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        
        <!-- MapStruct (선택) -->
        <dependency>
            <groupId>org.mapstruct</groupId>
            <artifactId>mapstruct</artifactId>
            <version>1.5.5.Final</version>
        </dependency>
        
        <!-- Test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
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

## 2. Entity 설계 (PostgreSQL)

### 2.1 Member Entity

```java
package kr.co.nubiz.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "members", indexes = {
    @Index(name = "idx_user_id", columnList = "user_id"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_member_type", columnList = "member_type")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Member {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @Column(name = "member_type", nullable = false, length = 1)
    private String memberType; // P=개인, C=법인
    
    @Column(name = "user_id", nullable = false, unique = true, length = 50)
    private String userId;
    
    @Column(name = "password", nullable = false)
    private String password; // SHA-256 해시
    
    @Column(name = "name", nullable = false, length = 100)
    private String name;
    
    @Column(name = "nick_name", length = 100)
    private String nickName;
    
    @Column(name = "business_number", length = 20)
    private String businessNumber; // 법인 회원
    
    @Column(name = "company_name", length = 200)
    private String companyName; // 법인 회원
    
    @Column(name = "tel", length = 100)
    private String tel; // DES 암호화
    
    @Column(name = "phone", length = 100)
    private String phone; // DES 암호화
    
    @Column(name = "fax", length = 100)
    private String fax; // DES 암호화
    
    @Column(name = "email", length = 200)
    private String email; // DES 암호화
    
    @Column(name = "age")
    private Integer age;
    
    @Column(name = "gender", length = 1)
    private String gender; // M=남성, F=여성
    
    @Column(name = "zip_code", length = 10)
    private String zipCode;
    
    @Column(name = "address1", length = 200)
    private String address1;
    
    @Column(name = "address2", length = 200)
    private String address2;
    
    @Column(name = "birthday", length = 100)
    private String birthday; // DES 암호화
    
    @Column(name = "birthday_type", length = 1)
    private String birthdayType; // S=양력, L=음력
    
    @Column(name = "email_agree", length = 1)
    @Builder.Default
    private String emailAgree = "N"; // Y=동의, N=비동의
    
    @Column(name = "sms_agree", length = 1)
    @Builder.Default
    private String smsAgree = "N";
    
    @Column(name = "agreement_date")
    private LocalDateTime agreementDate;
    
    @Column(name = "member_level", nullable = false, length = 2)
    @Builder.Default
    private String memberLevel = "0"; // 0=일반, 1-8=등급, 9=최고관리자
    
    @Column(name = "status", nullable = false, length = 1)
    @Builder.Default
    private String status = "U"; // U=사용중, D=삭제됨
    
    @Column(name = "cert_type", length = 10)
    private String certType;
    
    @Column(name = "cert_key1", length = 100)
    private String certKey1;
    
    @Column(name = "cert_key2", length = 100)
    private String certKey2;
    
    @Column(name = "last_login_date")
    private LocalDateTime lastLoginDate;
    
    @Column(name = "last_login_ip", length = 50)
    private String lastLoginIp;
    
    @Column(name = "login_fail_count")
    @Builder.Default
    private Integer loginFailCount = 0;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "created_ip", length = 50)
    private String createdIp;
    
    @Column(name = "created_by")
    private Long createdBy;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "updated_ip", length = 50)
    private String updatedIp;
    
    @Column(name = "updated_by")
    private Long updatedBy;
    
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
    
    @Column(name = "deleted_ip", length = 50)
    private String deletedIp;
    
    @Column(name = "deleted_by")
    private Long deletedBy;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = "U";
        }
        if (memberLevel == null) {
            memberLevel = "0";
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

### 2.2 Board Entity

```java
package kr.co.nubiz.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "boards")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Board {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @Column(name = "site_id", nullable = false)
    private Long siteId;
    
    @Column(name = "title", nullable = false, length = 255)
    private String title;
    
    @Column(name = "board_type", length = 20)
    @Builder.Default
    private String boardType = "NORMAL"; // NORMAL, FAQ, QNA
    
    @Column(name = "skin_id")
    private Long skinId;
    
    @Column(name = "list_access_role", length = 1)
    @Builder.Default
    private String listAccessRole = "0";
    
    @Column(name = "read_access_role", length = 1)
    @Builder.Default
    private String readAccessRole = "0";
    
    @Column(name = "cud_access_role", length = 1)
    @Builder.Default
    private String cudAccessRole = "0";
    
    @Column(name = "comment_access_role", length = 1)
    @Builder.Default
    private String commentAccessRole = "0";
    
    @Column(name = "reply_access_role", length = 1)
    @Builder.Default
    private String replyAccessRole = "0";
    
    @Column(name = "comment_use_yn", length = 1)
    @Builder.Default
    private String commentUseYn = "Y";
    
    @Column(name = "reply_use_yn", length = 1)
    @Builder.Default
    private String replyUseYn = "Y";
    
    @Column(name = "secret_use_yn", length = 1)
    @Builder.Default
    private String secretUseYn = "N";
    
    @Column(name = "password_use_yn", length = 1)
    @Builder.Default
    private String passwordUseYn = "N";
    
    @Column(name = "reservation_yn", length = 1)
    @Builder.Default
    private String reservationYn = "N";
    
    @Column(name = "upload_use_yn", length = 1)
    @Builder.Default
    private String uploadUseYn = "Y";
    
    @Column(name = "upload_count")
    @Builder.Default
    private Integer uploadCount = 5;
    
    @Column(name = "upload_size")
    @Builder.Default
    private Long uploadSize = 10485760L; // 10MB
    
    @Column(name = "upload_file_extension", length = 255)
    private String uploadFileExtension;
    
    @Column(name = "header", columnDefinition = "TEXT")
    private String header;
    
    @Column(name = "footer", columnDefinition = "TEXT")
    private String footer;
    
    @Column(name = "write_guide", columnDefinition = "TEXT")
    private String writeGuide;
    
    @Column(name = "modify_guide", columnDefinition = "TEXT")
    private String modifyGuide;
    
    @Column(name = "status", nullable = false, length = 1)
    @Builder.Default
    private String status = "U";
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "created_ip", length = 50)
    private String createdIp;
    
    @Column(name = "created_by")
    private Long createdBy;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "updated_ip", length = 50)
    private String updatedIp;
    
    @Column(name = "updated_by")
    private Long updatedBy;
    
    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<BoardItem> items;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = "U";
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

## 3. Repository 구현

### 3.1 MemberRepository

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
    
    Optional<Member> findByUserIdAndStatusNot(String userId, String status);
    
    boolean existsByUserId(String userId);
    
    @Query("SELECT m FROM Member m WHERE m.status != 'D' " +
           "AND (:searchType IS NULL OR :searchKeyword IS NULL OR " +
           "CASE :searchType " +
           "WHEN 'USERID' THEN m.userId LIKE %:searchKeyword% " +
           "WHEN 'NAME' THEN m.name LIKE %:searchKeyword% " +
           "WHEN 'EMAIL' THEN m.email LIKE %:searchKeyword% " +
           "ELSE true END)")
    Page<Member> findBySearchConditions(
        @Param("searchType") String searchType,
        @Param("searchKeyword") String searchKeyword,
        Pageable pageable
    );
}
```

## 4. Service 구현

### 4.1 MemberService

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
        // 아이디 중복 체크
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
            .tel(EncryptionUtil.encryptDES(
                request.getTel1() + request.getTel2() + request.getTel3()))
            .memberLevel(request.getMemberLevel() != null ? request.getMemberLevel() : "1")
            .status("U")
            .emailAgree(request.getEmailAgree() != null ? request.getEmailAgree() : "N")
            .smsAgree(request.getSmsAgree() != null ? request.getSmsAgree() : "N")
            .createdIp(request.getCreatedIp())
            .createdBy(request.getCreatedBy())
            .build();
        
        if ("C".equals(request.getMemberType())) {
            member.setBusinessNumber(request.getBusinessNumber());
            member.setCompanyName(request.getCompanyName());
        }
        
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
        if (request.getNickName() != null) {
            member.setNickName(request.getNickName());
        }
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            member.setPassword(EncryptionUtil.encryptSHA256(request.getPassword()));
        }
        if (request.getEmail1() != null && request.getEmail2() != null) {
            member.setEmail(EncryptionUtil.encryptDES(request.getEmail1() + "@" + request.getEmail2()));
        }
        if (request.getPhone1() != null && request.getPhone2() != null && request.getPhone3() != null) {
            member.setPhone(EncryptionUtil.encryptDES(
                request.getPhone1() + request.getPhone2() + request.getPhone3()));
        }
        if (request.getMemberLevel() != null) {
            member.setMemberLevel(request.getMemberLevel());
        }
        
        member.setUpdatedIp(request.getUpdatedIp());
        member.setUpdatedBy(request.getUpdatedBy());
        
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
        member.setNickName("삭제된 회원");
        member.setTel(null);
        member.setPhone(null);
        member.setEmail(null);
        member.setDeletedAt(LocalDateTime.now());
        member.setDeletedBy(id);
        
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
            .email(member.getEmail()) // 복호화는 필요시 별도 처리
            .phone(member.getPhone())
            .memberLevel(member.getMemberLevel())
            .status(member.getStatus())
            .createdAt(member.getCreatedAt())
            .updatedAt(member.getUpdatedAt())
            .build();
    }
}
```

## 5. DTO 설계

### 5.1 MemberDTO

```java
package kr.co.nubiz.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberDTO {
    private Long id;
    private String memberType;
    private String userId;
    private String name;
    private String nickName;
    private String email;
    private String phone;
    private String memberLevel;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

### 5.2 MemberCreateRequest

```java
package kr.co.nubiz.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class MemberCreateRequest {
    @NotBlank(message = "회원 타입은 필수입니다.")
    @Pattern(regexp = "^[PC]$", message = "회원 타입은 P(개인) 또는 C(법인)만 가능합니다.")
    private String memberType;
    
    @NotBlank(message = "아이디는 필수입니다.")
    private String userId;
    
    @NotBlank(message = "비밀번호는 필수입니다.")
    private String password;
    
    @NotBlank(message = "이름은 필수입니다.")
    private String name;
    
    private String nickName;
    
    // 법인 회원
    private String businessNumber;
    private String companyName;
    
    // 연락처 (분리)
    private String tel1, tel2, tel3;
    private String phone1, phone2, phone3;
    private String email1, email2;
    
    private String memberLevel;
    private String emailAgree;
    private String smsAgree;
    
    // 감사 정보
    private String createdIp;
    private Long createdBy;
}
```

## 6. Controller 구현

### 6.1 MemberController (완전한 예시)

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
        PagedResponse<MemberDTO> pagedResponse = PagedResponse.of(page);
        
        return ResponseEntity.ok(ApiResponse.success(pagedResponse));
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

### 6.2 공통 응답 클래스

```java
package kr.co.nubiz.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private T data;
    private String message;
    private long timestamp;
    
    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
            .success(true)
            .data(data)
            .timestamp(Instant.now().toEpochMilli())
            .build();
    }
    
    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
            .success(true)
            .data(data)
            .message(message)
            .timestamp(Instant.now().toEpochMilli())
            .build();
    }
    
    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder()
            .success(false)
            .message(message)
            .timestamp(Instant.now().toEpochMilli())
            .build();
    }
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PagedResponse<T> {
    private java.util.List<T> content;
    private PaginationInfo pagination;
    
    public static <T> PagedResponse<T> of(Page<T> page) {
        return PagedResponse.<T>builder()
            .content(page.getContent())
            .pagination(PaginationInfo.of(page))
            .build();
    }
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaginationInfo {
    private int currentPage;
    private int totalPages;
    private long totalElements;
    private int pageSize;
    private boolean hasNext;
    private boolean hasPrevious;
    
    public static PaginationInfo of(Page<?> page) {
        return PaginationInfo.builder()
            .currentPage(page.getNumber() + 1)
            .totalPages(page.getTotalPages())
            .totalElements(page.getTotalElements())
            .pageSize(page.getSize())
            .hasNext(page.hasNext())
            .hasPrevious(page.hasPrevious())
            .build();
    }
}
```

## 7. 예외 처리

### 7.1 GlobalExceptionHandler

```java
package kr.co.nubiz.exception;

import kr.co.nubiz.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        return ResponseEntity.badRequest()
            .body(ApiResponse.error("유효성 검사 실패", errors));
    }
    
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<Void>> handleRuntimeException(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(ApiResponse.error(ex.getMessage()));
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiResponse.error("서버 오류가 발생했습니다."));
    }
}
```

## 8. 보안 설정

### 8.1 SecurityConfig

```java
package kr.co.nubiz.config;

import kr.co.nubiz.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("USER")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "https://yourdomain.com"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }
}
```

## 9. 애플리케이션 실행

### 9.1 Main Application

```java
package kr.co.nubiz;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TownEApplication {
    public static void main(String[] args) {
        SpringApplication.run(TownEApplication.class, args);
    }
}
```

### 9.2 실행

```bash
# Maven으로 실행
mvn spring-boot:run

# 또는 JAR 파일로 실행
mvn clean package
java -jar target/townE-backend-4.0.0.jar
```

## 10. 테스트

### 10.1 API 테스트 예시

```bash
# 회원 목록 조회
curl -X GET "http://localhost:8080/api/admin/members?page=0&size=20" \
  -H "Authorization: Bearer {token}"

# 회원 등록
curl -X POST "http://localhost:8080/api/admin/members" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "memberType": "P",
    "userId": "testuser",
    "password": "password123",
    "name": "홍길동",
    "email1": "test",
    "email2": "example.com",
    "phone1": "010",
    "phone2": "1234",
    "phone3": "5678"
  }'
```

## 11. 다음 단계

이제 다음 문서를 참고하여 React 프론트엔드를 개발하세요:
- `11_React_Frontend_Guide.md` - React 프론트엔드 가이드
- `12_Complete_Migration_Strategy.md` - 통합 마이그레이션 전략

