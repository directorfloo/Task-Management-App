package org.example.taskmanager.service;

import lombok.RequiredArgsConstructor;
import org.example.taskmanager.dto.request.TaskRequest;
import org.example.taskmanager.dto.response.TaskResponse;
import org.example.taskmanager.entity.Task;
import org.example.taskmanager.entity.User;
import org.example.taskmanager.exception.TaskNotFoundException;
import org.example.taskmanager.exception.UserNotFoundException;
import org.example.taskmanager.repository.TaskRepository;
import org.example.taskmanager.repository.UserRepository;
import org.example.taskmanager.utils.TaskMapper;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;

    public List<TaskResponse> getAllTasks(User currentUser) {
         List<Task>  tasks = taskRepository.findByUserOrderByCreatedAtDesc(currentUser);
         return taskMapper.toResponseList(tasks);
    }

    public TaskResponse createTask(TaskRequest req, User currentUser) {
        Task task =taskMapper.toEntity(req);
        task.setUser(currentUser);
        task.setCompleted(false);
        Task savedTask = taskRepository.save(task);
        return taskMapper.toResponse(savedTask);

    }

    public TaskResponse updateTask(Long taskId, TaskRequest req, String title) {
        Task task = taskRepository.findById(taskId)
                .orElseGet(() -> taskRepository.findByTitle(title));

        if (task == null) {
            throw new TaskNotFoundException("Task not found");
        }

        taskMapper.updateEntityFromRequest(req, task);
        return taskMapper.toResponse(taskRepository.save(task));
    }


    public Task toggleComplete(Long taskId, String title) {
        Task task = taskRepository.findById(taskId)
                .orElseGet(() -> taskRepository.findByTitle(title));
        if (task == null) {
            throw new TaskNotFoundException("Task not found");
        }
        task.setCompleted(!task.isCompleted());
        return taskRepository.save(task);
    }

    public void deleteTask(Long taskId) {
      Task task =taskRepository.findByTaskId(taskId);
      taskRepository.delete(task);

    }

    @Override
    public List<TaskResponse> getTaskByTitle(String title, User currentUser) {
        List<Task> tasks = taskRepository.findByUserAndTitleContainingIgnoreCaseOrderByCreatedAtDesc(currentUser, title);
        if (tasks.isEmpty()) {
            throw new TaskNotFoundException("No tasks found matching '" + title + "'");
        }
        return tasks.stream()
                .map(taskMapper::toResponse)
                .collect(Collectors.toList());
    }
}
