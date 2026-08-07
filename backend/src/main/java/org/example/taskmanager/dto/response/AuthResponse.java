package org.example.taskmanager.dto.response;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AuthResponse {
    private Long userId;
    private String username;
    private String accessToken;
    private String refreshToken;
    private String tokenType;
}
