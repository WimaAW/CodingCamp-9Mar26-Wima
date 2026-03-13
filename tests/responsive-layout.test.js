/**
 * Responsive Layout Tests
 * Tests CSS styling and responsive design across multiple viewports
 * Validates: Requirements 6.3, 7.2
 */

describe('Responsive Layout - CSS Styling and Theme Support', () => {
  let styleSheet;

  beforeEach(() => {
    // Load the CSS file
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'styles.css';
    document.head.appendChild(link);
    styleSheet = link;
  });

  afterEach(() => {
    if (styleSheet && styleSheet.parentNode) {
      styleSheet.parentNode.removeChild(styleSheet);
    }
  });

  describe('CSS Variables - Light Theme', () => {
    it('should define light theme CSS variables', () => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      
      expect(styles.getPropertyValue('--color-background')).toBeTruthy();
      expect(styles.getPropertyValue('--color-text')).toBeTruthy();
      expect(styles.getPropertyValue('--color-primary')).toBeTruthy();
    });
  });

  describe('CSS Variables - Dark Theme', () => {
    it('should define dark theme CSS variables when data-theme="dark"', () => {
      document.documentElement.setAttribute('data-theme', 'dark');
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      
      expect(styles.getPropertyValue('--color-background')).toBeTruthy();
      expect(styles.getPropertyValue('--color-text')).toBeTruthy();
    });
  });

  describe('Layout Structure', () => {
    it('should have proper grid layout for body', () => {
      const body = document.body;
      const styles = getComputedStyle(body);
      
      expect(styles.display).toBe('grid');
      expect(styles.gridTemplateRows).toContain('auto');
    });

    it('should have responsive grid layout for main', () => {
      const main = document.querySelector('main');
      const styles = getComputedStyle(main);
      
      expect(styles.display).toBe('grid');
    });
  });

  describe('Responsive Breakpoints', () => {
    it('should have media query for tablet (max-width: 768px)', () => {
      // This test verifies the CSS file contains the media query
      const cssText = document.styleSheets[0].cssText || '';
      expect(cssText).toContain('768px');
    });

    it('should have media query for mobile (max-width: 480px)', () => {
      const cssText = document.styleSheets[0].cssText || '';
      expect(cssText).toContain('480px');
    });

    it('should have media query for large desktop (min-width: 1200px)', () => {
      const cssText = document.styleSheets[0].cssText || '';
      expect(cssText).toContain('1200px');
    });

    it('should have media query for ultra wide (min-width: 2560px)', () => {
      const cssText = document.styleSheets[0].cssText || '';
      expect(cssText).toContain('2560px');
    });
  });

  describe('Typography and Spacing', () => {
    it('should define font family', () => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      
      expect(styles.getPropertyValue('--font-family')).toBeTruthy();
    });

    it('should define spacing variables', () => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      
      expect(styles.getPropertyValue('--spacing-sm')).toBeTruthy();
      expect(styles.getPropertyValue('--spacing-md')).toBeTruthy();
      expect(styles.getPropertyValue('--spacing-lg')).toBeTruthy();
    });

    it('should define font size variables', () => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      
      expect(styles.getPropertyValue('--font-size-base')).toBeTruthy();
      expect(styles.getPropertyValue('--font-size-lg')).toBeTruthy();
      expect(styles.getPropertyValue('--font-size-xl')).toBeTruthy();
    });
  });

  describe('Color System', () => {
    it('should define primary color', () => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      
      expect(styles.getPropertyValue('--color-primary')).toBeTruthy();
    });

    it('should define success and error colors', () => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      
      expect(styles.getPropertyValue('--color-success')).toBeTruthy();
      expect(styles.getPropertyValue('--color-error')).toBeTruthy();
    });

    it('should define border and surface colors', () => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      
      expect(styles.getPropertyValue('--color-border')).toBeTruthy();
      expect(styles.getPropertyValue('--color-surface')).toBeTruthy();
    });
  });

  describe('Component Styling', () => {
    it('should style buttons with proper appearance', () => {
      const button = document.createElement('button');
      button.className = 'button';
      document.body.appendChild(button);
      
      const styles = getComputedStyle(button);
      expect(styles.padding).toBeTruthy();
      expect(styles.borderRadius).toBeTruthy();
      
      document.body.removeChild(button);
    });

    it('should style inputs with proper appearance', () => {
      const input = document.createElement('input');
      input.className = 'input';
      document.body.appendChild(input);
      
      const styles = getComputedStyle(input);
      expect(styles.padding).toBeTruthy();
      expect(styles.borderRadius).toBeTruthy();
      
      document.body.removeChild(input);
    });

    it('should style sections with proper appearance', () => {
      const section = document.createElement('section');
      section.className = 'section';
      document.body.appendChild(section);
      
      const styles = getComputedStyle(section);
      expect(styles.padding).toBeTruthy();
      expect(styles.borderRadius).toBeTruthy();
      
      document.body.removeChild(section);
    });
  });

  describe('Error Message Styling', () => {
    it('should style error messages with proper appearance', () => {
      const errorMsg = document.createElement('div');
      errorMsg.className = 'error-message';
      document.body.appendChild(errorMsg);
      
      const styles = getComputedStyle(errorMsg);
      expect(styles.padding).toBeTruthy();
      expect(styles.borderRadius).toBeTruthy();
      
      document.body.removeChild(errorMsg);
    });
  });

  describe('Utility Classes', () => {
    it('should hide elements with .hidden class', () => {
      const element = document.createElement('div');
      element.className = 'hidden';
      document.body.appendChild(element);
      
      const styles = getComputedStyle(element);
      expect(styles.display).toBe('none');
      
      document.body.removeChild(element);
    });

    it('should disable elements with .disabled class', () => {
      const element = document.createElement('button');
      element.className = 'disabled';
      document.body.appendChild(element);
      
      const styles = getComputedStyle(element);
      expect(styles.opacity).toBeLessThan(1);
      expect(styles.cursor).toBe('not-allowed');
      
      document.body.removeChild(element);
    });
  });
});
