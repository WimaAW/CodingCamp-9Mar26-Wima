/**
 * Integration Tests for Event Handling and DOM Integration (Task 10)
 * Tests that all interactive elements have proper event listeners
 * and that modules communicate correctly through shared state
 */

describe('Event Handling and DOM Integration (Task 10)', () => {
  let errorContainer;

  beforeEach(() => {
    // Set up complete DOM structure
    document.body.innerHTML = `
      <header>
        <div class="header-content">
          <div class="greeting-header">
            <h1 id="greeting-display">Good Morning</h1>
          </div>
          <button id="theme-toggle" class="theme-toggle" aria-label="Toggle theme">
            <span class="theme-icon">🌙</span>
          </button>
        </div>
      </header>

      <main>
        <!-- Greeting Section -->
        <section id="greeting-section" class="section">
          <h2>Greeting</h2>
          <div class="greeting-content">
            <div id="time-display" class="time-display">--:--</div>
            <div id="date-display" class="date-display">Loading...</div>
            <div class="custom-name-section">
              <input 
                type="text" 
                id="custom-name-input" 
                class="input" 
                placeholder="Enter your name (optional)"
                maxlength="50"
              >
              <button id="save-name-btn" class="button">Save Name</button>
            </div>
          </div>
        </section>

        <!-- Timer Section -->
        <section id="timer-section" class="section">
          <h2>Focus Timer</h2>
          <div class="timer-content">
            <div id="timer-display" class="timer-display">25:00</div>
            <div class="timer-controls">
              <button id="timer-start" class="button button-primary">Start</button>
              <button id="timer-stop" class="button" disabled>Stop</button>
              <button id="timer-reset" class="button">Reset</button>
            </div>
          </div>
        </section>

        <!-- Tasks Section -->
        <section id="tasks-section" class="section">
          <h2>Tasks</h2>
          <div class="tasks-content">
            <div class="task-input-group">
              <input 
                type="text" 
                id="task-input" 
                class="input" 
                placeholder="Add a new task..."
                maxlength="500"
              >
              <button id="task-add-btn" class="button button-primary">Add Task</button>
            </div>
            <ul id="task-list" class="task-list">
              <li class="placeholder">No tasks yet. Add one to get started!</li>
            </ul>
          </div>
        </section>

        <!-- Links Section -->
        <section id="links-section" class="section">
          <h2>Quick Links</h2>
          <div class="links-content">
            <div class="link-input-group">
              <input 
                type="text" 
                id="link-input-title" 
                class="input" 
                placeholder="Link title"
                maxlength="100"
              >
              <input 
                type="url" 
                id="link-input-url" 
                class="input" 
                placeholder="https://example.com"
                maxlength="2048"
              >
              <button id="link-add-btn" class="button button-primary">Add Link</button>
            </div>
            <ul id="link-list" class="link-list">
              <li class="placeholder">No quick links yet. Add one to get started!</li>
            </ul>
          </div>
        </section>
      </main>

      <div id="error-container" class="error-container"></div>
    `;

    errorContainer = document.getElementById('error-container');

    // Reset all module states
    ThemeManager.state = { currentTheme: 'light', defaultTheme: 'light' };
    GreetingModule.state = {
      currentTime: '00:00',
      currentDate: 'Loading...',
      greeting: 'Good Morning',
      customName: '',
      updateIntervalId: null
    };
    FocusTimerModule.state = {
      totalSeconds: 1500,
      remainingSeconds: 1500,
      isRunning: false,
      intervalId: null
    };
    TodoModule.state = { tasks: [] };
    QuickLinksModule.state = { links: [] };

    // Clear localStorage
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up intervals
    if (GreetingModule.state.updateIntervalId) {
      clearInterval(GreetingModule.state.updateIntervalId);
    }
    if (FocusTimerModule.state.intervalId) {
      clearInterval(FocusTimerModule.state.intervalId);
    }
  });

  describe('10.1 Event Listeners for Interactive Elements', () => {
    describe('Timer Controls', () => {
      it('should have click listener on Start button', () => {
        const startBtn = document.getElementById('timer-start');
        FocusTimerModule.init();
        
        startBtn.click();
        expect(FocusTimerModule.state.isRunning).toBe(true);
      });

      it('should have click listener on Stop button', () => {
        const stopBtn = document.getElementById('timer-stop');
        FocusTimerModule.init();
        
        FocusTimerModule.start();
        stopBtn.click();
        expect(FocusTimerModule.state.isRunning).toBe(false);
      });

      it('should have click listener on Reset button', () => {
        const resetBtn = document.getElementById('timer-reset');
        FocusTimerModule.init();
        
        FocusTimerModule.state.remainingSeconds = 500;
        resetBtn.click();
        expect(FocusTimerModule.state.remainingSeconds).toBe(1500);
      });
    });

    describe('Task Actions', () => {
      it('should have click listener on Add Task button', () => {
        const addBtn = document.getElementById('task-add-btn');
        const taskInput = document.getElementById('task-input');
        TodoModule.init();
        
        taskInput.value = 'Test task';
        addBtn.click();
        
        expect(TodoModule.state.tasks.length).toBe(1);
        expect(TodoModule.state.tasks[0].text).toBe('Test task');
      });

      it('should have click listener on Delete button for tasks', () => {
        TodoModule.init();
        TodoModule.addTask('Task to delete');
        
        const taskId = TodoModule.state.tasks[0].id;
        const deleteBtn = document.querySelector(`[data-task-id="${taskId}"].task-delete-btn`);
        
        deleteBtn.click();
        expect(TodoModule.state.tasks.length).toBe(0);
      });

      it('should have click listener on Toggle checkbox for tasks', () => {
        TodoModule.init();
        TodoModule.addTask('Task to toggle');
        
        const taskId = TodoModule.state.tasks[0].id;
        const checkbox = document.querySelector(`[data-task-id="${taskId}"].task-toggle-checkbox`);
        
        checkbox.click();
        expect(TodoModule.state.tasks[0].completed).toBe(true);
      });

      it('should have click listener on Edit button for tasks', () => {
        TodoModule.init();
        TodoModule.addTask('Original task');
        
        const taskId = TodoModule.state.tasks[0].id;
        const editBtn = document.querySelector(`[data-task-id="${taskId}"].task-edit-btn`);
        
        // Mock prompt
        global.prompt = jest.fn(() => 'Edited task');
        editBtn.click();
        
        expect(TodoModule.state.tasks[0].text).toBe('Edited task');
      });
    });

    describe('Link Actions', () => {
      it('should have click listener on Add Link button', () => {
        const addBtn = document.getElementById('link-add-btn');
        const titleInput = document.getElementById('link-input-title');
        const urlInput = document.getElementById('link-input-url');
        QuickLinksModule.init();
        
        titleInput.value = 'GitHub';
        urlInput.value = 'https://github.com';
        addBtn.click();
        
        expect(QuickLinksModule.state.links.length).toBe(1);
        expect(QuickLinksModule.state.links[0].title).toBe('GitHub');
      });

      it('should have click listener on Delete button for links', () => {
        QuickLinksModule.init();
        QuickLinksModule.addLink('GitHub', 'https://github.com');
        
        const linkId = QuickLinksModule.state.links[0].id;
        const deleteBtn = document.querySelector(`[data-link-id="${linkId}"].link-delete-btn`);
        
        deleteBtn.click();
        expect(QuickLinksModule.state.links.length).toBe(0);
      });

      it('should have click listener on Open button for links', () => {
        QuickLinksModule.init();
        QuickLinksModule.addLink('GitHub', 'https://github.com');
        
        const url = 'https://github.com';
        const openBtn = document.querySelector(`[data-link-url="${url}"].link-open-btn`);
        
        global.window.open = jest.fn();
        openBtn.click();
        
        expect(window.open).toHaveBeenCalledWith(url, '_blank');
      });
    });

    describe('Theme Toggle', () => {
      it('should have click listener on Theme Toggle button', () => {
        const themeToggle = document.getElementById('theme-toggle');
        ThemeManager.init();
        
        const initialTheme = ThemeManager.state.currentTheme;
        themeToggle.click();
        
        expect(ThemeManager.state.currentTheme).not.toBe(initialTheme);
      });
    });
  });

  describe('10.2 Input Handling for Task and Link Creation', () => {
    describe('Task Input Listeners', () => {
      it('should trigger validation on task input', () => {
        const taskInput = document.getElementById('task-input');
        TodoModule.init();
        
        taskInput.value = 'Valid task';
        const event = new KeyboardEvent('keypress', { key: 'Enter' });
        taskInput.dispatchEvent(event);
        
        expect(TodoModule.state.tasks.length).toBe(1);
      });

      it('should add task on Enter key in task input', () => {
        const taskInput = document.getElementById('task-input');
        TodoModule.init();
        
        taskInput.value = 'Task via Enter';
        const event = new KeyboardEvent('keypress', { key: 'Enter' });
        taskInput.dispatchEvent(event);
        
        expect(TodoModule.state.tasks.length).toBe(1);
        expect(taskInput.value).toBe('');
      });

      it('should reject empty task input', () => {
        const taskInput = document.getElementById('task-input');
        const addBtn = document.getElementById('task-add-btn');
        TodoModule.init();
        
        taskInput.value = '';
        addBtn.click();
        
        expect(TodoModule.state.tasks.length).toBe(0);
        const errorMessages = errorContainer.querySelectorAll('.error-message');
        expect(errorMessages.length).toBeGreaterThan(0);
      });

      it('should reject duplicate task input', () => {
        const taskInput = document.getElementById('task-input');
        const addBtn = document.getElementById('task-add-btn');
        TodoModule.init();
        
        taskInput.value = 'Duplicate task';
        addBtn.click();
        
        taskInput.value = 'Duplicate task';
        addBtn.click();
        
        expect(TodoModule.state.tasks.length).toBe(1);
        const errorMessages = errorContainer.querySelectorAll('.error-message');
        expect(errorMessages.length).toBeGreaterThan(0);
      });
    });

    describe('Link Input Listeners', () => {
      it('should trigger validation on link URL input', () => {
        const titleInput = document.getElementById('link-input-title');
        const urlInput = document.getElementById('link-input-url');
        QuickLinksModule.init();
        
        titleInput.value = 'GitHub';
        urlInput.value = 'https://github.com';
        const event = new KeyboardEvent('keypress', { key: 'Enter' });
        urlInput.dispatchEvent(event);
        
        expect(QuickLinksModule.state.links.length).toBe(1);
      });

      it('should add link on Enter key in URL input', () => {
        const titleInput = document.getElementById('link-input-title');
        const urlInput = document.getElementById('link-input-url');
        QuickLinksModule.init();
        
        titleInput.value = 'GitHub';
        urlInput.value = 'https://github.com';
        const event = new KeyboardEvent('keypress', { key: 'Enter' });
        urlInput.dispatchEvent(event);
        
        expect(QuickLinksModule.state.links.length).toBe(1);
        expect(urlInput.value).toBe('');
      });

      it('should add link on Enter key in title input', () => {
        const titleInput = document.getElementById('link-input-title');
        const urlInput = document.getElementById('link-input-url');
        QuickLinksModule.init();
        
        titleInput.value = 'GitHub';
        urlInput.value = 'https://github.com';
        const event = new KeyboardEvent('keypress', { key: 'Enter' });
        titleInput.dispatchEvent(event);
        
        expect(QuickLinksModule.state.links.length).toBe(1);
      });

      it('should reject invalid URL format', () => {
        const titleInput = document.getElementById('link-input-title');
        const urlInput = document.getElementById('link-input-url');
        const addBtn = document.getElementById('link-add-btn');
        QuickLinksModule.init();
        
        titleInput.value = 'Invalid Link';
        urlInput.value = 'not-a-valid-url';
        addBtn.click();
        
        expect(QuickLinksModule.state.links.length).toBe(0);
        const errorMessages = errorContainer.querySelectorAll('.error-message');
        expect(errorMessages.length).toBeGreaterThan(0);
      });

      it('should reject empty link title', () => {
        const titleInput = document.getElementById('link-input-title');
        const urlInput = document.getElementById('link-input-url');
        const addBtn = document.getElementById('link-add-btn');
        QuickLinksModule.init();
        
        titleInput.value = '';
        urlInput.value = 'https://github.com';
        addBtn.click();
        
        expect(QuickLinksModule.state.links.length).toBe(0);
        const errorMessages = errorContainer.querySelectorAll('.error-message');
        expect(errorMessages.length).toBeGreaterThan(0);
      });
    });

    describe('Custom Name Input Listeners', () => {
      it('should save custom name on Save Name button click', () => {
        const customNameInput = document.getElementById('custom-name-input');
        const saveNameBtn = document.getElementById('save-name-btn');
        GreetingModule.init();
        
        customNameInput.value = 'Alex';
        saveNameBtn.click();
        
        expect(GreetingModule.state.customName).toBe('Alex');
      });

      it('should save custom name on Enter key in custom name input', () => {
        const customNameInput = document.getElementById('custom-name-input');
        GreetingModule.init();
        
        customNameInput.value = 'Alex';
        const event = new KeyboardEvent('keypress', { key: 'Enter' });
        customNameInput.dispatchEvent(event);
        
        expect(GreetingModule.state.customName).toBe('Alex');
      });

      it('should reject invalid custom name', () => {
        const customNameInput = document.getElementById('custom-name-input');
        const saveNameBtn = document.getElementById('save-name-btn');
        GreetingModule.init();
        
        customNameInput.value = 'Invalid@Name#123';
        saveNameBtn.click();
        
        expect(GreetingModule.state.customName).toBe('');
        const errorMessages = errorContainer.querySelectorAll('.error-message');
        expect(errorMessages.length).toBeGreaterThan(0);
      });

      it('should reject empty custom name', () => {
        const customNameInput = document.getElementById('custom-name-input');
        const saveNameBtn = document.getElementById('save-name-btn');
        GreetingModule.init();
        
        customNameInput.value = '';
        saveNameBtn.click();
        
        expect(GreetingModule.state.customName).toBe('');
        const errorMessages = errorContainer.querySelectorAll('.error-message');
        expect(errorMessages.length).toBeGreaterThan(0);
      });
    });
  });

  describe('10.3 Wire All Modules Together', () => {
    it('should initialize all modules on page load', () => {
      // Simulate DOMContentLoaded
      ThemeManager.init();
      GreetingModule.init();
      FocusTimerModule.init();
      TodoModule.init();
      QuickLinksModule.init();
      
      // Verify all modules are initialized
      expect(document.getElementById('greeting-display').textContent).not.toBe('');
      expect(document.getElementById('timer-display').textContent).toBe('25:00');
      expect(document.getElementById('theme-toggle')).not.toBeNull();
    });

    it('should ensure modules communicate through shared state', () => {
      TodoModule.init();
      QuickLinksModule.init();
      
      // Add a task
      TodoModule.addTask('Test task');
      expect(TodoModule.state.tasks.length).toBe(1);
      
      // Add a link
      QuickLinksModule.addLink('Test Link', 'https://example.com');
      expect(QuickLinksModule.state.links.length).toBe(1);
      
      // Verify both modules maintain their own state
      expect(TodoModule.state.tasks.length).toBe(1);
      expect(QuickLinksModule.state.links.length).toBe(1);
    });

    it('should persist data across module interactions', () => {
      TodoModule.init();
      QuickLinksModule.init();
      ThemeManager.init();
      
      // Add task
      TodoModule.addTask('Persistent task');
      
      // Add link
      QuickLinksModule.addLink('Persistent Link', 'https://example.com');
      
      // Change theme
      ThemeManager.toggle();
      
      // Verify all data is persisted
      expect(TodoModule.state.tasks.length).toBe(1);
      expect(QuickLinksModule.state.links.length).toBe(1);
      expect(ThemeManager.state.currentTheme).toBe('dark');
    });

    it('should handle all interactions flowing correctly', () => {
      // Initialize all modules
      ThemeManager.init();
      GreetingModule.init();
      FocusTimerModule.init();
      TodoModule.init();
      QuickLinksModule.init();
      
      // Simulate user interactions
      const taskInput = document.getElementById('task-input');
      const addTaskBtn = document.getElementById('task-add-btn');
      
      taskInput.value = 'Complete project';
      addTaskBtn.click();
      
      expect(TodoModule.state.tasks.length).toBe(1);
      
      // Toggle task
      const checkbox = document.querySelector('.task-toggle-checkbox');
      checkbox.click();
      
      expect(TodoModule.state.tasks[0].completed).toBe(true);
      
      // Start timer
      const startBtn = document.getElementById('timer-start');
      startBtn.click();
      
      expect(FocusTimerModule.state.isRunning).toBe(true);
      
      // Toggle theme
      const themeToggle = document.getElementById('theme-toggle');
      themeToggle.click();
      
      expect(ThemeManager.state.currentTheme).toBe('dark');
    });

    it('should maintain module independence while sharing global state', () => {
      TodoModule.init();
      QuickLinksModule.init();
      
      // Modify one module
      TodoModule.addTask('Task 1');
      
      // Verify other module is not affected
      expect(QuickLinksModule.state.links.length).toBe(0);
      
      // Modify other module
      QuickLinksModule.addLink('Link 1', 'https://example.com');
      
      // Verify first module still has its data
      expect(TodoModule.state.tasks.length).toBe(1);
    });
  });

  describe('Event Listener Robustness', () => {
    it('should handle rapid clicks on buttons', () => {
      const addBtn = document.getElementById('task-add-btn');
      const taskInput = document.getElementById('task-input');
      TodoModule.init();
      
      taskInput.value = 'Task 1';
      addBtn.click();
      addBtn.click();
      addBtn.click();
      
      // Should only add one task (input cleared after first click)
      expect(TodoModule.state.tasks.length).toBe(1);
    });

    it('should handle missing DOM elements gracefully', () => {
      // Remove a button
      const startBtn = document.getElementById('timer-start');
      startBtn.remove();
      
      // Should not throw error
      expect(() => {
        FocusTimerModule.init();
      }).not.toThrow();
    });

    it('should handle keyboard events correctly', () => {
      const taskInput = document.getElementById('task-input');
      TodoModule.init();
      
      taskInput.value = 'Task via keyboard';
      
      // Simulate Enter key
      const enterEvent = new KeyboardEvent('keypress', { key: 'Enter' });
      taskInput.dispatchEvent(enterEvent);
      
      expect(TodoModule.state.tasks.length).toBe(1);
      
      // Simulate other key (should not add task)
      taskInput.value = 'Another task';
      const otherEvent = new KeyboardEvent('keypress', { key: 'a' });
      taskInput.dispatchEvent(otherEvent);
      
      expect(TodoModule.state.tasks.length).toBe(1);
    });
  });
});
