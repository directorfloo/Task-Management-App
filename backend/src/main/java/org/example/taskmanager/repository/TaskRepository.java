package org.example.taskmanager.repository;

import org.example.taskmanager.entity.Task;
import org.example.taskmanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByCompletedOrderByCreatedAtDesc(boolean completed);
    List<Task> findByUserOrderByCreatedAtDesc(User currentUser);
    List<Task> findByUserAndTitleContainingIgnoreCaseOrderByCreatedAtDesc(User user, String title);
    Task findByTaskId(Long taskId);
    Task findByTitle(String title);
}
