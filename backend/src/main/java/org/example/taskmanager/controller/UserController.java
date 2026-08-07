package org.example.taskmanager.controller;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.taskmanager.dto.request.LoginRequest;
import org.example.taskmanager.dto.request.RefreshTokenRequest;
import org.example.taskmanager.dto.request.RegisterRequest;
import org.example.taskmanager.dto.response.ApiResponse;
import org.example.taskmanager.dto.response.AuthResponse;
import org.example.taskmanager.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/tasks/Authentication")
@RequiredArgsConstructor
public class UserController {

    @Autowired
    private final UserService userService;

    @PostMapping("/register/user")
    @Operation(summary = "Register a new Requester")
    public ResponseEntity<ApiResponse<AuthResponse>> registerUser(
            @Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.ok(ApiResponse.success(
                "Requester registered successfully", userService.register(req)));
    }


    @PostMapping("/login")
    @Operation(summary = "Login for all roles")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Login successful", userService.login(req)));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(
            @Valid @RequestBody RefreshTokenRequest req) {
        return ResponseEntity.ok(ApiResponse.success(userService.refreshToken(req.getRefreshToken())));
    }
}
