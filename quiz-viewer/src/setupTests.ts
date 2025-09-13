import "@testing-library/jest-dom";
import { afterEach, beforeAll } from "vitest";

// Mock window.getComputedStyle to prevent React DOM errors in tests
Object.defineProperty(window, "getComputedStyle", {
  value: () => ({
    getPropertyValue: () => "",
  }),
});

// Mock ResizeObserver to prevent errors in tests
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock IntersectionObserver to prevent errors in tests
global.IntersectionObserver = class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
  root = null;
  rootMargin = "";
  thresholds = [];
} as any;

// Mock matchMedia to prevent errors in tests
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock requestAnimationFrame and cancelAnimationFrame
global.requestAnimationFrame = (callback: FrameRequestCallback) => {
  return setTimeout(callback, 0);
};
global.cancelAnimationFrame = (id: number) => {
  clearTimeout(id);
};

// Mock HTMLElement.prototype to prevent instanceof errors
beforeAll(() => {
  // Ensure HTMLElement is properly defined
  if (typeof HTMLElement === "undefined") {
    global.HTMLElement = class HTMLElement {} as any;
  }

  // Mock HTMLInputElement to implement value property
  if (typeof HTMLInputElement === "undefined") {
    global.HTMLInputElement = class HTMLInputElement extends HTMLElement {
      value: string = "";
      checked: boolean = false;
      type: string = "text";
    } as any;
  }

  // Mock document.createElement to return proper elements
  const originalCreateElement = document.createElement;
  document.createElement = function (tagName: string) {
    const element = originalCreateElement.call(this, tagName);

    // Add value property to input elements
    if (tagName.toLowerCase() === "input") {
      Object.defineProperty(element, "value", {
        get: function () {
          return this._value || "";
        },
        set: function (val) {
          this._value = val;
        },
        configurable: true,
      });

      Object.defineProperty(element, "checked", {
        get: function () {
          return this._checked || false;
        },
        set: function (val) {
          this._checked = val;
        },
        configurable: true,
      });
    }

    // Ensure the element has the correct constructor
    Object.setPrototypeOf(element, HTMLElement.prototype);
    return element;
  };
});

// Clean up after each test to prevent memory leaks
afterEach(() => {
  // Clean up any remaining DOM elements
  document.body.innerHTML = "";
});
