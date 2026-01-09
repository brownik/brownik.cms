package kr.co.nubiz.service;

import jakarta.servlet.http.HttpServletRequest;
import kr.co.nubiz.dto.auth.AuthResponse;
import kr.co.nubiz.dto.auth.LoginRequest;
import kr.co.nubiz.dto.auth.RefreshTokenRequest;
import kr.co.nubiz.dto.auth.SignupRequest;
import kr.co.nubiz.entity.Member;
import kr.co.nubiz.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final MemberService memberService;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        Member member = memberService.signup(request);
        
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

    public AuthResponse login(LoginRequest request, HttpServletRequest httpRequest) {
        log.info("로그인 시도: userId={}", request.getUserId());
        
        try {
            // 사용자 조회
            Member member = memberService.findByUserId(request.getUserId());
            log.debug("사용자 조회 성공: userId={}, memberLevel={}", request.getUserId(), member.getMemberLevel());

            // 비밀번호 검증
            if (!memberService.validatePassword(request.getUserPw(), member.getUserPw())) {
                log.warn("비밀번호 불일치: userId={}", request.getUserId());
                // 로그인 실패 횟수 증가
                memberService.incrementLoginFailCount(request.getUserId());
                throw new RuntimeException("아이디 또는 비밀번호가 잘못되었습니다");
            }
            
            log.info("비밀번호 검증 성공: userId={}", request.getUserId());

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
        } catch (RuntimeException e) {
            log.error("로그인 실패: userId={}, error={}", request.getUserId(), e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("로그인 중 예상치 못한 오류 발생: userId={}", request.getUserId(), e);
            throw new RuntimeException("로그인 처리 중 오류가 발생했습니다", e);
        }
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();

        // 토큰 검증
        if (jwtUtil.isTokenExpired(refreshToken)) {
            throw new RuntimeException("Refresh Token이 만료되었습니다");
        }

        // 토큰 타입 확인
        String tokenType = jwtUtil.extractTokenType(refreshToken);
        if (!"refresh".equals(tokenType)) {
            throw new RuntimeException("유효하지 않은 Refresh Token입니다");
        }

        // 사용자 정보 추출
        Long memberKey = jwtUtil.extractMemberKey(refreshToken);
        String userId = jwtUtil.extractUserId(refreshToken);

        // 사용자 조회
        Member member = memberService.findByUserId(userId);

        // 새 Access Token 생성
        String newAccessToken = jwtUtil.generateAccessToken(
                member.getKey(),
                member.getUserId(),
                member.getMemberLevel()
        );

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken) // Refresh Token은 그대로 반환
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

