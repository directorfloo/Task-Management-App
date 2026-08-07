package org.example.taskmanager.service;

import org.example.taskmanager.dto.request.LoginRequest;
import org.example.taskmanager.dto.request.RegisterRequest;
import org.example.taskmanager.dto.response.AuthResponse;

public interface UserService {
AuthResponse register(RegisterRequest req);
AuthResponse login(LoginRequest req);
void validateUser(String username);
AuthResponse refreshToken(String refreshToken);

}
