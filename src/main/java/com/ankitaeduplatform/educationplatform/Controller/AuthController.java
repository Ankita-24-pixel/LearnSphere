package com.ankitaeduplatform.educationplatform.Controller;

import com.ankitaeduplatform.educationplatform.Service.UserService;
import com.ankitaeduplatform.educationplatform.config.JWTUtility;
import com.ankitaeduplatform.educationplatform.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<?> loginUser(@RequestBody User user){

        boolean isAuthenticated = userService.authenticateUser(
                user.getEmail(),
                user.getPassword()
        );
        if(isAuthenticated){
            String token = jwtUtility.generateToken(user.getEmail());
            return ResponseEntity.ok(Collections.singletonMap("token", token));
        }else{
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }
}
