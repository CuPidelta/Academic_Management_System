const API_BASE = "http://localhost:3000";
const token = localStorage.getItem("token");
const userRole = localStorage.getItem("role")?.toLowerCase();
const userName = localStorage.getItem("userName") || "Registrar";


let allStudents = [];
let allEnrollments = [];
let allGrades = [];

// AUTH
function logout() {
  localStorage.clear();
  window.location.replace("login.html");
}

function initTopbar() {
  setText("adminNameDisplay", userName);
  setText("adminRoleDisplay", userRole || "—");
  setText("adminAvatar", userName.charAt(0).toUpperCase());

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


document.addEventListener("DOMContentLoaded", () => {
  if (!token || (userRole !== "registrar" && userRole !== "admin")) {
    window.location.replace("login.html");
    return;
  }
  initTopbar();
  loadAllReports();
});

// LOAD ALL DATA IN PARALLEL 
async function loadAllReports() {
  await Promise.all([
    fetchStudentReport(),
    fetchEnrollmentReport(),
    fetchGradeReport(),
    fetchCourseCount(),
  ]);
  computeSummaryStats();
}


async function fetchCourseCount() {
  try {
    const res = await fetch(`${API_BASE}/courses/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.Success) {
      setText("rptCourseCount", (data.Courses || []).length);
    }
  } catch (err) {
    console.error("fetchCourseCount error:", err);
  }
}

//STUDENTS
async function fetchStudentReport() {
  const tbody = document.getElementById("studentReportBody");

  try {
    const res = await fetch(`${API_BASE}/auth/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) {
      logout();
      return;
    }
    const data = await res.json();

    if (data.Success) {
      allStudents = data.Users.filter((u) => u.role === "student");
      renderStudentTable(allStudents);
    } else {
      if (tbody)
        tbody.innerHTML = `<tr><td colspan="5" class="table-empty">${data.Message || "Failed to load students."}</td></tr>`;
    }
  } catch (err) {
    console.error("fetchStudentReport error:", err);
    if (tbody)
      tbody.innerHTML = `<tr><td colspan="5" class="table-empty" style="color:var(--error)">Could not reach the server.</td></tr>`;
  }
}

function renderStudentTable(students) {
  const tbody = document.getElementById("studentReportBody");
  if (!tbody) return;

  if (!students.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="table-empty">No students found.</td></tr>`;
    return;
  }

  tbody.innerHTML = students
    .map(
      (s) => `
    <tr>
      <td><strong>${s.custom_id || "N/A"}</strong></td>
      <td>${s.full_name}</td>
      <td>${s.email}</td>
      <td>${s.year_level || "—"}</td>
      <td>${s.program || "<span style='color:var(--muted);font-style:italic'>Unassigned</span>"}</td>
    </tr>
  `,
    )
    .join("");
}

//ENROLLMENTS
async function fetchEnrollmentReport() {
  const tbody = document.getElementById("enrollReportBody");

  try {
    const res = await fetch(`${API_BASE}/enrollment/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) {
      logout();
      return;
    }
    const data = await res.json();

    if (data.Success) {
      allEnrollments = data.Enrollments || [];
      renderEnrollTable(allEnrollments);
    } else {
      if (tbody)
        tbody.innerHTML = `<tr><td colspan="4" class="table-empty">${data.Message || "Failed to load enrollments."}</td></tr>`;
    }
  } catch (err) {
    console.error("fetchEnrollmentReport error:", err);
    if (tbody)
      tbody.innerHTML = `<tr><td colspan="4" class="table-empty" style="color:var(--error)">Could not reach the server.</td></tr>`;
  }
}

function renderEnrollTable(enrollments) {
  const tbody = document.getElementById("enrollReportBody");
  if (!tbody) return;

  if (!enrollments.length) {
    tbody.innerHTML = `<tr><td colspan="4" class="table-empty">No enrollment records found.</td></tr>`;
    return;
  }

  tbody.innerHTML = enrollments
    .map(
      (e) => `
    <tr>
      <td><strong>${e.custom_id || "N/A"}</strong></td>
      <td>${e.student_name}</td>
      <td>${e.course_code}</td>
      <td>${e.course_title || e.title}</td>
      <td>${e.term || "—"}</td>
      <td>${e.semester || "—"}</td>
    </tr>
  `,
    )
    .join("");
}

