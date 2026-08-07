package org.example.taskmanager.utils;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.example.taskmanager.dto.request.TaskRequest;
import org.example.taskmanager.dto.response.TaskResponse;
import org.example.taskmanager.entity.Task;
import org.example.taskmanager.entity.User;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-07T03:00:28+0100",
    comments = "version: 1.6.2, compiler: javac, environment: Java 21.0.10 (Oracle Corporation)"
)
@Component
public class TaskMapperImpl implements TaskMapper {

    @Override
    public Task toEntity(TaskRequest request) {
        if ( request == null ) {
            return null;
        }

        Task.TaskBuilder task = Task.builder();

        task.title( request.getTitle() );
        task.description( request.getDescription() );
        if ( request.getPriority() != null ) {
            task.priority( Enum.valueOf( Task.Priority.class, request.getPriority() ) );
        }

        return task.build();
    }

    @Override
    public TaskResponse toResponse(Task task) {
        if ( task == null ) {
            return null;
        }

        TaskResponse taskResponse = new TaskResponse();

        Long userId = taskUserUserId( task );
        if ( userId != null ) {
            taskResponse.setUserId( String.valueOf( userId ) );
        }
        taskResponse.setUsername( taskUserUsername( task ) );
        taskResponse.setTaskId( task.getTaskId() );
        taskResponse.setTitle( task.getTitle() );
        taskResponse.setDescription( task.getDescription() );
        if ( task.getPriority() != null ) {
            taskResponse.setPriority( task.getPriority().name() );
        }

        return taskResponse;
    }

    @Override
    public List<TaskResponse> toResponseList(List<Task> tasks) {
        if ( tasks == null ) {
            return null;
        }

        List<TaskResponse> list = new ArrayList<TaskResponse>( tasks.size() );
        for ( Task task : tasks ) {
            list.add( toResponse( task ) );
        }

        return list;
    }

    @Override
    public void updateEntityFromRequest(TaskRequest request, Task task) {
        if ( request == null ) {
            return;
        }

        if ( request.getTitle() != null ) {
            task.setTitle( request.getTitle() );
        }
        if ( request.getDescription() != null ) {
            task.setDescription( request.getDescription() );
        }
        if ( request.getPriority() != null ) {
            task.setPriority( Enum.valueOf( Task.Priority.class, request.getPriority() ) );
        }
    }

    private Long taskUserUserId(Task task) {
        User user = task.getUser();
        if ( user == null ) {
            return null;
        }
        return user.getUserId();
    }

    private String taskUserUsername(Task task) {
        User user = task.getUser();
        if ( user == null ) {
            return null;
        }
        return user.getUsername();
    }
}
