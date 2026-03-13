/**
 * Property-Based Tests for Input Validator Module
 * Uses fast-check for property-based testing
 */

describe('Input Validator Module - Property-Based Tests', () => {
  describe('Property 29: Input Whitespace Trimming', () => {
    it('should remove leading and trailing whitespace while preserving internal spaces', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }),
          fc.string({ minLength: 0, maxLength: 10 }),
          fc.string({ minLength: 0, maxLength: 10 }),
          (text, leading, trailing) => {
            const input = leading + text + trailing;
            const result = InputValidator.trimInput(input);
            
            // Result should not have leading/trailing whitespace
            expect(result).toBe(result.trim());
            
            // Result should contain the original text (possibly trimmed)
            if (text.trim().length > 0) {
              expect(result).toContain(text.trim());
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Validates: Requirements 8.1
     */
  });

  describe('Property 30: Empty Input Rejection', () => {
    it('should reject empty or whitespace-only task text', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 0, maxLength: 10 }),
          (whitespace) => {
            const result = InputValidator.validateTaskText(whitespace);
            
            // If input is only whitespace, should be invalid
            if (whitespace.trim().length === 0) {
              expect(result.valid).toBe(false);
              expect(result.error).toBeDefined();
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject empty or whitespace-only URLs', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 0, maxLength: 10 }),
          (whitespace) => {
            const result = InputValidator.validateUrl(whitespace);
            
            // If input is only whitespace, should be invalid
            if (whitespace.trim().length === 0) {
              expect(result.valid).toBe(false);
              expect(result.error).toBeDefined();
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject empty or whitespace-only names', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 0, maxLength: 10 }),
          (whitespace) => {
            const result = InputValidator.validateName(whitespace);
            
            // If input is only whitespace, should be invalid
            if (whitespace.trim().length === 0) {
              expect(result.valid).toBe(false);
              expect(result.error).toBeDefined();
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Validates: Requirements 8.2
     */
  });

  describe('Property 31: XSS Prevention via Sanitization', () => {
    it('should remove script tags from any input', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }),
          (text) => {
            const maliciousInput = `<script>${text}</script>`;
            const result = InputValidator.sanitizeText(maliciousInput);
            
            // Result should not contain script tags
            expect(result).not.toContain('<script>');
            expect(result).not.toContain('</script>');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should remove HTML tags from any input', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }),
          (text) => {
            const maliciousInput = `<div onclick="alert('xss')">${text}</div>`;
            const result = InputValidator.sanitizeText(maliciousInput);
            
            // Result should not contain HTML tags
            expect(result).not.toContain('<div');
            expect(result).not.toContain('</div>');
            expect(result).not.toContain('onclick');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should remove event handlers from any input', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }),
          (text) => {
            const maliciousInput = `<img onerror="alert('${text}')">`;
            const result = InputValidator.sanitizeText(maliciousInput);
            
            // Result should not contain event handlers
            expect(result).not.toContain('onerror');
            expect(result).not.toContain('<img');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve safe text content after sanitization', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }),
          (text) => {
            const result = InputValidator.sanitizeText(text);
            
            // Safe text should be preserved (or at least contain the original)
            // Note: HTML entities might be escaped, so we check for content presence
            if (!text.includes('<') && !text.includes('>')) {
              expect(result).toContain(text);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Validates: Requirements 8.6
     */
  });

  describe('Property 32: Name Validation Accepts Valid Characters', () => {
    it('should accept names with only alphanumeric characters', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50, unit: fc.char().filter(c => /[a-zA-Z0-9]/.test(c)) }),
          (name) => {
            const result = InputValidator.validateName(name);
            expect(result.valid).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should accept names with spaces, hyphens, apostrophes, and periods', () => {
      fc.assert(
        fc.property(
          fc.stringOf(
            fc.oneof(
              fc.char().filter(c => /[a-zA-Z0-9]/.test(c)),
              fc.constant(' '),
              fc.constant('-'),
              fc.constant("'"),
              fc.constant('.')
            ),
            { minLength: 1, maxLength: 50 }
          ),
          (name) => {
            const result = InputValidator.validateName(name);
            
            // If name is valid (not empty after trim), should be accepted
            if (name.trim().length > 0) {
              expect(result.valid).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject names with invalid special characters', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.char().filter(c => !/[a-zA-Z0-9\s\-'.]/. test(c)),
          (name, invalidChar) => {
            const invalidName = name + invalidChar;
            const result = InputValidator.validateName(invalidName);
            
            // Should be invalid due to invalid character
            expect(result.valid).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Validates: Requirements 8.5
     */
  });

  describe('Property: Task Text Length Validation', () => {
    it('should accept task text within 500 character limit', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 500 }),
          (text) => {
            const result = InputValidator.validateTaskText(text);
            
            // If text is not empty after trim, should be valid
            if (text.trim().length > 0) {
              expect(result.valid).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject task text exceeding 500 characters', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 501, maxLength: 1000 }),
          (text) => {
            const result = InputValidator.validateTaskText(text);
            expect(result.valid).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property: URL Format Validation', () => {
    it('should accept URLs starting with http:// or https://', () => {
      fc.assert(
        fc.property(
          fc.oneof(fc.constant('http://'), fc.constant('https://')),
          fc.string({ minLength: 1, maxLength: 2040 }),
          (protocol, path) => {
            const url = protocol + path;
            const result = InputValidator.validateUrl(url);
            expect(result.valid).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject URLs not starting with http:// or https://', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }).filter(s => !s.startsWith('http://') && !s.startsWith('https://')),
          (url) => {
            const result = InputValidator.validateUrl(url);
            expect(result.valid).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property: Name Length Validation', () => {
    it('should accept names within 50 character limit', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          (name) => {
            const result = InputValidator.validateName(name);
            
            // If name is valid characters and not empty after trim
            if (name.trim().length > 0 && /^[a-zA-Z0-9\s\-'.]+$/.test(name)) {
              expect(result.valid).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject names exceeding 50 characters', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 51, maxLength: 100 }),
          (name) => {
            const result = InputValidator.validateName(name);
            expect(result.valid).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
