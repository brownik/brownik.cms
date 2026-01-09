package kr.co.nubiz.util;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * 비밀번호 유틸리티
 * 기존 SHA-256 비밀번호와 새 BCrypt 비밀번호 모두 지원
 */
public class PasswordUtil {

    /**
     * SHA-256 해시 생성 (기존 시스템 호환)
     */
    public static String sha256(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 알고리즘을 찾을 수 없습니다", e);
        }
    }

    /**
     * 비밀번호가 SHA-256 형식인지 확인 (64자 hex 문자열)
     * 대소문자 모두 허용 (기존 시스템 호환)
     */
    public static boolean isSha256Format(String password) {
        return password != null && password.length() == 64 && password.matches("[0-9a-fA-F]+");
    }

    /**
     * 비밀번호 검증 (SHA-256 또는 BCrypt 모두 지원)
     * 기존 시스템 호환: EncryptionUtil.ENC_SHA256()과 동일한 방식
     */
    public static boolean matches(String rawPassword, String encodedPassword, PasswordEncoder passwordEncoder) {
        if (encodedPassword == null || encodedPassword.isEmpty()) {
            return false;
        }

        // SHA-256 형식인 경우 (기존 시스템 호환)
        // 기존 EncryptionUtil.ENC_SHA256()과 동일한 방식 (Salt 없음)
        if (isSha256Format(encodedPassword)) {
            String sha256Hash = sha256(rawPassword);
            boolean matches = sha256Hash.equalsIgnoreCase(encodedPassword); // 대소문자 구분 없이 비교
            return matches;
        }

        // BCrypt 형식인 경우 (새 시스템)
        try {
            return passwordEncoder.matches(rawPassword, encodedPassword);
        } catch (Exception e) {
            // BCrypt 파싱 실패 시 SHA-256으로도 시도 (혼합 환경 대응)
            String sha256Hash = sha256(rawPassword);
            return sha256Hash.equalsIgnoreCase(encodedPassword);
        }
    }
}

