// Tabs functionality - handles switching between different content sections

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
      console.warn("No tabs found");
      return;
    }

    this.setupEventListeners();

    // Default to first tab if nothing is active
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
      console.warn("Missing data-tab attribute on button");
      return;
    }

    // Clear all active states first
    this.tabButtons.forEach((btn) => btn.classList.remove("active"));
    this.tabContents.forEach((content) => content.classList.remove("active"));

    // Set the new active states
    button.classList.add("active");
    const targetContent = document.getElementById(targetTab);

    if (targetContent) {
      targetContent.classList.add("active");
    } else {
      console.warn(`Couldn't find content for tab: ${targetTab}`);
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

  static init(containerSelector = ".tabs-container") {
    return new TabsManager(containerSelector);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const tabContainers = document.querySelectorAll(".tabs-container");
  tabContainers.forEach((container, index) => {
    const selector =
      index === 0
        ? ".tabs-container"
        : `.tabs-container:nth-of-type(${index + 1})`;
    new TabsManager(selector);
  });
});

if (typeof module !== "undefined" && module.exports) {
  module.exports = TabsManager;
}
