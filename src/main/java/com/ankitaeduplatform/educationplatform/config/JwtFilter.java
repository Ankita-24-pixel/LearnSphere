package com.ankitaeduplatform.educationplatform.config;

import com.ankitaeduplatform.educationplatform.entity.User;
import com.ankitaeduplatform.educationplatform.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.swing.text.html.Option;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Optional;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JWTUtility jwtUtility;

    @Autowired
    private UserRepository userRepository;



    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();
        // ✅ 1. Skip public endpoints
        if (path.startsWith("/auth") ||
                path.equals("/content") ||
                path.startsWith("/content/topic")) {

            filterChain.doFilter(request, response);
            return;
        }

        // ✅ 2. Get token
        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            // ❗ DO NOT BLOCK → just continue
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);

        // ✅ 3. Validate token (your logic here)
        if (token == null || token.isEmpty() || token.equals("null") || token.equals("undefined")) {
            filterChain.doFilter(request, response);
            return;
        }
//        try {
//            Optional<User> userOpt = userRepository.findByEmail(use);
//
//        } catch (Exception e) {
//            // ✅ THIS IS CRUCIAL
//            System.out.println("TOKEN" + token);
//            System.out.println("Invalid JWT token: " + token);
//        }

        filterChain.doFilter(request, response);
    }


}
