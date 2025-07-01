// User dropdown functionality
function createUserDropdown() {
  // Don't run on auth page - it has its own login/register forms
  if (window.location.pathname.includes("auth.html")) {
    return;
  }

  const accountNav = document.querySelector(".account-nav ul");
  if (!accountNav) return;

  const userInfo = JSON.parse(localStorage.getItem("user"));
  const isAdmin = localStorage.getItem("is_admin");

  // Check admin access protection
  if (window.location.pathname.includes("admin.html")) {
    if (!userInfo) {
      alert("You must be logged in to access the Admin Dashboard.");
      window.location.href = window.location.pathname.includes("pages/")
        ? "../index.html"
        : "index.html";
      return;
    }
    if (isAdmin !== "1") {
      alert("Access denied. You do not have admin privileges.");
      window.location.href = window.location.pathname.includes("pages/")
        ? "../index.html"
        : "index.html";
      return;
    }
  }

  // Find existing login/register link or create new structure
  let existingItems = Array.from(accountNav.children);
  let loginRegisterItem = existingItems.find(
    (item) =>
      item.querySelector("a") &&
      item.querySelector("a").textContent === "Login/Register"
  );

  // Find and handle admin dashboard link
  let adminDashboardItem = existingItems.find(
    (item) =>
      item.querySelector("a") &&
      item.querySelector("a").textContent === "Admin Dashboard"
  );

  // Hide admin dashboard for non-admin users
  if (adminDashboardItem) {
    if (isAdmin !== "1") {
      adminDashboardItem.style.display = "none";
    } else {
      adminDashboardItem.style.display = "block";
    }
  }

  if (userInfo) {
    // User is logged in - show dropdown
    if (loginRegisterItem) {
      // Replace the login/register item with user dropdown
      loginRegisterItem.remove();
    }

    const dropdownContainer = document.createElement("li");
    dropdownContainer.className = "user-dropdown";

    const userButton = document.createElement("button");
    userButton.className = "user-button";
    userButton.innerHTML = `
      <span class="user-name">${userInfo.username}</span>
      <span class="dropdown-arrow">▼</span>
    `;

    const dropdownMenu = document.createElement("ul");
    dropdownMenu.className = "dropdown-menu";

    const logoutItem = document.createElement("li");
    const logoutButton = document.createElement("button");
    logoutButton.className = "logout-button";
    logoutButton.textContent = "Logout";
    logoutButton.addEventListener("click", handleLogout);
    logoutItem.appendChild(logoutButton);
    dropdownMenu.appendChild(logoutItem);

    dropdownContainer.appendChild(userButton);
    dropdownContainer.appendChild(dropdownMenu);
    accountNav.appendChild(dropdownContainer);

    // Toggle dropdown on click
    userButton.addEventListener("click", function (e) {
      e.stopPropagation();
      dropdownMenu.classList.toggle("show");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function (e) {
      if (!dropdownContainer.contains(e.target)) {
        dropdownMenu.classList.remove("show");
      }
    });
  } else {
    // User is not logged in - show login/register link
    if (!loginRegisterItem) {
      const loginItem = document.createElement("li");
      const loginLink = document.createElement("a");
      loginLink.href = window.location.pathname.includes("pages/")
        ? "auth.html"
        : "pages/auth.html";
      loginLink.textContent = "Login/Register";
      loginItem.appendChild(loginLink);
      accountNav.appendChild(loginItem);
    }
  }
}

// Handle logout
function handleLogout() {
  localStorage.clear();
  window.location.reload();
}

// Initialize user dropdown when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  createUserDropdown();
});
