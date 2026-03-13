# Manual Testing Guide - Productivity Dashboard Checkpoint

This guide provides step-by-step instructions to manually verify all core functionality of the Productivity Dashboard.

## Prerequisites
- Open `index.html` in a modern web browser (Chrome, Firefox, Safari, or Edge)
- Open browser Developer Tools (F12 or Cmd+Option+I)
- Go to the Console tab to check for any errors

## Test Scenarios

### Test 1: Module Initialization
**Objective**: Verify all modules initialize correctly on page load

**Steps**:
1. Open `index.html` in browser
2. Check the page displays without errors
3. Verify the following elements are visible:
   - Current time in HH:MM format (top left)
   - Current date in readable format
   - "Good [TimeOfDay]" greeting
   - Timer display showing "25:00"
   - Task input field and "Add Task" button
   - Quick Links input fields and "Add Link" button
   - Theme toggle button (moon icon for light theme)

**Expected Result**: All elements display correctly, no console errors

---

### Test 2: Greeting Module - Time and Date Display
**Objective**: Verify time and date display functionality

**Steps**:
1. Note the current time displayed
2. Wait 1 minute
3. Verify the time has updated
4. Check the date format includes: Day name, Month name, Date number, Year

**Expected Result**: Time updates every minute, date displays in correct format

---

### Test 3: Greeting Module - Time-Based Greetings
**Objective**: Verify greeting changes based on time of day

**Steps**:
1. Check the greeting displayed (Good Morning, Good Afternoon, Good Evening, or Good Night)
2. Verify it matches the current time:
   - 5-11 AM: "Good Morning"
   - 12-4 PM: "Good Afternoon"
   - 5-11 PM: "Good Evening"
   - 12-4 AM: "Good Night"

**Expected Result**: Greeting matches current time of day

---

### Test 4: Greeting Module - Custom Name
**Objective**: Verify custom name functionality

**Steps**:
1. Locate the "Enter your name (optional)" input field
2. Type a name (e.g., "Alex")
3. Click "Save Name" button
4. Verify the greeting now displays: "Good [TimeOfDay], Alex"
5. Refresh the page
6. Verify the name persists and greeting still shows the name

**Expected Result**: Custom name appends to greeting and persists across page reloads

---

### Test 5: Focus Timer - Initialization
**Objective**: Verify timer initializes correctly

**Steps**:
1. Check the timer display shows "25:00"
2. Verify "Start" button is enabled
3. Verify "Stop" button is disabled
4. Verify "Reset" button is enabled

**Expected Result**: Timer shows 25:00 with correct button states

---

### Test 6: Focus Timer - Start/Stop/Reset
**Objective**: Verify timer controls work correctly

**Steps**:
1. Click "Start" button
2. Verify timer begins counting down (display changes)
3. Verify "Start" button becomes disabled
4. Verify "Stop" button becomes enabled
5. Wait a few seconds
6. Click "Stop" button
7. Verify timer stops counting
8. Verify "Start" button becomes enabled
9. Click "Reset" button
10. Verify timer returns to "25:00"

**Expected Result**: Timer controls work correctly, button states update appropriately

---

### Test 7: Focus Timer - Completion
**Objective**: Verify timer completion notification

**Steps**:
1. Set timer to a low value (for testing, manually set `FocusTimerModule.state.remainingSeconds = 5` in console)
2. Click "Start"
3. Wait for timer to reach 0
4. Verify a notification appears saying "Focus session complete! Great work! 🎉"
5. Verify timer stops automatically

**Expected Result**: Notification displays when timer reaches 0, timer stops automatically

---

### Test 8: To-Do List - Add Task
**Objective**: Verify task addition functionality

**Steps**:
1. Type "Buy groceries" in the task input field
2. Click "Add Task" button
3. Verify task appears in the list below
4. Verify input field is cleared
5. Add another task: "Complete project"
6. Verify both tasks appear in the list

**Expected Result**: Tasks are added to the list and input is cleared

---

### Test 9: To-Do List - Duplicate Prevention
**Objective**: Verify duplicate task prevention

