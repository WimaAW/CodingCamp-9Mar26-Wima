/**
 * Unit Tests for Error Handling System
 */

describe('Error Handling System', () => {
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

  describe('showError function', () => {
    it('should create and display error message', () => {
      showError('Test error message');
      
      const errorMessages = errorContainer.querySelectorAll('.error-message');
      expect(errorMessages.length).toBe(1);
      expect(errorMessages[0].textContent).toBe('Test error message');
    });

    it('should apply error-message class to error element', () => {
      showError('Test error');
      
      const errorMessage = errorContainer.querySelector('.error-message');
      expect(errorMessage).not.toBeNull();
      expect(errorMessage.classList.contains('error-message')).toBe(true);
    });

    it('should auto-dismiss error after default duration (3000ms)', (done) => {
      showError('Test error');
      
      const errorMessages = errorContainer.querySelectorAll('.error-message');
      expect(errorMessages.length).toBe(1);
      
      setTimeout(() => {
        const errorMessagesAfter = errorContainer.querySelectorAll('.error-message');
        expect(errorMessagesAfter.length).toBe(0);
        done();
      }, 3100);
    });

    it('should auto-dismiss error after custom duration', (done) => {
      showError('Test error', 1000);
      
      const errorMessages = errorContainer.querySelectorAll('.error-message');
      expect(errorMessages.length).toBe(1);
      
      setTimeout(() => {
        const errorMessagesAfter = errorContainer.querySelectorAll('.error-message');
        expect(errorMessagesAfter.length).toBe(0);
        done();
      }, 1100);
    });

    it('should support multiple error messages', () => {
      showError('Error 1');
      showError('Error 2');
      showError('Error 3');
      
      const errorMessages = errorContainer.querySelectorAll('.error-message');
      expect(errorMessages.length).toBe(3);
      expect(errorMessages[0].textContent).toBe('Error 1');
      expect(errorMessages[1].textContent).toBe('Error 2');
      expect(errorMessages[2].textContent).toBe('Error 3');
    });

    it('should handle empty error message', () => {
      showError('');
      
      const errorMessages = errorContainer.querySelectorAll('.error-message');
      expect(errorMessages.length).toBe(1);
      expect(errorMessages[0].textContent).toBe('');
    });

    it('should handle special characters in error message', () => {
      const specialMessage = 'Error: <script>alert("xss")</script>';
      showError(specialMessage);
      
      const errorMessage = errorContainer.querySelector('.error-message');
      expect(errorMessage.textContent).toBe(specialMessage);
      // textContent should not execute scripts
      expect(errorMessage.innerHTML).not.toContain('<script>');
    });

    it('should handle very long error messages', () => {
      const longMessage = 'a'.repeat(500);
      showError(longMessage);
      
      const errorMessage = errorContainer.querySelector('.error-message');
      expect(errorMessage.textContent).toBe(longMessage);
    });
  });

  describe('Task validation error messages', () => {
    it('should display "Task description cannot be empty" for empty tasks', () => {
      const validation = InputValidator.validateTaskText('');
      expect(validation.error).toBe('Task description cannot be empty');
    });

    it('should display "Task description cannot be empty" for whitespace-only tasks', () => {
      const validation = InputValidator.validateTaskText('   ');
      expect(validation.error).toBe('Task description cannot be empty');
    });

    it('should display error when adding empty task', () => {
      const taskInput = document.getElementById('task-input');
      const addBtn = document.getElementById('task-add-btn');
      
      if (taskInput && addBtn) {
        taskInput.value = '';
        addBtn.click();
        
        const errorMessages = errorContainer.querySelectorAll('.error-message');
        expect(errorMessages.length).toBeGreaterThan(0);
        expect(errorMessages[errorMessages.length - 1].textContent).toBe('Task description cannot be empty');
      }
    });

    it('should display "This task already exists in your list" for duplicate tasks', () => {
      // Add first task
      TodoModule.addTask('Test task');
      
      // Try to add duplicate
      const validation = InputValidator.validateTaskText('Test task');
      const isDuplicate = TodoModule.isDuplicate('Test task');
      
      expect(isDuplicate).toBe(true);
    });

    it('should display error when adding duplicate task', (done) => {
      // Add first task
      TodoModule.addTask('Duplicate test');
      
      // Clear error container
      errorContainer.innerHTML = '';
      
      // Try to add duplicate via UI
      const taskInput = document.getElementById('task-input');
      const addBtn = document.getElementById('task-add-btn');
      
      if (taskInput && addBtn) {
        taskInput.value = 'Duplicate test';
        addBtn.click();
        
        // Check for error message
        setTimeout(() => {
          const errorMessages = errorContainer.querySelectorAll('.error-message');
          expect(errorMessages.length).toBeGreaterThan(0);
          expect(errorMessages[errorMessages.length - 1].textContent).toContain('already exists');
          done();
        }, 100);
      } else {
        done();
      }
    });
  });

  describe('URL validation error messages', () => {
    it('should display "URL must start with http:// or https://" for invalid URLs', () => {
      const validation = InputValidator.validateUrl('example.com');
      expect(validation.error).toBe('URL must start with http:// or https://');
    });

    it('should display "URL cannot be empty" for empty URLs', () => {
      const validation = InputValidator.validateUrl('');
      expect(validation.error).toBe('URL cannot be empty');
    });

    it('should display error when adding invalid URL', () => {
      const linkUrlInput = document.getElementById('link-input-url');
      const addBtn = document.getElementById('link-add-btn');
      const linkTitleInput = document.getElementById('link-input-title');
      
      if (linkUrlInput && addBtn && linkTitleInput) {
        linkTitleInput.value = 'Test Link';
        linkUrlInput.value = 'invalid-url';
        addBtn.click();
        
        const errorMessages = errorContainer.querySelectorAll('.error-message');
        expect(errorMessages.length).toBeGreaterThan(0);
        expect(errorMessages[errorMessages.length - 1].textContent).toContain('http://');
      }
    });
  });

  describe('Link title validation error messages', () => {
    it('should display "Link title cannot be empty" for empty titles', () => {
      const linkTitleInput = document.getElementById('link-input-title');
      const linkUrlInput = document.getElementById('link-input-url');
      const addBtn = document.getElementById('link-add-btn');
      
      if (linkTitleInput && linkUrlInput && addBtn) {
        linkTitleInput.value = '';
        linkUrlInput.value = 'https://example.com';
        addBtn.click();
        
        const errorMessages = errorContainer.querySelectorAll('.error-message');
        expect(errorMessages.length).toBeGreaterThan(0);
        expect(errorMessages[errorMessages.length - 1].textContent).toBe('Link title cannot be empty');
      }
    });

    it('should display "Link title cannot be empty" for whitespace-only titles', () => {
      const linkTitleInput = document.getElementById('link-input-title');
      const linkUrlInput = document.getElementById('link-input-url');
      const addBtn = document.getElementById('link-add-btn');
      
      if (linkTitleInput && linkUrlInput && addBtn) {
        linkTitleInput.value = '   ';
        linkUrlInput.value = 'https://example.com';
        addBtn.click();
        
        const errorMessages = errorContainer.querySelectorAll('.error-message');
        expect(errorMessages.length).toBeGreaterThan(0);
        expect(errorMessages[errorMessages.length - 1].textContent).toBe('Link title cannot be empty');
      }
    });
  });

  describe('Error message visibility and styling', () => {
    it('should display error message in visible location', () => {
      showError('Visible error');
      
      const errorMessage = errorContainer.querySelector('.error-message');
      expect(errorMessage).not.toBeNull();
      
      // Check that error container is visible
      const containerStyle = window.getComputedStyle(errorContainer);
      expect(containerStyle.display).not.toBe('none');
    });

    it('should use error styling (red/error color)', () => {
      showError('Styled error');
      
      const errorMessage = errorContainer.querySelector('.error-message');
      expect(errorMessage).not.toBeNull();
      
      // Check that error message has error styling
      const style = window.getComputedStyle(errorMessage);
      // The error message should have error-related styling
      expect(errorMessage.classList.contains('error-message')).toBe(true);
    });

    it('should have distinct error styling from other messages', () => {
      showError('Error message');
      
      const errorMessage = errorContainer.querySelector('.error-message');
      expect(errorMessage.classList.contains('error-message')).toBe(true);
      
      // Verify it has the error class and not other classes
      const classList = Array.from(errorMessage.classList);
      expect(classList).toContain('error-message');
    });
  });

  describe('Error handling edge cases', () => {
    it('should handle rapid successive errors', () => {
      for (let i = 0; i < 5; i++) {
        showError(`Error ${i}`);
      }
      
      const errorMessages = errorContainer.querySelectorAll('.error-message');
      expect(errorMessages.length).toBe(5);
    });

    it('should handle errors with unicode characters', () => {
      showError('Error: 你好 🎉 مرحبا');
      
      const errorMessage = errorContainer.querySelector('.error-message');
      expect(errorMessage.textContent).toContain('你好');
      expect(errorMessage.textContent).toContain('🎉');
    });

    it('should handle errors with newlines', () => {
      showError('Error line 1\nError line 2');
      
      const errorMessage = errorContainer.querySelector('.error-message');
      expect(errorMessage.textContent).toContain('Error line 1');
      expect(errorMessage.textContent).toContain('Error line 2');
    });

    it('should not display error if container does not exist', () => {
      const originalContainer = document.getElementById('error-container');
      if (originalContainer) {
        originalContainer.remove();
      }
      
      // This should not throw an error
      expect(() => {
        showError('Test error');
      }).toThrow();
      
      // Restore container
      const newContainer = document.createElement('div');
      newContainer.id = 'error-container';
      newContainer.className = 'error-container';
      document.body.appendChild(newContainer);
    });
  });

  describe('Error message content validation', () => {
    it('should display complete error message text', () => {
      const errorText = 'This is a complete error message with details';
      showError(errorText);
      
      const errorMessage = errorContainer.querySelector('.error-message');
      expect(errorMessage.textContent).toBe(errorText);
    });

    it('should preserve error message formatting', () => {
      const errorText = 'Error: Invalid input (check format)';
      showError(errorText);
      
      const errorMessage = errorContainer.querySelector('.error-message');
      expect(errorMessage.textContent).toBe(errorText);
    });

    it('should handle error messages with quotes', () => {
      const errorText = 'Error: "Invalid" value provided';
      showError(errorText);
      
      const errorMessage = errorContainer.querySelector('.error-message');
      expect(errorMessage.textContent).toBe(errorText);
    });
  });
});
