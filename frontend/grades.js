

const API_BASE = "http://localhost:3000";
const token = localStorage.getItem("token");
const role = localStorage.getItem("role")?.toLowerCase();
const userName = localStorage.getItem("userName") || "User";

// URL params (used by instructor view)
const urlParams = new URLSearchParams(window.location.search);
const courseId = urlParams.get("course_id");
const courseCode = urlParams.get("code") || "Assigned Course";

// ─── AUTH ─────────────────────────────────────────────────────────────────────
function logout() {
  localStorage.clear();
  window.location.replace("login.html");
}

// ─── SMART BACK NAVIGATION ────────────────────────────────────────────────────
function handleBackToDashboard() {
  if (!role) {
    window.location.replace("login.html");
    return;
  }
  window.location.href = `${role}_dashboard.html`;
}

// ─── TOPBAR INIT ──────────────────────────────────────────────────────────────
function initTopbar() {
  const initial = userName.charAt(0).toUpperCase();
  setText("userName", userName);
  setText("userAvatar", initial);
  setText("userRoleDisplay", role || "—");

  // Set sidebar dashboard link based on role
  const dashLink = document.getElementById("dashboardLink");
  if (dashLink && role) dashLink.href = `${role}_dashboard.html`;
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  if (!token) {
    window.location.replace("login.html");
    return;
  }
  initTopbar();
  initializeView();
});

// ─── ROLE-BASED VIEW SWITCH ───────────────────────────────────────────────────
function initializeView() {
  const headRow = document.getElementById("tableHeadRow");
  const header = document.getElementById("tableHeader");

  if (role === "student") {
    setText("pageTitle", "My Academic Grades");
    setText("pageSubtitle", "Your enrolled courses and current grades");
    if (header) header.textContent = "My Academic Grades";
    if (headRow)
      headRow.innerHTML =
        "<th>Course Code</th><th>Course Title</th><th class='col-grade'>Grade</th><th>Remarks</th>";
    showGradesTable();
    fetchMyGrades();
  } else if (role === "instructor") {
    setText("pageTitle", "Grades");
    if (courseId) {
      // Came from dashboard with a specific course — go straight to grading sheet
      loadGradingSheet(courseId, courseCode);
    } else {
      // No course selected — show course picker first
      showCoursePicker();
      fetchCoursePickerList();
    }
  } else {
    // Admin or Registrar
    const label = role === "admin" ? "Admin" : "Registrar";
    setText("pageTitle", "Master Grade Record");
    setText("pageSubtitle", `Full grade overview — ${label} view`);
    if (header) header.textContent = `Master Grade Record (${label})`;
    if (headRow)
      headRow.innerHTML =
        "<th>Student Name</th><th>Course</th><th class='col-grade'>Grade</th><th>Remarks</th>";
    showGradesTable();
    fetchAllGrades();
  }
}

// ─── SHOW / HIDE HELPERS ──────────────────────────────────────────────────────
function showCoursePicker() {
  const picker = document.getElementById("coursePickerCard");
  const grades = document.getElementById("gradesTableCard");
  if (picker) picker.style.display = "block";
  if (grades) grades.style.display = "none";
  setText("pageSubtitle", "Select a course to manage grades");
}

function showGradesTable() {
  const picker = document.getElementById("coursePickerCard");
  const grades = document.getElementById("gradesTableCard");
  if (picker) picker.style.display = "none";
  if (grades) grades.style.display = "block";
}

