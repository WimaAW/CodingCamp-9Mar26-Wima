# Implementation Plan: Productivity Dashboard

## Overview

This implementation plan breaks down the Productivity Dashboard into discrete, manageable coding tasks. The dashboard will be built as a single-page application with vanilla HTML, CSS, and JavaScript, featuring modular architecture with separate concerns for Greeting, Timer, Tasks, Links, and Theme management. All data persists to Local Storage, and the interface is responsive across 320px to 2560px viewports.

## Tasks

- [x] 1. Set up project structure and HTML foundation
  - Create single HTML file with semantic structure
  - Define all major sections (header, main, footer)
  - Create placeholder elements for Greeting, Timer, Tasks, Links sections
  - Set up basic meta tags and viewport configuration
  - _Requirements: 6.4, 6.5, 6.6, 7.1_

- [x] 2. Implement CSS styling with theme support
  - [x] 2.1 Create CSS file with base styles and layout
    - Define CSS variables for light and dark themes
    - Implement responsive grid/flexbox layout
    - Set up typography, spacing, and color system
    - _Requirements: 5.3, 5.4, 6.3, 6.4, 7.2_
  
  - [x] 2.2 Implement responsive design for 320px to 2560px viewports
    - Add media queries for mobile (320-480px), tablet (481-768px), desktop (769px+)
    - Test layout at breakpoints
    - _Requirements: 6.3, 7.2_
  
  - [ ] 2.3 Write property test for responsive layout
    - **Property 28: Responsive Layout at Multiple Viewports**
    - **Validates: Requirements 6.3**

- [-] 3. Implement Greeting Module
  - [x] 3.1 Create Greeting Module with time and date display
    - Implement time formatting (HH:MM)
    - Implement date formatting (Day, Month DD, YYYY)
    - Set up minute-based update interval
    - _Requirements: 1.1, 1.2, 1.8_
  
  - [x] 3.2 Implement greeting logic based on time of day
    - Implement getGreeting(hour) function with four time ranges
    - Map hours 5-11 to "Good Morning"
    - Map hours 12-16 to "Good Afternoon"
    - Map hours 17-23 to "Good Evening"
    - Map hours 0-4 to "Good Night"
    - _Requirements: 1.3, 1.4, 1.5, 1.6_
  
  - [x] 3.3 Implement custom name storage and display
    - Add setCustomName(name) method
    - Add getCustomName() method
    - Load custom name from Local Storage on init
    - Append name to greeting display (e.g., "Good Morning, Alex")
    - _Requirements: 1.7, 1.9_
  
  - [x] 3.4 Write property tests for Greeting Module
    - **Property 1: Greeting Logic Correctness**
    - **Validates: Requirements 1.3, 1.4, 1.5, 1.6**
    - **Property 2: Custom Name Appending**
    - **Validates: Requirements 1.7, 1.9**
    - **Property 3: Time Display Format**
    - **Validates: Requirements 1.1**
    - **Property 4: Date Display Format**
    - **Validates: Requirements 1.2**

- [-] 4. Implement Focus Timer Module
  - [x] 4.1 Create Focus Timer Module with initialization and display
    - Initialize timer to 1500 seconds (25 minutes)
    - Implement MM:SS display format
    - Create Start, Stop, Reset button elements
    - _Requirements: 2.1, 2.8_
  
  - [x] 4.2 Implement timer countdown logic
    - Implement start() method to begin countdown
    - Implement tick() method to decrement by 1 second
    - Implement updateDisplay() method to update MM:SS
    - Use setInterval for consistent updates
    - _Requirements: 2.2, 2.9_
  
  - [ ] 4.3 Implement timer control state management
    - Disable Start button while timer is running
    - Enable Start button when timer is paused
    - Implement stop() method to pause countdown
    - Implement reset() method to return to 25:00
    - _Requirements: 2.3, 2.4, 2.5, 2.6_
  
  - [ ] 4.4 Implement timer completion notification
    - Auto-stop timer when reaching 0 seconds
    - Display completion notification/alert
    - _Requirements: 2.7_
  
  - [ ] 4.5 Write property tests for Focus Timer Module
    - **Property 5: Timer Initialization**
    - **Validates: Requirements 2.1, 2.8**
    - **Property 6: Timer Countdown Accuracy**
    - **Validates: Requirements 2.2, 2.8**
    - **Property 7: Timer Start Disables Button**
    - **Validates: Requirements 2.3**
    - **Property 8: Timer Stop Pauses Countdown**
    - **Validates: Requirements 2.4**
    - **Property 9: Timer Stop Enables Button**
    - **Validates: Requirements 2.5**
    - **Property 10: Timer Reset Returns to 25 Minutes**
    - **Validates: Requirements 2.6**

