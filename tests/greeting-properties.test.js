/**
 * Property-Based Tests for Greeting Module
 * Uses fast-check for property-based testing
 * 
 * Feature: productivity-dashboard
 * Property 1: Greeting Logic Correctness - Validates Requirements 1.3, 1.4, 1.5, 1.6
 * Property 2: Custom Name Appending - Validates Requirements 1.7, 1.9
 * Property 3: Time Display Format - Validates Requirements 1.1
 * Property 4: Date Display Format - Validates Requirements 1.2
 */

describe('Greeting Module - Property-Based Tests', () => {
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

    // Reset GreetingModule state
    GreetingModule.state = {
      currentTime: '00:00',
      currentDate: 'Loading...',
      greeting: 'Good Morning',
      customName: '',
      updateIntervalId: null
    };
  });

  afterEach(() => {
    global.localStorage = originalLocalStorage;
    if (GreetingModule.state.updateIntervalId) {
      clearInterval(GreetingModule.state.updateIntervalId);
    }
  });

  describe('Property 1: Greeting Logic Correctness', () => {
    it('should return "Good Morning" for any hour in range 5-11', () => {
      fc.assert(
        fc.property(fc.integer({ min: 5, max: 11 }), (hour) => {
          expect(GreetingModule.getGreeting(hour)).toBe('Good Morning');
        }),
        { numRuns: 100 }
      );
    });

    it('should return "Good Afternoon" for any hour in range 12-16', () => {
      fc.assert(
        fc.property(fc.integer({ min: 12, max: 16 }), (hour) => {
          expect(GreetingModule.getGreeting(hour)).toBe('Good Afternoon');
        }),
        { numRuns: 100 }
      );
    });

    it('should return "Good Evening" for any hour in range 17-23', () => {
      fc.assert(
        fc.property(fc.integer({ min: 17, max: 23 }), (hour) => {
          expect(GreetingModule.getGreeting(hour)).toBe('Good Evening');
        }),
        { numRuns: 100 }
      );
    });

    it('should return "Good Night" for any hour in range 0-4', () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 4 }), (hour) => {
          expect(GreetingModule.getGreeting(hour)).toBe('Good Night');
        }),
        { numRuns: 100 }
      );
    });

    it('should return valid greeting for all 24 hours', () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 23 }), (hour) => {
          const greeting = GreetingModule.getGreeting(hour);
          const validGreetings = ['Good Morning', 'Good Afternoon', 'Good Evening', 'Good Night'];
          expect(validGreetings).toContain(greeting);
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Validates: Requirements 1.3, 1.4, 1.5, 1.6
     */
  });

  describe('Property 2: Custom Name Appending', () => {
    it('should store custom name when setCustomName is called', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1, maxLength: 50 }), (name) => {
          GreetingModule.setCustomName(name);
          expect(GreetingModule.getCustomName()).toBe(name);
        }),
        { numRuns: 100 }
      );
    });

    it('should not append name to greeting when custom name is empty', () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 23 }), (hour) => {
          GreetingModule.setCustomName('');
          const greeting = GreetingModule.getGreeting(hour);
          // The greeting itself should not contain a comma
          expect(greeting).not.toContain(',');
        }),
        { numRuns: 100 }
      );
    });

    /**
     * Validates: Requirements 1.7, 1.9
     */
  });

  describe('Property 3: Time Display Format', () => {
    it('should always format time as HH:MM with valid hours and minutes', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 23 }),
          fc.integer({ min: 0, max: 59 }),
          (hour, minute) => {
            const date = new Date(2024, 0, 15, hour, minute, 0);
            const formatted = GreetingModule.formatTime(date);
            
            // Check format HH:MM
            expect(formatted).toMatch(/^\d{2}:\d{2}$/);
            
            // Check values are correct
            const [h, m] = formatted.split(':');
            expect(parseInt(h)).toBe(hour);
            expect(parseInt(m)).toBe(minute);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Validates: Requirements 1.1
     */
  });

  describe('Property 4: Date Display Format', () => {
    it('should always format date with day name, month name, day number, and year', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 11 }),
          fc.integer({ min: 1, max: 28 }),
          (month, day) => {
            const date = new Date(2024, month, day);
            const formatted = GreetingModule.formatDate(date);
            
            // Check format contains day name, month name, day number, and year
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                               'July', 'August', 'September', 'October', 'November', 'December'];
            
            const dayName = dayNames[date.getDay()];
            const monthName = monthNames[month];
            
            expect(formatted).toContain(dayName);
            expect(formatted).toContain(monthName);
            expect(formatted).toContain('2024');
            expect(formatted).toMatch(/\d{2}/); // Day number with padding
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Validates: Requirements 1.2
     */
  });
});
