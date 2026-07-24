

const API_BASE = "http://localhost:3000";
const token = localStorage.getItem("token");
const rawRole = localStorage.getItem("role");
const userRole = rawRole ? rawRole.toLowerCase() : null;
const userName = localStorage.getItem("userName") || "Admin";

// ─── AUTH UTILITIES ───────────────────────────────────────────────────────────
function logout(reason = "Manual logout") {
  console.log("Logout:", reason);
  localStorage.clear();
  window.location.replace("login.html");
}

async function handleAuthError(res) {
  if (res.status === 401) {
    logout("Session expired");
    return true;
  }
  if (res.status === 403) {
    const data = await res.json().catch(() => ({}));
    showFormMsg(data.Message || "Access Denied.", "error");
    return true;
  }
  return false;
}

// ─── TOPBAR USER INFO ─────────────────────────────────────────────────────────
function initTopbar() {
  const nameEl = document.getElementById("adminNameDisplay");
  const roleEl = document.getElementById("adminRoleDisplay");
  const avatarEl = document.getElementById("adminAvatar");

  if (nameEl) nameEl.textContent = userName;
  if (roleEl) roleEl.textContent = userRole || "—";
  if (avatarEl) avatarEl.textContent = userName.charAt(0).toUpperCase();
}

// ─── FORM MESSAGE ─────────────────────────────────────────────────────────────
function showFormMsg(text, type = "info") {
  const el = document.getElementById("formMsg");
  if (!el) return;
  el.textContent = text;
  el.className = `form-msg ${type}`;
}

function clearFormMsg() {
  const el = document.getElementById("formMsg");
  if (!el) return;
  el.textContent = "";
  el.className = "form-msg";
}

// BUTTON LOADING STATE 
function setSubmitLoading(loading) {
  const btn = document.getElementById("submitBtn");
  if (!btn) return;
  btn.disabled = loading;
  btn.classList.toggle("loading", loading);
}

// FORM SUBMIT 
const userForm = document.getElementById("userForm");
if (userForm) {
  userForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearFormMsg();

    const dbId = document.getElementById("db_id").value;
    const isEditing = !!dbId;
    const selectedRole = document.getElementById("userRole").value;
    const pwdValue = document.getElementById("userPassword").value;

    const payload = {
      role_name: selectedRole,
      full_name: document.getElementById("fullName").value.trim(),
      email: document.getElementById("userEmail").value.trim(),
    };

    if (!isEditing || pwdValue.trim() !== "") {
      payload.password = pwdValue;
    }

    if (selectedRole === "student") {
      payload.custom_id = document
        .getElementById("customStudentId")
        .value.trim();
      payload.year_level = document.getElementById("yearLevel").value;
      payload.program = document.getElementById("program").value.trim();
    }

    const url = isEditing
      ? `${API_BASE}/auth/users/${dbId}`
      : `${API_BASE}/auth/register`;
    const method = isEditing ? "PUT" : "POST";

    setSubmitLoading(true);
    showFormMsg(isEditing ? "Updating account…" : "Creating account…", "info");

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (await handleAuthError(res)) return;

      const data = await res.json();

      if (data.Success) {
        showFormMsg(
          data.Message || (isEditing ? "Account updated." : "Account created."),
          "success",
        );
        resetForm();
        fetchUsers();
      } else {
        showFormMsg(data.Message || "Operation failed.", "error");
      }
    } catch (err) {
      console.error("Form submit error:", err);
      showFormMsg(
        "Server connection failed. Check your server status.",
        "error",
      );
    } finally {
      setSubmitLoading(false);
    }
  });
}

