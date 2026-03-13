/**
 * Unit Tests for Input Validator Module
 */

describe('Input Validator Module', () => {
  describe('sanitizeText', () => {
    it('should remove HTML tags', () => {
      const input = '<div>Hello</div>';
      const result = InputValidator.sanitizeText(input);
      expect(result).not.toContain('<div>');
      expect(result).not.toContain('</div>');
    });

    it('should remove script tags', () => {
      const input = '<script>alert("xss")</script>';
      const result = InputValidator.sanitizeText(input);
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('</script>');
    });

    it('should remove event handlers', () => {
      const input = '<img onerror="alert(\'xss\')">';
      const result = InputValidator.sanitizeText(input);
      expect(result).not.toContain('onerror');
    });

    it('should preserve plain text', () => {
      const input = 'Hello World';
      const result = InputValidator.sanitizeText(input);
      expect(result).toBe('Hello World');
    });

    it('should handle empty string', () => {
      const result = InputValidator.sanitizeText('');
      expect(result).toBe('');
    });

    it('should handle non-string input', () => {
      expect(InputValidator.sanitizeText(null)).toBe('');
      expect(InputValidator.sanitizeText(undefined)).toBe('');
      expect(InputValidator.sanitizeText(123)).toBe('');
    });
  });

  describe('trimInput', () => {
    it('should remove leading whitespace', () => {
      const result = InputValidator.trimInput('   Hello');
      expect(result).toBe('Hello');
    });

    it('should remove trailing whitespace', () => {
      const result = InputValidator.trimInput('Hello   ');
      expect(result).toBe('Hello');
    });

    it('should remove both leading and trailing whitespace', () => {
      const result = InputValidator.trimInput('   Hello World   ');
      expect(result).toBe('Hello World');
    });

    it('should preserve internal spaces', () => {
      const result = InputValidator.trimInput('  Hello   World  ');
      expect(result).toBe('Hello   World');
    });

    it('should handle empty string', () => {
      const result = InputValidator.trimInput('');
      expect(result).toBe('');
    });

    it('should handle whitespace-only string', () => {
      const result = InputValidator.trimInput('   ');
      expect(result).toBe('');
    });

    it('should handle non-string input', () => {
      expect(InputValidator.trimInput(null)).toBe('');
      expect(InputValidator.trimInput(undefined)).toBe('');
    });
  });

  describe('validateTaskText', () => {
    it('should accept valid task text', () => {
      const result = InputValidator.validateTaskText('Complete project report');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should reject empty task text', () => {
      const result = InputValidator.validateTaskText('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Task description cannot be empty');
    });

    it('should reject whitespace-only task text', () => {
      const result = InputValidator.validateTaskText('   ');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Task description cannot be empty');
    });

    it('should reject task text exceeding 500 characters', () => {
      const longText = 'a'.repeat(501);
      const result = InputValidator.validateTaskText(longText);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Task description cannot exceed 500 characters');
    });

    it('should accept task text at 500 character limit', () => {
      const text = 'a'.repeat(500);
      const result = InputValidator.validateTaskText(text);
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should trim whitespace before validation', () => {
      const result = InputValidator.validateTaskText('   Valid task   ');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should accept task text with special characters', () => {
      const result = InputValidator.validateTaskText('Task: Complete @home (urgent!)');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe('validateUrl', () => {
    it('should accept URL with http:// prefix', () => {
      const result = InputValidator.validateUrl('http://example.com');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should accept URL with https:// prefix', () => {
      const result = InputValidator.validateUrl('https://example.com');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should reject URL without http:// or https:// prefix', () => {
      const result = InputValidator.validateUrl('example.com');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('URL must start with http:// or https://');
    });

    it('should reject URL with ftp:// prefix', () => {
      const result = InputValidator.validateUrl('ftp://example.com');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('URL must start with http:// or https://');
    });

    it('should reject empty URL', () => {
      const result = InputValidator.validateUrl('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('URL cannot be empty');
    });

    it('should reject whitespace-only URL', () => {
      const result = InputValidator.validateUrl('   ');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('URL cannot be empty');
    });

    it('should reject URL exceeding 2048 characters', () => {
      const longUrl = 'https://' + 'a'.repeat(2042);
      const result = InputValidator.validateUrl(longUrl);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('URL cannot exceed 2048 characters');
    });

    it('should accept URL at 2048 character limit', () => {
      const url = 'https://' + 'a'.repeat(2041);
      const result = InputValidator.validateUrl(url);
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should trim whitespace before validation', () => {
      const result = InputValidator.validateUrl('   https://example.com   ');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should accept complex URLs', () => {
      const result = InputValidator.validateUrl('https://example.com/path?query=value&other=123#section');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe('validateName', () => {
    it('should accept alphanumeric names', () => {
      const result = InputValidator.validateName('Alex123');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should accept names with spaces', () => {
      const result = InputValidator.validateName('John Doe');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should accept names with hyphens', () => {
      const result = InputValidator.validateName('Mary-Jane');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should accept names with apostrophes', () => {
      const result = InputValidator.validateName("O'Brien");
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should accept names with periods', () => {
      const result = InputValidator.validateName('Dr. Smith');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should reject names with invalid characters', () => {
      const result = InputValidator.validateName('Alex@123');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('can only contain');
    });

    it('should reject empty name', () => {
      const result = InputValidator.validateName('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Name cannot be empty');
    });

    it('should reject whitespace-only name', () => {
      const result = InputValidator.validateName('   ');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Name cannot be empty');
    });

    it('should reject name exceeding 50 characters', () => {
      const longName = 'a'.repeat(51);
      const result = InputValidator.validateName(longName);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Name cannot exceed 50 characters');
    });

    it('should accept name at 50 character limit', () => {
      const name = 'a'.repeat(50);
      const result = InputValidator.validateName(name);
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should trim whitespace before validation', () => {
      const result = InputValidator.validateName('   Alex   ');
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should accept complex valid names', () => {
      const result = InputValidator.validateName("Jean-Pierre O'Connor Jr.");
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });
  });
});
