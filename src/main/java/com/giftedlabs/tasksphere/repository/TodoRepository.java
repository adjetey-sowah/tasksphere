package com.giftedlabs.tasksphere.repository;

import com.giftedlabs.tasksphere.entity.TodoItem;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;

@Repository
public class TodoRepository {

    private final DynamoDbTable<TodoItem> todoTable;

    @Autowired
    public TodoRepository(DynamoDbEnhancedClient dynamoDbEnhancedClient){
        this.todoTable = dynamoDbEnhancedClient.table("TodoItem", TableSchema.fromBean(TodoItem.class));
    }
}
