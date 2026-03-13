# Technical Design Document: Productivity Dashboard

## Overview

The Productivity Dashboard is a single-page web application built with vanilla HTML, CSS, and JavaScript. It provides users with an integrated workspace combining time awareness, focus timing, task management, quick link access, and theme customization. The application prioritizes performance, accessibility, and simplicity through a modular architecture with clear separation of concerns.

**Key Design Principles:**
- Single-file architecture (one HTML, one CSS, one JS file)
- Vanilla JavaScript with no external dependencies
- Local Storage for persistent data
- Responsive design supporting 320px to 2560px viewports
- Modular function organization for maintainability
- Progressive enhancement with graceful degradation

## Architecture

### System Structure

```
┌─────────────────────────────────────────────────────────┐
│                   Productivity Dashboard                 │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │         Presentation Layer (HTML/CSS)            │   │
│  │  - Semantic HTML structure                       │   │
│  │  - CSS Grid/Flexbox layout                       │   │
│  │  - Theme variables (light/dark)                  │   │
│  └──────────────────────────────────────────────────┘   │
│                          ↕                               │
│  ┌──────────────────────────────────────────────────┐   │
│  │      Application Layer (JavaScript)              │   │
│  │  - Module objects (Greeting, Timer, Tasks, etc)  │   │
│  │  - Event handlers                                │   │
│  │  - DOM manipulation                              │   │
│  └──────────────────────────────────────────────────┘   │
│                          ↕                               │
│  ┌──────────────────────────────────────────────────┐   │
│  │      Data Layer (Local Storage)                  │   │
│  │  - Task persistence                              │   │
│  │  - Quick links storage                           │   │
│  │  - Theme preference                              │   │
│  │  - Custom name                                   │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Initialization**: On page load, JavaScript initializes all modules and loads persisted data from Local Storage
2. **User Interaction**: User interacts with UI elements (buttons, inputs, checkboxes)
3. **Event Handling**: Event listeners trigger appropriate module functions
4. **State Update**: Module updates internal state and DOM
5. **Persistence**: Changes are saved to Local Storage
6. **Display Update**: DOM reflects new state with visual feedback

### Local Storage Schema

```
Key Naming Convention: "pd_" prefix for all keys

pd_tasks: JSON array of task objects
  [
    { id: "uuid", text: "Task description", completed: false, createdAt: timestamp },
    ...
  ]

pd_quickLinks: JSON array of quick link objects
  [
    { id: "uuid", title: "Link Title", url: "https://example.com" },
    ...
  ]

pd_theme: String ("light" or "dark")

