/**
 * Property-Based Tests for To-Do List Module
 * Uses fast-check for property-based testing
 */

describe('To-Do List Module - Property-Based Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    TodoModule.state.tasks = [];
  });

  describe('Property 11: Task List Displays All Tasks', () => {
    it('should display all tasks in the DOM', () => {
      fc.assert(
        fc.property(
          fc.array(fc.string({ minLength: 1, maxLength: 100 }), { minLength: 1, maxLength: 10 }),
          (taskTexts) => {
            // Set up DOM
            document.body.innerHTML = '<ul id="task-list"></ul>';
            
            // Add all tasks
            taskTexts.forEach(text => {
              TodoModule.addTask(text);
            });
            
            TodoModule.renderTasks();
            
            // Count rendered tasks
            const renderedTasks = document.querySelectorAll('.task-item').length;
            expect(renderedTasks).toBe(taskTexts.length);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Validates: Requirements 3.1
     */
  });

  describe('Property 12: Task Addition Grows List', () => {
    it('should increase list length by 1 when adding valid task', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }),
          (taskText) => {
            const initialLength = TodoModule.state.tasks.length;
            TodoModule.addTask(taskText);
            expect(TodoModule.state.tasks.length).toBe(initialLength + 1);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Validates: Requirements 3.2
     */
  });

  describe('Property 13: Duplicate Task Prevention', () => {
    it('should prevent adding duplicate tasks (case-insensitive)', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }),
          (taskText) => {
            // Add first task
            TodoModule.addTask(taskText);
            const initialLength = TodoModule.state.tasks.length;
            
            // Try to add duplicate with different case
            const isDuplicate = TodoModule.isDuplicate(taskText.toUpperCase());
            expect(isDuplicate).toBe(true);
            
            // Try to add duplicate with different case
            const isDuplicate2 = TodoModule.isDuplicate(taskText.toLowerCase());
            expect(isDuplicate2).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Validates: Requirements 3.3
     */
  });

  describe('Property 14: Task Edit Updates Description', () => {
    it('should update task description when edited', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }),
          fc.string({ minLength: 1, maxLength: 100 }),
          (originalText, newText) => {
            // Skip if texts are identical
            if (originalText.toLowerCase() === newText.toLowerCase()) {
              return;
            }
            
            TodoModule.addTask(originalText);
            const taskId = TodoModule.state.tasks[0].id;
            TodoModule.editTask(taskId, newText);
            
            // Task should have new text (sanitized and trimmed)
            const sanitized = InputValidator.sanitizeText(InputValidator.trimInput(newText));
            expect(TodoModule.state.tasks[0].text).toBe(sanitized);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Validates: Requirements 3.5
     */
  });

  describe('Property 15: Task Completion Toggle', () => {
    it('should toggle task completion status', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }),
          (taskText) => {
            TodoModule.addTask(taskText);
            const taskId = TodoModule.state.tasks[0].id;
            
            // Initial state should be incomplete
            expect(TodoModule.state.tasks[0].completed).toBe(false);
            
            // Toggle to complete
            TodoModule.toggleTask(taskId);
            expect(TodoModule.state.tasks[0].completed).toBe(true);
            
            // Toggle back to incomplete
            TodoModule.toggleTask(taskId);
            expect(TodoModule.state.tasks[0].completed).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Validates: Requirements 3.6, 3.10
     */
  });

  describe('Property 16: Task Deletion Removes from List', () => {
    it('should remove task from list when deleted', () => {
      fc.assert(
        fc.property(
          fc.array(fc.string({ minLength: 1, maxLength: 100 }), { minLength: 2, maxLength: 10 }),
          (taskTexts) => {
            // Add all tasks
            taskTexts.forEach(text => {
              TodoModule.addTask(text);
            });
            
            const initialLength = TodoModule.state.tasks.length;
            const taskToDelete = TodoModule.state.tasks[0].id;
            
            TodoModule.deleteTask(taskToDelete);
            
            expect(TodoModule.state.tasks.length).toBe(initialLength - 1);
            // Deleted task should not be in list
            expect(TodoModule.state.tasks.some(t => t.id === taskToDelete)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Validates: Requirements 3.7
     */
  });

  describe('Property 17: Task Persistence Round Trip', () => {
    it('should restore tasks with identical text and completion status after reload', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              text: fc.string({ minLength: 1, maxLength: 100 }),
              completed: fc.boolean()
            }),
            { minLength: 1, maxLength: 10 }
          ),
          (taskData) => {
            // Add tasks
            taskData.forEach(data => {
              TodoModule.addTask(data.text);
              if (data.completed) {
                const taskId = TodoModule.state.tasks[TodoModule.state.tasks.length - 1].id;
                TodoModule.toggleTask(taskId);
              }
            });
            
            // Save to storage
            TodoModule.saveTasks();
            
            // Clear and reload
            const savedTasks = JSON.parse(localStorage.getItem('pd_tasks'));
            TodoModule.state.tasks = [];
            TodoModule.loadTasks();
            
            // Verify all tasks restored
            expect(TodoModule.state.tasks.length).toBe(taskData.length);
            
            // Verify each task's text and completion status
            TodoModule.state.tasks.forEach((task, index) => {
              const sanitized = InputValidator.sanitizeText(InputValidator.trimInput(taskData[index].text));
              expect(task.text).toBe(sanitized);
              expect(task.completed).toBe(taskData[index].completed);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Validates: Requirements 3.8, 3.9
     */
  });
});