- [-] 5. Implement Input Validator Module
  - [ ] 5.1 Create Input Validator with sanitization functions
    - Implement sanitizeText(input) to remove HTML/script tags
    - Implement trimInput(input) to remove leading/trailing whitespace
    - Implement validateTaskText(text) with length and content checks
    - _Requirements: 8.1, 8.6_
  
  - [ ] 5.2 Implement URL and name validation
    - Implement validateUrl(url) to check http:// or https:// prefix
    - Implement validateName(name) to accept alphanumeric and punctuation
    - _Requirements: 8.3, 8.4, 8.5_
  
  - [ ] 5.3 Write property tests for Input Validator
    - **Property 29: Input Whitespace Trimming**
    - **Validates: Requirements 8.1**
    - **Property 30: Empty Input Rejection**
    - **Validates: Requirements 8.2**
    - **Property 31: XSS Prevention via Sanitization**
    - **Validates: Requirements 8.6**
    - **Property 32: Name Validation Accepts Valid Characters**
    - **Validates: Requirements 8.5**

- [-] 6. Implement To-Do List Module
  - [ ] 6.1 Create To-Do List Module with task data structure
    - Define task object structure (id, text, completed, createdAt)
    - Implement init() to load tasks from Local Storage
    - Implement renderTasks() to display all tasks in DOM
    - _Requirements: 3.1, 3.9_
  
  - [ ] 6.2 Implement task addition with duplicate detection
    - Implement addTask(text) method
    - Implement isDuplicate(text) for case-insensitive comparison
    - Display error message for duplicates
    - Generate UUID for each new task
    - _Requirements: 3.2, 3.3_
  
  - [ ] 6.3 Implement task editing functionality
    - Implement editTask(id, newText) method
    - Support inline editing with confirmation
    - Update task description in DOM and storage
    - _Requirements: 3.4, 3.5_
  
  - [ ] 6.4 Implement task completion toggle and deletion
    - Implement toggleTask(id) to mark complete/incomplete
    - Apply strikethrough styling to completed tasks
    - Implement deleteTask(id) method
    - _Requirements: 3.6, 3.7, 3.10_
  
  - [ ] 6.5 Implement task persistence to Local Storage
    - Implement saveTasks() method
    - Save after each modification (add, edit, toggle, delete)
    - _Requirements: 3.8_
  
  - [ ] 6.6 Write property tests for To-Do List Module
    - **Property 11: Task List Displays All Tasks**
    - **Validates: Requirements 3.1**
    - **Property 12: Task Addition Grows List**
    - **Validates: Requirements 3.2**
    - **Property 13: Duplicate Task Prevention**
    - **Validates: Requirements 3.3**
    - **Property 14: Task Edit Updates Description**
    - **Validates: Requirements 3.5**
    - **Property 15: Task Completion Toggle**
    - **Validates: Requirements 3.6, 3.10**
    - **Property 16: Task Deletion Removes from List**
    - **Validates: Requirements 3.7**
    - **Property 17: Task Persistence Round Trip**
    - **Validates: Requirements 3.8, 3.9**