// ─── INSTRUCTOR: COURSE PICKER ────────────────────────────────────────────────
async function fetchCoursePickerList() {
  const tbody = document.getElementById("coursePickerBody");
  const subtitel = document.getElementById("coursePickerSubtitle");

  try {
    const res = await fetch(`${API_BASE}/instructor/my-courses`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) {
      logout();
      return;
    }
    const data = await res.json();

    const courses = data.Courses || [];
    if (subtitel)
      subtitel.textContent = `${courses.length} course${courses.length !== 1 ? "s" : ""} assigned to your account`;

    if (!courses.length) {
      if (tbody)
        tbody.innerHTML = `<tr><td colspan="5" class="table-empty">No courses assigned yet.</td></tr>`;
      return;
    }

    // Fetch student count for every course in parallel
    const studentCounts = await Promise.all(
      courses.map((c) =>
        fetch(`${API_BASE}/instructor/course-students/${c.course_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((r) => r.json())
          .then((d) => (d.Students || []).length)
          .catch(() => 0),
      ),
    );

    if (tbody) {
      tbody.innerHTML = courses
        .map((c, i) => {
          const count = studentCounts[i];
          return `
          <tr>
            <td>${c.course_code}</td>
            <td>${c.title}</td>
            <td>${c.units} Units</td>
            <td style="text-align:center">
              <span class="student-count-badge">${count}</span>
            </td>
            <td>
              <button class="btn-assign" onclick="loadGradingSheet(${c.course_id}, '${escapeAttr(c.course_code)}')">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M9 1l2 2-7 7H2V8L9 1z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>
                Manage Grades
              </button>
            </td>
          </tr>`;
        })
        .join("");
    }
  } catch (err) {
    console.error("fetchCoursePickerList error:", err);
    if (tbody)
      tbody.innerHTML = `<tr><td colspan="5" class="table-empty" style="color:var(--error)">Could not reach the server.</td></tr>`;
  }
}

// Called when instructor selects a course from the picker
function loadGradingSheet(cId, cCode) {
  const headRow = document.getElementById("tableHeadRow");
  const header = document.getElementById("tableHeader");
  const backBtn = document.getElementById("backToPickerBtn");

  setText("pageSubtitle", cCode);
  if (header) header.textContent = `Class Grading Sheet: ${cCode}`;
  if (headRow)
    headRow.innerHTML =
      "<th>Student Name</th><th>Student ID</th><th class='col-grade'>Grade</th><th>Action</th>";
  if (backBtn) backBtn.style.display = "inline-flex";

  showGradesTable();

  // Temporarily override courseId for the fetch
  window._activeCourseId = cId;
  fetchEnrollmentsForGrading(cId);
}

// ─── STUDENT VIEW ─────────────────────────────────────────────────────────────
async function fetchMyGrades() {
  try {
    const res = await fetch(`${API_BASE}/grades/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) {
      logout();
      return;
    }
    const data = await res.json();

    renderTable(data.Grades || [], (g) => {
      const badge = gradeBadge(g.grade_value);
      return `
        <tr>
          <td>${g.course_code}</td>
          <td>${g.course_title}</td>
          <td class="col-grade">${badge}</td>
          <td>${g.remarks || "—"}</td>
        </tr>`;
    });
  } catch (err) {
    console.error("fetchMyGrades error:", err);
    renderError();
  }
}

// ─── INSTRUCTOR VIEW ──────────────────────────────────────────────────────────
async function fetchEnrollmentsForGrading(overrideCourseId) {
  const targetId = overrideCourseId || courseId;
  if (!targetId) {
    showCoursePicker();
    fetchCoursePickerList();
    return;
  }

  try {
    const res = await fetch(
      `${API_BASE}/instructor/course-students/${targetId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    if (res.status === 401) {
      logout();
      return;
    }
    const data = await res.json();

    renderTable(data.Students || [], (s) => {
      const badge = s.grade_value
        ? gradeBadge(s.grade_value)
        : `<span class="grade-badge grade-none">Not Graded</span>`;
      return `
        <tr>
          <td>${s.full_name}</td>
          <td>${s.custom_id || "N/A"}</td>
          <td class="col-grade">${badge}</td>
          <td>
            <button class="btn-assign" onclick="openGradeModal(${s.enrollment_id}, '${escapeAttr(s.full_name)}')">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M9 1l2 2-7 7H2V8L9 1z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>
              ${s.grade_value ? "Update" : "Assign"}
            </button>
          </td>
        </tr>`;
    });
  } catch (err) {
    console.error("fetchEnrollmentsForGrading error:", err);
    renderError();
  }
}

// ─── ADMIN / REGISTRAR VIEW ───────────────────────────────────────────────────
async function fetchAllGrades() {
  try {
    const res = await fetch(`${API_BASE}/grades/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) {
      logout();
      return;
    }
    const data = await res.json();

    renderTable(data.Grades || [], (g) => {
      const badge = gradeBadge(g.grade_value);
      return `
        <tr>
          <td>${g.student_name}</td>
          <td>${g.course_code}</td>
          <td class="col-grade">${badge}</td>
          <td>${g.remarks || "—"}</td>
        </tr>`;
    });
  } catch (err) {
    console.error("fetchAllGrades error:", err);
    renderError();
  }
}

// ─── GRADE MODAL ──────────────────────────────────────────────────────────────
let pendingEnrollmentId = null;

function openGradeModal(enrollmentId, studentName) {
  pendingEnrollmentId = enrollmentId;
  setText("gradeModalStudentName", studentName);
  clearModalMsg();
  document.getElementById("gradeInput").value = "";
  document.getElementById("remarksInput").value = ""; // resets dropdown to "— Select Remarks —"
  document.getElementById("gradeModal").classList.add("open");
}

function closeGradeModal() {
  document.getElementById("gradeModal").classList.remove("open");
  pendingEnrollmentId = null;
}

async function submitGrade() {
  if (pendingEnrollmentId === null) return;

  const gradeVal = document.getElementById("gradeInput").value.trim();
  const remarks = document.getElementById("remarksInput").value.trim();

  if (!gradeVal) {
    showModalMsg("Please enter a grade value.", "error");
    return;
  }

  const val = parseFloat(gradeVal);
  if (isNaN(val) || val < 1.0 || val > 5.0) {
    showModalMsg("Grade must be between 1.0 and 5.0.", "error");
    return;
  }

  setGradeLoading(true);
  showModalMsg("Saving grade…", "info");

  try {
    const res = await fetch(`${API_BASE}/instructor/submit-grade`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        enrollment_id: pendingEnrollmentId,
        grade_value: gradeVal,
        remarks: remarks || null,
      }),
    });
    const result = await res.json();

    if (result.Success) {
      closeGradeModal();
      // Re-fetch the current grading sheet instead of resetting the whole view
      if (role === "instructor") {
        const activeId = window._activeCourseId || courseId;
        const activeCode =
          document
            .getElementById("tableHeader")
            ?.textContent?.replace("Class Grading Sheet: ", "") || "";
        loadGradingSheet(activeId, activeCode);
      } else {
        initializeView();
      }
    } else {
      showModalMsg(result.Message || "Failed to save grade.", "error");
    }
  } catch (err) {
    console.error("submitGrade error:", err);
    showModalMsg("Server connection failed.", "error");
  } finally {
    setGradeLoading(false);
  }
}

