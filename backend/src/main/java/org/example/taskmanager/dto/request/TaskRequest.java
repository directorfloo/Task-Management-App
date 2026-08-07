package org.example.taskmanager.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.example.taskmanager.entity.Task;

@Data
public class TaskRequest {
    @NotBlank(message = "Title cannot be blank")
    private String title;
    private String description;
    private String priority;
}
