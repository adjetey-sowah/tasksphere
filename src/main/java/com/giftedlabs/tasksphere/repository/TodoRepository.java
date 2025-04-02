package com.giftedlabs.tasksphere.repository;

import com.giftedlabs.tasksphere.entity.TodoItem;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;
import software.amazon.awssdk.enhanced.dynamodb.model.PageIterable;

import java.util.ArrayList;
import java.util.List;

@Repository
public class TodoRepository {

    private final DynamoDbTable<TodoItem> todoTable;
    private final DynamoDbEnhancedClient enhancedClient;

    @Autowired
    public TodoRepository(DynamoDbEnhancedClient dynamoDbEnhancedClient){
        this.enhancedClient = dynamoDbEnhancedClient;
        this.todoTable = enhancedClient.table("TodoItem", TableSchema.fromBean(TodoItem.class));
    }

    public TodoItem save(TodoItem todoItem) {
        todoItem.setUpdatedAt(System.currentTimeMillis());
        todoTable.putItem(todoItem);
        return todoItem;
    }

    public TodoItem findById(String id){
        return todoTable.getItem(r -> r.key(k -> k.partitionValue(id)));
    }

    public List<TodoItem> findAll() {
        PageIterable<TodoItem> results = todoTable.scan();
        List<TodoItem> todoItems = new ArrayList<>();
        results.items().forEach(todoItems::add);
        return todoItems;
    }

    public void delete(TodoItem todoItem) {
        todoTable.deleteItem(todoItem);
    }
}
