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
  } catch {
    
  }
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
    showMsg("formMsg", data.Message || "Access Denied.", "error");
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


  const dashLink = document.getElementById("dashboardNavLink");
  if (dashLink) {
    dashLink.href =
      userRole === "registrar" ? "registrar_dashboard.html" : "admin_home.html";
  }


  const userAccountsLink = document.getElementById("userAccountsLink");
  if (userAccountsLink) {
    userAccountsLink.style.display = userRole === "admin" ? "flex" : "none";
  }
}


function showMsg(elId, text, type = "info") {
  const el = document.getElementById(elId);
  if (!el) return;
  el.textContent = text;
  el.className = `form-msg ${type}`;
}

function clearMsg(elId) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.textContent = "";
  el.className = "form-msg";
}


function setLoading(btnId, loading) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.disabled = loading;
  btn.classList.toggle("loading", loading);
}

// FETCH INSTRUCTORS 
async function fetchInstructors() {
  const selectors = ["instructor_id", "edit_instructor_id"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  try {
    const res = await fetch(`${API_BASE}/auth/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    if (data.Success) {
      const options = data.Users.filter((u) => u.role === "instructor")
        .map((i) => `<option value="${i.user_id}">${i.full_name}</option>`)
        .join("");

      selectors.forEach((sel) => {
        sel.innerHTML =
          '<option value="">— Select Instructor —</option>' + options;
      });
    }
  } catch (err) {
    console.error("fetchInstructors error:", err);
  }
}

// CREATE / UPDATE COURSE 
document.addEventListener("DOMContentLoaded", () => {
  initTopbar();
  fetchInstructors();
  fetchCourses();

  // Edit form submission
  const editForm = document.getElementById("editCourseForm");
  if (editForm) editForm.addEventListener("submit", handleUpdate);

  // Confirm delete modal button
  const confirmBtn = document.getElementById("confirmDeleteBtn");
  if (confirmBtn)
    confirmBtn.addEventListener("click", () => {
      if (pendingDeleteId !== null) confirmDelete(pendingDeleteId);
    });

  // Close modals on overlay click
  ["editModal", "confirmModal"].forEach((id) => {
    const el = document.getElementById(id);
    if (el)
      el.addEventListener("click", (e) => {
        if (e.target === el) {
          if (id === "editModal") closeEditModal();
          if (id === "confirmModal") closeConfirmModal();
        }
      });
  });
});

const courseForm = document.getElementById("courseForm");
if (courseForm) {
  courseForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearMsg("formMsg");
    setLoading("submitBtn", true);
    showMsg("formMsg", "Creating course…", "info");

    const courseData = {
      course_code: document.getElementById("course_code").value.trim(),
      title: document.getElementById("title").value.trim(),
      units: document.getElementById("units").value,
      instructor_id: document.getElementById("instructor_id").value || null,
    };

    try {
      const res = await fetch(`${API_BASE}/courses/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(courseData),
      });

      if (await handleAuthError(res)) return;
      const data = await res.json();

      if (data.Success) {
        showMsg(
          "formMsg",
          data.Message || "Course created successfully!",
          "success",
        );
        logAction("CREATE_COURSE", "course", null, {
          code: courseData.course_code,
          title: courseData.title,
        });
        courseForm.reset();
        fetchCourses();
      } else {
        showMsg("formMsg", data.Message || "Failed to create course.", "error");
      }
    } catch (err) {
      console.error("Create course error:", err);
      showMsg("formMsg", "Server connection failed.", "error");
    } finally {
      setLoading("submitBtn", false);
    }
  });
}

