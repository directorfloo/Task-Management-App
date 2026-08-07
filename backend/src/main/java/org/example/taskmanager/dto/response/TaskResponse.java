package org.example.taskmanager.dto.response;

import lombok.Getter;
import lombok.Setter;
import org.example.taskmanager.entity.Task;
import org.example.taskmanager.entity.User;

import java.time.LocalDateTime;


@Getter
@Setter
public class TaskResponse {
    private Long taskId;
    private String title;
    private String description;
    private String priority;
    private String userId;
    private String username;

}
