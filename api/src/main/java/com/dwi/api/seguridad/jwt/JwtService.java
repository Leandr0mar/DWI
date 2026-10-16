package com.dwi.api.seguridad.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Date;
import javax.crypto.SecretKey;

@Service
public class JwtService {

    private final SecretKey signingKey;
    private final long expirationMs;

    public JwtService(
            @Value("${app.security.jwt.secret}") String base64Secret,
            @Value("${app.security.jwt.expiration-ms:86400000}") long expirationMs
    ) {
        if (base64Secret == null || base64Secret.isBlank()) {
            // Clave efímera para desarrollo/laboratorio: los tokens dejan de servir al reiniciar.
            this.signingKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
        } else {
            byte[] keyBytes = Decoders.BASE64.decode(base64Secret);
            this.signingKey = Keys.hmacShaKeyFor(keyBytes);
        }
        if (expirationMs <= 0) {
            throw new IllegalArgumentException("JWT expiration must be greater than zero");
        }
        this.expirationMs = expirationMs;
    }

    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
                .setSubject(userDetails.getUsername()) // El email será el username
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean isTokenValid(Claims claims, UserDetails userDetails) {
        String username = claims.getSubject();
        Date expiration = claims.getExpiration();
        return username != null
                && username.equals(userDetails.getUsername())
                && expiration != null
                && expiration.after(new Date());
    }
}
