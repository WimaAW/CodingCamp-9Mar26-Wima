// Jest setup file for Productivity Dashboard tests

// Load the main script file
require('./script.js');

// Mock localStorage if not available
if (!global.localStorage) {
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
}

// Mock window.open for link tests
if (!global.window) {
  global.window = {};
}

global.window.open = jest.fn();

// Set up DOM environment
document.body.innerHTML = '';