//EDIT USER
async function editUser(userId) {
  try {
    const res = await fetch(`${API_BASE}/auth/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (await handleAuthError(res)) return;
    const data = await res.json();

    if (data.Success) {
      const u = data.User;

      document.getElementById("db_id").value = u.user_id;
      document.getElementById("userRole").value = u.role;
      document.getElementById("fullName").value = u.full_name;
      document.getElementById("userEmail").value = u.email;

      const pwdField = document.getElementById("userPassword");
      pwdField.required = false;
      pwdField.placeholder = "Leave blank to keep current";
      pwdField.value = "";

      if (u.role === "student") {
        document.getElementById("customStudentId").value = u.custom_id || "";
        document.getElementById("yearLevel").value = u.year_level || "1st Year";
        document.getElementById("program").value = u.program || "";
      }

      toggleStudentFields();

      document.getElementById("formTitle").textContent = "Edit User Account";
      document
        .getElementById("submitBtn")
        .querySelector(".btn-text").textContent = "Update Account";

      const cancelBtn = document.getElementById("cancelEditBtn");
      if (cancelBtn) cancelBtn.style.display = "inline-flex";

      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      showFormMsg("Could not load user details.", "error");
    }
  } catch (err) {
    console.error("Edit fetch error:", err);
    showFormMsg("Error fetching user details.", "error");
  }
}

// DELETE / DEACTIVATE USER 
let pendingDeleteId = null;

function deleteUser(userId) {
  pendingDeleteId = userId;
  openModal();
}

function openModal() {
  const modal = document.getElementById("confirmModal");
  if (modal) modal.classList.add("open");
}

function closeModal() {
  const modal = document.getElementById("confirmModal");
  if (modal) modal.classList.remove("open");
  pendingDeleteId = null;
}

// Close modal on overlay click
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("confirmModal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  const confirmBtn = document.getElementById("confirmDeleteBtn");
  if (confirmBtn) {
    confirmBtn.addEventListener("click", async () => {
      if (!pendingDeleteId) return;
      closeModal();
      await confirmDelete(pendingDeleteId);
    });
  }
});

async function confirmDelete(userId) {
  try {
    const res = await fetch(`${API_BASE}/auth/users/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (await handleAuthError(res)) return;
    const data = await res.json();

    if (data.Success) {
      showFormMsg("User deactivated successfully.", "success");
      fetchUsers();
    } else {
      showFormMsg(data.Message || "Deactivation failed.", "error");
    }
  } catch (err) {
    console.error("Delete error:", err);
    showFormMsg("Delete failed. Check your server status.", "error");
  }
}

//RESET FORM
function resetForm() {
  if (!userForm) return;
  userForm.reset();

  document.getElementById("db_id").value = "";
  document.getElementById("formTitle").textContent = "Create New User Account";
  document.getElementById("submitBtn").querySelector(".btn-text").textContent =
    "Save Account";

  const pwdField = document.getElementById("userPassword");
  pwdField.required = true;
  pwdField.placeholder = "Set initial password";

  const cancelBtn = document.getElementById("cancelEditBtn");
  if (cancelBtn) cancelBtn.style.display = "none";

  clearFormMsg();
  toggleStudentFields();
}

//FETCH & RENDER USERS
async function fetchUsers() {
  const studentBody = document.getElementById("studentTableBody");
  const instructorBody = document.getElementById("instructorTableBody");
  const staffBody = document.getElementById("staffTableBody");

  // Show loading state
  const emptyRow = (cols, msg) =>
    `<tr><td colspan="${cols}" class="table-empty">${msg}</td></tr>`;

  if (studentBody) studentBody.innerHTML = emptyRow(4, "Loading…");
  if (instructorBody) instructorBody.innerHTML = emptyRow(3, "Loading…");
  if (staffBody) staffBody.innerHTML = emptyRow(4, "Loading…");

  try {
    const res = await fetch(`${API_BASE}/auth/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (await handleAuthError(res)) return;
    const data = await res.json();

    if (!data.Success) {
      const errMsg = data.Message || "Failed to load users.";
      if (studentBody) studentBody.innerHTML = emptyRow(4, errMsg);
      if (instructorBody) instructorBody.innerHTML = emptyRow(3, errMsg);
      if (staffBody) staffBody.innerHTML = emptyRow(4, errMsg);
      return;
    }

    const users = data.Users;

    // Students
    if (studentBody) {
      const students = users.filter((u) => u.role === "student");
      updateCount("studentCount", students.length, "student");
      studentBody.innerHTML = students.length
        ? students
            .map(
              (u) => `
          <tr>
            <td><strong>${u.custom_id || "—"}</strong></td>
            <td>${u.full_name}</td>
            <td>${u.year_level} · ${u.program}</td>
            <td>
              <button class="btn-edit"   onclick="editUser(${u.user_id})">Edit</button>
              <button class="btn-delete" onclick="deleteUser(${u.user_id})">Deactivate</button>
            </td>
          </tr>`,
            )
            .join("")
        : emptyRow(4, "No students registered yet.");
    }

    // Instructors
    if (instructorBody) {
      const instructors = users.filter((u) => u.role === "instructor");
      updateCount("instructorCount", instructors.length, "instructor");
      instructorBody.innerHTML = instructors.length
        ? instructors
            .map(
              (u) => `
          <tr>
            <td>${u.full_name}</td>
            <td>${u.email}</td>
            <td>
              <button class="btn-edit"   onclick="editUser(${u.user_id})">Edit</button>
              <button class="btn-delete" onclick="deleteUser(${u.user_id})">Deactivate</button>
            </td>
          </tr>`,
            )
            .join("")
        : emptyRow(3, "No instructors registered yet.");
    }

    // Staff (admin + registrar)
    if (staffBody) {
      const staff = users.filter((u) =>
        ["admin", "registrar"].includes(u.role),
      );
      updateCount("staffCount", staff.length, "staff member");
      staffBody.innerHTML = staff.length
        ? staff
            .map(
              (u) => `
          <tr>
            <td><span class="role-badge ${u.role}">${u.role.toUpperCase()}</span></td>
            <td>${u.full_name}</td>
            <td>${u.email}</td>
            <td>
              <button class="btn-edit"   onclick="editUser(${u.user_id})">Edit</button>
              <button class="btn-delete" onclick="deleteUser(${u.user_id})">Deactivate</button>
            </td>
          </tr>`,
            )
            .join("")
        : emptyRow(4, "No staff accounts found.");
    }
  } catch (err) {
    console.error("fetchUsers error:", err);
    const errMsg = "Could not reach the server.";
    if (studentBody) studentBody.innerHTML = emptyRow(4, errMsg);
    if (instructorBody) instructorBody.innerHTML = emptyRow(3, errMsg);
    if (staffBody) staffBody.innerHTML = emptyRow(4, errMsg);
  }
}

function updateCount(elId, count, label) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.textContent = `${count} ${label}${count !== 1 ? "s" : ""} registered`;
}

//EXPOSE toggleStudentFields globally 
window.toggleStudentFields = function () {
  const role = document.getElementById("userRole")?.value;
  const section = document.getElementById("studentFieldsSection");
  if (!section) return;
  if (role === "student") {
    section.style.display = "grid";
    section
      .querySelectorAll("input, select")
      .forEach((i) => (i.required = true));
  } else {
    section.style.display = "none";
    section.querySelectorAll("input, select").forEach((i) => {
      i.required = false;
      i.value = "";
    });
  }
};

//INIT
document.addEventListener("DOMContentLoaded", () => {
  if (!token || !["admin", "registrar"].includes(userRole)) {
    logout("Invalid session or role");
    return;
  }
  initTopbar();
  fetchUsers();
  fetchDashboardStats();
});

// DASHBOARD STATS
async function fetchDashboardStats() {
  try {
    // Run all three fetches in parallel
    const [usersRes, coursesRes, enrollRes, gradesRes] = await Promise.all([
      fetch(`${API_BASE}/auth/users`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${API_BASE}/courses/all`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${API_BASE}/enrollment/all`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${API_BASE}/grades/all`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const [usersData, coursesData, enrollData, gradesData] = await Promise.all([
      usersRes.json(),
      coursesRes.json(),
      enrollRes.json(),
      gradesRes.json(),
    ]);

    // Users breakdown
    if (usersData.Success) {
      const users = usersData.Users || [];
      const students = users.filter((u) => u.role === "student");
      const instructors = users.filter((u) => u.role === "instructor");
      const staff = users.filter((u) =>
        ["admin", "registrar"].includes(u.role),
      );
      setStatText("statStudents", students.length);
      setStatText("statInstructors", instructors.length);
      setStatText("statStaff", staff.length);
    }

    // Courses
    if (coursesData.Success) {
      setStatText("statCourses", (coursesData.Courses || []).length);
    }

    // Enrollments
    if (enrollData.Success) {
      setStatText("statEnrollments", (enrollData.Enrollments || []).length);
    }

    // Passing rate from grades
    if (gradesData.Success) {
      const grades = gradesData.Grades || [];
      const graded = grades.filter(
        (g) => g.grade_value !== null && g.grade_value !== undefined,
      );
      const passing = graded.filter((g) => parseFloat(g.grade_value) <= 3.0);
      const rate = graded.length
        ? Math.round((passing.length / graded.length) * 100) + "%"
        : "N/A";
      setStatText("statPassRate", rate);
    }
  } catch (err) {
    console.error("fetchDashboardStats error:", err);
  }
}

function setStatText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

// TOGGLE PASSWORD VISIBILITY 
function togglePasswordVisibility() {
  const pwdInput = document.getElementById("userPassword");
  const eyeIcon = document.getElementById("eyeIcon");

  if (pwdInput.type === "password") {
    // Switch to Text
    pwdInput.type = "text";
    // Change icon to Open Eye
    eyeIcon.innerHTML = `
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    `;
    eyeIcon.style.color = "#333";
  } else {
    // Switch to Password
    pwdInput.type = "password";
    // Change icon back to Closed Eye (Slash)
    eyeIcon.innerHTML = `
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    `;
    eyeIcon.style.color = "#666";
  }
}
