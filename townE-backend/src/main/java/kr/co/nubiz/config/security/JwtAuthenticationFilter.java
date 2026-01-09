package kr.co.nubiz.config.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.co.nubiz.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String token = getTokenFromRequest(request);

        if (token != null && jwtUtil.validateToken(token, jwtUtil.extractUserId(token))) {
            try {
                // 토큰 타입 확인 (access token만 허용)
                String tokenType = jwtUtil.extractTokenType(token);
                if (!"access".equals(tokenType)) {
                    filterChain.doFilter(request, response);
                    return;
                }

                // 사용자 정보 추출
                Long memberKey = jwtUtil.extractMemberKey(token);
                String userId = jwtUtil.extractUserId(token);
                String memberLevel = jwtUtil.extractMemberLevel(token);

                // 권한 설정
                String role = getRoleFromMemberLevel(memberLevel);
                SimpleGrantedAuthority authority = new SimpleGrantedAuthority(role);

                // 인증 객체 생성
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userId,
                                null,
                                Collections.singletonList(authority)
                        );
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // SecurityContext에 인증 정보 설정
                SecurityContextHolder.getContext().setAuthentication(authentication);

                // 요청에 사용자 정보 추가 (선택사항)
                request.setAttribute("memberKey", memberKey);
                request.setAttribute("userId", userId);
                request.setAttribute("memberLevel", memberLevel);

            } catch (Exception e) {
                log.error("JWT 토큰 처리 중 오류 발생", e);
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    private String getRoleFromMemberLevel(String memberLevel) {
        if (memberLevel == null) {
            return "ROLE_GUEST";
        }
        
        int level = Integer.parseInt(memberLevel);
        if (level >= 8) {
            return "ROLE_ADMIN";
        } else if (level >= 3) {
            return "ROLE_USER";
        } else {
            return "ROLE_GUEST";
        }
    }
}