// GRADES
async function fetchGradeReport() {
  const tbody = document.getElementById("gradeReportBody");

  try {
    const res = await fetch(`${API_BASE}/grades/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) {
      logout();
      return;
    }
    const data = await res.json();

    if (data.Success) {
      allGrades = data.Grades || [];
      renderGradeTable(allGrades);
    } else {
      if (tbody)
        tbody.innerHTML = `<tr><td colspan="5" class="table-empty">${data.Message || "Failed to load grades."}</td></tr>`;
    }
  } catch (err) {
    console.error("fetchGradeReport error:", err);
    if (tbody)
      tbody.innerHTML = `<tr><td colspan="5" class="table-empty" style="color:var(--error)">Could not reach the server.</td></tr>`;
  }
}

function renderGradeTable(grades) {
  const tbody = document.getElementById("gradeReportBody");
  if (!tbody) return;

  if (!grades.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="table-empty">No grade records found.</td></tr>`;
    return;
  }

  tbody.innerHTML = grades
    .map((g) => {
      const val = parseFloat(g.grade_value);
      const hasGrade = !isNaN(val);
      const isPassing = hasGrade && val <= 3.0;

      const badgeCls = !hasGrade
        ? "grade-none"
        : isPassing
          ? "grade-pass"
          : "grade-fail";
      const display = hasGrade ? val.toFixed(2) : "N/A";

      const statusCls = !hasGrade
        ? "status-pending"
        : isPassing
          ? "status-pass"
          : "status-fail";
      const statusText = !hasGrade
        ? "Pending"
        : isPassing
          ? "Passed"
          : "Failed";

      return `
      <tr>
        <td><strong>${g.custom_id || g.student_id || "—"}</strong></td>
        <td>${g.student_name}</td>
        <td>${g.course_code}</td>
        <td><span class="grade-badge ${badgeCls}">${display}</span></td>
        <td>${g.remarks || "—"}</td>
        <td><span class="status-pill ${statusCls}">${statusText}</span></td>
      </tr>
    `;
    })
    .join("");
}

// SUMMARY STATS
function computeSummaryStats() {
  setText("rptStudentCount", allStudents.length);
  setText("rptEnrollCount", allEnrollments.length);

 
  const graded = allGrades.filter((g) => {
    const v = g.grade_value;
    return (
      v !== null &&
      v !== undefined &&
      v !== "" &&
      v !== "null" &&
      !isNaN(parseFloat(v))
    );
  });
  const passing = graded.filter((g) => parseFloat(g.grade_value) <= 3.0);
  const rate = graded.length
    ? Math.round((passing.length / graded.length) * 100) + "%"
    : "—";

  console.log(
    "[Reports] allGrades:",
    allGrades.length,
    "graded:",
    graded.length,
    "passing:",
    passing.length,
  );
  setText("rptPassRate", rate);
}

// TAB SWITCHING 
let activeTab = "students";

function switchTab(tabName) {
  activeTab = tabName;
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tabName);
  });
  document.querySelectorAll(".tab-pane").forEach((pane) => {
    pane.classList.toggle("active", pane.id === `tab-${tabName}`);
  });

  // Update search placeholder and re-filter with current query
  const input = document.getElementById("globalSearch");
  if (input) {
    const placeholders = {
      students: "Search by Student ID…",
      enrollments: "Search by Student ID…",
      grades: "Search by Student ID…",
    };
    input.placeholder = placeholders[tabName] || "Search…";
  }

  filterActiveTab();
}

// UNIFIED SEARCH 
function filterActiveTab() {
  if (activeTab === "students") filterStudentTable();
  else if (activeTab === "enrollments") filterEnrollTable();
  else if (activeTab === "grades") filterGradeTable();
}

function exportActiveTab() {
  exportCSV(activeTab);
}

// SEARCH / FILTER 
function filterStudentTable() {
  const q = (document.getElementById("globalSearch")?.value || "")
    .toLowerCase()
    .trim();
  if (!q) {
    renderStudentTable(allStudents);
    return;
  }
  renderStudentTable(
    allStudents.filter((s) => (s.custom_id || "").toLowerCase().includes(q)),
  );
}

function filterEnrollTable() {
  const q = (document.getElementById("globalSearch")?.value || "")
    .toLowerCase()
    .trim();
  if (!q) {
    renderEnrollTable(allEnrollments);
    return;
  }
  renderEnrollTable(
    allEnrollments.filter((e) => (e.custom_id || "").toLowerCase().includes(q)),
  );
}

function filterGradeTable() {
  const q = (document.getElementById("globalSearch")?.value || "")
    .toLowerCase()
    .trim();
  if (!q) {
    renderGradeTable(allGrades);
    return;
  }
  renderGradeTable(
    allGrades.filter((g) =>
      (g.custom_id || g.student_id || "").toString().toLowerCase().includes(q),
    ),
  );
}

// CSV EXPORT 
function exportCSV(type) {
  let headers, rows, filename;

  if (type === "students") {
    headers = ["Student ID", "Full Name", "Email", "Year Level", "Program"];
    rows = allStudents.map((s) => [
      s.custom_id || "N/A",
      s.full_name,
      s.email,
      s.year_level || "N/A",
      s.program || "N/A",
    ]);
    filename = "ams_students.csv";
  } else if (type === "enrollments") {
    headers = [
      "Student ID",
      "Student Name",
      "Course Code",
      "Course Title",
      "Term",
      "Semester",
    ];
    rows = allEnrollments.map((e) => [
      e.custom_id || "N/A",
      e.student_name,
      e.course_code,
      e.course_title || e.title,
      e.term || "—",
      e.semester || "—",
    ]);
    filename = "ams_enrollments.csv";
  } else if (type === "grades") {
    headers = [
      "Student ID",
      "Student Name",
      "Course Code",
      "Grade",
      "Remarks",
      "Status",
    ];
    rows = allGrades.map((g) => {
      const val = parseFloat(g.grade_value);
      const hasGrade = !isNaN(val);
      const status = !hasGrade ? "Pending" : val <= 3.0 ? "Passed" : "Failed";
      return [
        g.custom_id || g.student_id || "—",
        g.student_name,
        g.course_code,
        hasGrade ? val.toFixed(2) : "N/A",
        g.remarks || "—",
        status,
      ];
    });
    filename = "ams_grades.csv";
  }

  downloadCSV(headers, rows, filename);
}

function exportAllCSV() {
  exportCSV("students");
  setTimeout(() => exportCSV("enrollments"), 300);
  setTimeout(() => exportCSV("grades"), 600);
}

function downloadCSV(headers, rows, filename) {
  const escape = (val) => `"${String(val).replace(/"/g, '""')}"`;
  const csv = [
    headers.map(escape).join(","),
    ...rows.map((r) => r.map(escape).join(",")),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

//HELPER 
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
