package com.giftedlabs.tasksphere.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;

import java.util.UUID;

@Data
@NoArgsConstructor
@DynamoDbBean
public class SubTask {

    private String id = UUID.randomUUID().toString();
    private String title;
    private boolean completed;
}
