/**
 * Universal Tabs Module
 * Provides reusable tab functionality for any page
 */
class TabsManager {
  constructor(containerSelector = ".tabs-container") {
    this.container = document.querySelector(containerSelector);
    this.tabButtons = this.container
      ? this.container.querySelectorAll(".tab-button")
      : [];
    this.tabContents = document.querySelectorAll(".tab-content");
    this.init();
  }

  init() {
    if (!this.container || this.tabButtons.length === 0) {
      console.warn("No tabs container or buttons found");
      return;
    }

    this.setupEventListeners();

    // Activate first tab by default if no tab is active
    if (!this.container.querySelector(".tab-button.active")) {
      this.activateTab(this.tabButtons[0]);
    }
  }

  setupEventListeners() {
    this.tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.switchTab(button);
      });
    });
  }

  switchTab(button) {
    const targetTab = button.getAttribute("data-tab");

    if (!targetTab) {
      console.warn("No data-tab attribute found on button");
      return;
    }

    // Remove active class from all buttons and contents
    this.tabButtons.forEach((btn) => btn.classList.remove("active"));
    this.tabContents.forEach((content) => content.classList.remove("active"));

    // Add active class to clicked button and corresponding content
    button.classList.add("active");
    const targetContent = document.getElementById(targetTab);

    if (targetContent) {
      targetContent.classList.add("active");
    } else {
      console.warn(`Tab content with id '${targetTab}' not found`);
    }
  }

  activateTab(button) {
    if (button) {
      this.switchTab(button);
    }
  }

  activateTabById(tabId) {
    const button = this.container.querySelector(`[data-tab="${tabId}"]`);
    if (button) {
      this.switchTab(button);
    }
  }

  // Static method to initialize tabs on any page
  static init(containerSelector = ".tabs-container") {
    return new TabsManager(containerSelector);
  }
}

// Auto-initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all tab containers on the page
  const tabContainers = document.querySelectorAll(".tabs-container");
  tabContainers.forEach((container, index) => {
    const selector =
      index === 0
        ? ".tabs-container"
        : `.tabs-container:nth-of-type(${index + 1})`;
    new TabsManager(selector);
  });
});

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = TabsManager;
}