**Steps**:
1. Type "Buy groceries" in the task input
2. Click "Add Task"
3. Type "Buy groceries" again (same text)
4. Click "Add Task"
5. Verify an error message appears: "This task already exists in your list"
6. Verify only one "Buy groceries" task exists in the list
7. Wait 3 seconds
8. Verify error message disappears

**Expected Result**: Duplicate task is rejected with error message

---

### Test 10: To-Do List - Toggle Completion
**Objective**: Verify task completion toggle

**Steps**:
1. Add a task: "Test task"
2. Click the checkbox next to the task
3. Verify the task text shows strikethrough styling
4. Click the checkbox again
5. Verify the strikethrough is removed

**Expected Result**: Checkbox toggles completion status with visual feedback

---

### Test 11: To-Do List - Edit Task
**Objective**: Verify task editing functionality

**Steps**:
1. Add a task: "Original task"
2. Click the "Edit" button next to the task
3. A prompt appears with the current task text
4. Change the text to "Updated task"
5. Click OK
6. Verify the task text in the list has changed to "Updated task"

**Expected Result**: Task text is updated in the list

---

### Test 12: To-Do List - Delete Task
**Objective**: Verify task deletion functionality

**Steps**:
1. Add a task: "Task to delete"
2. Click the "Delete" button next to the task
3. Verify the task is removed from the list
4. Verify the list updates correctly

**Expected Result**: Task is removed from the list

---

### Test 13: Quick Links - Add Link
**Objective**: Verify link addition functionality

**Steps**:
1. Type "GitHub" in the link title field
2. Type "https://github.com" in the URL field
3. Click "Add Link" button
4. Verify the link appears in the list with title and URL
5. Verify input fields are cleared

**Expected Result**: Link is added to the list with correct title and URL

---

### Test 14: Quick Links - URL Validation
**Objective**: Verify URL validation

