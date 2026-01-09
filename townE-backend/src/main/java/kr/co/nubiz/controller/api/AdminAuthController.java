package kr.co.nubiz.controller.api;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import kr.co.nubiz.common.dto.ApiResponse;
import kr.co.nubiz.dto.auth.AdminLoginRequest;
import kr.co.nubiz.dto.auth.AuthResponse;
import kr.co.nubiz.service.AdminAuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/v1/admin/auth")
@RequiredArgsConstructor
public class AdminAuthController {

    private final AdminAuthService adminAuthService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody AdminLoginRequest request,
            HttpServletRequest httpRequest) {
        log.info("관리자 로그인 요청: userId={}", request.getUserId());
        
        AuthResponse response = adminAuthService.login(request, httpRequest);
        
        return ResponseEntity.ok(ApiResponse.success("관리자 로그인 성공", response));
    }
}