- [-] 7. Implement Quick Links Module
  - [ ] 7.1 Create Quick Links Module with link data structure
    - Define link object structure (id, title, url)
    - Implement init() to load links from Local Storage
    - Implement renderLinks() to display all links in DOM
    - _Requirements: 4.1, 4.6_
  
  - [ ] 7.2 Implement link addition with URL validation
    - Implement addLink(title, url) method
    - Use InputValidator.validateUrl() for validation
    - Display error message for invalid URLs
    - Generate UUID for each new link
    - _Requirements: 4.2, 4.7_
  
  - [ ] 7.3 Implement link opening and deletion
    - Implement openLink(url) to open in new tab
    - Implement deleteLink(id) method
    - _Requirements: 4.3, 4.4_
  
  - [ ] 7.4 Implement link persistence to Local Storage
    - Implement saveLinks() method
    - Save after each modification (add, delete)
    - _Requirements: 4.5_
  
  - [ ] 7.5 Write property tests for Quick Links Module
    - **Property 18: Quick Links Display All Links**
    - **Validates: Requirements 4.1**
    - **Property 19: Quick Link Addition**
    - **Validates: Requirements 4.2**
    - **Property 20: Quick Link Deletion**
    - **Validates: Requirements 4.4**
    - **Property 21: Quick Link Persistence Round Trip**
    - **Validates: Requirements 4.5, 4.6**
    - **Property 22: URL Validation Rejects Invalid Formats**
    - **Validates: Requirements 4.7, 8.3, 8.4**

- [-] 8. Implement Theme Manager
  - [ ] 8.1 Create Theme Manager with light/dark theme support
    - Define theme state (currentTheme, defaultTheme)
    - Implement init() to load theme from Local Storage
    - Implement setTheme(theme) to apply CSS class to document root
    - Default to light theme if no preference stored
    - _Requirements: 5.1, 5.6, 5.7_
  
  - [ ] 8.2 Implement theme toggle functionality
    - Implement toggle() method to switch between light and dark
    - Implement getTheme() to return current theme
    - _Requirements: 5.2_
  
  - [ ] 8.3 Implement theme persistence to Local Storage
    - Implement saveTheme() method
    - Save after each toggle
    - _Requirements: 5.5_
  
  - [ ] 8.4 Write property tests for Theme Manager
    - **Property 23: Theme Toggle Switches State**
    - **Validates: Requirements 5.2**
    - **Property 24: Light Theme Styling**
    - **Validates: Requirements 5.3**
    - **Property 25: Dark Theme Styling**
    - **Validates: Requirements 5.4**
    - **Property 26: Theme Persistence Round Trip**
    - **Validates: Requirements 5.5, 5.6**
    - **Property 27: Default Theme is Light**
    - **Validates: Requirements 5.7**

- [-] 9. Implement error handling and user feedback
  - [ ] 9.1 Create error display system
    - Implement showError(message, duration) function
    - Display errors in visible notification area
    - Auto-dismiss after 3-5 seconds
    - Use distinct error styling (red/error color)
    - _Requirements: 7.6, 8.2, 8.3, 8.4_
  
  - [ ] 9.2 Implement validation error messages
    - Display "Task description cannot be empty" for empty tasks
    - Display "This task already exists" for duplicates
    - Display "URL must start with http:// or https://" for invalid URLs
    - Display "Link title cannot be empty" for empty titles
    - _Requirements: 8.2, 8.3, 8.4_
  
  - [ ] 9.3 Write property test for error message display
    - **Property 33: Error Messages Display Clearly**
    - **Validates: Requirements 7.6**

- [-] 10. Implement event handling and DOM integration
  - [ ] 10.1 Set up event listeners for all interactive elements
    - Add click listeners for timer controls (Start, Stop, Reset)
    - Add click listeners for task actions (Add, Edit, Delete, Toggle)
    - Add click listeners for link actions (Add, Delete, Open)
    - Add click listener for theme toggle
    - _Requirements: 3.2, 3.4, 3.6, 3.7, 4.2, 4.3, 4.4, 5.2_
  
  - [ ] 10.2 Implement input handling for task and link creation
    - Add input listeners for task text field
    - Add input listeners for link title and URL fields
    - Add input listeners for custom name field
    - Trigger validation on input
    - _Requirements: 3.2, 4.2, 1.7_
  
  - [ ] 10.3 Wire all modules together
    - Initialize all modules on page load
    - Ensure modules communicate through shared state
    - Test that all interactions flow correctly
    - _Requirements: 6.5, 6.6_

