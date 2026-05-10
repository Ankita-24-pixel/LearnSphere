package com.ankitaeduplatform.educationplatform.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;

@Component
public class JWTUtility {
    
    private static final String SECRET = "fdafe8ryq3ue102i1ifsaodifhaiohp9323nkfhiafasfu490fklafiaoeipor332";
    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());
    
    public String generateToken(String userName){
        return Jwts.builder()
                .setSubject(userName)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
                .signWith(key)
                .compact();
    }
    public String extractUserName(String token){
        return Jwts.parser()
                .verifyWith((SecretKey) key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
                
    }
}
