const API_BASE = "http://localhost:3000";
const token = localStorage.getItem("token");
const userName = localStorage.getItem("userName") || "Admin";
const userRole = localStorage.getItem("role") || "";

async function logAction(action, target_type, target_id, details) {
  try {
    await fetch(`${API_BASE}/audit/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ action, target_type, target_id, details }),
    });
  } catch {}
}

function logout() {
  localStorage.clear();
  window.location.replace("login.html");
}

async function handleAuthError(res) {
  if (res.status === 401) {
    logout();
    return true;
  }
  if (res.status === 403) {
    const data = await res.json().catch(() => ({}));
    showMsg(data.Message || "Access Denied.", "error");
    return true;
  }
  return false;
}

function initTopbar() {
  const nameEl = document.getElementById("adminNameDisplay");
  const roleEl = document.getElementById("adminRoleDisplay");
  const avatarEl = document.getElementById("adminAvatar");
  if (nameEl) nameEl.textContent = userName;
  if (roleEl) roleEl.textContent = userRole;
  if (avatarEl) avatarEl.textContent = userName.charAt(0).toUpperCase();

  // Set dashboard link based on role
  const dashLink = document.getElementById("dashboardNavLink");
  if (dashLink) {
    dashLink.href =
      userRole === "registrar" ? "registrar_dashboard.html" : "admin_home.html";
  }

  const userAccountsLink = document.getElementById("userAccountsLink");
  if (userAccountsLink && userRole === "registrar") {
    userAccountsLink.style.display = "none";
  }

  const sidebar = document.querySelector(".sidebar");
  if (sidebar) sidebar.style.opacity = "1";
}

//MESSAGE HELPERS
function setFieldError(elId, message) {
  const el = document.getElementById(elId);
  if (!el) return;
  if (message) {
    el.textContent = message;
    el.style.display = "block";
  } else {
    el.textContent = "";
    el.style.display = "none";
  }
}

function showMsg(text, type = "info") {
  const el = document.getElementById("formMsg");
  if (!el) return;
  el.textContent = text;
  el.className = `form-msg ${type}`;
}

function clearMsg() {
  const el = document.getElementById("formMsg");
  if (!el) return;
  el.textContent = "";
  el.className = "form-msg";
}

function setLoading(loading) {
  const btn = document.getElementById("submitBtn");
  if (!btn) return;
  btn.disabled = loading;
  btn.classList.toggle("loading", loading);
}

//LOOKUP STUDENT BY CUSTOM ID
async function lookupStudentByCustomId(customId) {
  try {
    const res = await fetch(`${API_BASE}/auth/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    if (data.Success) {
      const match = data.Users.find(
        (u) =>
          u.role === "student" &&
          (u.custom_id || "").toLowerCase() === customId.toLowerCase().trim(),
      );
      return match || null;
    }
    return null;
  } catch (err) {
    console.error("lookupStudentByCustomId error:", err);
    return null;
  }
}

//FETCH COURSES
async function fetchCourses() {
  const courseSelect = document.getElementById("course_id");

  try {
    const res = await fetch(`${API_BASE}/courses/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    if (data.Success) {
      courseSelect.innerHTML =
        '<option value="">— Select Course —</option>' +
        data.Courses.map(
          (c) =>
            `<option value="${c.course_id}">${c.course_code} — ${c.title}</option>`,
        ).join("");
    }
  } catch (err) {
    console.error("fetchCourses error:", err);
  }
}

// ENROLLMENT FORM SUBMIT
const enrollmentForm = document.getElementById("enrollmentForm");
if (enrollmentForm) {
  enrollmentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearMsg();

    const customId = document.getElementById("student_id_input").value.trim();
    const course_id = document.getElementById("course_id").value;
    const term = document.getElementById("term").value;
    const semester = document.getElementById("semester").value;

    // Validate inputs
    if (!customId) {
      setFieldError("studentIdError", "Please enter a Student ID.");
      return;
    }
    if (!course_id) {
      showMsg("Please select a course.", "warning");
      return;
    }
    if (!term) {
      showMsg("Please select a term.", "warning");
      return;
    }
    if (!semester) {
      showMsg("Please select a semester.", "warning");
      return;
    }

    setFieldError("studentIdError", null);
    setLoading(true);
    showMsg("Looking up student…", "info");

    // Resolve custom_id → student_id
    const student = await lookupStudentByCustomId(customId);
    if (!student) {
      setLoading(false);
      setFieldError(
        "studentIdError",
        `No student found with ID "${customId}".`,
      );
      clearMsg();
      return;
    }

    if (!student.student_id) {
      setLoading(false);
      setFieldError(
        "studentIdError",
        "Student record is missing an internal ID. Check authController.js SQL query.",
      );
      clearMsg();
      return;
    }

    showMsg("Processing enrollment…", "info");

    try {
      const res = await fetch(`${API_BASE}/enrollment/enroll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          student_id: student.student_id,
          course_id,
          term,
          semester,
        }),
      });

      if (await handleAuthError(res)) return;
      const data = await res.json();

      if (data.Success) {
        showMsg(data.Message || "Student enrolled successfully.", "success");
        logAction("ENROLL_STUDENT", "enrollment", null, {
          student_id: student.student_id,
          course_id,
          term,
          semester,
        });
        enrollmentForm.reset();
        setFieldError("studentIdError", null);
        fetchEnrollments();
      } else {
        showMsg(data.Message || "Enrollment failed.", "error");
      }
    } catch (err) {
      console.error("Enrollment submit error:", err);
      showMsg("Connection error. Check your server status.", "error");
    } finally {
      setLoading(false);
    }
  });
}

