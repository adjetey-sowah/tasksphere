// todoItem.js - Todo item component

const todoItem = {
    /**
     * Create a todo item DOM element
     * @param {Object} todo - Todo item data
     * @param {Object} handlers - Event handlers
     * @returns {HTMLElement} Todo item element
     */
    createTodoElement(todo, handlers) {
        const todoElement = document.createElement('div');
        todoElement.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        todoElement.dataset.id = todo.id;

        const priorityInfo = utils.getPriorityInfo(todo.priority);
        const isOverdue = todo.dueDate && !todo.completed && utils.isDatePast(todo.dueDate);

        todoElement.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
            <div class="todo-content">
                <div class="todo-title">
                    ${todo.title}
                </div>
                <div class="todo-details-info">
                    <span class="todo-priority ${priorityInfo.class}">${priorityInfo.text}</span>
                    <span class="todo-due-date ${isOverdue ? 'overdue' : ''}">
                        <i class="far fa-calendar-alt"></i>
                        ${utils.formatDate(todo.dueDate)}
                    </span>
                    <span class="todo-subtask-count">
                        <i class="fas fa-tasks"></i>
                        ${todo.subTasks?.length || 0} subtasks
                    </span>
                </div>
            </div>
            <div class="todo-actions">
                <button class="todo-action-btn subtasks-btn" title="Manage Subtasks">
                    <i class="fas fa-list-ul"></i>
                </button>
                <button class="todo-action-btn edit-btn" title="Edit Todo">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="todo-action-btn delete-btn" title="Delete Todo">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;

        // Add event listeners
        const checkbox = todoElement.querySelector('.todo-checkbox');
        checkbox.addEventListener('change', () => {
            handlers.toggleComplete(todo.id, checkbox.checked);
        });

        const subtasksBtn = todoElement.querySelector('.subtasks-btn');
        subtasksBtn.addEventListener('click', () => {
            handlers.openSubtasks(todo);
        });

        const editBtn = todoElement.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => {
            handlers.editTodo(todo);
        });

        const deleteBtn = todoElement.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            handlers.deleteTodo(todo.id);
        });

        return todoElement;
    },

    /**
     * Update stats display
     * @param {Array} todos - All todo items
     */
    updateStats(todos) {
        const totalTodos = todos.length;
        const completedTodos = todos.filter(todo => todo.completed).length;

        document.getElementById('total-todos').textContent = `${totalTodos} total`;
        document.getElementById('completed-todos').textContent = `${completedTodos} completed`;
    }
};