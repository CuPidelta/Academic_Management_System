const API_BASE = "http://localhost:3000";

//DOM refs
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const submitBtn = document.getElementById("submitBtn");
const msgEl = document.getElementById("msg");
const togglePwBtn = document.getElementById("togglePw");
const eyeShow = document.getElementById("eyeShow");
const eyeHide = document.getElementById("eyeHide");

//Password visibility toggle
if (togglePwBtn) {
  togglePwBtn.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";

    if (isHidden) {
      passwordInput.type = "text";

      togglePwBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" stroke-width="1.2" />
          <circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.2" />
        </svg>
      `;
    } else {
      passwordInput.type = "password";

      togglePwBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" stroke-width="1.2" opacity="0.4" />
          <line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
        </svg>
      `;
    }
  });
}

// Inline field validation
function setFieldError(groupId, errorId, message) {
  const group = document.getElementById(groupId);
  const error = document.getElementById(errorId);
  if (!group || !error) return;
  if (message) {
    group.classList.add("has-error");
    error.textContent = message;
  } else {
    group.classList.remove("has-error");
    error.textContent = "";
  }
}

function validateForm() {
  let valid = true;
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email) {
    setFieldError("emailGroup", "emailError", "Email is required.");
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setFieldError("emailGroup", "emailError", "Enter a valid email address.");
    valid = false;
  } else {
    setFieldError("emailGroup", "emailError", null);
  }

  if (!password) {
    setFieldError("passwordGroup", "passwordError", "Password is required.");
    valid = false;
  } else {
    setFieldError("passwordGroup", "passwordError", null);
  }

  return valid;
}

// Clear field errors while user types
if (emailInput)
  emailInput.addEventListener("input", () =>
    setFieldError("emailGroup", "emailError", null),
  );
if (passwordInput)
  passwordInput.addEventListener("input", () =>
    setFieldError("passwordGroup", "passwordError", null),
  );

// Status message helpers
function showMessage(text, type = "error") {
  if (!msgEl) return;
  msgEl.textContent = text;
  msgEl.className = `msg ${type}`;
}

function clearMessage() {
  if (!msgEl) return;
  msgEl.textContent = "";
  msgEl.className = "msg";
}

// Loading state
function setLoading(loading) {
  if (!submitBtn) return;
  submitBtn.disabled = loading;
  submitBtn.classList.toggle("loading", loading);
}

// Role
const ROLE_REDIRECT = {
  student: "student_dashboard.html",
  instructor: "instructor_dashboard.html",
  registrar: "registrar_dashboard.html",
  admin: "admin_home.html",
  staff: "admin_dashboard.html",
};

//Submit handler
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearMessage();

    if (!validateForm()) return;

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    setLoading(true);
    showMessage("Authenticating…", "info");

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.Success) {
        // Guard: ensure role is present before doing anything
        if (!data.User || !data.User.role) {
          throw new Error("User role missing from server response.");
        }

        // Clear stale session data to prevent role contamination
        localStorage.clear();

        const role = data.User.role.toLowerCase().trim();
        const userName = data.User.full_name || data.User.name || "User";

        // Persist session
        localStorage.setItem("token", data.Token);
        localStorage.setItem("role", role);
        localStorage.setItem("userName", userName);

        console.log("Login successful. Role:", role);

        // Redirect
        const destination = ROLE_REDIRECT[role];

        if (destination) {
          showMessage("Login successful! Redirecting…", "success");
          setTimeout(() => window.location.replace(destination), 700);
        } else {
          showMessage(
            "Access granted, but no dashboard is mapped for this role.",
            "warning",
          );
          localStorage.clear();
        }
      } else {
        showMessage(data.Message || "Invalid email or password.", "error");
      }
    } catch (err) {
      console.error("Login Error:", err);

      if (err.message === "User role missing from server response.") {
        showMessage(
          "Server error: user role is missing. Contact your administrator.",
          "error",
        );
      } else {
        showMessage(
          "Connection failed. Please check your server status.",
          "error",
        );
      }
    } finally {
      setLoading(false);
    }
  });
}

//Logout
function logout() {
  localStorage.clear();
  window.location.replace("login.html");
}
