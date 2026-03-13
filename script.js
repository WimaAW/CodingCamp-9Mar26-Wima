// ============================================================================
// Productivity Dashboard - Vanilla JavaScript
// ============================================================================

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Generate a UUID v4 for unique identifiers
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Get value from Local Storage with error handling
 */
function getFromStorage(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Error reading from storage: ${key}`, error);
    return null;
  }
}

/**
 * Save value to Local Storage with error handling
 */
function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to storage: ${key}`, error);
    showError('Local Storage is full. Please delete some items.');
  }
}

/**
 * Display error message to user
 */
function showError(message, duration = 3000) {
  const container = document.getElementById('error-container');
  const errorEl = document.createElement('div');
  errorEl.className = 'error-message';
  errorEl.textContent = message;
  container.appendChild(errorEl);
  
  setTimeout(() => {
    errorEl.remove();
  }, duration);
}

// ============================================================================
// Input Validator Module
// ============================================================================

const InputValidator = {
  /**
   * Sanitize text by removing HTML and script tags
   * Prevents XSS attacks by escaping HTML entities
   */
  sanitizeText(input) {
    if (typeof input !== 'string') {
      return '';
    }
    
    // Create a temporary element to leverage browser's HTML parsing
    const temp = document.createElement('div');
    temp.textContent = input;
    return temp.innerHTML;
  },

  /**
   * Trim leading and trailing whitespace from input
   */
  trimInput(input) {
    if (typeof input !== 'string') {
      return '';
    }
    return input.trim();
  },

  /**
   * Validate task text
   * Requirements: Non-empty after trim, max 500 characters
   * Returns: { valid: boolean, error: string|null }
   */
  validateTaskText(text) {
    const trimmed = this.trimInput(text);
    
    if (!trimmed) {
      return { valid: false, error: 'Task description cannot be empty' };
    }
    
    if (trimmed.length > 500) {
      return { valid: false, error: 'Task description cannot exceed 500 characters' };
    }
    
    return { valid: true, error: null };
  },

  /**
   * Validate URL format
   * Requirements: Must start with http:// or https://
   * Returns: { valid: boolean, error: string|null }
   */
  validateUrl(url) {
    const trimmed = this.trimInput(url);
    
    if (!trimmed) {
      return { valid: false, error: 'URL cannot be empty' };
    }
    
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      return { valid: false, error: 'URL must start with http:// or https://' };
    }
    
    if (trimmed.length > 2048) {
      return { valid: false, error: 'URL cannot exceed 2048 characters' };
    }
    
    return { valid: true, error: null };
  },

  /**
   * Validate custom name
   * Requirements: Alphanumeric and common punctuation, max 50 characters
   * Returns: { valid: boolean, error: string|null }
   */
  validateName(name) {
    const trimmed = this.trimInput(name);
    
    if (!trimmed) {
      return { valid: false, error: 'Name cannot be empty' };
    }
    
    if (trimmed.length > 50) {
      return { valid: false, error: 'Name cannot exceed 50 characters' };
    }
    
    // Allow alphanumeric, spaces, hyphens, apostrophes, periods
    const validNamePattern = /^[a-zA-Z0-9\s\-'.]+$/;
    if (!validNamePattern.test(trimmed)) {
      return { valid: false, error: 'Name can only contain letters, numbers, spaces, hyphens, apostrophes, and periods' };
    }
    
    return { valid: true, error: null };
  }
};

// ============================================================================
// Greeting Module
// ============================================================================

