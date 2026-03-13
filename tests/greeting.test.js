/**
 * Unit Tests for Greeting Module
 */

describe('Greeting Module', () => {
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

  describe('formatTime', () => {
    it('should format time as HH:MM', () => {
      const date = new Date(2024, 0, 15, 14, 30, 0);
      expect(GreetingModule.formatTime(date)).toBe('14:30');
    });

    it('should pad single digit hours', () => {
      const date = new Date(2024, 0, 15, 9, 5, 0);
      expect(GreetingModule.formatTime(date)).toBe('09:05');
    });

    it('should handle midnight', () => {
      const date = new Date(2024, 0, 15, 0, 0, 0);
      expect(GreetingModule.formatTime(date)).toBe('00:00');
    });

    it('should handle 23:59', () => {
      const date = new Date(2024, 0, 15, 23, 59, 0);
      expect(GreetingModule.formatTime(date)).toBe('23:59');
    });
  });

  describe('formatDate', () => {
    it('should format date as "Day, Month DD, YYYY"', () => {
      const date = new Date(2024, 0, 15); // January 15, 2024 (Monday)
      expect(GreetingModule.formatDate(date)).toBe('Monday, January 15, 2024');
    });

    it('should pad single digit days', () => {
      const date = new Date(2024, 0, 5); // January 5, 2024 (Friday)
      expect(GreetingModule.formatDate(date)).toBe('Friday, January 05, 2024');
    });

    it('should handle different months', () => {
      const date = new Date(2024, 11, 25); // December 25, 2024 (Wednesday)
      expect(GreetingModule.formatDate(date)).toBe('Wednesday, December 25, 2024');
    });
  });

  describe('getGreeting', () => {
    it('should return "Good Morning" for hours 5-11', () => {
      expect(GreetingModule.getGreeting(5)).toBe('Good Morning');
      expect(GreetingModule.getGreeting(8)).toBe('Good Morning');
      expect(GreetingModule.getGreeting(11)).toBe('Good Morning');
    });

    it('should return "Good Afternoon" for hours 12-16', () => {
      expect(GreetingModule.getGreeting(12)).toBe('Good Afternoon');
      expect(GreetingModule.getGreeting(14)).toBe('Good Afternoon');
      expect(GreetingModule.getGreeting(16)).toBe('Good Afternoon');
    });

    it('should return "Good Evening" for hours 17-23', () => {
      expect(GreetingModule.getGreeting(17)).toBe('Good Evening');
      expect(GreetingModule.getGreeting(20)).toBe('Good Evening');
      expect(GreetingModule.getGreeting(23)).toBe('Good Evening');
    });

    it('should return "Good Night" for hours 0-4', () => {
      expect(GreetingModule.getGreeting(0)).toBe('Good Night');
      expect(GreetingModule.getGreeting(2)).toBe('Good Night');
      expect(GreetingModule.getGreeting(4)).toBe('Good Night');
    });
  });

  describe('setCustomName and getCustomName', () => {
    it('should set and get custom name', () => {
      GreetingModule.setCustomName('Alex');
      expect(GreetingModule.getCustomName()).toBe('Alex');
    });

    it('should save custom name to localStorage', () => {
      GreetingModule.setCustomName('Jordan');
      expect(localStorage.getItem('pd_customName')).toBe(JSON.stringify('Jordan'));
    });

    it('should handle empty name', () => {
      GreetingModule.setCustomName('');
      expect(GreetingModule.getCustomName()).toBe('');
    });
  });

  describe('loadCustomName', () => {
    it('should load custom name from localStorage', () => {
      localStorage.setItem('pd_customName', JSON.stringify('Sam'));
      GreetingModule.loadCustomName();
      expect(GreetingModule.getCustomName()).toBe('Sam');
    });

    it('should handle missing custom name in localStorage', () => {
      GreetingModule.loadCustomName();
      expect(GreetingModule.getCustomName()).toBe('');
    });
  });

  describe('updateDisplay', () => {
    it('should update current time', () => {
      GreetingModule.updateDisplay();
      expect(GreetingModule.state.currentTime).toMatch(/^\d{2}:\d{2}$/);
    });

    it('should update current date', () => {
      GreetingModule.updateDisplay();
      expect(GreetingModule.state.currentDate).toMatch(/^[A-Za-z]+, [A-Za-z]+ \d{2}, \d{4}$/);
    });

    it('should update greeting based on current hour', () => {
      GreetingModule.updateDisplay();
      const hour = new Date().getHours();
      const expectedGreeting = GreetingModule.getGreeting(hour);
      expect(GreetingModule.state.greeting).toBe(expectedGreeting);
    });
  });

  describe('setupUpdateInterval', () => {
    it('should set up an interval', () => {
      GreetingModule.setupUpdateInterval();
      expect(GreetingModule.state.updateIntervalId).toBeDefined();
      expect(typeof GreetingModule.state.updateIntervalId).toBe('number');
    });

    it('should clear previous interval before setting new one', () => {
      GreetingModule.setupUpdateInterval();
      const firstId = GreetingModule.state.updateIntervalId;
      GreetingModule.setupUpdateInterval();
      const secondId = GreetingModule.state.updateIntervalId;
      expect(firstId).not.toBe(secondId);
    });
  });
});
