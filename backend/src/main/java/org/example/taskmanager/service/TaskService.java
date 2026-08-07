package org.example.taskmanager.service;

import org.example.taskmanager.dto.request.TaskRequest;
import org.example.taskmanager.dto.response.TaskResponse;
import org.example.taskmanager.entity.Task;
import org.example.taskmanager.entity.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

public interface TaskService {
    List<TaskResponse> getAllTasks(User currentUser);
    TaskResponse createTask(TaskRequest req, User currentUser);
    TaskResponse updateTask(Long taskId, TaskRequest req, String title);
    Task toggleComplete(Long taskId, String title);
    void deleteTask(Long taskId);
    List<TaskResponse> getTaskByTitle(String title, User currentUser);
}
