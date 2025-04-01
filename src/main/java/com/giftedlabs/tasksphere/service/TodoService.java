package com.giftedlabs.tasksphere.service;

import com.giftedlabs.tasksphere.entity.SubTask;
import com.giftedlabs.tasksphere.entity.TodoItem;
import com.giftedlabs.tasksphere.exception.BadRequestException;
import com.giftedlabs.tasksphere.exception.ResourceNotFoundException;
import com.giftedlabs.tasksphere.repository.TodoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;


import java.util.List;


@Service
public class TodoService {

    private static final Logger logger = LoggerFactory.getLogger(TodoService.class);

    private final TodoRepository todoRepository;

    @Autowired
    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    public List<TodoItem> getAllTodos() {
        logger.debug("Fetching all todo items");
        return todoRepository.findAll();
    }

    public TodoItem getTodoById(String id) {
        if (!StringUtils.hasText(id)) {
            throw new BadRequestException("Todo ID cannot be empty");
        }

        logger.debug("Fetching todo item with id: {}", id);
        TodoItem todoItem = todoRepository.findById(id);

        if (todoItem == null) {
            throw new ResourceNotFoundException("Todo not found with id: " + id);
        }

        return todoItem;
    }


    public TodoItem createTodo(TodoItem todoItem) {
        if (todoItem == null) {
            throw new BadRequestException("Todo item cannot be null");
        }

        if (!StringUtils.hasText(todoItem.getTitle())) {
            throw new BadRequestException("Todo title cannot be empty");
        }

        logger.debug("Creating new todo item: {}", todoItem);
        return todoRepository.save(todoItem);
    }

    public TodoItem updateTodo(String id, TodoItem todoItem) {
        if (!StringUtils.hasText(id)) {
            throw new BadRequestException("Todo ID cannot be empty");
        }

        if (todoItem == null) {
            throw new BadRequestException("Todo item cannot be null");
        }

        if (!StringUtils.hasText(todoItem.getTitle())) {
            throw new BadRequestException("Todo title cannot be empty");
        }

        logger.debug("Updating todo item with id: {}", id);
        TodoItem existingTodo = getTodoById(id);

        todoItem.setId(id);
        todoItem.setCreatedAt(existingTodo.getCreatedAt());
        return todoRepository.save(todoItem);
    }


    public void deleteTodo(String id) {
        if (!StringUtils.hasText(id)) {
            throw new BadRequestException("Todo ID cannot be empty");
        }

        logger.debug("Deleting todo item with id: {}", id);
        TodoItem todo = getTodoById(id);
        todoRepository.delete(todo);
    }


    public TodoItem addSubTask(String todoId, SubTask subTask) {
        if (!StringUtils.hasText(todoId)) {
            throw new BadRequestException("Todo ID cannot be empty");
        }

        if (subTask == null) {
            throw new BadRequestException("SubTask cannot be null");
        }



        logger.debug("Adding subtask to todo with id: {}", todoId);
        TodoItem todo = getTodoById(todoId);
        todo.getSubTasks().add(subTask);
        return todoRepository.save(todo);
    }


    public TodoItem updateSubTask(String todoId, String subTaskId, SubTask updatedSubTask) {
        if (!StringUtils.hasText(todoId)) {
            throw new BadRequestException("Todo ID cannot be empty");
        }

        if (!StringUtils.hasText(subTaskId)) {
            throw new BadRequestException("SubTask ID cannot be empty");
        }

        if (updatedSubTask == null) {
            throw new BadRequestException("Updated SubTask cannot be null");
        }


        logger.debug("Updating subtask {} for todo with id: {}", subTaskId, todoId);
        TodoItem todo = getTodoById(todoId);

        boolean found = false;
        List<SubTask> subTasks = todo.getSubTasks();
        for (int i = 0; i < subTasks.size(); i++) {
            if (subTasks.get(i).getId().equals(subTaskId)) {
                updatedSubTask.setId(subTaskId);
                subTasks.set(i, updatedSubTask);
                found = true;
                break;
            }
        }

        if (!found) {
            throw new ResourceNotFoundException("Subtask not found with id: " + subTaskId);
        }

        return todoRepository.save(todo);
    }


    public TodoItem deleteSubTask(String todoId, String subTaskId) {
        if (!StringUtils.hasText(todoId)) {
            throw new BadRequestException("Todo ID cannot be empty");
        }

        if (!StringUtils.hasText(subTaskId)) {
            throw new BadRequestException("SubTask ID cannot be empty");
        }

        logger.debug("Deleting subtask {} from todo with id: {}", subTaskId, todoId);
        TodoItem todo = getTodoById(todoId);

        boolean removed = todo.getSubTasks().removeIf(subTask -> subTask.getId().equals(subTaskId));
        if (!removed) {
            throw new ResourceNotFoundException("Subtask not found with id: " + subTaskId);
        }

        return todoRepository.save(todo);
    }
}