//  FETCH ALL COURSES 
async function fetchCourses() {
  const tbody = document.getElementById("courseTableBody");
  if (tbody)
    tbody.innerHTML = `<tr><td colspan="5" class="table-empty">Loading…</td></tr>`;

  try {
    const res = await fetch(`${API_BASE}/courses/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (await handleAuthError(res)) return;
    const data = await res.json();

    if (data.Success) {
      const courses = data.Courses;
      const countEl = document.getElementById("courseCount");
      if (countEl)
        countEl.textContent = `${courses.length} course${courses.length !== 1 ? "s" : ""} in catalog`;

      if (!courses.length) {
        if (tbody)
          tbody.innerHTML = `<tr><td colspan="5" class="table-empty">No courses found. Add one above.</td></tr>`;
        return;
      }

      if (tbody) {
        tbody.innerHTML = courses
          .map(
            (c) => `
          <tr>
            <td><span class="course-code">${c.course_code}</span></td>
            <td>${c.title}</td>
            <td>${c.units}</td>
            <td>${
              c.instructor_name
                ? c.instructor_name
                : '<span class="instructor-unassigned">Unassigned</span>'
            }</td>
            <td>
              <button class="btn-edit"   onclick='openEditModal(${JSON.stringify(c)})'>Edit</button>
              <button class="btn-delete" onclick="deleteCourse(${c.course_id})">Delete</button>
            </td>
          </tr>
        `,
          )
          .join("");
      }
    } else {
      if (tbody)
        tbody.innerHTML = `<tr><td colspan="5" class="table-empty">${data.Message || "Failed to load courses."}</td></tr>`;
    }
  } catch (err) {
    console.error("fetchCourses error:", err);
    if (tbody)
      tbody.innerHTML = `<tr><td colspan="5" class="table-empty" style="color:var(--error)">Could not reach the server.</td></tr>`;
  }
}

// EDIT MODAL
function openEditModal(course) {
  document.getElementById("edit_course_id").value = course.course_id;
  document.getElementById("edit_course_code").value = course.course_code;
  document.getElementById("edit_title").value = course.title;
  document.getElementById("edit_units").value = course.units;
  document.getElementById("edit_instructor_id").value =
    course.instructor_id || "";

  clearMsg("editMsg");
  document.getElementById("editModal").classList.add("open");
}

function closeEditModal() {
  document.getElementById("editModal").classList.remove("open");
}

async function handleUpdate(e) {
  e.preventDefault();
  clearMsg("editMsg");
  setLoading("updateBtn", true);
  showMsg("editMsg", "Saving changes…", "info");

  const id = document.getElementById("edit_course_id").value;
  const updateData = {
    course_code: document.getElementById("edit_course_code").value.trim(),
    title: document.getElementById("edit_title").value.trim(),
    units: document.getElementById("edit_units").value,
    instructor_id: document.getElementById("edit_instructor_id").value || null,
  };

  try {
    const res = await fetch(`${API_BASE}/courses/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    if (await handleAuthError(res)) return;
    const data = await res.json();

    if (data.Success) {
      closeEditModal();
      showMsg(
        "formMsg",
        data.Message || "Course updated successfully.",
        "success",
      );
      logAction("UPDATE_COURSE", "course", id, {
        code: updateData.course_code,
        title: updateData.title,
      });
      fetchCourses();
    } else {
      showMsg("editMsg", data.Message || "Update failed.", "error");
    }
  } catch (err) {
    console.error("handleUpdate error:", err);
    showMsg("editMsg", "Server connection failed.", "error");
  } finally {
    setLoading("updateBtn", false);
  }
}

// DELETE COURSE 
let pendingDeleteId = null;

function deleteCourse(id) {
  pendingDeleteId = id;
  document.getElementById("confirmModal").classList.add("open");
}

function closeConfirmModal() {
  document.getElementById("confirmModal").classList.remove("open");
  pendingDeleteId = null;
}

async function confirmDelete(id) {
  closeConfirmModal();

  try {
    const res = await fetch(`${API_BASE}/courses/delete/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (await handleAuthError(res)) return;
    const data = await res.json();

    if (data.Success) {
      showMsg("formMsg", data.Message || "Course deleted.", "success");
      logAction("DELETE_COURSE", "course", id, {});
      fetchCourses();
    } else {
      showMsg("formMsg", data.Message || "Delete failed.", "error");
    }
  } catch (err) {
    console.error("confirmDelete error:", err);
    showMsg("formMsg", "Error deleting course.", "error");
  }
}

// RESET FORM 
function resetForm() {
  const form = document.getElementById("courseForm");
  if (form) form.reset();
  clearMsg("formMsg");
}
