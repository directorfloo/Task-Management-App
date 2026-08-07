package org.example.taskmanager.service;


import lombok.RequiredArgsConstructor;
import org.example.taskmanager.dto.request.LoginRequest;
import org.example.taskmanager.dto.request.RegisterRequest;
import org.example.taskmanager.dto.response.AuthResponse;
import org.example.taskmanager.entity.User;
import org.example.taskmanager.exception.UserNotFoundException;
import org.example.taskmanager.exception.UsernameAlreadyExistException;
import org.example.taskmanager.repository.UserRepository;
import org.example.taskmanager.security.CustomUserDetailsService;
import org.example.taskmanager.security.JwtUtil;
import org.example.taskmanager.utils.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    @Autowired
   private final UserRepository userRepository;

    @Autowired
    private final UserMapper userMapper;

    @Autowired
   private final PasswordEncoder passwordEncoder;

    @Autowired
   private final AuthenticationManager authenticationManager;

    @Autowired
   private final JwtUtil jwtUtil;

    @Autowired
   private final CustomUserDetailsService userDetailsService;

    @Override
    public AuthResponse register(RegisterRequest req) {
        validateUser(req.getUsername());
        User user = userMapper.toEntity(req);
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setConfirmedPassword(passwordEncoder.encode(req.getConfirmedPassword()));
        user.setCreatedAt(LocalDateTime.now());
        user.setActive(true);
        User savedUser = userRepository.save(user);
        return buildAuthResponse(savedUser);
    }

    @Override
    public AuthResponse login(LoginRequest req) {
      authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword()));
      User user =userRepository.findByUsername(req.getUsername())
              .orElseThrow(()-> new UserNotFoundException("User not found"));


        return buildAuthResponse(user);



    }

    @Override
    public void validateUser(String username) {
        if(userRepository.existsByUsername(username)){
            throw new UsernameAlreadyExistException("Username already exists");
        }

    }

    @Override
    public AuthResponse refreshToken(String refreshToken) {
        String username = jwtUtil.extractUsername(refreshToken);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        if (!jwtUtil.isTokenValid(refreshToken, userDetails)) {
            throw new RuntimeException("Invalid or expired refresh token");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        return buildAuthResponse(user);
    }

    public AuthResponse buildAuthResponse(User user) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        Map<String, Object> claims = Map.of( "userId", user.getUserId());
        String accessToken = jwtUtil.generateToken(userDetails, claims);
        String refreshToken = jwtUtil.generateRefreshToken(userDetails);

        AuthResponse response = new AuthResponse();
        response.setUserId(user.getUserId());
        response.setUsername(user.getUsername());
        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshToken);
        response.setTokenType("Bearer");
        return response;

    }
}
