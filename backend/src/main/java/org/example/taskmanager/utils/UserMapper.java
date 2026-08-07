package org.example.taskmanager.utils;

import org.example.taskmanager.dto.request.RegisterRequest;
import org.example.taskmanager.dto.response.AuthResponse;
import org.example.taskmanager.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;



@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "confirmedPassword", ignore = true)
     User toEntity(RegisterRequest req);




}
