// utils.js - Utility functions

const utils = {
    /**
     * Format a date string to display format
     * @param {string} dateString - ISO date string
     * @returns {string} Formatted date
     */
    formatDate(dateString) {
        if (!dateString) return 'No due date';

        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const dateObj = new Date(date);
        dateObj.setHours(0, 0, 0, 0);

        if (dateObj.getTime() === today.getTime()) {
            return 'Today';
        } else if (dateObj.getTime() === tomorrow.getTime()) {
            return 'Tomorrow';
        } else {
            return new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                year: dateObj.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
            }).format(date);
        }
    },

    /**
     * Check if a date is in the past
     * @param {string} dateString - ISO date string
     * @returns {boolean} True if date is in the past
     */
    isDatePast(dateString) {
        if (!dateString) return false;

        const date = new Date(dateString);
        date.setHours(23, 59, 59, 999);
        const today = new Date();

        return date < today;
    },

    /**
     * Get priority display text and class
     * @param {string} priority - Priority level (HIGH, MEDIUM, LOW)
     * @returns {Object} Object with display text and class name
     */
    getPriorityInfo(priority) {
        const priorityMap = {
            'HIGH': { text: 'High', class: 'priority-HIGH' },
            'MEDIUM': { text: 'Medium', class: 'priority-MEDIUM' },
            'LOW': { text: 'Low', class: 'priority-LOW' }
        };

        return priorityMap[priority] || { text: 'None', class: '' };
    },

    /**
     * Filter todos based on search query, priority, and status
     * @param {Array} todos - Array of todo items
     * @param {Object} filters - Filter criteria
     * @returns {Array} Filtered todos
     */
    filterTodos(todos, filters) {
        return todos.filter(todo => {
            // Search filter
            const matchesSearch = !filters.search ||
                todo.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                (todo.description && todo.description.toLowerCase().includes(filters.search.toLowerCase()));

            // Priority filter
            const matchesPriority = filters.priority === 'all' || todo.priority === filters.priority;

            // Status filter
            const matchesStatus = filters.status === 'all' ||
                (filters.status === 'completed' && todo.completed) ||
                (filters.status === 'active' && !todo.completed);

            return matchesSearch && matchesPriority && matchesStatus;
        });
    },

    /**
     * Sort todos based on sort criteria
     * @param {Array} todos - Array of todo items
     * @param {string} sortBy - Sort criteria
     * @returns {Array} Sorted todos
     */
    sortTodos(todos, sortBy) {
        const sortedTodos = [...todos];

        const priorityOrder = { 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };

        switch (sortBy) {
            case 'dueDate':
                return sortedTodos.sort((a, b) => {
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
                });

            case 'priority':
                return sortedTodos.sort((a, b) => {
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                });

            case 'title':
                return sortedTodos.sort((a, b) => {
                    return a.title.localeCompare(b.title);
                });

            case 'createdAt':
            default:
                return sortedTodos.sort((a, b) => {
                    return b.createdAt - a.createdAt;
                });
        }
    }
};