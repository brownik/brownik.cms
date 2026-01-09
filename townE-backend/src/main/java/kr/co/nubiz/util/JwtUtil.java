package kr.co.nubiz.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    @Value("${jwt.refresh-expiration}")
    private Long refreshExpiration;

    private SecretKey getSigningKey() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateAccessToken(Long memberKey, String userId, String memberLevel) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("memberKey", memberKey);
        claims.put("userId", userId);
        claims.put("memberLevel", memberLevel);
        claims.put("type", "access");

        return createToken(claims, userId, expiration);
    }

    public String generateRefreshToken(Long memberKey, String userId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("memberKey", memberKey);
        claims.put("userId", userId);
        claims.put("type", "refresh");

        return createToken(claims, userId, refreshExpiration);
    }

    private String createToken(Map<String, Object> claims, String subject, Long expiration) {
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    public String extractUserId(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Long extractMemberKey(String token) {
        Claims claims = extractAllClaims(token);
        Object memberKey = claims.get("memberKey");
        if (memberKey instanceof Integer) {
            return ((Integer) memberKey).longValue();
        }
        return (Long) memberKey;
    }

    public String extractMemberLevel(String token) {
        Claims claims = extractAllClaims(token);
        return (String) claims.get("memberLevel");
    }

    public String extractTokenType(String token) {
        Claims claims = extractAllClaims(token);
        return (String) claims.get("type");
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Boolean validateToken(String token, String userId) {
        final String extractedUserId = extractUserId(token);
        return (extractedUserId.equals(userId) && !isTokenExpired(token));
    }
}

