/**
 * Unit Tests for To-Do List Module
 */

describe('To-Do List Module', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset module state
    TodoModule.state.tasks = [];
  });

  describe('Task Creation', () => {
    it('should add a new task', () => {
      TodoModule.addTask('Test task');
      expect(TodoModule.state.tasks.length).toBe(1);
      expect(TodoModule.state.tasks[0].text).toBe('Test task');
      expect(TodoModule.state.tasks[0].completed).toBe(false);
    });

    it('should generate UUID for each task', () => {
      TodoModule.addTask('Task 1');
      TodoModule.addTask('Task 2');
      expect(TodoModule.state.tasks[0].id).not.toBe(TodoModule.state.tasks[1].id);
    });

    it('should set createdAt timestamp', () => {
      const before = Date.now();
      TodoModule.addTask('Test task');
      const after = Date.now();
      expect(TodoModule.state.tasks[0].createdAt).toBeGreaterThanOrEqual(before);
      expect(TodoModule.state.tasks[0].createdAt).toBeLessThanOrEqual(after);
    });
  });

  describe('Duplicate Detection', () => {
    it('should detect exact duplicate', () => {
      TodoModule.addTask('Test task');
      expect(TodoModule.isDuplicate('Test task')).toBe(true);
    });

    it('should detect case-insensitive duplicate', () => {
      TodoModule.addTask('Test task');
      expect(TodoModule.isDuplicate('test task')).toBe(true);
      expect(TodoModule.isDuplicate('TEST TASK')).toBe(true);
    });

    it('should not detect non-duplicate', () => {
      TodoModule.addTask('Test task');
      expect(TodoModule.isDuplicate('Different task')).toBe(false);
    });

    it('should return false for empty task list', () => {
      expect(TodoModule.isDuplicate('Any task')).toBe(false);
    });
  });

  describe('Task Editing', () => {
    it('should edit task text', () => {
      TodoModule.addTask('Original task');
      const taskId = TodoModule.state.tasks[0].id;
      TodoModule.editTask(taskId, 'Updated task');
      expect(TodoModule.state.tasks[0].text).toBe('Updated task');
    });

    it('should not edit non-existent task', () => {
      TodoModule.addTask('Task 1');
      const initialLength = TodoModule.state.tasks.length;
      TodoModule.editTask('non-existent-id', 'New text');
      expect(TodoModule.state.tasks.length).toBe(initialLength);
    });

    it('should prevent editing to duplicate text', () => {
      TodoModule.addTask('Task 1');
      TodoModule.addTask('Task 2');
      const taskId = TodoModule.state.tasks[1].id;
      // This should fail silently (show error)
      TodoModule.editTask(taskId, 'Task 1');
      // Task should remain unchanged
      expect(TodoModule.state.tasks[1].text).toBe('Task 2');
    });
  });

  describe('Task Completion Toggle', () => {
    it('should toggle task completion status', () => {
      TodoModule.addTask('Test task');
      const taskId = TodoModule.state.tasks[0].id;
      expect(TodoModule.state.tasks[0].completed).toBe(false);
      TodoModule.toggleTask(taskId);
      expect(TodoModule.state.tasks[0].completed).toBe(true);
      TodoModule.toggleTask(taskId);
      expect(TodoModule.state.tasks[0].completed).toBe(false);
    });

    it('should not toggle non-existent task', () => {
      TodoModule.addTask('Task 1');
      const initialStatus = TodoModule.state.tasks[0].completed;
      TodoModule.toggleTask('non-existent-id');
      expect(TodoModule.state.tasks[0].completed).toBe(initialStatus);
    });
  });

  describe('Task Deletion', () => {
    it('should delete a task', () => {
      TodoModule.addTask('Task 1');
      TodoModule.addTask('Task 2');
      const taskId = TodoModule.state.tasks[0].id;
      TodoModule.deleteTask(taskId);
      expect(TodoModule.state.tasks.length).toBe(1);
      expect(TodoModule.state.tasks[0].text).toBe('Task 2');
    });

    it('should not affect other tasks when deleting', () => {
      TodoModule.addTask('Task 1');
      TodoModule.addTask('Task 2');
      TodoModule.addTask('Task 3');
      const taskId = TodoModule.state.tasks[1].id;
      TodoModule.deleteTask(taskId);
      expect(TodoModule.state.tasks.length).toBe(2);
      expect(TodoModule.state.tasks[0].text).toBe('Task 1');
      expect(TodoModule.state.tasks[1].text).toBe('Task 3');
    });

    it('should not delete non-existent task', () => {
      TodoModule.addTask('Task 1');
      const initialLength = TodoModule.state.tasks.length;
      TodoModule.deleteTask('non-existent-id');
      expect(TodoModule.state.tasks.length).toBe(initialLength);
    });
  });

  describe('Task Persistence', () => {
    it('should save tasks to localStorage', () => {
      TodoModule.addTask('Task 1');
      TodoModule.addTask('Task 2');
      const stored = JSON.parse(localStorage.getItem('pd_tasks'));
      expect(stored.length).toBe(2);
      expect(stored[0].text).toBe('Task 1');
      expect(stored[1].text).toBe('Task 2');
    });

    it('should load tasks from localStorage', () => {
      const tasks = [
        { id: 'id1', text: 'Task 1', completed: false, createdAt: Date.now() },
        { id: 'id2', text: 'Task 2', completed: true, createdAt: Date.now() }
      ];
      localStorage.setItem('pd_tasks', JSON.stringify(tasks));
      TodoModule.loadTasks();
      expect(TodoModule.state.tasks.length).toBe(2);
      expect(TodoModule.state.tasks[0].text).toBe('Task 1');
      expect(TodoModule.state.tasks[1].completed).toBe(true);
    });

    it('should handle empty localStorage gracefully', () => {
      localStorage.removeItem('pd_tasks');
      TodoModule.loadTasks();
      expect(TodoModule.state.tasks.length).toBe(0);
    });
  });

  describe('Task Rendering', () => {
    beforeEach(() => {
      // Set up DOM
      document.body.innerHTML = `
        <ul id="task-list"></ul>
      `;
    });

    it('should render tasks in DOM', () => {
      TodoModule.addTask('Task 1');
      TodoModule.addTask('Task 2');
      TodoModule.renderTasks();
      const items = document.querySelectorAll('.task-item');
      expect(items.length).toBe(2);
    });

    it('should show placeholder when no tasks', () => {
      TodoModule.renderTasks();
      const placeholder = document.querySelector('.placeholder');
      expect(placeholder).toBeTruthy();
      expect(placeholder.textContent).toContain('No tasks yet');
    });

    it('should apply completed class to completed tasks', () => {
      TodoModule.addTask('Task 1');
      TodoModule.toggleTask(TodoModule.state.tasks[0].id);
      TodoModule.renderTasks();
      const item = document.querySelector('.task-item');
      expect(item.classList.contains('completed')).toBe(true);
    });

    it('should render task text correctly', () => {
      TodoModule.addTask('My test task');
      TodoModule.renderTasks();
      const taskText = document.querySelector('.task-text');
      expect(taskText.textContent).toBe('My test task');
    });
  });
});
