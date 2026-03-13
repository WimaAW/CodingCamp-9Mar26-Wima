/**
 * Property-Based Tests for Quick Links Module
 * Uses fast-check for property-based testing
 */

describe('Quick Links Module - Property-Based Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    QuickLinksModule.state.links = [];
  });

  describe('Property 18: Quick Links Display All Links', () => {
    it('should display all links in the DOM', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.tuple(
              fc.string({ minLength: 1, maxLength: 50 }),
              fc.string({ minLength: 1, maxLength: 50 })
            ),
            { minLength: 1, maxLength: 10 }
          ),
          (linkData) => {
            // Set up DOM
            document.body.innerHTML = '<ul id="link-list"></ul>';
            
            // Add all links with valid URLs
            linkData.forEach(([title, urlPart]) => {
              const url = `https://${urlPart}.com`;
              QuickLinksModule.addLink(title, url);
            });
            
            QuickLinksModule.renderLinks();
            
            // Count rendered links
            const renderedLinks = document.querySelectorAll('.link-item').length;
            expect(renderedLinks).toBe(linkData.length);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Validates: Requirements 4.1
     */
  });

  describe('Property 19: Quick Link Addition', () => {
    it('should add valid links to the collection', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.string({ minLength: 1, maxLength: 50 }),
          (title, urlPart) => {
            const url = `https://${urlPart}.com`;
            const initialLength = QuickLinksModule.state.links.length;
            QuickLinksModule.addLink(title, url);
            expect(QuickLinksModule.state.links.length).toBe(initialLength + 1);
            expect(QuickLinksModule.state.links[initialLength].title).toBe(title);
            expect(QuickLinksModule.state.links[initialLength].url).toBe(url);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Validates: Requirements 4.2
     */
  });

  describe('Property 20: Quick Link Deletion', () => {
    it('should remove link from collection when deleted', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.tuple(
              fc.string({ minLength: 1, maxLength: 50 }),
              fc.string({ minLength: 1, maxLength: 50 })
            ),
            { minLength: 1, maxLength: 10 }
          ),
          (linkData) => {
            // Add all links
            linkData.forEach(([title, urlPart]) => {
              const url = `https://${urlPart}.com`;
              QuickLinksModule.addLink(title, url);
            });
            
            // Delete first link
            if (QuickLinksModule.state.links.length > 0) {
              const firstLinkId = QuickLinksModule.state.links[0].id;
              const initialLength = QuickLinksModule.state.links.length;
              QuickLinksModule.deleteLink(firstLinkId);
              expect(QuickLinksModule.state.links.length).toBe(initialLength - 1);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Validates: Requirements 4.4
     */
  });

  describe('Property 21: Quick Link Persistence Round Trip', () => {
    it('should persist and restore links from localStorage', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.tuple(
              fc.string({ minLength: 1, maxLength: 50 }),
              fc.string({ minLength: 1, maxLength: 50 })
            ),
            { minLength: 0, maxLength: 10 }
          ),
          (linkData) => {
            // Add links
            linkData.forEach(([title, urlPart]) => {
              const url = `https://${urlPart}.com`;
              QuickLinksModule.addLink(title, url);
            });
            
            // Verify saved to localStorage
            const stored = JSON.parse(localStorage.getItem('pd_quickLinks'));
            expect(stored.length).toBe(linkData.length);
            
            // Clear state and reload
            QuickLinksModule.state.links = [];
            QuickLinksModule.loadLinks();
            
            // Verify restored correctly
            expect(QuickLinksModule.state.links.length).toBe(linkData.length);
            
            // Verify each link matches
            QuickLinksModule.state.links.forEach((link, index) => {
              expect(link.title).toBe(linkData[index][0]);
              expect(link.url).toBe(`https://${linkData[index][1]}.com`);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Validates: Requirements 4.5, 4.6
     */
  });

  describe('Property 22: URL Validation Rejects Invalid Formats', () => {
    it('should reject URLs without http:// or https:// prefix', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }),
          (invalidUrl) => {
            // Skip if URL already has valid prefix
            if (invalidUrl.startsWith('http://') || invalidUrl.startsWith('https://')) {
              return;
            }
            
            const validation = InputValidator.validateUrl(invalidUrl);
            expect(validation.valid).toBe(false);
            expect(validation.error).toContain('http://');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should accept URLs with http:// or https:// prefix', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }),
          (urlPart) => {
            const validHttpUrl = `http://${urlPart}`;
            const validHttpsUrl = `https://${urlPart}`;
            
            const httpValidation = InputValidator.validateUrl(validHttpUrl);
            const httpsValidation = InputValidator.validateUrl(validHttpsUrl);
            
            expect(httpValidation.valid).toBe(true);
            expect(httpsValidation.valid).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Validates: Requirements 4.7, 8.3, 8.4
     */
  });
});
