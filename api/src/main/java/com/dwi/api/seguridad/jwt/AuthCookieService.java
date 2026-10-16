package com.dwi.api.seguridad.jwt;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.time.Duration;

/** Crea y elimina la cookie HttpOnly que transporta el JWT. */
@Service
public class AuthCookieService {

    private final String cookieName;
    private final boolean secure;
    private final String sameSite;
    private final long expirationMs;

    public AuthCookieService(
            @Value("${app.security.cookie.name:auth_token}") String cookieName,
            @Value("${app.security.cookie.secure:false}") boolean secure,
            @Value("${app.security.cookie.same-site:Lax}") String sameSite,
            @Value("${app.security.jwt.expiration-ms:86400000}") long expirationMs
    ) {
        this.cookieName = cookieName;
        this.secure = secure;
        this.sameSite = sameSite;
        this.expirationMs = expirationMs;
        if ("None".equalsIgnoreCase(sameSite) && !secure) {
            throw new IllegalArgumentException("SameSite=None requiere AUTH_COOKIE_SECURE=true");
        }
    }

    public ResponseCookie create(String token) {
        return ResponseCookie.from(cookieName, token)
                .httpOnly(true)
                .secure(secure)
                .sameSite(sameSite)
                .path("/")
                .maxAge(Duration.ofMillis(expirationMs))
                .build();
    }

    public ResponseCookie clear() {
        return ResponseCookie.from(cookieName, "")
                .httpOnly(true)
                .secure(secure)
                .sameSite(sameSite)
                .path("/")
                .maxAge(Duration.ZERO)
                .build();
    }

    public java.util.Optional<String> readToken(jakarta.servlet.http.HttpServletRequest request) {
        if (request.getCookies() == null) return java.util.Optional.empty();
        for (jakarta.servlet.http.Cookie cookie : request.getCookies()) {
            if (cookieName.equals(cookie.getName())) return java.util.Optional.of(cookie.getValue());
        }
        return java.util.Optional.empty();
    }
}
