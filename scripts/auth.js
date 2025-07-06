async function register() {
  try {
    const response = await axios.post(
      "http://localhost/cinema-booking-backend/users/register",
      {
        username: document.getElementById("register-name").value,
        email: document.getElementById("register-email").value,
        password: document.getElementById("register-password").value,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 201 && response.data.success) {
      alert(response.data.message);
      // Switch to login tab after successful registration
      document.querySelector('[data-tab="login"]').click();
    } else {
      alert(response.data.error || "Registration failed");
    }
  } catch (error) {
    console.error("Error registering user:", error);
    if (error.response && error.response.data && error.response.data.error) {
      alert(error.response.data.error);
    } else {
      alert("Registration failed. Please try again.");
    }
  }
}

async function login() {
  try {
    const response = await axios.post(
      "http://localhost/cinema-booking-backend/users/login",
      {
        email: document.getElementById("login-email").value,
        password: document.getElementById("login-password").value,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      const userData = {
        id: response.data.user_id,
        username: response.data.username,
        is_admin: response.data.is_admin,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("is_admin", response.data.is_admin ? "1" : "0");
      if (response.data.is_admin) {
        window.location.href = "admin.html";
      } else {
        // Redirect to home page and let the dropdown update
        window.location.href = "../index.html";
      }
    } else {
      alert(response.data.error || "Login failed");
    }
  } catch (error) {
    console.error("Error logging in:", error);
    if (error.response && error.response.data && error.response.data.error) {
      alert(error.response.data.error);
    } else {
      alert("Login failed. Please try again.");
    }
  }
}

// Logout is now handled in main.js

document.addEventListener("DOMContentLoaded", function () {
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const isAdmin = localStorage.getItem("is_admin");
  const onAdminPage = window.location.pathname.includes("admin.html");
  const dashboard = document.querySelector(".admin-dashboard");
  const authButtons = document.querySelectorAll(".auth-button");

  // Add form event listeners
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      login();
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      register();
    });
  }

  // Check if user is already logged in and redirect if necessary
  if (userInfo && window.location.pathname.includes("auth.html")) {
    if (isAdmin === "1") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "../index.html";
    }
  }

  // Check admin access
  if (onAdminPage && isAdmin !== "1") {
    window.location.href = "../index.html";
  }
});