const GreetingModule = {
  state: {
    currentTime: '00:00',
    currentDate: 'Loading...',
    greeting: 'Good Morning',
    customName: '',
    updateIntervalId: null
  },

  /**
   * Initialize the Greeting Module
   */
  init() {
    this.loadCustomName();
    this.updateDisplay();
    this.setupUpdateInterval();
  },

  /**
   * Update time and date display
   */
  updateDisplay() {
    const now = new Date();
    this.state.currentTime = this.formatTime(now);
    this.state.currentDate = this.formatDate(now);
    this.state.greeting = this.getGreeting(now.getHours());
    this.render();
  },

  /**
   * Format time as HH:MM
   */
  formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  },

  /**
   * Format date as "Day, Month DD, YYYY"
   */
  formatDate(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const dayNum = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${dayName}, ${monthName} ${dayNum}, ${year}`;
  },

  /**
   * Get greeting based on hour of day
   * 5-11: Good Morning
   * 12-16: Good Afternoon
   * 17-23: Good Evening
   * 0-4: Good Night
   */
  getGreeting(hour) {
    if (hour >= 5 && hour <= 11) {
      return 'Good Morning';
    } else if (hour >= 12 && hour <= 16) {
      return 'Good Afternoon';
    } else if (hour >= 17 && hour <= 23) {
      return 'Good Evening';
    } else {
      return 'Good Night';
    }
  },

  /**
   * Set custom name and save to storage
   */
  setCustomName(name) {
    this.state.customName = name;
    saveToStorage('pd_customName', name);
    this.render();
  },

  /**
   * Get custom name
   */
  getCustomName() {
    return this.state.customName;
  },

  /**
   * Load custom name from Local Storage
   */
  loadCustomName() {
    const name = getFromStorage('pd_customName');
    if (name) {
      this.state.customName = name;
    }
  },

  /**
   * Set up minute-based update interval
   */
  setupUpdateInterval() {
    // Clear any existing interval
    if (this.state.updateIntervalId) {
      clearInterval(this.state.updateIntervalId);
    }
    
    // Update every minute (60000 ms)
    this.state.updateIntervalId = setInterval(() => {
      this.updateDisplay();
    }, 60000);
  },

  /**
   * Render greeting display
   */
  render() {
    const greetingDisplay = document.getElementById('greeting-display');
    const timeDisplay = document.getElementById('time-display');
    const dateDisplay = document.getElementById('date-display');
    
    if (greetingDisplay) {
      let greetingText = this.state.greeting;
      if (this.state.customName) {
        greetingText += `, ${this.state.customName}`;
      }
      greetingDisplay.textContent = greetingText;
    }
    
    if (timeDisplay) {
      timeDisplay.textContent = this.state.currentTime;
    }
    
    if (dateDisplay) {
      dateDisplay.textContent = this.state.currentDate;
    }
  }
};

// ============================================================================
// Focus Timer Module
// ============================================================================

const FocusTimerModule = {
  state: {
    totalSeconds: 1500,      // 25 minutes
    remainingSeconds: 1500,
    isRunning: false,
    intervalId: null
  },

  /**
   * Initialize the Focus Timer Module
   */
  init() {
    this.setupEventListeners();
    this.updateDisplay();
  },

  /**
   * Set up event listeners for timer controls
   */
  setupEventListeners() {
    const startBtn = document.getElementById('timer-start');
    const stopBtn = document.getElementById('timer-stop');
    const resetBtn = document.getElementById('timer-reset');

    if (startBtn) {
      startBtn.addEventListener('click', () => this.start());
    }

    if (stopBtn) {
      stopBtn.addEventListener('click', () => this.stop());
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.reset());
    }
  },

  /**
   * Start the timer countdown
   */
  start() {
    if (this.state.isRunning) return;

    this.state.isRunning = true;
    this.updateButtonStates();

    // Use setInterval for consistent updates every second
    this.state.intervalId = setInterval(() => {
      this.tick();
    }, 1000);
  },

  /**
   * Decrement timer by 1 second and check for completion
   */
  tick() {
    if (this.state.remainingSeconds > 0) {
      this.state.remainingSeconds--;
      this.updateDisplay();

      // Check if timer reached 0
      if (this.state.remainingSeconds === 0) {
        this.stop();
        this.showCompletionNotification();
      }
    }
  },

  /**
   * Stop (pause) the timer countdown
   */
  stop() {
    this.state.isRunning = false;
    
    if (this.state.intervalId) {
      clearInterval(this.state.intervalId);
      this.state.intervalId = null;
    }

    this.updateButtonStates();
  },

  /**
   * Reset timer to 25 minutes
   */
  reset() {
    this.stop();
    this.state.remainingSeconds = this.state.totalSeconds;
    this.updateDisplay();
  },

  /**
   * Update the MM:SS display
   */
  updateDisplay() {
    const minutes = Math.floor(this.state.remainingSeconds / 60);
    const seconds = this.state.remainingSeconds % 60;
    
    const displayText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    const timerDisplay = document.getElementById('timer-display');
    if (timerDisplay) {
      timerDisplay.textContent = displayText;
    }
  },

  /**
   * Update button states based on timer state
   */
  updateButtonStates() {
    const startBtn = document.getElementById('timer-start');
    const stopBtn = document.getElementById('timer-stop');

    if (startBtn) {
      startBtn.disabled = this.state.isRunning;
    }

    if (stopBtn) {
      stopBtn.disabled = !this.state.isRunning;
    }
  },

  /**
   * Show completion notification when timer reaches 0
   */
  showCompletionNotification() {
    showError('Focus session complete! Great work! 🎉', 5000);
  }
};

// ============================================================================
// To-Do List Module
// ============================================================================

const TodoModule = {
  state: {
    tasks: []
  },

  /**
   * Initialize the To-Do List Module
   * Load tasks from Local Storage and set up event listeners
   */
  init() {
    this.loadTasks();
    this.setupEventListeners();
    this.renderTasks();
  },

  /**
   * Load tasks from Local Storage
   */
  loadTasks() {
    const tasks = getFromStorage('pd_tasks');
    this.state.tasks = tasks || [];
  },

  /**
   * Save tasks to Local Storage
   */
  saveTasks() {
    saveToStorage('pd_tasks', this.state.tasks);
  },

  /**
   * Set up event listeners for task controls
   */
  setupEventListeners() {
    const taskInput = document.getElementById('task-input');
    const addBtn = document.getElementById('task-add-btn');

    if (addBtn) {
      addBtn.addEventListener('click', () => this.handleAddTask());
    }

    if (taskInput) {
      taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.handleAddTask();
        }
      });
    }

    // Event delegation for task actions (edit, delete, toggle)
    const taskList = document.getElementById('task-list');
    if (taskList) {
      taskList.addEventListener('click', (e) => {
        if (e.target.matches('.task-delete-btn')) {
          const taskId = e.target.dataset.taskId;
          this.deleteTask(taskId);
        } else if (e.target.matches('.task-toggle-checkbox')) {
          const taskId = e.target.dataset.taskId;
          this.toggleTask(taskId);
        } else if (e.target.matches('.task-edit-btn')) {
          const taskId = e.target.dataset.taskId;
          this.startEditTask(taskId);
        }
      });
    }
  },

  /**
   * Handle add task button click
   */
  handleAddTask() {
    const taskInput = document.getElementById('task-input');
    if (!taskInput) return;

    const text = taskInput.value;
    const validation = InputValidator.validateTaskText(text);

    if (!validation.valid) {
      showError(validation.error);
      return;
    }

    const sanitizedText = InputValidator.sanitizeText(InputValidator.trimInput(text));

    if (this.isDuplicate(sanitizedText)) {
      showError('This task already exists in your list');
      return;
    }

    this.addTask(sanitizedText);
    taskInput.value = '';
    taskInput.focus();
  },

  /**
   * Add a new task
   */
  addTask(text) {
    const task = {
      id: generateUUID(),
      text: text,
      completed: false,
      createdAt: Date.now()
    };

    this.state.tasks.push(task);
    this.saveTasks();
    this.renderTasks();
  },

  /**
   * Check if a task with identical text already exists (case-insensitive)
   */
  isDuplicate(text) {
    const lowerText = text.toLowerCase();
    return this.state.tasks.some(task => task.text.toLowerCase() === lowerText);
  },

  /**
   * Edit a task
   */
  editTask(id, newText) {
    const task = this.state.tasks.find(t => t.id === id);
    if (!task) return;

    const sanitizedText = InputValidator.sanitizeText(InputValidator.trimInput(newText));

    // Check for duplicates (excluding the current task)
    const isDuplicate = this.state.tasks.some(
      t => t.id !== id && t.text.toLowerCase() === sanitizedText.toLowerCase()
    );

    if (isDuplicate) {
      showError('This task already exists in your list');
      return;
    }

    task.text = sanitizedText;
    this.saveTasks();
    this.renderTasks();
  },

  /**
   * Start inline editing for a task
   */
  startEditTask(id) {
    const task = this.state.tasks.find(t => t.id === id);
    if (!task) return;

    const newText = prompt('Edit task:', task.text);
    if (newText !== null) {
      const validation = InputValidator.validateTaskText(newText);
      if (!validation.valid) {
        showError(validation.error);
        return;
      }
      this.editTask(id, newText);
    }
  },

  /**
   * Toggle task completion status
   */
  toggleTask(id) {
    const task = this.state.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveTasks();
      this.renderTasks();
    }
  },

  /**
   * Delete a task
   */
  deleteTask(id) {
    this.state.tasks = this.state.tasks.filter(t => t.id !== id);
    this.saveTasks();
    this.renderTasks();
  },

  /**
   * Render all tasks in the DOM
   */
  renderTasks() {
    const taskList = document.getElementById('task-list');
    if (!taskList) return;

    // Clear existing tasks
    taskList.innerHTML = '';

    if (this.state.tasks.length === 0) {
      const placeholder = document.createElement('li');
      placeholder.className = 'placeholder';
      placeholder.textContent = 'No tasks yet. Add one to get started!';
      taskList.appendChild(placeholder);
      return;
    }

    // Use DocumentFragment for efficient batch rendering
    const fragment = document.createDocumentFragment();

    this.state.tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = 'task-item';
      if (task.completed) {
        li.classList.add('completed');
      }

      li.innerHTML = `
        <input 
          type="checkbox" 
          class="task-toggle-checkbox" 
          data-task-id="${task.id}"
          ${task.completed ? 'checked' : ''}
          aria-label="Toggle task completion"
        >
        <span class="task-text">${task.text}</span>
        <button class="task-edit-btn" data-task-id="${task.id}" aria-label="Edit task">Edit</button>
        <button class="task-delete-btn" data-task-id="${task.id}" aria-label="Delete task">Delete</button>
      `;

      fragment.appendChild(li);
    });

    taskList.appendChild(fragment);
  }
};
// ============================================================================
// Quick Links Module
// ============================================================================

const QuickLinksModule = {
  state: {
    links: []
  },

  /**
   * Initialize the Quick Links Module
   * Load links from Local Storage and set up event listeners
   */
  init() {
    this.loadLinks();
    this.setupEventListeners();
    this.renderLinks();
  },

  /**
   * Load links from Local Storage
   */
  loadLinks() {
    const links = getFromStorage('pd_quickLinks');
    this.state.links = links || [];
  },

  /**
   * Save links to Local Storage
   */
  saveLinks() {
    saveToStorage('pd_quickLinks', this.state.links);
  },

  /**
   * Set up event listeners for link controls
   */
  setupEventListeners() {
    const linkTitleInput = document.getElementById('link-input-title');
    const linkUrlInput = document.getElementById('link-input-url');
    const addBtn = document.getElementById('link-add-btn');

    if (addBtn) {
      addBtn.addEventListener('click', () => this.handleAddLink());
    }

    if (linkUrlInput) {
      linkUrlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.handleAddLink();
        }
      });
    }

    if (linkTitleInput) {
      linkTitleInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.handleAddLink();
        }
      });
    }

    // Event delegation for link actions (delete, open)
    const linkList = document.getElementById('link-list');
    if (linkList) {
      linkList.addEventListener('click', (e) => {
        if (e.target.matches('.link-delete-btn')) {
          const linkId = e.target.dataset.linkId;
          this.deleteLink(linkId);
        } else if (e.target.matches('.link-open-btn')) {
          const url = e.target.dataset.linkUrl;
          this.openLink(url);
        }
      });
    }
  },

  /**
   * Handle add link button click
   */
  handleAddLink() {
    const linkTitleInput = document.getElementById('link-input-title');
    const linkUrlInput = document.getElementById('link-input-url');

    if (!linkTitleInput || !linkUrlInput) return;

    const title = linkTitleInput.value;
    const url = linkUrlInput.value;

    // Validate title
    const titleTrimmed = InputValidator.trimInput(title);
    if (!titleTrimmed) {
      showError('Link title cannot be empty');
      return;
    }

    // Validate URL
    const urlValidation = InputValidator.validateUrl(url);
    if (!urlValidation.valid) {
      showError(urlValidation.error);
      return;
    }

    const sanitizedTitle = InputValidator.sanitizeText(titleTrimmed);
    const sanitizedUrl = InputValidator.sanitizeText(InputValidator.trimInput(url));

    this.addLink(sanitizedTitle, sanitizedUrl);
    linkTitleInput.value = '';
    linkUrlInput.value = '';
    linkTitleInput.focus();
  },

  /**
   * Add a new link
   */
  addLink(title, url) {
    const link = {
      id: generateUUID(),
      title: title,
      url: url
    };

    this.state.links.push(link);
    this.saveLinks();
    this.renderLinks();
  },

  /**
   * Open a link in a new browser tab
   */
  openLink(url) {
    window.open(url, '_blank');
  },

  /**
   * Delete a link
   */
  deleteLink(id) {
    this.state.links = this.state.links.filter(l => l.id !== id);
    this.saveLinks();
    this.renderLinks();
  },

  /**
   * Render all links in the DOM
   */
  renderLinks() {
    const linkList = document.getElementById('link-list');
    if (!linkList) return;

    // Clear existing links
    linkList.innerHTML = '';

    if (this.state.links.length === 0) {
      const placeholder = document.createElement('li');
      placeholder.className = 'placeholder';
      placeholder.textContent = 'No quick links yet. Add one to get started!';
      linkList.appendChild(placeholder);
      return;
    }

    // Use DocumentFragment for efficient batch rendering
    const fragment = document.createDocumentFragment();

    this.state.links.forEach(link => {
      const li = document.createElement('li');
      li.className = 'link-item';

      li.innerHTML = `
        <div class="link-content">
          <button class="link-open-btn" data-link-url="${link.url}" aria-label="Open link">
            <span class="link-title">${link.title}</span>
            <span class="link-url">${link.url}</span>
          </button>
        </div>
        <button class="link-delete-btn" data-link-id="${link.id}" aria-label="Delete link">Delete</button>
      `;

      fragment.appendChild(li);
    });

    linkList.appendChild(fragment);
  }
};

// ============================================================================
// Theme Manager Module
// ============================================================================

const ThemeManager = {
  state: {
    currentTheme: 'light',
    defaultTheme: 'light'
  },

  /**
   * Initialize the Theme Manager
   * Load theme preference from Local Storage and apply it
   */
  init() {
    this.loadTheme();
    this.applyTheme();
    this.setupEventListeners();
  },

  /**
   * Load theme preference from Local Storage
   * Defaults to light theme if no preference stored
   */
  loadTheme() {
    const storedTheme = getFromStorage('pd_theme');
    if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
      this.state.currentTheme = storedTheme;
    } else {
      this.state.currentTheme = this.state.defaultTheme;
    }
  },

  /**
   * Apply the current theme by setting data-theme attribute on document root
   */
  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.state.currentTheme);
    this.updateThemeToggleIcon();
  },

  /**
   * Set a specific theme and apply it
   */
  setTheme(theme) {
    if (theme === 'light' || theme === 'dark') {
      this.state.currentTheme = theme;
      this.applyTheme();
      this.saveTheme();
    }
  },

  /**
   * Get the current theme
   */
  getTheme() {
    return this.state.currentTheme;
  },

  /**
   * Toggle between light and dark themes
   */
  toggle() {
    const newTheme = this.state.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  },

  /**
   * Save theme preference to Local Storage
   */
  saveTheme() {
    saveToStorage('pd_theme', this.state.currentTheme);
  },

  /**
   * Update the theme toggle button icon based on current theme
   */
  updateThemeToggleIcon() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      const icon = themeToggle.querySelector('.theme-icon');
      if (icon) {
        // Show moon icon in light theme, sun icon in dark theme
        icon.textContent = this.state.currentTheme === 'light' ? '🌙' : '☀️';
      }
    }
  },

  /**
   * Set up event listener for theme toggle button
   */
  setupEventListeners() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.toggle();
      });
    }
  }
};

// ============================================================================
// Page Initialization
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Theme Manager
  ThemeManager.init();

  // Initialize Greeting Module
  GreetingModule.init();

  // Initialize Focus Timer Module
  FocusTimerModule.init();

  // Initialize To-Do List Module
  TodoModule.init();

  // Initialize Quick Links Module
  QuickLinksModule.init();

  // Set up custom name input handler
  const customNameInput = document.getElementById('custom-name-input');
  const saveNameBtn = document.getElementById('save-name-btn');

  if (customNameInput && saveNameBtn) {
    // Load existing name into input
    const existingName = GreetingModule.getCustomName();
    if (existingName) {
      customNameInput.value = existingName;
    }

    // Save name on button click
    saveNameBtn.addEventListener('click', () => {
      const name = customNameInput.value;
      const validation = InputValidator.validateName(name);
      
      if (validation.valid) {
        GreetingModule.setCustomName(validation.valid ? InputValidator.trimInput(name) : name);
      } else {
        showError(validation.error);
      }
    });

    // Save name on Enter key
    customNameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        saveNameBtn.click();
      }
    });
  }
});
