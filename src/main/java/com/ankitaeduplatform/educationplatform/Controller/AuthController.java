package com.ankitaeduplatform.educationplatform.Controller;

import com.ankitaeduplatform.educationplatform.Service.UserService;
import com.ankitaeduplatform.educationplatform.config.JWTUtility;
import com.ankitaeduplatform.educationplatform.entity.User;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/auth")

public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JWTUtility jwtUtility;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user){
        boolean isSaved = userService.saveNewUser(user);
        if(isSaved){
            return ResponseEntity.ok("User registered successfully");
        }else{
            return ResponseEntity.badRequest().body("Error registering user");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user, HttpServletResponse response){

        boolean isAuthenticated = userService.authenticateUser(
                user.getEmail(),
                user.getPassword()
        );
        if(isAuthenticated){
            User userbyemail = userService.findByEmail(user.getEmail()).get();
            String token = jwtUtility.generateToken(userbyemail.getEmail(), userbyemail.getRole());

            Cookie cookie = new Cookie("jwt_token", token);
            cookie.setHttpOnly(true);
            cookie.setSecure(true);
            cookie.setPath("/");
            cookie.setAttribute("SameSite", "None");
            cookie.setMaxAge(24*60*60);

            response.addCookie(cookie);

            return ResponseEntity.ok("Login successful");
        }else{
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletResponse response) {

        Cookie cookie = new Cookie("jwt_token", "");
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);

        response.addCookie(cookie);

        return ResponseEntity.ok("Logged out");
    }
    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication auth) {
        if(auth == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(auth.getPrincipal());
    }
}
