// subTask.js - Subtask handling

const subTaskManager = {
    currentTodoId: null,

    /**
     * Initialize the subtask modal and handlers
     */
    init() {
        const modal = document.getElementById('subtask-modal');
        const closeModal = document.querySelector('.close-modal');
        const addSubtaskForm = document.querySelector('.add-subtask-form');

        // Close modal when clicking on X
        closeModal.addEventListener('click', () => {
            this.closeModal();
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // Add subtask form submission
        addSubtaskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addSubtask();
        });

        // Add subtask button click
        document.getElementById('add-subtask-btn').addEventListener('click', (e) => {
            e.preventDefault();
            this.addSubtask();
        });
    },

    /**
     * Open the subtask modal for a todo
     * @param {Object} todo - The todo item
     */
    openModal(todo) {
        this.currentTodoId = todo.id;

        // Set parent task info
        document.getElementById('parent-task-title').textContent = todo.title;
        document.getElementById('parent-task-description').textContent = todo.description || 'No description provided.';

        // Clear previous subtasks
        const subtasksList = document.getElementById('subtasks-list');
        subtasksList.innerHTML = '';

        // Add subtasks if any
        if (todo.subTasks && todo.subTasks.length > 0) {
            todo.subTasks.forEach(subtask => {
                subtasksList.appendChild(this.createSubtaskElement(subtask));
            });
        } else {
            subtasksList.innerHTML = '<p class="no-subtasks">No subtasks yet. Add one above!</p>';
        }

        // Clear input field
        document.getElementById('subtask-title').value = '';

        // Show modal
        document.getElementById('subtask-modal').style.display = 'block';
    },

    /**
     * Close the subtask modal
     */
    closeModal() {
        document.getElementById('subtask-modal').style.display = 'none';
        this.currentTodoId = null;
    },

    /**
     * Create a subtask element
     * @param {Object} subtask - Subtask data
     * @returns {HTMLElement} Subtask list item
     */
    createSubtaskElement(subtask) {
        const subtaskItem = document.createElement('li');
        subtaskItem.className = `subtask-item ${subtask.completed ? 'completed-subtask' : ''}`;
        subtaskItem.dataset.id = subtask.id;

        subtaskItem.innerHTML = `
            <input type="checkbox" class="subtask-checkbox" ${subtask.completed ? 'checked' : ''}>
            <span class="subtask-title">${subtask.title}</span>
            <button class="delete-subtask" title="Delete Subtask">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add event listeners
        const checkbox = subtaskItem.querySelector('.subtask-checkbox');
        checkbox.addEventListener('change', () => {
            this.toggleSubtaskComplete(subtask.id, checkbox.checked);
        });

        const deleteBtn = subtaskItem.querySelector('.delete-subtask');
        deleteBtn.addEventListener('click', () => {
            this.deleteSubtask(subtask.id);
        });

        return subtaskItem;
    },

    /**
     * Add a new subtask
     */
    async addSubtask() {
        const inputField = document.getElementById('subtask-title');
        const title = inputField.value.trim();

        if (!title || !this.currentTodoId) return;

        const subtaskData = {
            title: title,
            completed: false
        };

        try {
            const todo = await api.addSubtask(this.currentTodoId, subtaskData);

            // Update the list
            const subtasksList = document.getElementById('subtasks-list');
            const noSubtasksMsg = subtasksList.querySelector('.no-subtasks');
            if (noSubtasksMsg) {
                subtasksList.innerHTML = '';
            }

            // Find the newly added subtask
            const newSubtask = todo.subTasks.find(st => st.title === title);
            if (newSubtask) {
                subtasksList.appendChild(this.createSubtaskElement(newSubtask));
            }

            // Clear input field
            inputField.value = '';

            // Update the main todo list
            app.refreshTodos();

        } catch (error) {
            console.error('Failed to add subtask:', error);
            alert('Failed to add subtask. Please try again.');
        }
    },

    /**
     * Toggle subtask completion status
     * @param {string} subtaskId - Subtask ID
     * @param {boolean} completed - New completion status
     */
    async toggleSubtaskComplete(subtaskId, completed) {
        if (!this.currentTodoId) return;

        try {
            const subtaskData = {
                completed: completed
            };

            await api.updateSubtask(this.currentTodoId, subtaskId, subtaskData);

            // Update class on subtask item
            const subtaskItem = document.querySelector(`.subtask-item[data-id="${subtaskId}"]`);
            if (subtaskItem) {
                if (completed) {
                    subtaskItem.classList.add('completed-subtask');
                } else {
                    subtaskItem.classList.remove('completed-subtask');
                }
            }

            // Update main todo list
            app.refreshTodos();

        } catch (error) {
            console.error('Failed to update subtask:', error);
            alert('Failed to update subtask. Please try again.');

            // Revert the checkbox state
            const checkbox = document.querySelector(`.subtask-item[data-id="${subtaskId}"] .subtask-checkbox`);
            if (checkbox) {
                checkbox.checked = !completed;
            }
        }
    },

    /**
     * Delete a subtask
     * @param {string} subtaskId - Subtask ID to delete
     */
    async deleteSubtask(subtaskId) {
        if (!this.currentTodoId) return;

        if (!confirm('Are you sure you want to delete this subtask?')) {
            return;
        }

        try {
            const todo = await api.deleteSubtask(this.currentTodoId, subtaskId);

            // Remove from DOM
            const subtaskItem = document.querySelector(`.subtask-item[data-id="${subtaskId}"]`);
            if (subtaskItem) {
                subtaskItem.remove();
            }

            // Check if no subtasks left
            const subtasksList = document.getElementById('subtasks-list');
            if (todo.subTasks.length === 0 || subtasksList.children.length === 0) {
                subtasksList.innerHTML = '<p class="no-subtasks">No subtasks yet. Add one above!</p>';
            }

            // Update main todo list
            app.refreshTodos();

        } catch (error) {
            console.error('Failed to delete subtask:', error);
            alert('Failed to delete subtask. Please try again.');
        }
    }
};