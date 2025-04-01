package com.giftedlabs.tasksphere.controller;

import com.giftedlabs.tasksphere.entity.SubTask;
import com.giftedlabs.tasksphere.entity.TodoItem;
import com.giftedlabs.tasksphere.service.TodoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = "*")
public class TodoController {

    private static final Logger logger = LoggerFactory.getLogger(TodoController.class);

    private final TodoService todoService;

    @Autowired
    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    @GetMapping
    public ResponseEntity<List<TodoItem>> getAllTodos() {
        logger.info("GET /api/todos - Retrieving all todos");
        List<TodoItem> todos = todoService.getAllTodos();
        return ResponseEntity.ok(todos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TodoItem> getTodoById(@PathVariable String id) {
        logger.info("GET /api/todos/{} - Retrieving todo by id", id);
        // No try-catch needed as the GlobalExceptionHandler will handle exceptions
        TodoItem todo = todoService.getTodoById(id);
        return ResponseEntity.ok(todo);
    }

    @PostMapping
    public ResponseEntity<TodoItem> createTodo(@Validated @RequestBody TodoItem todoItem) {
        logger.info("POST /api/todos - Creating new todo");
        TodoItem createdTodo = todoService.createTodo(todoItem);
        return new ResponseEntity<>(createdTodo, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TodoItem> updateTodo(
            @PathVariable String id,
            @Validated @RequestBody TodoItem todoItem) {
        logger.info("PUT /api/todos/{} - Updating todo", id);
        TodoItem updatedTodo = todoService.updateTodo(id, todoItem);
        return ResponseEntity.ok(updatedTodo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable String id) {
        logger.info("DELETE /api/todos/{} - Deleting todo", id);
        todoService.deleteTodo(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/subtasks")
    public ResponseEntity<TodoItem> addSubTask(
            @PathVariable String id,
            @Validated @RequestBody SubTask subTask) {
        logger.info("POST /api/todos/{}/subtasks - Adding subtask to todo", id);
        TodoItem updatedTodo = todoService.addSubTask(id, subTask);
        return ResponseEntity.ok(updatedTodo);
    }

    @PutMapping("/{todoId}/subtasks/{subTaskId}")
    public ResponseEntity<TodoItem> updateSubTask(
            @PathVariable String todoId,
            @PathVariable String subTaskId,
            @Validated @RequestBody SubTask subTask) {
        logger.info("PUT /api/todos/{}/subtasks/{} - Updating subtask", todoId, subTaskId);
        TodoItem updatedTodo = todoService.updateSubTask(todoId, subTaskId, subTask);
        return ResponseEntity.ok(updatedTodo);
    }

    @DeleteMapping("/{todoId}/subtasks/{subTaskId}")
    public ResponseEntity<TodoItem> deleteSubTask(
            @PathVariable String todoId,
            @PathVariable String subTaskId) {
        logger.info("DELETE /api/todos/{}/subtasks/{} - Deleting subtask", todoId, subTaskId);
        TodoItem updatedTodo = todoService.deleteSubTask(todoId, subTaskId);
        return ResponseEntity.ok(updatedTodo);
    }
}