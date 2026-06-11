package com.ankitaeduplatform.educationplatform.config;

import com.ankitaeduplatform.educationplatform.entity.User;
import com.ankitaeduplatform.educationplatform.repository.UserRepository;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.swing.text.html.Option;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Optional;

@Component
public class JwtFilter extends OncePerRequestFilter { //runs only once for every http request

    //field injection of beans
    @Autowired
    private JWTUtility jwtUtility;

    @Autowired
    private UserRepository userRepository;



    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {


        String token = null;
        String username = null;

        if(request.getCookies() != null){
            for(Cookie cookie : request.getCookies()){
                if("jwt_token".equals(cookie.getName())){
                    token = cookie.getValue();
                    break;
                }
            }
        }
        //no token
        if(token == null){
            filterChain.doFilter(request, response);
            return;
        }
        try{
            //extract username from token
            username = jwtUtility.extractUserName(token);
            System.out.println("Token username = " + username);
        }catch(JwtException | IllegalArgumentException e){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        if(username != null && SecurityContextHolder.getContext().getAuthentication() == null){
            Optional<User> userOpt = userRepository.findByEmail(username);
            if(userOpt.isPresent()){
                User user = userOpt.get();
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        user,
                        null,
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole())));
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }
    public boolean validateToken(String token){
        try{
            jwtUtility.extractUserName(token);
            return true;
        }catch(Exception e){
            return false;
        }
    }


}
