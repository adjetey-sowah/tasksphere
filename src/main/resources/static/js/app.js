// app.js - Main application logic

const app = {
    todos: [],
    filters: {
        search: '',
        priority: 'all',
        status: 'all'
    },
    sortBy: 'createdAt',
    editingTodoId: null,

    /**
     * Initialize the app
     */
    async init() {
        // Initialize the subtask manager
        subTaskManager.init();

        // Set up event listeners
        this.setupEventListeners();

        // Initialize theme from localStorage
        this.initTheme();

        // Load todos from the backend
        await this.loadTodos();
    },

    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        // Theme toggle
        document.querySelector('.theme-toggle').addEventListener('click', this.toggleTheme.bind(this));

        // Add todo form
        document.getElementById('add-todo-form').addEventListener('submit', this.handleAddTodo.bind(this));

        // Search input
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.filters.search = e.target.value;
            this.renderTodos();
        });

        // Priority filter
        document.getElementById('priority-filter').addEventListener('change', (e) => {
            this.filters.priority = e.target.value;
            this.renderTodos();
        });

        // Status filter
        document.getElementById('status-filter').addEventListener('change', (e) => {
            this.filters.status = e.target.value;
            this.renderTodos();
        });

        // Sort by
        document.getElementById('sort-by').addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.renderTodos();
        });
    },

    /**
     * Initialize theme from localStorage
     */
    initTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            document.querySelector('.theme-toggle i').classList.replace('fa-moon', 'fa-sun');
        }
    },

    /**
     * Toggle between light and dark theme
     */
    toggleTheme() {
        const themeIcon = document.querySelector('.theme-toggle i');

        if (document.body.classList.contains('dark-theme')) {
            document.body.classList.remove('dark-theme');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.add('dark-theme');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        }
    },

    /**
     * Load todos from the backend
     */
    async loadTodos() {
        const todosContainer = document.getElementById('todos-list');
        todosContainer.innerHTML = `
            <div class="loading-indicator">
                <div class="spinner"></div>
                <p>Loading your tasks...</p>
            </div>
        `;

        try {
            this.todos = await api.getAllTodos();
            this.renderTodos();
        } catch (error) {
            console.error('Error loading todos:', error);
            todosContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Failed to load todos. Please try again later.</p>
                    <button id="retry-load" class="add-btn">Retry</button>
                </div>
            `;

            document.getElementById('retry-load').addEventListener('click', () => {
                this.loadTodos();
            });
        }
    },

    /**
     * Refresh todos from the backend
     */
    async refreshTodos() {
        try {
            this.todos = await api.getAllTodos();
            this.renderTodos();
        } catch (error) {
            console.error('Error refreshing todos:', error);
        }
    },

    /**
     * Render todos to the DOM
     */
    renderTodos() {
        const todosContainer = document.getElementById('todos-list');
        todosContainer.innerHTML = '';

        // Apply filters and sorting
        const filteredTodos = utils.filterTodos(this.todos, this.filters);
        const sortedTodos = utils.sortTodos(filteredTodos, this.sortBy);

        // Update stats
        todoItem.updateStats(this.todos);

        // If no todos, show empty state
        if (sortedTodos.length === 0) {
            if (this.todos.length === 0) {
                todosContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-tasks"></i>
                        <p>You don't have any tasks yet. Add one above!</p>
                    </div>
                `;
            } else {
                todosContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-filter"></i>
                        <p>No tasks match your filters</p>
                    </div>
                `;
            }
            return;
        }

        // Create and append todo elements
        const handlers = {
            toggleComplete: this.toggleTodoComplete.bind(this),
            openSubtasks: this.openSubtasks.bind(this),
            editTodo: this.prepareEditTodo.bind(this),
            deleteTodo: this.confirmDeleteTodo.bind(this)
        };

        sortedTodos.forEach(todo => {
            const todoElement = todoItem.createTodoElement(todo, handlers);
            todosContainer.appendChild(todoElement);
        });
    },

    /**
     * Handle adding a new todo
     * @param {Event} e - Submit event
     */
    async handleAddTodo(e) {
        e.preventDefault();

        const titleInput = document.getElementById('todo-title');
        const descriptionInput = document.getElementById('todo-description');
        const priorityInput = document.getElementById('todo-priority');
        const dueDateInput = document.getElementById('todo-due-date');

        const title = titleInput.value.trim();
        if (!title) return;

        const todoData = {
            title: title,
            description: descriptionInput.value.trim(),
            priority: priorityInput.value,
            dueDate: dueDateInput.value || null,
            completed: false,
            subTasks: []
        };

        try {
            if (this.editingTodoId) {
                // Update existing todo
                await api.updateTodo(this.editingTodoId, todoData);
                this.editingTodoId = null;
                document.querySelector('.add-btn').textContent = 'Add Task';
            } else {
                // Create new todo
                await api.createTodo(todoData);
            }

            // Clear form
            titleInput.value = '';
            descriptionInput.value = '';
            priorityInput.value = 'MEDIUM';
            dueDateInput.value = '';

            // Refresh todos
            await this.refreshTodos();

        } catch (error) {
            console.error('Error saving todo:', error);
            alert('Failed to save task. Please try again.');
        }
    },

    /**
     * Prepare to edit a todo
     * @param {Object} todo - Todo to edit
     */
    prepareEditTodo(todo) {
        // Populate form fields
        document.getElementById('todo-title').value = todo.title;
        document.getElementById('todo-description').value = todo.description || '';
        document.getElementById('todo-priority').value = todo.priority;
        document.getElementById('todo-due-date').value = todo.dueDate || '';

        // Change button text and set editing ID
        document.querySelector('.add-btn').textContent = 'Update Task';
        this.editingTodoId = todo.id;

        // Scroll to form
        document.querySelector('.add-todo-container').scrollIntoView({ behavior: 'smooth' });
    },

    /**
     * Toggle todo completion status
     * @param {string} todoId - Todo ID
     * @param {boolean} completed - New completion status
     */
    async toggleTodoComplete(todoId, completed) {
        try {
            const todo = this.todos.find(t => t.id === todoId);
            if (todo) {
                todo.completed = completed;
                await api.updateTodo(todoId, todo);

                // Update UI
                const todoElement = document.querySelector(`.todo-item[data-id="${todoId}"]`);
                if (todoElement) {
                    if (completed) {
                        todoElement.classList.add('completed');
                    } else {
                        todoElement.classList.remove('completed');
                    }
                }

                // Update stats
                todoItem.updateStats(this.todos);
            }
        } catch (error) {
            console.error('Error updating todo:', error);

            // Revert checkbox state
            const checkbox = document.querySelector(`.todo-item[data-id="${todoId}"] .todo-checkbox`);
            if (checkbox) {
                checkbox.checked = !completed;
            }

            alert('Failed to update task. Please try again.');
        }
    },

    /**
     * Open subtasks modal for a todo
     * @param {Object} todo - Todo to manage subtasks for
     */
    openSubtasks(todo) {
        subTaskManager.openModal(todo);
    },

    /**
     * Confirm and delete a todo
     * @param {string} todoId - Todo ID to delete
     */
    async confirmDeleteTodo(todoId) {
        if (!confirm('Are you sure you want to delete this task and all its subtasks?')) {
            return;
        }

        try {
            await api.deleteTodo(todoId);

            // Remove from local array
            this.todos = this.todos.filter(todo => todo.id !== todoId);

            // Remove from DOM
            const todoElement = document.querySelector(`.todo-item[data-id="${todoId}"]`);
            if (todoElement) {
                todoElement.remove();
            }

            // Update stats
            todoItem.updateStats(this.todos);

            // Check if todos list is now empty
            if (this.todos.length === 0) {
                this.renderTodos(); // This will show the empty state
            }

            // If the deleted todo was being edited, reset the form
            if (this.editingTodoId === todoId) {
                document.getElementById('add-todo-form').reset();
                document.querySelector('.add-btn').textContent = 'Add Task';
                this.editingTodoId = null;
            }

        } catch (error) {
            console.error('Error deleting todo:', error);
            alert('Failed to delete task. Please try again.');
        }
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});