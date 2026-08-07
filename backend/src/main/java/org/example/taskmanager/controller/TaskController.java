package org.example.taskmanager.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.taskmanager.dto.request.TaskRequest;
import org.example.taskmanager.dto.response.TaskResponse;
import org.example.taskmanager.entity.Task;
import org.example.taskmanager.entity.User;
import org.example.taskmanager.service.TaskService;
import org.example.taskmanager.service.TaskServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    @Autowired
    private final TaskServiceImpl taskService;


    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @Valid @RequestBody TaskRequest req,
            @AuthenticationPrincipal User currentUser
            ) {
        TaskResponse response = taskService.createTask(req, currentUser);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PatchMapping(value = "/{taskId}", consumes = { "multipart/form-data" })
    public ResponseEntity<TaskResponse> updateTask(  @PathVariable Long taskId, @ModelAttribute TaskRequest req, @RequestParam String title) {
        TaskResponse response = taskService.updateTask( taskId,req,title);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable @org.springframework.lang.NonNull Long taskId) {
        taskService.deleteTask( taskId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/all")
    @Transactional(readOnly = true)
    public ResponseEntity<List<TaskResponse>> getAllTasks(@AuthenticationPrincipal User currentUser) {
        List<TaskResponse> responses = taskService.getAllTasks(currentUser);
        // return new ResponseEntity<>(responses, HttpStatus.OK);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/search")
    public ResponseEntity<List<TaskResponse>> getTaskByTitle(
            @RequestParam @org.springframework.lang.NonNull String title, @AuthenticationPrincipal User currentUser) {
        List<TaskResponse> responses = taskService.getTaskByTitle(title , currentUser);
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }
    @PatchMapping("/{taskId}/toggle-complete")
    public ResponseEntity<Task> toggleComplete(
            @PathVariable @org.springframework.lang.NonNull Long taskId, @RequestParam String title) {
        Task task = taskService.toggleComplete(taskId, title);
        return new ResponseEntity<>(task, HttpStatus.OK);
    }



}


