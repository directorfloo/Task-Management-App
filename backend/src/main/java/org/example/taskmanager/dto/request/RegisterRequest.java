package org.example.taskmanager.dto.request;

import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
public class RegisterRequest {
    private String username;
    private String password;
    private String confirmedPassword;
}