**Steps**:
1. Type "Google" in the title field
2. Type "google.com" (without http://) in the URL field
3. Click "Add Link"
4. Verify error message appears: "URL must start with http:// or https://"
5. Type "https://google.com" in the URL field
6. Click "Add Link"
7. Verify the link is added successfully

**Expected Result**: Invalid URLs are rejected, valid URLs are accepted

---

### Test 15: Quick Links - Open Link
**Objective**: Verify link opening functionality

**Steps**:
1. Add a link: "GitHub" → "https://github.com"
2. Click the link button (showing the title and URL)
3. Verify a new browser tab opens with the GitHub website

**Expected Result**: Link opens in a new tab

---

### Test 16: Quick Links - Delete Link
**Objective**: Verify link deletion functionality

**Steps**:
1. Add a link: "GitHub" → "https://github.com"
2. Click the "Delete" button next to the link
3. Verify the link is removed from the list

**Expected Result**: Link is removed from the list

---

### Test 17: Theme Toggle
**Objective**: Verify theme switching functionality

**Steps**:
1. Note the current theme (light background with dark text)
2. Click the theme toggle button (moon icon)
3. Verify the theme changes to dark (dark background with light text)
4. Verify the icon changes to sun (☀️)
5. Click the theme toggle button again
6. Verify the theme changes back to light
7. Verify the icon changes back to moon (🌙)

**Expected Result**: Theme toggles between light and dark with icon updates

---

### Test 18: Local Storage Persistence - Tasks
**Objective**: Verify tasks persist across page reloads

**Steps**:
1. Add tasks: "Task 1", "Task 2", "Task 3"
2. Mark "Task 2" as complete
3. Refresh the page (F5 or Cmd+R)
4. Verify all three tasks appear in the list
5. Verify "Task 2" is still marked as complete

**Expected Result**: Tasks persist with their completion status

---

### Test 19: Local Storage Persistence - Links
**Objective**: Verify links persist across page reloads

**Steps**:
1. Add links: "GitHub" → "https://github.com", "Google" → "https://google.com"
2. Refresh the page
3. Verify both links appear in the list

**Expected Result**: Links persist across page reloads

---

### Test 20: Local Storage Persistence - Theme
**Objective**: Verify theme preference persists

**Steps**:
1. Switch to dark theme
2. Refresh the page
3. Verify the page loads in dark theme
4. Switch to light theme
5. Refresh the page
6. Verify the page loads in light theme

**Expected Result**: Theme preference persists across page reloads

---

### Test 21: Local Storage Persistence - Custom Name
**Objective**: Verify custom name persists

**Steps**:
1. Enter custom name "Alex"
2. Click "Save Name"
3. Refresh the page
4. Verify the greeting displays "Good [TimeOfDay], Alex"
5. Verify the name input field shows "Alex"

**Expected Result**: Custom name persists across page reloads

---

### Test 22: Input Validation - Empty Task
**Objective**: Verify empty task rejection

**Steps**:
1. Leave the task input field empty
2. Click "Add Task"
3. Verify error message appears: "Task description cannot be empty"
4. Verify no task is added to the list

**Expected Result**: Empty task is rejected with error message

---

### Test 23: Input Validation - Whitespace Trimming
**Objective**: Verify whitespace is trimmed from inputs

**Steps**:
1. Type "   Task with spaces   " in the task input (with leading/trailing spaces)
2. Click "Add Task"
3. Verify the task appears as "Task with spaces" (without extra spaces)

**Expected Result**: Whitespace is trimmed from task text

---

### Test 24: Input Validation - HTML Sanitization
**Objective**: Verify HTML tags are sanitized

**Steps**:
1. Type "<script>alert('xss')</script>Task" in the task input
2. Click "Add Task"
3. Verify the task appears as "Task" (without script tags)
4. Open browser console
5. Verify no alert appears

**Expected Result**: HTML/script tags are removed from input

---

### Test 25: Error Message Display
**Objective**: Verify error messages display and auto-dismiss

**Steps**:
1. Try to add an empty task
2. Verify error message appears in a visible container
3. Verify error message has distinct styling (red/error color)
4. Wait 3 seconds
5. Verify error message disappears

**Expected Result**: Error messages display clearly and auto-dismiss

---

### Test 26: Responsive Design - Mobile (320px)
**Objective**: Verify layout works on mobile viewport

**Steps**:
1. Open browser Developer Tools
2. Click the device toggle (mobile view)
3. Set viewport to 320px width
4. Verify all sections are visible
5. Verify no horizontal scrolling
6. Verify text is readable
7. Verify buttons are clickable

**Expected Result**: Layout is responsive and usable at 320px width

---

### Test 27: Responsive Design - Tablet (768px)
**Objective**: Verify layout works on tablet viewport

**Steps**:
1. Set viewport to 768px width
2. Verify all sections are visible
3. Verify layout adjusts appropriately
4. Verify no horizontal scrolling

**Expected Result**: Layout is responsive and usable at 768px width

---

### Test 28: Responsive Design - Desktop (1920px)
**Objective**: Verify layout works on desktop viewport

**Steps**:
1. Set viewport to 1920px width
2. Verify all sections are visible
3. Verify layout uses available space
4. Verify no horizontal scrolling

**Expected Result**: Layout is responsive and usable at 1920px width

---

### Test 29: Complete Workflow
**Objective**: Verify all features work together

**Steps**:
1. Set custom name to "User"
2. Add 3 tasks
3. Mark one task as complete
4. Add 2 quick links
5. Switch to dark theme
6. Start the timer
7. Refresh the page
8. Verify:
   - Custom name persists
   - All tasks appear with correct completion status
   - All links appear
   - Dark theme is applied
   - Timer state is preserved (or reset to 25:00)

**Expected Result**: All features work together and persist correctly

---

### Test 30: Console Check
**Objective**: Verify no console errors

**Steps**:
1. Open browser Developer Tools
2. Go to Console tab
3. Perform all above tests
4. Verify no error messages appear in console
5. Verify no warnings appear (except for expected browser warnings)

**Expected Result**: No console errors or warnings

---

## Summary

If all 30 tests pass, the Productivity Dashboard checkpoint is complete and verified. The application:

✅ Initializes all modules correctly
✅ Handles all user interactions (add, edit, delete, toggle, timer, theme)
✅ Persists data to Local Storage across page reloads
✅ Displays error messages clearly
✅ Validates and sanitizes all inputs
✅ Works responsively on all viewport sizes
✅ Has no console errors

The dashboard is ready for production use.

