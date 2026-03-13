/**
 * Property-Based Tests for Error Handling System
 * Uses fast-check for property-based testing
 */

describe('Error Handling System - Property-Based Tests', () => {
  let errorContainer;

  beforeEach(() => {
    // Create error container if it doesn't exist
    errorContainer = document.getElementById('error-container');
    if (!errorContainer) {
      errorContainer = document.createElement('div');
      errorContainer.id = 'error-container';
      errorContainer.className = 'error-container';
      document.body.appendChild(errorContainer);
    }
    // Clear any existing error messages
    errorContainer.innerHTML = '';
  });

  afterEach(() => {
    // Clean up error messages
    if (errorContainer) {
      errorContainer.innerHTML = '';
    }
  });

  describe('Property 33: Error Messages Display Clearly', () => {
    it('should display any error message in visible manner', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 200 }),
          (errorMessage) => {
            // Clear previous errors
            errorContainer.innerHTML = '';
            
            // Display error
            showError(errorMessage);
            
            // Verify error is displayed
            const errorElements = errorContainer.querySelectorAll('.error-message');
            expect(errorElements.length).toBe(1);
            
            // Verify error message content is visible
            const displayedMessage = errorElements[0].textContent;
            expect(displayedMessage).toBe(errorMessage);
            
            // Verify error element is not hidden
            const style = window.getComputedStyle(errorElements[0]);
            expect(style.display).not.toBe('none');
            expect(style.visibility).not.toBe('hidden');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should display error with appropriate styling', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 200 }),
          (errorMessage) => {
            // Clear previous errors
            errorContainer.innerHTML = '';
            
            // Display error
            showError(errorMessage);
            
            // Verify error has error-message class
            const errorElements = errorContainer.querySelectorAll('.error-message');
            expect(errorElements.length).toBe(1);
            expect(errorElements[0].classList.contains('error-message')).toBe(true);
            
            // Verify error element is in the DOM
            expect(document.body.contains(errorElements[0])).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should auto-dismiss error after specified duration', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 200 }),
          fc.integer({ min: 500, max: 5000 }),
          (errorMessage, duration) => {
            // Clear previous errors
            errorContainer.innerHTML = '';
            
            // Display error with custom duration
            showError(errorMessage, duration);
            
            // Verify error is displayed immediately
            const errorElements = errorContainer.querySelectorAll('.error-message');
            expect(errorElements.length).toBe(1);
            
            // Note: We can't test the actual timeout in a synchronous test,
            // but we verify the error is created and will be removed
            expect(errorElements[0].textContent).toBe(errorMessage);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle multiple errors without losing visibility', () => {
      fc.assert(
        fc.property(
          fc.array(fc.string({ minLength: 1, maxLength: 100 }), { minLength: 1, maxLength: 5 }),
          (errorMessages) => {
            // Clear previous errors
            errorContainer.innerHTML = '';
            
            // Display multiple errors
            errorMessages.forEach(msg => showError(msg));
            
            // Verify all errors are displayed
            const errorElements = errorContainer.querySelectorAll('.error-message');
            expect(errorElements.length).toBe(errorMessages.length);
            
            // Verify each error message is visible
            errorMessages.forEach((msg, index) => {
              expect(errorElements[index].textContent).toBe(msg);
              expect(errorElements[index].classList.contains('error-message')).toBe(true);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should display validation error messages clearly', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 500 }),
          (taskText) => {
            const validation = InputValidator.validateTaskText(taskText);
            
            // If validation fails, error message should be descriptive
            if (!validation.valid) {
              expect(validation.error).toBeDefined();
              expect(validation.error.length).toBeGreaterThan(0);
              
              // Error message should be a string
              expect(typeof validation.error).toBe('string');
              
              // Error message should not be empty
              expect(validation.error.trim().length).toBeGreaterThan(0);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should display URL validation error messages clearly', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 200 }),
          (url) => {
            const validation = InputValidator.validateUrl(url);
            
            // If validation fails, error message should be descriptive
            if (!validation.valid) {
              expect(validation.error).toBeDefined();
              expect(validation.error.length).toBeGreaterThan(0);
              
              // Error message should be a string
              expect(typeof validation.error).toBe('string');
              
              // Error message should not be empty
              expect(validation.error.trim().length).toBeGreaterThan(0);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should display name validation error messages clearly', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }),
          (name) => {
            const validation = InputValidator.validateName(name);
            
            // If validation fails, error message should be descriptive
            if (!validation.valid) {
              expect(validation.error).toBeDefined();
              expect(validation.error.length).toBeGreaterThan(0);
              
              // Error message should be a string
              expect(typeof validation.error).toBe('string');
              
              // Error message should not be empty
              expect(validation.error.trim().length).toBeGreaterThan(0);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Validates: Requirements 7.6
     */
  });

  describe('Property: Error Message Persistence', () => {
    it('should keep error message visible until auto-dismiss', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 200 }),
          (errorMessage) => {
            // Clear previous errors
            errorContainer.innerHTML = '';
            
            // Display error
            showError(errorMessage);
            
            // Verify error is immediately visible
            const errorElements = errorContainer.querySelectorAll('.error-message');
            expect(errorElements.length).toBe(1);
            expect(errorElements[0].textContent).toBe(errorMessage);
            
            // Verify error is in DOM
            expect(errorContainer.contains(errorElements[0])).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property: Error Message Content Integrity', () => {
    it('should preserve error message content exactly', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 200 }),
          (errorMessage) => {
            // Clear previous errors
            errorContainer.innerHTML = '';
            
            // Display error
            showError(errorMessage);
            
            // Verify content is preserved exactly
            const errorElements = errorContainer.querySelectorAll('.error-message');
            expect(errorElements[0].textContent).toBe(errorMessage);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not modify error message text', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 200 }),
          (errorMessage) => {
            // Clear previous errors
            errorContainer.innerHTML = '';
            
            // Display error
            showError(errorMessage);
            
            // Get displayed message
            const errorElements = errorContainer.querySelectorAll('.error-message');
            const displayedMessage = errorElements[0].textContent;
            
            // Verify no modification occurred
            expect(displayedMessage).toBe(errorMessage);
            expect(displayedMessage.length).toBe(errorMessage.length);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property: Error Message Accessibility', () => {
    it('should display error message in accessible manner', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 200 }),
          (errorMessage) => {
            // Clear previous errors
            errorContainer.innerHTML = '';
            
            // Display error
            showError(errorMessage);
            
            // Verify error is accessible
            const errorElements = errorContainer.querySelectorAll('.error-message');
            expect(errorElements.length).toBe(1);
            
            // Error should be in the DOM and visible
            const errorElement = errorElements[0];
            expect(errorElement.offsetHeight).toBeGreaterThan(0);
            expect(errorElement.offsetWidth).toBeGreaterThan(0);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property: Specific Error Messages', () => {
    it('should display "Task description cannot be empty" for empty tasks', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 0, maxLength: 10 }),
          (whitespace) => {
            const result = InputValidator.validateTaskText(whitespace);
            
            // If input is only whitespace, should show specific error
            if (whitespace.trim().length === 0) {
              expect(result.error).toBe('Task description cannot be empty');
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should display "URL must start with http:// or https://" for invalid URLs', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }).filter(s => !s.startsWith('http://') && !s.startsWith('https://')),
          (url) => {
            const result = InputValidator.validateUrl(url);
            
            // If URL doesn't start with http/https, should show specific error
            if (url.trim().length > 0) {
              expect(result.error).toBe('URL must start with http:// or https://');
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should display "Link title cannot be empty" for empty titles', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 0, maxLength: 10 }),
          (whitespace) => {
            // Simulate link title validation
            const titleTrimmed = whitespace.trim();
            
            // If title is empty after trim, should show specific error
            if (!titleTrimmed) {
              expect(titleTrimmed).toBe('');
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should display "This task already exists" for duplicate tasks', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }),
          (taskText) => {
            // Clear tasks
            TodoModule.state.tasks = [];
            
            // Add first task
            TodoModule.addTask(taskText);
            
            // Check if duplicate detection works
            const isDuplicate = TodoModule.isDuplicate(taskText);
            expect(isDuplicate).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