pd_customName: String (user's custom name for greeting)
```

## Components and Interfaces

### 1. Greeting Module

**Responsibility**: Display current time, date, and personalized greeting

**Interface**:
```javascript
const GreetingModule = {
  init(),           // Initialize and start updates
  updateDisplay(),  // Update time and greeting
  setCustomName(name),  // Store custom name
  getCustomName(),  // Retrieve custom name
  getGreeting(hour) // Determine greeting based on hour
}
```

**Data Structure**:
```javascript
{
  currentTime: "14:30",
  currentDate: "Monday, January 15, 2024",
  greeting: "Good Afternoon",
  customName: "Alex"
}
```

**Behavior**:
- Updates time display every minute
- Greeting logic based on hour ranges (5-11 AM, 12-4 PM, 5-11 PM, 12-4 AM)
- Appends custom name if stored
- Loads custom name from Local Storage on init

### 2. Focus Timer Module

**Responsibility**: Manage 25-minute Pomodoro timer with start/stop/reset controls

**Interface**:
```javascript
const FocusTimerModule = {
  init(),           // Initialize timer UI
  start(),          // Begin countdown
  stop(),           // Pause countdown
  reset(),          // Return to 25 minutes
  updateDisplay(),  // Update MM:SS display
  tick()            // Decrement timer (called every second)
}
```

**Data Structure**:
```javascript
{
  totalSeconds: 1500,      // 25 minutes
  remainingSeconds: 1500,
  isRunning: false,
  intervalId: null
}
```

**Behavior**:
- Initializes to 1500 seconds (25 minutes)
- Disables Start button while running
- Enables Start button when paused
- Auto-stops and shows notification at 0 seconds
- Updates display every second during countdown
- Clears interval on stop/reset

### 3. To-Do List Module

**Responsibility**: Manage task CRUD operations with duplicate detection and persistence

**Interface**:
```javascript
const TodoModule = {
  init(),                   // Load tasks from storage
  addTask(text),            // Add new task
  editTask(id, newText),    // Update task description
  toggleTask(id),           // Mark task complete/incomplete
  deleteTask(id),           // Remove task
  renderTasks(),            // Update DOM display
  isDuplicate(text),        // Check for duplicate text
  saveTasks()               // Persist to Local Storage
}
```

**Data Structure**:
```javascript
{
  tasks: [
    {
      id: "uuid-1",
      text: "Complete project report",
      completed: false,
      createdAt: 1705334400000
    },
    ...
  ]
}
```

**Behavior**:
- Generates UUID for each task
- Prevents duplicate task text (case-insensitive comparison)
- Persists after each modification
- Loads from Local Storage on init
- Renders completed tasks with strikethrough styling
- Supports inline editing with confirmation

### 4. Quick Links Module

**Responsibility**: Manage bookmarks with URL validation and persistence

**Interface**:
```javascript
const QuickLinksModule = {
  init(),                   // Load links from storage
  addLink(title, url),      // Add new link
  deleteLink(id),           // Remove link
  openLink(url),            // Open URL in new tab
  validateUrl(url),         // Validate URL format
  renderLinks(),            // Update DOM display
  saveLinks()               // Persist to Local Storage
}
```

**Data Structure**:
```javascript
{
  links: [
    {
      id: "uuid-1",
      title: "GitHub",
      url: "https://github.com"
    },
    ...
  ]
}
```

**Behavior**:
- Validates URL format (must start with http:// or https://)
- Generates UUID for each link
- Opens links in new browser tab
- Persists after each modification
- Loads from Local Storage on init
- Displays title and URL in UI

### 5. Theme Manager

**Responsibility**: Handle light/dark theme switching and persistence

**Interface**:
```javascript
const ThemeManager = {
  init(),           // Load theme preference and apply
  toggle(),         // Switch between light and dark
  setTheme(theme),  // Apply specific theme
  getTheme(),       // Get current theme
  saveTheme()       // Persist to Local Storage
}
```

**Data Structure**:
```javascript
{
  currentTheme: "light",  // "light" or "dark"
  defaultTheme: "light"
}
```

**Behavior**:
- Defaults to light theme if no preference stored
- Applies CSS class to document root
- Persists preference to Local Storage
- Toggles between light and dark on button click
- Applies theme on page load

### 6. Input Validator

**Responsibility**: Sanitize and validate all user inputs

**Interface**:
```javascript
const InputValidator = {
  sanitizeText(input),      // Remove XSS vectors
  validateTaskText(text),   // Check task input
  validateUrl(url),         // Check URL format
  validateName(name),       // Check custom name
  trimInput(input)          // Remove leading/trailing whitespace
}
```

**Validation Rules**:
- Task text: Non-empty after trim, max 500 characters
- URL: Valid format (http:// or https://), max 2048 characters
- Custom name: Alphanumeric + common punctuation, max 50 characters
- All inputs: Sanitize HTML/script tags

**Behavior**:
- Trims whitespace from all inputs
- Rejects empty strings
- Prevents injection attacks via HTML escaping
- Provides clear error messages

## Data Models

### Task Object

```javascript
{
  id: String,              // UUID v4
  text: String,            // Task description (1-500 chars)
  completed: Boolean,      // Completion status
  createdAt: Number        // Timestamp in milliseconds
}
```

### Quick Link Object

```javascript
{
  id: String,              // UUID v4
  title: String,           // Link display name (1-100 chars)
  url: String              // Full URL (http:// or https://)
}
```

### Theme Preference

```javascript
String: "light" | "dark"
```

### Custom Name

```javascript
String: User's custom name (1-50 chars)
```

## HTML Structure

### Semantic Organization

```html
<body>
  <header>
    <!-- Greeting and time display -->
    <!-- Theme toggle -->
  </header>

  <main>
    <section id="greeting-section">
      <!-- Time, date, greeting -->
    </section>

    <section id="timer-section">
      <!-- Focus timer display and controls -->
    </section>

    <section id="tasks-section">
      <!-- Task input and task list -->
    </section>

    <section id="links-section">
      <!-- Quick link input and link list -->
    </section>
  </main>

  <footer>
    <!-- Optional: attribution, version info -->
  </footer>
</body>
```

### Key Elements

- `#greeting-display`: Time and greeting text
- `#timer-display`: MM:SS countdown
- `#timer-controls`: Start, Stop, Reset buttons
- `#task-input`: Text input for new tasks
- `#task-list`: Container for task items
- `#link-input-title`: Title input for quick links
- `#link-input-url`: URL input for quick links
- `#link-list`: Container for link items
- `#theme-toggle`: Button to switch themes

## CSS Organization

### File Structure

```css
/* 1. CSS Variables (Theme colors, spacing, typography) */
:root {
  --color-primary: #2563eb;
  --color-background: #ffffff;
  --color-text: #1f2937;
  --spacing-unit: 8px;
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

[data-theme="dark"] {
  --color-background: #1f2937;
  --color-text: #f3f4f6;
}

/* 2. Reset and Base Styles */
* { box-sizing: border-box; }
body { margin: 0; padding: 0; }

/* 3. Layout (Grid, Flexbox) */
body { display: grid; grid-template-rows: auto 1fr auto; }
main { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }

/* 4. Component Styles */
.section { padding: var(--spacing-unit) * 3; }
.button { padding: var(--spacing-unit) * 2; }
.input { padding: var(--spacing-unit) * 1.5; }

/* 5. Responsive Breakpoints */
@media (max-width: 768px) { /* Tablet */ }
@media (max-width: 480px) { /* Mobile */ }

/* 6. Utility Classes */
.hidden { display: none; }
.disabled { opacity: 0.5; cursor: not-allowed; }
```

### Theme Variables

```css
Light Theme:
  --color-background: #ffffff
  --color-surface: #f9fafb
  --color-text: #1f2937
  --color-text-secondary: #6b7280
  --color-border: #e5e7eb
  --color-primary: #2563eb
  --color-success: #10b981
  --color-error: #ef4444

Dark Theme:
  --color-background: #1f2937
  --color-surface: #111827
  --color-text: #f3f4f6
  --color-text-secondary: #d1d5db
  --color-border: #374151
  --color-primary: #3b82f6
  --color-success: #34d399
  --color-error: #f87171
```

## JavaScript Architecture

### Module Pattern

```javascript
const ModuleName = {
  // Private state
  state: { /* ... */ },

  // Initialization
  init() {
    this.loadFromStorage();
    this.setupEventListeners();
    this.render();
  },

  // Public methods
  publicMethod() { /* ... */ },

  // Private methods
  _privateMethod() { /* ... */ },

  // Storage operations
  _saveToStorage() { /* ... */ },
  _loadFromStorage() { /* ... */ },

  // DOM operations
  _render() { /* ... */ },
  _setupEventListeners() { /* ... */ }
};
```

### Utility Functions

```javascript
// UUID generation
function generateUUID() { /* ... */ }

// Local Storage helpers
function getFromStorage(key) { /* ... */ }
function saveToStorage(key, data) { /* ... */ }

// DOM helpers
function createElement(tag, className, content) { /* ... */ }
function setAttributes(element, attrs) { /* ... */ }

// Debounce/Throttle
function debounce(func, delay) { /* ... */ }
function throttle(func, delay) { /* ... */ }
```

### Event Handling Pattern

```javascript
// Event delegation for dynamic elements
document.addEventListener('click', (e) => {
  if (e.target.matches('.task-delete-btn')) {
    TodoModule.deleteTask(e.target.dataset.taskId);
  }
});

// Direct listeners for static elements
document.getElementById('timer-start').addEventListener('click', () => {
  FocusTimerModule.start();
});
```

## Local Storage Key Naming

```
pd_tasks              // Task list (JSON array)
pd_quickLinks         // Quick links (JSON array)
pd_theme              // Theme preference (string)
pd_customName         // Custom greeting name (string)
```

**Rationale**: "pd_" prefix prevents collisions with other applications using Local Storage.

## Performance Considerations

### DOM Updates

- **Batch Updates**: Collect multiple DOM changes and apply together
- **Debouncing**: Debounce input validation (300ms delay)
- **Throttling**: Throttle scroll/resize events if needed
- **Minimal Reflows**: Use CSS classes instead of inline styles

### Efficient Rendering

```javascript
// Bad: Multiple DOM updates
for (let task of tasks) {
  list.appendChild(createTaskElement(task));
}

// Good: Single DOM update
const fragment = document.createDocumentFragment();
for (let task of tasks) {
  fragment.appendChild(createTaskElement(task));
}
list.appendChild(fragment);
```

### Timer Optimization

- Use `setInterval` for timer updates (not recursive setTimeout)
- Clear interval on stop/reset
- Update display only when seconds change

### Storage Optimization

- Debounce storage writes (don't save on every keystroke)
- Use JSON.stringify/parse efficiently
- Limit stored data size (tasks, links, preferences only)

## Error Handling

### User-Facing Errors

```javascript
function showError(message, duration = 3000) {
  const errorEl = document.createElement('div');
  errorEl.className = 'error-message';
  errorEl.textContent = message;
  document.body.appendChild(errorEl);
  
  setTimeout(() => errorEl.remove(), duration);
}
```

### Error Scenarios

1. **Invalid Input**: Display inline error message, prevent action
2. **Storage Full**: Warn user, suggest clearing old data
3. **Invalid URL**: Show validation error, highlight input
4. **Duplicate Task**: Show error message, clear input
5. **Timer Overflow**: Reset to 25 minutes, show notification

### Graceful Degradation

- If Local Storage unavailable: Show warning, allow session-only use
- If timer fails: Show error, allow manual reset
- If theme fails: Default to light theme

## Testing Strategy

### Unit Testing Approach

Unit tests verify specific examples, edge cases, and error conditions:

1. **Greeting Module Tests**
   - Verify correct greeting for each time range
   - Test custom name appending
   - Test time formatting

2. **Timer Module Tests**
   - Verify countdown accuracy
   - Test start/stop/reset functionality
   - Test button state changes

3. **Task Module Tests**
   - Test task creation and deletion
   - Test duplicate detection
   - Test completion toggle
   - Test Local Storage persistence

4. **Quick Links Module Tests**
   - Test URL validation
   - Test link creation and deletion
   - Test Local Storage persistence

5. **Input Validator Tests**
   - Test sanitization of HTML/script tags
   - Test whitespace trimming
   - Test empty input rejection
   - Test URL format validation

6. **Theme Manager Tests**
   - Test theme toggle
   - Test theme persistence
   - Test CSS class application

### Property-Based Testing Approach

Property-based tests verify universal properties across all inputs using randomization.

## Acceptance Criteria Analysis

Before writing correctness properties, I need to analyze which acceptance criteria are testable as properties, examples, or edge cases.


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Greeting Logic Correctness

*For any* hour value between 5 and 11 (inclusive), the greeting should be "Good Morning"; for hours 12-16, "Good Afternoon"; for hours 17-23, "Good Evening"; for hours 0-4, "Good Night".

**Validates: Requirements 1.3, 1.4, 1.5, 1.6**

### Property 2: Custom Name Appending

*For any* custom name stored in the system, the greeting display should include the name in the format "Good [TimeOfDay], [Name]".

**Validates: Requirements 1.7, 1.9**

### Property 3: Time Display Format

*For any* current time, the displayed time should match the HH:MM format where HH is 00-23 and MM is 00-59.

**Validates: Requirements 1.1**

### Property 4: Date Display Format

*For any* current date, the displayed date should contain the day name, month name, day number, and year in a readable format.

**Validates: Requirements 1.2**

### Property 5: Timer Initialization

*For any* fresh timer instance, the initial display should show "25:00" and the internal state should be 1500 seconds.

**Validates: Requirements 2.1, 2.8**

### Property 6: Timer Countdown Accuracy

*For any* running timer, after one second passes, the remaining seconds should decrease by exactly 1 and the display should update accordingly.

**Validates: Requirements 2.2, 2.8**

### Property 7: Timer Start Disables Button

*For any* timer in running state, the Start button should be disabled and the Stop button should be enabled.

**Validates: Requirements 2.3**

### Property 8: Timer Stop Pauses Countdown

*For any* running timer, after clicking Stop, the remaining seconds should not change on subsequent ticks.

**Validates: Requirements 2.4**

### Property 9: Timer Stop Enables Button

*For any* paused timer, the Start button should be enabled.

**Validates: Requirements 2.5**

### Property 10: Timer Reset Returns to 25 Minutes

*For any* timer in any state, after clicking Reset, the display should show "25:00" and internal state should be 1500 seconds.

**Validates: Requirements 2.6**

### Property 11: Task List Displays All Tasks

*For any* set of tasks stored in the system, all tasks should appear in the DOM with their completion status correctly reflected.

**Validates: Requirements 3.1**

### Property 12: Task Addition Grows List

*For any* task list and valid task description, adding the task should result in the task appearing in the list and the list length increasing by 1.

**Validates: Requirements 3.2**

### Property 13: Duplicate Task Prevention

*For any* task list containing a task with text T, attempting to add another task with identical text (case-insensitive) should be rejected and an error message should be displayed.

**Validates: Requirements 3.3**

### Property 14: Task Edit Updates Description

*For any* task with original text T1, after editing to new text T2 and confirming, the task should display T2 in the list.

**Validates: Requirements 3.5**

### Property 15: Task Completion Toggle

*For any* task, clicking the completion checkbox should toggle its completed state and apply strikethrough styling when completed.

**Validates: Requirements 3.6, 3.10**

### Property 16: Task Deletion Removes from List

*For any* task in the list, clicking Delete should remove the task from the DOM and decrease list length by 1.

**Validates: Requirements 3.7**

### Property 17: Task Persistence Round Trip

*For any* task added to the list, after saving to Local Storage and reloading, the task should be restored with identical text and completion status.

**Validates: Requirements 3.8, 3.9**

### Property 18: Quick Links Display All Links

*For any* set of links stored in the system, all links should appear in the DOM with their titles and URLs correctly displayed.

**Validates: Requirements 4.1**

### Property 19: Quick Link Addition

*For any* valid link title and URL, adding the link should result in the link appearing in the list.

**Validates: Requirements 4.2**

### Property 20: Quick Link Deletion

*For any* link in the list, clicking Delete should remove the link from the DOM.

**Validates: Requirements 4.4**

### Property 21: Quick Link Persistence Round Trip

*For any* link added to the list, after saving to Local Storage and reloading, the link should be restored with identical title and URL.

**Validates: Requirements 4.5, 4.6**

### Property 22: URL Validation Rejects Invalid Formats

*For any* URL string that does not start with "http://" or "https://", the validator should reject it and an error message should be displayed.

**Validates: Requirements 4.7, 8.3, 8.4**

### Property 23: Theme Toggle Switches State

*For any* current theme, clicking the Theme Toggle should switch to the opposite theme (light ↔ dark).

**Validates: Requireme
nts 5.2**

### Property 24: Light Theme Styling

*For any* dashboard in Light theme, the CSS variables should set light background colors with dark text (background should be light, text should be dark).

**Validates: Requirements 5.3**

### Property 25: Dark Theme Styling

*For any* dashboard in Dark theme, the CSS variables should set dark background colors with light text (background should be dark, text should be light).

**Validates: Requirements 5.4**

### Property 26: Theme Persistence Round Trip

*For any* theme preference set by the user, after saving to Local Storage and reloading, the same theme should be applied.

**Validates: Requirements 5.5, 5.6**

### Property 27: Default Theme is Light

*For any* fresh dashboard with no stored theme preference, the applied theme should be Light.

**Validates: Requirements 5.7**

### Property 28: Responsive Layout at Multiple Viewports

*For any* viewport width from 320px to 2560px, the dashboard should display without horizontal scrolling and all sections should be visible and readable.

**Validates: Requirements 6.3**

### Property 29: Input Whitespace Trimming

*For any* task or name input with leading/trailing whitespace, after trimming, the whitespace should be removed while preserving internal spaces.

**Validates: Requirements 8.1**

### Property 30: Empty Input Rejection

*For any* input that is empty or contains only whitespace characters, the system should reject it and display an error message.

**Validates: Requirements 8.2**

### Property 31: XSS Prevention via Sanitization

*For any* user input containing HTML tags or script content (e.g., "<script>", "<img onerror>"), the sanitized output should not contain executable script tags or event handlers.

**Validates: Requirements 8.6**

### Property 32: Name Validation Accepts Valid Characters

*For any* name input containing only alphanumeric characters and common punctuation (spaces, hyphens, apostrophes, periods), the input should be accepted.

**Validates: Requirements 8.5**

### Property 33: Error Messages Display Clearly

*For any* validation error or system error, an error message should be displayed in a visible manner (not hidden, with appropriate styling) and should contain descriptive text about the error.

**Validates: Requirements 7.6**

## Error Handling

### Input Validation Errors

- **Empty Task**: "Task description cannot be empty"
- **Duplicate Task**: "This task already exists in your list"
- **Invalid URL**: "URL must start with http:// or https://"
- **Empty Link Title**: "Link title cannot be empty"

### System Errors

- **Storage Full**: "Local Storage is full. Please delete some items."
- **Storage Unavailable**: "Local Storage is not available. Changes will not be saved."
- **Timer Error**: "Timer error occurred. Please refresh the page."

### Error Display

- Errors appear in a dismissible notification at the top of the page
- Auto-dismiss after 3-5 seconds or on user action
- Use distinct color (red/error color) for visibility
- Include clear, actionable error message text

## Testing Strategy

### Unit Testing Approach

Unit tests verify specific examples, edge cases, and error conditions:

**Greeting Module Tests**
- Test greeting for each time range (5-11, 12-16, 17-23, 0-4)
- Test custom name appending with various names
- Test time formatting with edge cases (midnight, noon)
- Test date formatting with different dates

**Focus Timer Module Tests**
- Test timer initialization to 25:00
- Test countdown from various starting points
- Test start/stop/reset button state changes
- Test timer completion notification
- Test display format MM:SS

**Task Module Tests**
- Test adding valid tasks
- Test duplicate detection (case-insensitive)
- Test task editing and confirmation
- Test task completion toggle with strikethrough
- Test task deletion
- Test Local Storage persistence and loading
- Test empty/whitespace input rejection

**Quick Links Module Tests**
- Test adding valid links with http:// and https://
- Test URL validation rejection of invalid formats
- Test link deletion
- Test Local Storage persistence and loading
- Test link opening in new tab

**Theme Manager Tests**
- Test theme toggle between light and dark
- Test CSS class application for each theme
- Test theme persistence to Local Storage
- Test default theme (light) when no preference stored

**Input Validator Tests**
- Test whitespace trimming from inputs
- Test empty input rejection
- Test HTML/script tag sanitization
- Test URL format validation
- Test name validation with alphanumeric and punctuation

### Property-Based Testing Approach

Property-based tests verify universal properties across all inputs using randomization. Each property test should:

1. Generate random valid inputs (tasks, links, names, times, etc.)
2. Execute the operation being tested
3. Verify the property holds for all generated inputs
4. Run minimum 100 iterations per test

**Property Test Configuration**

Each property-based test must:
- Reference the corresponding design property
- Use tag format: `Feature: productivity-dashboard, Property {number}: {property_text}`
- Run minimum 100 iterations
- Use appropriate generators for random data:
  - Random task descriptions (1-500 chars, alphanumeric + punctuation)
  - Random URLs (valid http/https formats)
  - Random names (1-50 chars, alphanumeric + punctuation)
  - Random hours (0-23)
  - Random viewport widths (320-2560px)

**Example Property Test Structure**

```javascript
// Feature: productivity-dashboard, Property 12: Task Addition Grows List
describe('Task Addition Grows List', () => {
  it('should increase list length by 1 when adding valid task', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 500 }), (taskText) => {
        const initialLength = todoModule.tasks.length;
        todoModule.addTask(taskText);
        expect(todoModule.tasks.length).toBe(initialLength + 1);
      }),
      { numRuns: 100 }
    );
  });
});
```

### Dual Testing Coverage

- **Unit tests**: Catch concrete bugs, test specific examples and edge cases
- **Property tests**: Verify general correctness across all inputs, catch systematic issues
- **Together**: Comprehensive coverage ensuring both correctness and robustness

### Test Organization

- Unit tests in `tests/unit/` directory
- Property tests in `tests/properties/` directory
- Test files mirror source structure
- Each module has corresponding test file
