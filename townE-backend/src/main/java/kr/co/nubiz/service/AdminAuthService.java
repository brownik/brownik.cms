package kr.co.nubiz.service;

import jakarta.servlet.http.HttpServletRequest;
import kr.co.nubiz.dto.auth.AuthResponse;
import kr.co.nubiz.dto.auth.AdminLoginRequest;
import kr.co.nubiz.entity.Member;
import kr.co.nubiz.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminAuthService {

    private final MemberService memberService;
    private final JwtUtil jwtUtil;

    /**
     * 관리자 로그인
     * 관리자는 MEMBERLEVEL이 8 이상이어야 함
     */
    public AuthResponse login(AdminLoginRequest request, HttpServletRequest httpRequest) {
        // 사용자 조회
        Member member = memberService.findByUserId(request.getUserId());

        // 관리자 권한 확인 (MEMBERLEVEL 8 이상)
        int memberLevel = Integer.parseInt(member.getMemberLevel());
        if (memberLevel < 8) {
            throw new RuntimeException("관리자 권한이 없습니다");
        }

        // 비밀번호 검증
        if (!memberService.validatePassword(request.getUserPw(), member.getUserPw())) {
            // 로그인 실패 횟수 증가
            memberService.incrementLoginFailCount(request.getUserId());
            throw new RuntimeException("아이디 또는 비밀번호가 잘못되었습니다");
        }

        // 로그인 정보 업데이트
        String clientIp = getClientIp(httpRequest);
        memberService.updateLoginInfo(member.getKey(), clientIp);

        // JWT 토큰 생성
        String accessToken = jwtUtil.generateAccessToken(
                member.getKey(),
                member.getUserId(),
                member.getMemberLevel()
        );
        String refreshToken = jwtUtil.generateRefreshToken(
                member.getKey(),
                member.getUserId()
        );

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(AuthResponse.UserInfo.builder()
                        .id(member.getKey())
                        .userId(member.getUserId())
                        .name(member.getName())
                        .memberLevel(member.getMemberLevel())
                        .build())
                .build();
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}

