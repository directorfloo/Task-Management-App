package org.example.taskmanager.utils;

import org.example.taskmanager.dto.request.TaskRequest;
import org.example.taskmanager.dto.response.TaskResponse;
import org.example.taskmanager.entity.Task;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TaskMapper {

    @Mapping( target = "taskId", ignore = true)
    @Mapping(target = "completed", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "user", ignore = true)   // set manually in service (from logged-in user)
    Task toEntity(TaskRequest request);

    @Mapping(source = "user.userId", target = "userId")
    @Mapping(source = "user.username", target = "username")
    TaskResponse toResponse(Task task);


    List<TaskResponse> toResponseList(List<Task> tasks);


    @Mapping( target = "taskId", ignore = true)
    @Mapping(target = "completed", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "user", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(TaskRequest request, @MappingTarget Task task);
}