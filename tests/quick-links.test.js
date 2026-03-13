/**
 * Unit Tests for Quick Links Module
 */

describe('Quick Links Module', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset module state
    QuickLinksModule.state.links = [];
  });

  describe('Link Creation', () => {
    it('should add a new link', () => {
      QuickLinksModule.addLink('GitHub', 'https://github.com');
      expect(QuickLinksModule.state.links.length).toBe(1);
      expect(QuickLinksModule.state.links[0].title).toBe('GitHub');
      expect(QuickLinksModule.state.links[0].url).toBe('https://github.com');
    });

    it('should generate UUID for each link', () => {
      QuickLinksModule.addLink('GitHub', 'https://github.com');
      QuickLinksModule.addLink('Google', 'https://google.com');
      expect(QuickLinksModule.state.links[0].id).not.toBe(QuickLinksModule.state.links[1].id);
    });

    it('should accept http:// URLs', () => {
      QuickLinksModule.addLink('Example', 'http://example.com');
      expect(QuickLinksModule.state.links[0].url).toBe('http://example.com');
    });

    it('should accept https:// URLs', () => {
      QuickLinksModule.addLink('Secure', 'https://secure.example.com');
      expect(QuickLinksModule.state.links[0].url).toBe('https://secure.example.com');
    });
  });

  describe('Link Deletion', () => {
    it('should delete a link', () => {
      QuickLinksModule.addLink('Link 1', 'https://link1.com');
      QuickLinksModule.addLink('Link 2', 'https://link2.com');
      const linkId = QuickLinksModule.state.links[0].id;
      QuickLinksModule.deleteLink(linkId);
      expect(QuickLinksModule.state.links.length).toBe(1);
      expect(QuickLinksModule.state.links[0].title).toBe('Link 2');
    });

    it('should not affect other links when deleting', () => {
      QuickLinksModule.addLink('Link 1', 'https://link1.com');
      QuickLinksModule.addLink('Link 2', 'https://link2.com');
      QuickLinksModule.addLink('Link 3', 'https://link3.com');
      const linkId = QuickLinksModule.state.links[1].id;
      QuickLinksModule.deleteLink(linkId);
      expect(QuickLinksModule.state.links.length).toBe(2);
      expect(QuickLinksModule.state.links[0].title).toBe('Link 1');
      expect(QuickLinksModule.state.links[1].title).toBe('Link 3');
    });

    it('should not delete non-existent link', () => {
      QuickLinksModule.addLink('Link 1', 'https://link1.com');
      const initialLength = QuickLinksModule.state.links.length;
      QuickLinksModule.deleteLink('non-existent-id');
      expect(QuickLinksModule.state.links.length).toBe(initialLength);
    });
  });

  describe('Link Persistence', () => {
    it('should save links to localStorage', () => {
      QuickLinksModule.addLink('GitHub', 'https://github.com');
      QuickLinksModule.addLink('Google', 'https://google.com');
      const stored = JSON.parse(localStorage.getItem('pd_quickLinks'));
      expect(stored.length).toBe(2);
      expect(stored[0].title).toBe('GitHub');
      expect(stored[1].title).toBe('Google');
    });

    it('should load links from localStorage', () => {
      const links = [
        { id: 'id1', title: 'GitHub', url: 'https://github.com' },
        { id: 'id2', title: 'Google', url: 'https://google.com' }
      ];
      localStorage.setItem('pd_quickLinks', JSON.stringify(links));
      QuickLinksModule.loadLinks();
      expect(QuickLinksModule.state.links.length).toBe(2);
      expect(QuickLinksModule.state.links[0].title).toBe('GitHub');
      expect(QuickLinksModule.state.links[1].url).toBe('https://google.com');
    });

    it('should handle empty localStorage gracefully', () => {
      localStorage.removeItem('pd_quickLinks');
      QuickLinksModule.loadLinks();
      expect(QuickLinksModule.state.links.length).toBe(0);
    });
  });

  describe('Link Rendering', () => {
    beforeEach(() => {
      // Set up DOM
      document.body.innerHTML = `
        <ul id="link-list"></ul>
      `;
    });

    it('should render links in DOM', () => {
      QuickLinksModule.addLink('GitHub', 'https://github.com');
      QuickLinksModule.addLink('Google', 'https://google.com');
      QuickLinksModule.renderLinks();
      const items = document.querySelectorAll('.link-item');
      expect(items.length).toBe(2);
    });

    it('should show placeholder when no links', () => {
      QuickLinksModule.renderLinks();
      const placeholder = document.querySelector('.placeholder');
      expect(placeholder).toBeTruthy();
      expect(placeholder.textContent).toContain('No quick links yet');
    });

    it('should render link title correctly', () => {
      QuickLinksModule.addLink('My Link', 'https://example.com');
      QuickLinksModule.renderLinks();
      const linkTitle = document.querySelector('.link-title');
      expect(linkTitle.textContent).toBe('My Link');
    });

    it('should render link URL correctly', () => {
      QuickLinksModule.addLink('Example', 'https://example.com');
      QuickLinksModule.renderLinks();
      const linkUrl = document.querySelector('.link-url');
      expect(linkUrl.textContent).toBe('https://example.com');
    });

    it('should have delete button with correct data attribute', () => {
      QuickLinksModule.addLink('GitHub', 'https://github.com');
      QuickLinksModule.renderLinks();
      const deleteBtn = document.querySelector('.link-delete-btn');
      expect(deleteBtn).toBeTruthy();
      expect(deleteBtn.dataset.linkId).toBe(QuickLinksModule.state.links[0].id);
    });

    it('should have open button with correct data attribute', () => {
      QuickLinksModule.addLink('GitHub', 'https://github.com');
      QuickLinksModule.renderLinks();
      const openBtn = document.querySelector('.link-open-btn');
      expect(openBtn).toBeTruthy();
      expect(openBtn.dataset.linkUrl).toBe('https://github.com');
    });
  });

  describe('Link Opening', () => {
    it('should open link in new tab', () => {
      // Mock window.open
      const originalOpen = window.open;
      window.open = jest.fn();

      QuickLinksModule.openLink('https://github.com');

      expect(window.open).toHaveBeenCalledWith('https://github.com', '_blank');

      // Restore original
      window.open = originalOpen;
    });
  });

  describe('URL Validation', () => {
    it('should accept valid http URL', () => {
      const validation = InputValidator.validateUrl('http://example.com');
      expect(validation.valid).toBe(true);
    });

    it('should accept valid https URL', () => {
      const validation = InputValidator.validateUrl('https://example.com');
      expect(validation.valid).toBe(true);
    });

    it('should reject URL without protocol', () => {
      const validation = InputValidator.validateUrl('example.com');
      expect(validation.valid).toBe(false);
      expect(validation.error).toContain('http:// or https://');
    });

    it('should reject empty URL', () => {
      const validation = InputValidator.validateUrl('');
      expect(validation.valid).toBe(false);
    });

    it('should reject URL with only whitespace', () => {
      const validation = InputValidator.validateUrl('   ');
      expect(validation.valid).toBe(false);
    });

    it('should reject URL exceeding max length', () => {
      const longUrl = 'https://' + 'a'.repeat(2050);
      const validation = InputValidator.validateUrl(longUrl);
      expect(validation.valid).toBe(false);
    });
  });

  describe('Title Validation', () => {
    it('should accept non-empty title', () => {
      const titleTrimmed = InputValidator.trimInput('GitHub');
      expect(titleTrimmed).toBeTruthy();
    });

    it('should reject empty title', () => {
      const titleTrimmed = InputValidator.trimInput('');
      expect(titleTrimmed).toBeFalsy();
    });

    it('should reject title with only whitespace', () => {
      const titleTrimmed = InputValidator.trimInput('   ');
      expect(titleTrimmed).toBeFalsy();
    });

    it('should trim whitespace from title', () => {
      const titleTrimmed = InputValidator.trimInput('  GitHub  ');
      expect(titleTrimmed).toBe('GitHub');
    });
  });
});
