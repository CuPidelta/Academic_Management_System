const API_BASE = "http://localhost:3000";
const token = localStorage.getItem("token");
const userRole = localStorage.getItem("role")?.toLowerCase();
const userName = localStorage.getItem("userName") || "Admin";

// ─── AUTH ─────────────────────────────────────────────────────────────────────
function logout() {
  localStorage.clear();
  window.location.replace("login.html");
}

// ─── TOPBAR ───────────────────────────────────────────────────────────────────
function initTopbar() {
  setText("adminNameDisplay", userName);
  setText("adminRoleDisplay", userRole || "—");
  setText("adminAvatar", userName.charAt(0).toUpperCase());
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  if (!token || (userRole !== "admin" && userRole !== "registrar")) {
    window.location.replace("login.html");
    return;
  }
  initTopbar();
  loadDashboard();
});

// LOAD ALL IN PARALLEL
async function loadDashboard() {
  await Promise.all([
    fetchStats(),
    fetchRecentStudents(),
    fetchRecentEnrollments(),
  ]);
}

// STAT CARDS
async function fetchStats() {
  try {
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

    if (usersData.Success) {
      const users = usersData.Users || [];
      const students = users.filter((u) => u.role === "student");
      const instructors = users.filter((u) => u.role === "instructor");
      const staff = users.filter((u) =>
        ["admin", "registrar"].includes(u.role),
      );
      setText("statStudents", students.length);
      setText("statInstructors", instructors.length);
      setText("statStaff", staff.length);
    }

    if (coursesData.Success) {
      setText("statCourses", (coursesData.Courses || []).length);
    }

    if (enrollData.Success) {
      setText("statEnrollments", (enrollData.Enrollments || []).length);
    }

    if (gradesData.Success) {
      const grades = gradesData.Grades || [];
      const graded = grades.filter(
        (g) => g.grade_value !== null && g.grade_value !== undefined,
      );
      const passing = graded.filter((g) => parseFloat(g.grade_value) <= 3.0);
      const rate = graded.length
        ? Math.round((passing.length / graded.length) * 100) + "%"
        : "N/A";
      setText("statPassRate", rate);
    }
  } catch (err) {
    console.error("fetchStats error:", err);
  }
}

// RECENT STUDENTS
async function fetchRecentStudents() {
  const tbody = document.getElementById("recentStudentsBody");
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
      const students = (data.Users || [])
        .filter((u) => u.role === "student")
        .slice(0, 5); // show latest 5

      setText(
        "recentStudentSub",
        `Showing latest ${students.length} of ${
          (data.Users || []).filter((u) => u.role === "student").length
        } students`,
      );

      if (!students.length) {
        tbody.innerHTML = `<tr><td colspan="3" class="table-empty">No students registered yet.</td></tr>`;
        return;
      }

      tbody.innerHTML = students
        .map(
          (s) => `
        <tr>
          <td><strong>${s.custom_id || "N/A"}</strong></td>
          <td>${s.full_name}</td>
          <td>${s.year_level || "—"} · ${s.program || "—"}</td>
        </tr>
      `,
        )
        .join("");
    }
  } catch (err) {
    console.error("fetchRecentStudents error:", err);
    if (tbody)
      tbody.innerHTML = `<tr><td colspan="3" class="table-empty" style="color:var(--error)">Could not reach the server.</td></tr>`;
  }
}

//  RECENT ENROLLMENTS
async function fetchRecentEnrollments() {
  const tbody = document.getElementById("recentEnrollBody");
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
      const enrollments = (data.Enrollments || []).slice(0, 5); // show latest 5

      setText(
        "recentEnrollSub",
        `Showing latest ${enrollments.length} of ${
          (data.Enrollments || []).length
        } enrollments`,
      );

      if (!enrollments.length) {
        tbody.innerHTML = `<tr><td colspan="5" class="table-empty">No enrollments yet.</td></tr>`;
        return;
      }

      tbody.innerHTML = enrollments
        .map(
          (e) => `
        <tr>
          <td>${e.student_name}</td>
          <td><strong>${e.course_code}</strong></td>
          <td>${e.course_title || e.title}</td>
          <td>${e.term || "—"}</td>
          <td>${e.semester || "—"}</td>
        </tr>
      `,
        )
        .join("");
    }
  } catch (err) {
    console.error("fetchRecentEnrollments error:", err);
    if (tbody)
      tbody.innerHTML = `<tr><td colspan="5" class="table-empty" style="color:var(--error)">Could not reach the server.</td></tr>`;
  }
}

// HELPER
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
