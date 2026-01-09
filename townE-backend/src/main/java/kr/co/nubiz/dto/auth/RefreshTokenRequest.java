package kr.co.nubiz.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RefreshTokenRequest {

    @NotBlank(message = "Refresh Token은 필수입니다")
    private String refreshToken;
}

