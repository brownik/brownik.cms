package kr.co.nubiz.controller.api;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import kr.co.nubiz.common.dto.ApiResponse;
import kr.co.nubiz.entity.Member;
import kr.co.nubiz.repository.MemberRepository;
import kr.co.nubiz.util.PasswordUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/v1/test")
@RequiredArgsConstructor
public class TestLoginController {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    
    @PersistenceContext
    private EntityManager entityManager;

    @GetMapping("/members")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMembers() {
        Map<String, Object> data = new HashMap<>();
        
        try {
            // Native Query로 직접 COUNT 조회
            Query countQuery = entityManager.createNativeQuery("SELECT COUNT(*) FROM NU_MEMBER");
            Long totalCount = ((Number) countQuery.getSingleResult()).longValue();
            data.put("totalCount", totalCount);
            
            // 상태가 'U'인 회원 몇 명 조회 (Native Query 사용)
            // Native Query로 직접 조회하여 Entity 매핑 문제 회피
            Query activeQuery = entityManager.createNativeQuery(
                "SELECT `KEY`, USERID, NAME, MEMBERLEVEL, `STATUS`, USERPW FROM NU_MEMBER WHERE `STATUS` = 'U' LIMIT 5"
            );
            @SuppressWarnings("unchecked")
            List<Object[]> activeRows = activeQuery.getResultList();
            
            var activeMembers = activeRows.stream()
                    .map(row -> {
                        Map<String, Object> memberInfo = new HashMap<>();
                        memberInfo.put("key", row[0]);
                        memberInfo.put("userId", row[1]);
                        memberInfo.put("name", row[2]);
                        memberInfo.put("memberLevel", row[3]);
                        memberInfo.put("status", row[4]);
                        String userPw = row[5] != null ? row[5].toString() : null;
                        memberInfo.put("passwordLength", userPw != null ? userPw.length() : 0);
                        memberInfo.put("isSha256", userPw != null && PasswordUtil.isSha256Format(userPw));
                        return memberInfo;
                    })
                    .toList();
            
            data.put("sampleMembers", activeMembers);
            
            return ResponseEntity.ok(ApiResponse.success("회원 정보 조회 성공", data));
        } catch (Exception e) {
            log.error("회원 정보 조회 실패", e);
            data.put("error", e.getMessage());
            return ResponseEntity.ok(ApiResponse.success("회원 정보 조회 실패", data));
        }
    }

    @GetMapping("/tables")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTables() {
        Map<String, Object> data = new HashMap<>();
        
        try {
            // 테이블 목록 조회
            Query tablesQuery = entityManager.createNativeQuery(
                "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'townE' ORDER BY TABLE_NAME"
            );
            @SuppressWarnings("unchecked")
            List<String> tables = tablesQuery.getResultList();
            
            data.put("database", "townE");
            data.put("tableCount", tables.size());
            data.put("tables", tables);
            
            // NU_MEMBER 테이블 구조 조회
            if (tables.contains("NU_MEMBER")) {
                Query descQuery = entityManager.createNativeQuery("DESCRIBE NU_MEMBER");
                @SuppressWarnings("unchecked")
                List<Object[]> columns = descQuery.getResultList();
                
                List<Map<String, String>> columnInfo = new java.util.ArrayList<>();
                for (Object[] col : columns) {
                    Map<String, String> colMap = new HashMap<>();
                    colMap.put("Field", col[0].toString());
                    colMap.put("Type", col[1].toString());
                    colMap.put("Null", col[2].toString());
                    colMap.put("Key", col[3] != null ? col[3].toString() : "");
                    colMap.put("Default", col[4] != null ? col[4].toString() : "NULL");
                    colMap.put("Extra", col[5] != null ? col[5].toString() : "");
                    columnInfo.add(colMap);
                }
                data.put("NU_MEMBER_structure", columnInfo);
            }
            
            return ResponseEntity.ok(ApiResponse.success("테이블 정보 조회 성공", data));
        } catch (Exception e) {
            log.error("테이블 정보 조회 실패", e);
            data.put("error", e.getMessage());
            data.put("stackTrace", java.util.Arrays.toString(e.getStackTrace()));
            return ResponseEntity.ok(ApiResponse.success("테이블 정보 조회 실패", data));
        }
    }

    @PostMapping("/password-check")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkPassword(
            @RequestParam String userId,
            @RequestParam String password) {
        Map<String, Object> data = new HashMap<>();
        
        try {
            var memberOpt = memberRepository.findByUserIdAndStatus(userId, "U");
            if (memberOpt.isEmpty()) {
                data.put("found", false);
                data.put("message", "사용자를 찾을 수 없습니다");
                return ResponseEntity.ok(ApiResponse.success("비밀번호 검증 결과", data));
            }
            
            Member member = memberOpt.get();
            data.put("found", true);
            data.put("userId", member.getUserId());
            data.put("storedPasswordLength", member.getUserPw().length());
            data.put("isSha256", PasswordUtil.isSha256Format(member.getUserPw()));
            data.put("passwordMatch", PasswordUtil.matches(password, member.getUserPw(), passwordEncoder));
            
            // SHA-256 테스트
            if (PasswordUtil.isSha256Format(member.getUserPw())) {
                String sha256Hash = PasswordUtil.sha256(password);
                data.put("sha256Hash", sha256Hash);
                data.put("sha256Match", sha256Hash.equals(member.getUserPw()));
            }
            
            return ResponseEntity.ok(ApiResponse.success("비밀번호 검증 결과", data));
        } catch (Exception e) {
            log.error("비밀번호 검증 실패", e);
            data.put("error", e.getMessage());
            return ResponseEntity.ok(ApiResponse.success("비밀번호 검증 실패", data));
        }
    }
}

