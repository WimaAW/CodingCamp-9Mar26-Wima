/**
 * Unit Tests for Focus Timer Module
 * Tests specific examples and edge cases for timer functionality
 */

describe('Focus Timer Module', () => {
  let timerDisplay;
  let startBtn;
  let stopBtn;
  let resetBtn;

  beforeEach(() => {
    // Set up DOM elements
    document.body.innerHTML = `
      <div id="timer-display">25:00</div>
      <button id="timer-start">Start</button>
      <button id="timer-stop" disabled>Stop</button>
      <button id="timer-reset">Reset</button>
      <div id="error-container"></div>
    `;

    timerDisplay = document.getElementById('timer-display');
    startBtn = document.getElementById('timer-start');
    stopBtn = document.getElementById('timer-stop');
    resetBtn = document.getElementById('timer-reset');

    // Reset module state
    FocusTimerModule.state = {
      totalSeconds: 1500,
      remainingSeconds: 1500,
      isRunning: false,
      intervalId: null
    };

    // Re-initialize to set up event listeners
    FocusTimerModule.init();
  });

  afterEach(() => {
    // Clean up any intervals
    if (FocusTimerModule.state.intervalId) {
      clearInterval(FocusTimerModule.state.intervalId);
      FocusTimerModule.state.intervalId = null;
    }
  });

  describe('Initialization', () => {
    it('should initialize timer to 25:00 (1500 seconds)', () => {
      expect(FocusTimerModule.state.remainingSeconds).toBe(1500);
      expect(timerDisplay.textContent).toBe('25:00');
    });

    it('should initialize with isRunning as false', () => {
      expect(FocusTimerModule.state.isRunning).toBe(false);
    });

    it('should have Start button enabled and Stop button disabled initially', () => {
      expect(startBtn.disabled).toBe(false);
      expect(stopBtn.disabled).toBe(true);
    });
  });

  describe('Display Format', () => {
    it('should display time in MM:SS format', () => {
      FocusTimerModule.state.remainingSeconds = 125; // 2:05
      FocusTimerModule.updateDisplay();
      expect(timerDisplay.textContent).toBe('02:05');
    });

    it('should display 00:00 when timer reaches 0', () => {
      FocusTimerModule.state.remainingSeconds = 0;
      FocusTimerModule.updateDisplay();
      expect(timerDisplay.textContent).toBe('00:00');
    });

    it('should display 01:00 for 60 seconds', () => {
      FocusTimerModule.state.remainingSeconds = 60;
      FocusTimerModule.updateDisplay();
      expect(timerDisplay.textContent).toBe('01:00');
    });

    it('should display 00:01 for 1 second', () => {
      FocusTimerModule.state.remainingSeconds = 1;
      FocusTimerModule.updateDisplay();
      expect(timerDisplay.textContent).toBe('00:01');
    });
  });

  describe('Start Functionality', () => {
    it('should set isRunning to true when start is called', () => {
      FocusTimerModule.start();
      expect(FocusTimerModule.state.isRunning).toBe(true);
    });

    it('should disable Start button when timer starts', () => {
      FocusTimerModule.start();
      expect(startBtn.disabled).toBe(true);
    });

    it('should enable Stop button when timer starts', () => {
      FocusTimerModule.start();
      expect(stopBtn.disabled).toBe(false);
    });

    it('should set an interval ID when started', () => {
      FocusTimerModule.start();
      expect(FocusTimerModule.state.intervalId).not.toBeNull();
    });

    it('should not start if already running', () => {
      FocusTimerModule.start();
      const firstIntervalId = FocusTimerModule.state.intervalId;
      FocusTimerModule.start();
      expect(FocusTimerModule.state.intervalId).toBe(firstIntervalId);
    });
  });

  describe('Stop Functionality', () => {
    it('should set isRunning to false when stop is called', () => {
      FocusTimerModule.start();
      FocusTimerModule.stop();
      expect(FocusTimerModule.state.isRunning).toBe(false);
    });

    it('should enable Start button when timer stops', () => {
      FocusTimerModule.start();
      FocusTimerModule.stop();
      expect(startBtn.disabled).toBe(false);
    });

    it('should disable Stop button when timer stops', () => {
      FocusTimerModule.start();
      FocusTimerModule.stop();
      expect(stopBtn.disabled).toBe(true);
    });

    it('should clear the interval when stopped', () => {
      FocusTimerModule.start();
      const intervalId = FocusTimerModule.state.intervalId;
      FocusTimerModule.stop();
      expect(FocusTimerModule.state.intervalId).toBeNull();
    });

    it('should pause countdown (not decrement) after stop', () => {
      FocusTimerModule.start();
      FocusTimerModule.stop();
      const remainingBefore = FocusTimerModule.state.remainingSeconds;
      FocusTimerModule.tick();
      expect(FocusTimerModule.state.remainingSeconds).toBe(remainingBefore);
    });
  });

  describe('Reset Functionality', () => {
    it('should return timer to 25:00 (1500 seconds)', () => {
      FocusTimerModule.state.remainingSeconds = 500;
      FocusTimerModule.reset();
      expect(FocusTimerModule.state.remainingSeconds).toBe(1500);
      expect(timerDisplay.textContent).toBe('25:00');
    });

    it('should stop the timer when reset', () => {
      FocusTimerModule.start();
      FocusTimerModule.reset();
      expect(FocusTimerModule.state.isRunning).toBe(false);
    });

    it('should enable Start button after reset', () => {
      FocusTimerModule.start();
      FocusTimerModule.reset();
      expect(startBtn.disabled).toBe(false);
    });

    it('should clear interval when reset', () => {
      FocusTimerModule.start();
      FocusTimerModule.reset();
      expect(FocusTimerModule.state.intervalId).toBeNull();
    });
  });

  describe('Tick Functionality', () => {
    it('should decrement remainingSeconds by 1', () => {
      FocusTimerModule.state.remainingSeconds = 100;
      FocusTimerModule.tick();
      expect(FocusTimerModule.state.remainingSeconds).toBe(99);
    });

    it('should update display after tick', () => {
      FocusTimerModule.state.remainingSeconds = 100;
      FocusTimerModule.tick();
      expect(timerDisplay.textContent).toBe('01:39');
    });

    it('should not go below 0 seconds', () => {
      FocusTimerModule.state.remainingSeconds = 0;
      FocusTimerModule.tick();
      expect(FocusTimerModule.state.remainingSeconds).toBe(0);
    });

    it('should stop timer when reaching 0 seconds', () => {
      FocusTimerModule.state.remainingSeconds = 1;
      FocusTimerModule.state.isRunning = true;
      FocusTimerModule.tick();
      expect(FocusTimerModule.state.isRunning).toBe(false);
    });
  });

  describe('Button State Management', () => {
    it('should disable Start and enable Stop when running', () => {
      FocusTimerModule.start();
      expect(startBtn.disabled).toBe(true);
      expect(stopBtn.disabled).toBe(false);
    });

    it('should enable Start and disable Stop when paused', () => {
      FocusTimerModule.start();
      FocusTimerModule.stop();
      expect(startBtn.disabled).toBe(false);
      expect(stopBtn.disabled).toBe(true);
    });

    it('should enable Start and disable Stop after reset', () => {
      FocusTimerModule.start();
      FocusTimerModule.reset();
      expect(startBtn.disabled).toBe(false);
      expect(stopBtn.disabled).toBe(true);
    });
  });

  describe('Completion Notification', () => {
    it('should show completion notification when timer reaches 0', () => {
      const errorContainer = document.getElementById('error-container');
      FocusTimerModule.state.remainingSeconds = 1;
      FocusTimerModule.state.isRunning = true;
      FocusTimerModule.tick();
      
      // Check that an error message was added to the container
      const errorMessages = errorContainer.querySelectorAll('.error-message');
      expect(errorMessages.length).toBeGreaterThan(0);
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete start-stop-reset cycle', () => {
      // Start
      FocusTimerModule.start();
      expect(FocusTimerModule.state.isRunning).toBe(true);
      expect(startBtn.disabled).toBe(true);

      // Stop
      FocusTimerModule.stop();
      expect(FocusTimerModule.state.isRunning).toBe(false);
      expect(startBtn.disabled).toBe(false);

      // Reset
      FocusTimerModule.reset();
      expect(FocusTimerModule.state.remainingSeconds).toBe(1500);
      expect(timerDisplay.textContent).toBe('25:00');
    });

    it('should handle multiple start-stop cycles', () => {
      FocusTimerModule.start();
      FocusTimerModule.stop();
      FocusTimerModule.start();
      FocusTimerModule.stop();
      
      expect(FocusTimerModule.state.isRunning).toBe(false);
      expect(startBtn.disabled).toBe(false);
    });

    it('should maintain correct time after pause and resume', () => {
      FocusTimerModule.state.remainingSeconds = 500;
      FocusTimerModule.start();
      FocusTimerModule.stop();
      
      const pausedTime = FocusTimerModule.state.remainingSeconds;
      FocusTimerModule.start();
      FocusTimerModule.stop();
      
      expect(FocusTimerModule.state.remainingSeconds).toBe(pausedTime);
    });
  });
});
