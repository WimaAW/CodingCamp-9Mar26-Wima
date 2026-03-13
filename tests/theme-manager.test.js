/**
 * Unit Tests for Theme Manager Module
 * Tests specific examples and edge cases for theme functionality
 */

describe('Theme Manager Module', () => {
  let themeToggle;
  let originalLocalStorage;

  beforeEach(() => {
    // Mock localStorage
    originalLocalStorage = global.localStorage;
    global.localStorage = {
      data: {},
      getItem(key) {
        return this.data[key] || null;
      },
      setItem(key, value) {
        this.data[key] = value;
      },
      removeItem(key) {
        delete this.data[key];
      },
      clear() {
        this.data = {};
      }
    };

    // Set up DOM elements
    document.body.innerHTML = `
      <button id="theme-toggle" class="theme-toggle" aria-label="Toggle theme">
        <span class="theme-icon">🌙</span>
      </button>
      <div id="error-container"></div>
    `;

    themeToggle = document.getElementById('theme-toggle');

    // Reset module state
    ThemeManager.state = {
      currentTheme: 'light',
      defaultTheme: 'light'
    };

    // Clear any data-theme attribute
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    global.localStorage = originalLocalStorage;
    document.documentElement.removeAttribute('data-theme');
  });

  describe('Initialization', () => {
    it('should initialize with light theme as default', () => {
      ThemeManager.init();
      expect(ThemeManager.state.currentTheme).toBe('light');
    });

    it('should apply theme on init', () => {
      ThemeManager.init();
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('should set up event listener on init', () => {
      ThemeManager.init();
      expect(themeToggle).toBeDefined();
    });

    it('should load theme from localStorage if available', () => {
      localStorage.setItem('pd_theme', JSON.stringify('dark'));
      ThemeManager.state.currentTheme = 'light'; // Reset state
      ThemeManager.loadTheme();
      expect(ThemeManager.state.currentTheme).toBe('dark');
    });

    it('should default to light theme if no localStorage preference', () => {
      localStorage.clear();
      ThemeManager.state.currentTheme = 'dark'; // Reset state
      ThemeManager.loadTheme();
      expect(ThemeManager.state.currentTheme).toBe('light');
    });
  });

  describe('Theme Application', () => {
    it('should apply light theme by setting data-theme attribute', () => {
      ThemeManager.setTheme('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('should apply dark theme by setting data-theme attribute', () => {
      ThemeManager.setTheme('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('should update theme icon when applying light theme', () => {
      ThemeManager.setTheme('light');
      const icon = themeToggle.querySelector('.theme-icon');
      expect(icon.textContent).toBe('🌙');
    });

    it('should update theme icon when applying dark theme', () => {
      ThemeManager.setTheme('dark');
      const icon = themeToggle.querySelector('.theme-icon');
      expect(icon.textContent).toBe('☀️');
    });

    it('should not apply invalid theme values', () => {
      ThemeManager.setTheme('light');
      ThemeManager.setTheme('invalid');
      expect(ThemeManager.state.currentTheme).toBe('light');
    });
  });

  describe('Theme Toggle', () => {
    it('should toggle from light to dark', () => {
      ThemeManager.state.currentTheme = 'light';
      ThemeManager.toggle();
      expect(ThemeManager.state.currentTheme).toBe('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('should toggle from dark to light', () => {
      ThemeManager.state.currentTheme = 'dark';
      ThemeManager.toggle();
      expect(ThemeManager.state.currentTheme).toBe('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('should toggle multiple times correctly', () => {
      ThemeManager.state.currentTheme = 'light';
      ThemeManager.toggle();
      expect(ThemeManager.state.currentTheme).toBe('dark');
      ThemeManager.toggle();
      expect(ThemeManager.state.currentTheme).toBe('light');
      ThemeManager.toggle();
      expect(ThemeManager.state.currentTheme).toBe('dark');
    });

    it('should save theme to localStorage after toggle', () => {
      ThemeManager.state.currentTheme = 'light';
      ThemeManager.toggle();
      const stored = localStorage.getItem('pd_theme');
      expect(stored).toBe(JSON.stringify('dark'));
    });
  });

  describe('Get Theme', () => {
    it('should return current light theme', () => {
      ThemeManager.state.currentTheme = 'light';
      expect(ThemeManager.getTheme()).toBe('light');
    });

    it('should return current dark theme', () => {
      ThemeManager.state.currentTheme = 'dark';
      expect(ThemeManager.getTheme()).toBe('dark');
    });
  });

  describe('Theme Persistence', () => {
    it('should save light theme to localStorage', () => {
      ThemeManager.setTheme('light');
      const stored = localStorage.getItem('pd_theme');
      expect(stored).toBe(JSON.stringify('light'));
    });

    it('should save dark theme to localStorage', () => {
      ThemeManager.setTheme('dark');
      const stored = localStorage.getItem('pd_theme');
      expect(stored).toBe(JSON.stringify('dark'));
    });

    it('should persist theme across module reinitializations', () => {
      ThemeManager.setTheme('dark');
      
      // Reset module state
      ThemeManager.state.currentTheme = 'light';
      
      // Reload theme from storage
      ThemeManager.loadTheme();
      expect(ThemeManager.state.currentTheme).toBe('dark');
    });

    it('should handle corrupted localStorage data gracefully', () => {
      localStorage.setItem('pd_theme', 'invalid-json-{');
      ThemeManager.state.currentTheme = 'dark';
      ThemeManager.loadTheme();
      // Should default to light theme on error
      expect(ThemeManager.state.currentTheme).toBe('light');
    });
  });

  describe('Theme Toggle Button Integration', () => {
    it('should toggle theme when button is clicked', () => {
      ThemeManager.init();
      ThemeManager.state.currentTheme = 'light';
      
      themeToggle.click();
      expect(ThemeManager.state.currentTheme).toBe('dark');
    });

    it('should update icon when button is clicked', () => {
      ThemeManager.init();
      ThemeManager.state.currentTheme = 'light';
      
      themeToggle.click();
      const icon = themeToggle.querySelector('.theme-icon');
      expect(icon.textContent).toBe('☀️');
    });

    it('should persist theme after button click', () => {
      ThemeManager.init();
      ThemeManager.state.currentTheme = 'light';
      
      themeToggle.click();
      const stored = localStorage.getItem('pd_theme');
      expect(stored).toBe(JSON.stringify('dark'));
    });
  });

  describe('Default Theme Behavior', () => {
    it('should default to light theme on fresh initialization', () => {
      localStorage.clear();
      ThemeManager.state.currentTheme = 'dark';
      ThemeManager.loadTheme();
      expect(ThemeManager.state.currentTheme).toBe('light');
    });

    it('should apply light theme as default', () => {
      localStorage.clear();
      ThemeManager.init();
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete theme cycle: init -> toggle -> reload', () => {
      // Initialize with light theme
      ThemeManager.init();
      expect(ThemeManager.state.currentTheme).toBe('light');

      // Toggle to dark
      ThemeManager.toggle();
      expect(ThemeManager.state.currentTheme).toBe('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

      // Simulate page reload by resetting state and reloading
      ThemeManager.state.currentTheme = 'light';
      ThemeManager.loadTheme();
      expect(ThemeManager.state.currentTheme).toBe('dark');
    });

    it('should maintain theme consistency across multiple toggles', () => {
      ThemeManager.init();
      
      for (let i = 0; i < 5; i++) {
        ThemeManager.toggle();
        const expected = i % 2 === 0 ? 'dark' : 'light';
        expect(ThemeManager.state.currentTheme).toBe(expected);
        expect(document.documentElement.getAttribute('data-theme')).toBe(expected);
      }
    });
  });
});