// Close modal on overlay click
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("gradeModal");
  if (modal)
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeGradeModal();
    });
});

// HELPERS 
function renderTable(items, mapFn) {
  const tbody = document.getElementById("gradeTableBody");
  const countEl = document.getElementById("recordCount");
  if (!tbody) return;

  if (!items.length) {
    tbody.innerHTML = `<tr><td colspan="4" class="table-empty">No records found.</td></tr>`;
    if (countEl) countEl.textContent = "0 records";
    return;
  }

  tbody.innerHTML = items.map(mapFn).join("");
  if (countEl)
    countEl.textContent = `${items.length} record${items.length !== 1 ? "s" : ""}`;
}

function renderMessage(msg) {
  const tbody = document.getElementById("gradeTableBody");
  if (tbody)
    tbody.innerHTML = `<tr><td colspan="4" class="table-empty">${msg}</td></tr>`;
}

function renderError() {
  const tbody = document.getElementById("gradeTableBody");
  if (tbody)
    tbody.innerHTML = `<tr><td colspan="4" class="table-empty" style="color:var(--error)">Error loading records. Check server status.</td></tr>`;
}

function gradeBadge(value) {
  if (value === null || value === undefined || value === "") {
    return `<span class="grade-badge grade-none">N/A</span>`;
  }
  const val = parseFloat(value);
  const isPassing = !isNaN(val) && val <= 3.0;
  const cls = isPassing ? "grade-pass" : "grade-fail";
  return `<span class="grade-badge ${cls}">${isNaN(val) ? value : val.toFixed(2)}</span>`;
}

function showModalMsg(text, type = "info") {
  const el = document.getElementById("gradeModalMsg");
  if (!el) return;
  el.textContent = text;
  el.className = `form-msg ${type}`;
}

function clearModalMsg() {
  const el = document.getElementById("gradeModalMsg");
  if (!el) return;
  el.textContent = "";
  el.className = "form-msg";
}

function setGradeLoading(loading) {
  const btn = document.getElementById("submitGradeBtn");
  if (!btn) return;
  btn.disabled = loading;
  btn.classList.toggle("loading", loading);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function escapeAttr(str) {
  return str.replace(/'/g, "\\'");
}