//FETCH ENROLLMENTS
async function fetchEnrollments() {
  const tbody = document.getElementById("enrollmentTableBody");
  if (tbody)
    tbody.innerHTML = `<tr><td colspan="7" class="table-empty">Loading…</td></tr>`;

  try {
    const res = await fetch(`${API_BASE}/enrollment/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (await handleAuthError(res)) return;
    const data = await res.json();

    if (data.Success) {
      const enrollments = data.Enrollments;
      const countEl = document.getElementById("enrollmentCount");
      if (countEl)
        countEl.textContent = `${enrollments.length} active enrollment${enrollments.length !== 1 ? "s" : ""}`;

      if (!enrollments.length) {
        if (tbody)
          tbody.innerHTML = `<tr><td colspan="7" class="table-empty">No active enrollments found.</td></tr>`;
        return;
      }

      if (tbody) {
        if (enrollments.length) {
          const sample = enrollments[0];
          console.log("[Enrollment fields]", Object.keys(sample));
          console.log("[Enrollment values]", Object.values(sample));
          console.table(sample);
        }

        tbody.innerHTML = enrollments
          .map((e) => {
            const enrollId = e.enrollment_id ?? e.enrollmentId ?? e.id ?? null;

            if (!enrollId) {
              console.warn("Missing enrollment ID in record:", e);
            }

            return `
            <tr>
              <td><strong>${e.custom_id || "—"}</strong></td>
              <td>${e.student_name}</td>
              <td><strong>${e.course_code}</strong></td>
              <td>${e.course_title || e.title}</td>
              <td>${e.term || "—"}</td>
              <td>${e.semester || "—"}</td>
              <td>
                ${
                  enrollId
                    ? `<button class="btn-delete" onclick="dropCourse(${enrollId})">Drop</button>`
                    : `<span style="color:var(--muted);font-size:0.78rem;font-style:italic">N/A</span>`
                }
              </td>
            </tr>`;
          })
          .join("");
      }
    } else {
      if (tbody)
        tbody.innerHTML = `<tr><td colspan="7" class="table-empty">${data.Message || "Failed to load enrollments."}</td></tr>`;
    }
  } catch (err) {
    console.error("fetchEnrollments error:", err);
    if (tbody)
      tbody.innerHTML = `<tr><td colspan="7" class="table-empty" style="color:var(--error)">Could not reach the server.</td></tr>`;
  }
}

//DROP COURSE
let pendingDropId = null;

function dropCourse(enrollId) {
  if (!enrollId || enrollId === "null") {
    console.error("dropCourse called with invalid ID:", enrollId);
    showMsg(
      "Cannot drop: enrollment ID is missing. Check your API response.",
      "error",
    );
    return;
  }
  pendingDropId = enrollId;
  document.getElementById("confirmModal").classList.add("open");
}

function closeConfirmModal() {
  document.getElementById("confirmModal").classList.remove("open");
  pendingDropId = null;
}

async function confirmDrop() {
  if (pendingDropId === null) return;

  const idToDelete = pendingDropId;
  closeConfirmModal();

  try {
    const res = await fetch(`${API_BASE}/enrollment/drop/${idToDelete}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (await handleAuthError(res)) return;
    const data = await res.json();

    if (data.Success) {
      showMsg(data.Message || "Course dropped successfully.", "success");
      logAction("DROP_ENROLLMENT", "enrollment", idToDelete, {});
      fetchEnrollments();
    } else {
      showMsg(data.Message || "Failed to drop course.", "error");
    }
  } catch (err) {
    console.error("confirmDrop error:", err);
    showMsg("Error dropping course. Check server status.", "error");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initTopbar();
  fetchCourses();
  fetchEnrollments();

  const confirmBtn = document.getElementById("confirmDropBtn");
  if (confirmBtn) confirmBtn.addEventListener("click", confirmDrop);

  const modal = document.getElementById("confirmModal");
  if (modal)
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeConfirmModal();
    });
});
