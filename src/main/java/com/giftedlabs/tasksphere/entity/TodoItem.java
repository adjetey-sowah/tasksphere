package com.giftedlabs.tasksphere.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@DynamoDbBean
public class TodoItem {

    private static final String TABLE_NAME = "TodoItems";

    private String id = UUID.randomUUID().toString();
    private String title;
    private String description;
    private boolean completed;
    private String priority; //HIGH, MEDIUM, LOW
    private String dueDate;
    private List<SubTask> subTasks = new ArrayList<>();
    private long createdAt = System.currentTimeMillis();
    private long updatedAt = System.currentTimeMillis();

    @DynamoDbPartitionKey
    public String getId(){
        return id;
    }

}
