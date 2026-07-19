package com.ankitaeduplatform.educationplatform.Service;

import com.ankitaeduplatform.educationplatform.entity.User;
import com.ankitaeduplatform.educationplatform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public boolean saveNewUser(User user){
        try{
            if(userRepository.existsByEmail(user.getEmail())){

                throw new RuntimeException("Email already exists");
            }
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            userRepository.save(user);
            return true;

        }catch(Exception e){
            e.printStackTrace();
            return false;
        }
    }
    public boolean authenticateUser(String email, String password){
        Optional<User> userdetails = userRepository.findByEmail(email);

        if(userdetails.isPresent()){
            User user = userdetails.get();
            return passwordEncoder.matches(password, user.getPassword());
        }
        return false;
    }
    public List<User> getAll(){
        return userRepository.findAll();
    }
    public Optional<User> findById(Long id){
        return userRepository.findById(id);
    }
    public Optional<User> findByEmail(String email){
        return userRepository.findByEmail(email);
    }
    public void deleteById(Long id){
        userRepository.deleteById(id);
    }
}
