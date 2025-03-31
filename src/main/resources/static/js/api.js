// api.js - Handles API calls to the backend

const API_URL = '/api/todos';

const api = {
    /**
     * Get all todos from the backend
     * @returns {Promise<Array>} Array of todo items
     */
    async getAllTodos() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch todos');
            return await response.json();
        } catch (error) {
            console.error('Error fetching todos:', error);
            throw error;
        }
    },

    /**
     * Create a new todo
     * @param {Object} todoData - The todo data to create
     * @returns {Promise<Object>} The created todo
     */
    async createTodo(todoData) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(todoData)
            });
            if (!response.ok) throw new Error('Failed to create todo');
            return await response.json();
        } catch (error) {
            console.error('Error creating todo:', error);
            throw error;
        }
    },

    /**
     * Update an existing todo
     * @param {string} id - The todo ID
     * @param {Object} todoData - The updated todo data
     * @returns {Promise<Object>} The updated todo
     */
    async updateTodo(id, todoData) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(todoData)
            });
            if (!response.ok) throw new Error('Failed to update todo');
            return await response.json();
        } catch (error) {
            console.error('Error updating todo:', error);
            throw error;
        }
    },

    /**
     * Delete a todo
     * @param {string} id - The todo ID to delete
     * @returns {Promise<void>}
     */
    async deleteTodo(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete todo');
        } catch (error) {
            console.error('Error deleting todo:', error);
            throw error;
        }
    },

    /**
     * Add a subtask to a todo
     * @param {string} todoId - The parent todo ID
     * @param {Object} subtaskData - The subtask data
     * @returns {Promise<Object>} The updated todo with the new subtask
     */
    async addSubtask(todoId, subtaskData) {
        try {
            const response = await fetch(`${API_URL}/${todoId}/subtasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(subtaskData)
            });
            if (!response.ok) throw new Error('Failed to add subtask');
            return await response.json();
        } catch (error) {
            console.error('Error adding subtask:', error);
            throw error;
        }
    },

    /**
     * Update a subtask
     * @param {string} todoId - The parent todo ID
     * @param {string} subtaskId - The subtask ID
     * @param {Object} subtaskData - The updated subtask data
     * @returns {Promise<Object>} The updated todo
     */
    async updateSubtask(todoId, subtaskId, subtaskData) {
        try {
            const response = await fetch(`${API_URL}/${todoId}/subtasks/${subtaskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(subtaskData)
            });
            if (!response.ok) throw new Error('Failed to update subtask');
            return await response.json();
        } catch (error) {
            console.error('Error updating subtask:', error);
            throw error;
        }
    },

    /**
     * Delete a subtask
     * @param {string} todoId - The parent todo ID
     * @param {string} subtaskId - The subtask ID to delete
     * @returns {Promise<Object>} The updated todo
     */
    async deleteSubtask(todoId, subtaskId) {
        try {
            const response = await fetch(`${API_URL}/${todoId}/subtasks/${subtaskId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete subtask');
            return await response.json();
        } catch (error) {
            console.error('Error deleting subtask:', error);
            throw error;
        }
    }
};