package com.giftedlabs.tasksphere.exception;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Map;

@NoArgsConstructor
@Setter
@Getter
public class ValidationErrorResponse extends ErrorResponse {

    private Map<String, String> validationErrors;


    public ValidationErrorResponse(int status, String message, String path,
                                   LocalDateTime timestamp, Map<String, String> validationErrors) {
        super(status, message, path, timestamp);
        this.validationErrors = validationErrors;
    }

}