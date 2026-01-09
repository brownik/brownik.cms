package kr.co.nubiz.controller.api;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import kr.co.nubiz.common.dto.ApiResponse;
import kr.co.nubiz.dto.auth.AuthResponse;
import kr.co.nubiz.dto.auth.LoginRequest;
import kr.co.nubiz.dto.auth.RefreshTokenRequest;
import kr.co.nubiz.dto.auth.SignupRequest;
import kr.co.nubiz.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<AuthResponse>> signup(
            @Valid @RequestBody SignupRequest request) {
        log.info("회원가입 요청: userId={}", request.getUserId());
        
        AuthResponse response = authService.signup(request);
        
        return ResponseEntity.ok(ApiResponse.success("회원가입이 완료되었습니다", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest) {
        log.info("로그인 요청: userId={}", request.getUserId());
        
        AuthResponse response = authService.login(request, httpRequest);
        
        return ResponseEntity.ok(ApiResponse.success("로그인 성공", response));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(
            @Valid @RequestBody RefreshTokenRequest request) {
        log.info("토큰 갱신 요청");
        
        AuthResponse response = authService.refreshToken(request);
        
        return ResponseEntity.ok(ApiResponse.success("토큰이 갱신되었습니다", response));
    }
}

