package org.example.taskmanager.utils;

import javax.annotation.processing.Generated;
import org.example.taskmanager.dto.request.RegisterRequest;
import org.example.taskmanager.entity.User;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-07-16T04:38:53+0100",
    comments = "version: 1.6.2, compiler: javac, environment: Java 21.0.10 (Oracle Corporation)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public User toEntity(RegisterRequest req) {
        if ( req == null ) {
            return null;
        }

        User.UserBuilder user = User.builder();

        user.username( req.getUsername() );

        return user.build();
    }
}
