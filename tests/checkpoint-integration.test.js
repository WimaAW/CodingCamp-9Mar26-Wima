/**
 * Checkpoint Integration Test - Task 11
 * Verifies all core functionality works for the productivity-dashboard spec
 * 
 * This test suite ensures:
 * - All modules initialize correctly
 * - All user interactions work (add, edit, delete, toggle, timer, theme)
 * - Local Storage persistence across page reloads
 * - Error messages display correctly
 */

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock window.open for link opening
global.open = jest.fn();

describe('Checkpoint: Productivity Dashboard Core Functionality', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    // Reset DOM
    document.body.innerHTML = `
      <header>
        <div class="header-content">
          <div class="greeting-header">
            <h1 id="greeting-display">Good Morning</h1>
          </div>
          <button id="theme-toggle" class="theme-toggle">
            <span class="theme-icon">🌙</span>
          </button>
        </div>
      </header>
      <main>
        <section id="greeting-section" class="section">
          <h2>Greeting</h2>
          <div class="greeting-content">
            <div id="time-display" class="time-display">--:--</div>
            <div id="date-display" class="date-display">Loading...</div>
            <div class="custom-name-section">
              <input type="text" id="custom-name-input" class="input" placeholder="Enter your name">
              <button id="save-name-btn" class="button">Save Name</button>
            </div>
          </div>
        </section>
        <section id="timer-section" class="section">
          <h2>Focus Timer</h2>
          <div class="timer-content">
            <div id="timer-display" class="timer-display">25:00</div>
            <div class="timer-controls">
              <button id="timer-start" class="button">Start</button>
              <button id="timer-stop" class="button" disabled>Stop</button>
              <button id="timer-reset" class="button">Reset</button>
            </div>
          </div>
        </section>
        <section id="tasks-section" class="section">
          <h2>Tasks</h2>
          <div class="tasks-content">
            <div class="task-input-group">
              <input type="text" id="task-input" class="input" placeholder="Add a new task...">
              <button id="task-add-btn" class="button">Add Task</button>
            </div>
            <ul id="task-list" class="task-list">
              <li class="placeholder">No tasks yet. Add one to get started!</li>
            </ul>
          </div>
        </section>
        <section id="links-section" class="section">
          <h2>Quick Links</h2>
          <div class="links-content">
            <div class="link-input-group">
              <input type="text" id="link-input-title" class="input" placeholder="Link title">
              <input type="url" id="link-input-url" class="input" placeholder="https://example.com">
              <button id="link-add-btn" class="button">Add Link</button>
            </div>
            <ul id="link-list" class="link-list">
              <li class="placeholder">No quick links yet. Add one to get started!</li>
            </ul>
          </div>
        </section>
      </main>
      <div id="error-container" class="error-container"></div>
    `;
    
    jest.clearAllMocks();
  });

  describe('Module Initialization', () => {
    test('should initialize all modules without errors', () => {
      expect(() => {
        ThemeManager.init();
        GreetingModule.init();
        FocusTimerModule.init();
        TodoModule.init();
        QuickLinksModule.init();
      }).not.toThrow();
    });

    test('should initialize Greeting Module with current time and date', () => {
      GreetingModule.init();
      const timeDisplay = document.getElementById('time-display');
      const dateDisplay = document.getElementById('date-display');
      
      expect(timeDisplay.textContent).toMatch(/\d{2}:\d{2}/);
      expect(dateDisplay.textContent).not.toBe('Loading...');
    });

    test('should initialize Focus Timer to 25:00', () => {
      FocusTimerModule.init();
      const timerDisplay = document.getElementById('timer-display');
      expect(timerDisplay.textContent).toBe('25:00');
    });

    test('should initialize Theme Manager with light theme by default', () => {
      ThemeManager.init();
      expect(ThemeManager.getTheme()).toBe('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    test('should initialize To-Do List with empty tasks', () => {
      TodoModule.init();
      expect(TodoModule.state.tasks.length).toBe(0);
    });

    test('should initialize Quick Links with empty links', () => {
      QuickLinksModule.init();
      expect(QuickLinksModule.state.links.length).toBe(0);
    });
  });

  describe('User Interactions - Tasks', () => {
    beforeEach(() => {
      TodoModule.init();
    });

    test('should add a new task', () => {
      const taskInput = document.getElementById('task-input');
      const addBtn = document.getElementById('task-add-btn');
      
      taskInput.value = 'Test task';
      addBtn.click();
      
      expect(TodoModule.state.tasks.length).toBe(1);
      expect(TodoModule.state.tasks[0].text).toBe('Test task');
      expect(taskInput.value).toBe('');
    });

    test('should prevent duplicate tasks', () => {
      const taskInput = document.getElementById('task-input');
      const addBtn = document.getElementById('task-add-btn');
      
      taskInput.value = 'Duplicate task';
      addBtn.click();
      
      taskInput.value = 'Duplicate task';
      addBtn.click();
      
      expect(TodoModule.state.tasks.length).toBe(1);
    });

    test('should toggle task completion', () => {
      TodoModule.addTask('Test task');
      const taskId = TodoModule.state.tasks[0].id;
      
      TodoModule.toggleTask(taskId);
      expect(TodoModule.state.tasks[0].completed).toBe(true);
      
      TodoModule.toggleTask(taskId);
      expect(TodoModule.state.tasks[0].completed).toBe(false);
    });

    test('should delete a task', () => {
      TodoModule.addTask('Task to delete');
      const taskId = TodoModule.state.tasks[0].id;
      
      TodoModule.deleteTask(taskId);
      expect(TodoModule.state.tasks.length).toBe(0);
    });

    test('should edit a task', () => {
      TodoModule.addTask('Original task');
      const taskId = TodoModule.state.tasks[0].id;
      
      TodoModule.editTask(taskId, 'Updated task');
      expect(TodoModule.state.tasks[0].text).toBe('Updated task');
    });
  });

  describe('User Interactions - Timer', () => {
    beforeEach(() => {
      FocusTimerModule.init();
    });

    test('should start the timer', () => {
      const startBtn = document.getElementById('timer-start');
      startBtn.click();
      
      expect(FocusTimerModule.state.isRunning).toBe(true);
      expect(startBtn.disabled).toBe(true);
    });

    test('should stop the timer', () => {
      const startBtn = document.getElementById('timer-start');
      const stopBtn = document.getElementById('timer-stop');
      
      startBtn.click();
      stopBtn.click();
      
      expect(FocusTimerModule.state.isRunning).toBe(false);
      expect(startBtn.disabled).toBe(false);
    });

    test('should reset the timer to 25:00', () => {
      FocusTimerModule.state.remainingSeconds = 600;
      const resetBtn = document.getElementById('timer-reset');
      
      resetBtn.click();
      
      expect(FocusTimerModule.state.remainingSeconds).toBe(1500);
      const timerDisplay = document.getElementById('timer-display');
      expect(timerDisplay.textContent).toBe('25:00');
    });

    test('should update timer display during countdown', (done) => {
      FocusTimerModule.state.remainingSeconds = 5;
      FocusTimerModule.updateDisplay();
      
      const timerDisplay = document.getElementById('timer-display');
      expect(timerDisplay.textContent).toBe('00:05');
      done();
    });
  });

  describe('User Interactions - Theme', () => {
    beforeEach(() => {
      ThemeManager.init();
    });

    test('should toggle theme from light to dark', () => {
      const themeToggle = document.getElementById('theme-toggle');
      themeToggle.click();
      
      expect(ThemeManager.getTheme()).toBe('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    test('should toggle theme from dark to light', () => {
      ThemeManager.setTheme('dark');
      const themeToggle = document.getElementById('theme-toggle');
      themeToggle.click();
      
      expect(ThemeManager.getTheme()).toBe('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    test('should update theme icon based on current theme', () => {
      const icon = document.querySelector('.theme-icon');
      ThemeManager.setTheme('light');
      expect(icon.textContent).toBe('🌙');
      
      ThemeManager.setTheme('dark');
      expect(icon.textContent).toBe('☀️');
    });
  });

  describe('User Interactions - Quick Links', () => {
    beforeEach(() => {
      QuickLinksModule.init();
    });

    test('should add a new quick link', () => {
      const titleInput = document.getElementById('link-input-title');
      const urlInput = document.getElementById('link-input-url');
      const addBtn = document.getElementById('link-add-btn');
      
      titleInput.value = 'GitHub';
      urlInput.value = 'https://github.com';
      addBtn.click();
      
      expect(QuickLinksModule.state.links.length).toBe(1);
      expect(QuickLinksModule.state.links[0].title).toBe('GitHub');
      expect(QuickLinksModule.state.links[0].url).toBe('https://github.com');
    });

    test('should delete a quick link', () => {
      QuickLinksModule.addLink('GitHub', 'https://github.com');
      const linkId = QuickLinksModule.state.links[0].id;
      
      QuickLinksModule.deleteLink(linkId);
      expect(QuickLinksModule.state.links.length).toBe(0);
    });

    test('should open a link in new tab', () => {
      QuickLinksModule.addLink('GitHub', 'https://github.com');
      QuickLinksModule.openLink('https://github.com');
      
      expect(global.open).toHaveBeenCalledWith('https://github.com', '_blank');
    });

    test('should reject invalid URLs', () => {
      const titleInput = document.getElementById('link-input-title');
      const urlInput = document.getElementById('link-input-url');
      const addBtn = document.getElementById('link-add-btn');
      
      titleInput.value = 'Invalid Link';
      urlInput.value = 'not-a-valid-url';
      addBtn.click();
      
      expect(QuickLinksModule.state.links.length).toBe(0);
    });
  });

  describe('Local Storage Persistence', () => {
    test('should persist tasks to Local Storage', () => {
      TodoModule.init();
      TodoModule.addTask('Persistent task');
      
      const stored = localStorage.getItem('pd_tasks');
      expect(stored).not.toBeNull();
      
      const parsed = JSON.parse(stored);
      expect(parsed.length).toBe(1);
      expect(parsed[0].text).toBe('Persistent task');
    });

    test('should load tasks from Local Storage', () => {
      const taskData = [
        { id: '1', text: 'Loaded task', completed: false, createdAt: Date.now() }
      ];
      localStorage.setItem('pd_tasks', JSON.stringify(taskData));
      
      TodoModule.init();
      expect(TodoModule.state.tasks.length).toBe(1);
      expect(TodoModule.state.tasks[0].text).toBe('Loaded task');
    });

    test('should persist quick links to Local Storage', () => {
      QuickLinksModule.init();
      QuickLinksModule.addLink('GitHub', 'https://github.com');
      
      const stored = localStorage.getItem('pd_quickLinks');
      expect(stored).not.toBeNull();
      
      const parsed = JSON.parse(stored);
      expect(parsed.length).toBe(1);
      expect(parsed[0].title).toBe('GitHub');
    });

    test('should load quick links from Local Storage', () => {
      const linkData = [
        { id: '1', title: 'GitHub', url: 'https://github.com' }
      ];
      localStorage.setItem('pd_quickLinks', JSON.stringify(linkData));
      
      QuickLinksModule.init();
      expect(QuickLinksModule.state.links.length).toBe(1);
      expect(QuickLinksModule.state.links[0].title).toBe('GitHub');
    });

    test('should persist theme preference to Local Storage', () => {
      ThemeManager.init();
      ThemeManager.setTheme('dark');
      
      const stored = localStorage.getItem('pd_theme');
      expect(stored).toBe('"dark"');
    });

    test('should load theme preference from Local Storage', () => {
      localStorage.setItem('pd_theme', '"dark"');
      
      ThemeManager.init();
      expect(ThemeManager.getTheme()).toBe('dark');
    });

    test('should persist custom name to Local Storage', () => {
      GreetingModule.init();
      GreetingModule.setCustomName('Alex');
      
      const stored = localStorage.getItem('pd_customName');
      expect(stored).toBe('"Alex"');
    });

    test('should load custom name from Local Storage', () => {
      localStorage.setItem('pd_customName', '"Alex"');
      
      GreetingModule.init();
      expect(GreetingModule.getCustomName()).toBe('Alex');
    });
  });

  describe('Error Message Display', () => {
    beforeEach(() => {
      TodoModule.init();
      QuickLinksModule.init();
    });

    test('should display error for empty task', () => {
      const taskInput = document.getElementById('task-input');
      const addBtn = document.getElementById('task-add-btn');
      
      taskInput.value = '';
      addBtn.click();
      
      const errorContainer = document.getElementById('error-container');
      expect(errorContainer.children.length).toBeGreaterThan(0);
    });

    test('should display error for duplicate task', () => {
      const taskInput = document.getElementById('task-input');
      const addBtn = document.getElementById('task-add-btn');
      
      taskInput.value = 'Duplicate';
      addBtn.click();
      
      taskInput.value = 'Duplicate';
      addBtn.click();
      
      const errorContainer = document.getElementById('error-container');
      expect(errorContainer.children.length).toBeGreaterThan(0);
    });

    test('should display error for invalid URL', () => {
      const titleInput = document.getElementById('link-input-title');
      const urlInput = document.getElementById('link-input-url');
      const addBtn = document.getElementById('link-add-btn');
      
      titleInput.value = 'Bad Link';
      urlInput.value = 'not-a-url';
      addBtn.click();
      
      const errorContainer = document.getElementById('error-container');
      expect(errorContainer.children.length).toBeGreaterThan(0);
    });

    test('should display error for empty link title', () => {
      const titleInput = document.getElementById('link-input-title');
      const urlInput = document.getElementById('link-input-url');
      const addBtn = document.getElementById('link-add-btn');
      
      titleInput.value = '';
      urlInput.value = 'https://example.com';
      addBtn.click();
      
      const errorContainer = document.getElementById('error-container');
      expect(errorContainer.children.length).toBeGreaterThan(0);
    });

    test('should auto-dismiss error messages after timeout', (done) => {
      const taskInput = document.getElementById('task-input');
      const addBtn = document.getElementById('task-add-btn');
      
      taskInput.value = '';
      addBtn.click();
      
      const errorContainer = document.getElementById('error-container');
      expect(errorContainer.children.length).toBeGreaterThan(0);
      
      setTimeout(() => {
        expect(errorContainer.children.length).toBe(0);
        done();
      }, 3100);
    });
  });

  describe('Input Validation and Sanitization', () => {
    test('should sanitize HTML tags in task input', () => {
      TodoModule.init();
      const taskInput = document.getElementById('task-input');
      const addBtn = document.getElementById('task-add-btn');
      
      taskInput.value = '<script>alert("xss")</script>Task';
      addBtn.click();
      
      expect(TodoModule.state.tasks[0].text).not.toContain('<script>');
    });

    test('should trim whitespace from task input', () => {
      TodoModule.init();
      const taskInput = document.getElementById('task-input');
      const addBtn = document.getElementById('task-add-btn');
      
      taskInput.value = '  Task with spaces  ';
      addBtn.click();
      
      expect(TodoModule.state.tasks[0].text).toBe('Task with spaces');
    });

    test('should reject empty task after trimming', () => {
      TodoModule.init();
      const taskInput = document.getElementById('task-input');
      const addBtn = document.getElementById('task-add-btn');
      
      taskInput.value = '   ';
      addBtn.click();
      
      expect(TodoModule.state.tasks.length).toBe(0);
    });

    test('should validate URL format', () => {
      QuickLinksModule.init();
      
      const validation1 = InputValidator.validateUrl('https://example.com');
      expect(validation1.valid).toBe(true);
      
      const validation2 = InputValidator.validateUrl('http://example.com');
      expect(validation2.valid).toBe(true);
      
      const validation3 = InputValidator.validateUrl('ftp://example.com');
      expect(validation3.valid).toBe(false);
    });
  });

  describe('Greeting Module Functionality', () => {
    beforeEach(() => {
      GreetingModule.init();
    });

    test('should display correct greeting for morning hours', () => {
      const greeting = GreetingModule.getGreeting(8);
      expect(greeting).toBe('Good Morning');
    });

    test('should display correct greeting for afternoon hours', () => {
      const greeting = GreetingModule.getGreeting(14);
      expect(greeting).toBe('Good Afternoon');
    });

    test('should display correct greeting for evening hours', () => {
      const greeting = GreetingModule.getGreeting(19);
      expect(greeting).toBe('Good Evening');
    });

    test('should display correct greeting for night hours', () => {
      const greeting = GreetingModule.getGreeting(2);
      expect(greeting).toBe('Good Night');
    });

    test('should append custom name to greeting', () => {
      GreetingModule.setCustomName('Alex');
      const greetingDisplay = document.getElementById('greeting-display');
      expect(greetingDisplay.textContent).toContain('Alex');
    });

    test('should format time correctly', () => {
      const date = new Date(2024, 0, 15, 14, 30);
      const time = GreetingModule.formatTime(date);
      expect(time).toBe('14:30');
    });

    test('should format date correctly', () => {
      const date = new Date(2024, 0, 15);
      const formattedDate = GreetingModule.formatDate(date);
      expect(formattedDate).toContain('January');
      expect(formattedDate).toContain('15');
      expect(formattedDate).toContain('2024');
    });
  });

  describe('Complete Integration Workflow', () => {
    test('should handle complete user workflow', () => {
      // Initialize all modules
      ThemeManager.init();
      GreetingModule.init();
      FocusTimerModule.init();
      TodoModule.init();
      QuickLinksModule.init();
      
      // Add a task
      const taskInput = document.getElementById('task-input');
      taskInput.value = 'Complete project';
      document.getElementById('task-add-btn').click();
      expect(TodoModule.state.tasks.length).toBe(1);
      
      // Add a quick link
      const titleInput = document.getElementById('link-input-title');
      const urlInput = document.getElementById('link-input-url');
      titleInput.value = 'GitHub';
      urlInput.value = 'https://github.com';
      document.getElementById('link-add-btn').click();
      expect(QuickLinksModule.state.links.length).toBe(1);
      
      // Toggle theme
      document.getElementById('theme-toggle').click();
      expect(ThemeManager.getTheme()).toBe('dark');
      
      // Start timer
      document.getElementById('timer-start').click();
      expect(FocusTimerModule.state.isRunning).toBe(true);
      
      // Verify all data persists
      expect(localStorage.getItem('pd_tasks')).not.toBeNull();
      expect(localStorage.getItem('pd_quickLinks')).not.toBeNull();
      expect(localStorage.getItem('pd_theme')).not.toBeNull();
    });
  });
});