- [x] 11. Checkpoint - Ensure all core functionality works
  - Verify all modules initialize correctly
  - Test all user interactions (add, edit, delete, toggle, timer, theme)
  - Verify Local Storage persistence across page reloads
  - Ensure error messages display correctly
  - Ask the user if questions arise

- [ ] 12. Implement utility functions and helpers
  - [ ] 12.1 Create UUID generation function
    - Implement generateUUID() for unique task and link IDs
    - _Requirements: 3.2, 4.2_
  
  - [ ] 12.2 Create Local Storage helper functions
    - Implement getFromStorage(key) with error handling
    - Implement saveToStorage(key, data) with error handling
    - Handle storage full scenarios
    - _Requirements: 3.8, 3.9, 4.5, 4.6, 5.5, 5.6_
  
  - [ ] 12.3 Create DOM helper functions
    - Implement createElement(tag, className, content)
    - Implement setAttributes(element, attrs)
    - _Requirements: 6.5_
  
  - [ ] 12.4 Create debounce/throttle utilities
    - Implement debounce(func, delay) for input validation
    - Implement throttle(func, delay) if needed for scroll/resize
    - _Requirements: 6.2_

- [ ] 13. Implement performance optimizations
  - [ ] 13.1 Optimize DOM updates
    - Use DocumentFragment for batch task/link rendering
    - Minimize reflows by batching style changes
    - Use CSS classes instead of inline styles
    - _Requirements: 6.2_
  
  - [ ] 13.2 Optimize timer performance
    - Use single setInterval for timer updates
    - Clear interval on stop/reset
    - Update display only when seconds change
    - _Requirements: 2.9, 6.2_
  
  - [ ] 13.3 Optimize storage operations
    - Debounce storage writes (300ms delay)
    - Avoid saving on every keystroke
    - Batch multiple changes before saving
    - _Requirements: 6.2_

- [ ] 14. Implement accessibility and visual feedback
  - [ ] 14.1 Add visual feedback for user interactions
    - Implement button hover states
    - Implement button active states
    - Implement input focus states
    - Implement disabled state styling
    - _Requirements: 7.5_
  
  - [ ] 14.2 Ensure semantic HTML and ARIA attributes
    - Use semantic HTML elements (button, input, section, etc.)
    - Add aria-labels where needed
    - Ensure keyboard navigation works
    - _Requirements: 7.1, 7.4_

- [ ] 15. Final integration and testing
  - [ ] 15.1 Test all features end-to-end
    - Test greeting updates every minute
    - Test timer countdown and completion
    - Test task CRUD operations
    - Test link CRUD operations
    - Test theme toggle and persistence
    - Test responsive layout at multiple viewports
    - _Requirements: 1.8, 2.2, 2.9, 3.1-3.10, 4.1-4.7, 5.1-5.7, 6.3_
  
  - [ ] 15.2 Test Local Storage persistence
    - Verify all data persists across page reloads
    - Test with multiple browser tabs
    - Test storage full scenarios
    - _Requirements: 3.8, 3.9, 4.5, 4.6, 5.5, 5.6_
  
  - [ ] 15.3 Test error handling and edge cases
    - Test empty input rejection
    - Test duplicate task prevention
    - Test invalid URL rejection
    - Test invalid name input
    - _Requirements: 8.1-8.6_

- [ ] 16. Final checkpoint - Ensure all tests pass
  - Ensure all unit tests pass
  - Ensure all property-based tests pass (minimum 100 iterations each)
  - Verify no console errors or warnings
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional property-based tests and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints (tasks 11 and 16) ensure incremental validation
- Property tests validate universal correctness properties across all inputs
- Unit tests validate specific examples and edge cases
- All code must be vanilla JavaScript with no external dependencies
- Single HTML, CSS, and JS file structure as per requirements
- Local Storage key prefix: "pd_" to prevent collisions
