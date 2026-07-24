const API_BASE = "http://localhost:3000";
const token = localStorage.getItem("token");
const userName = localStorage.getItem("userName") || "Student";

function logout() {
  localStorage.clear();
  window.location.replace("login.html");
}

function initTopbar() {
  const initial = userName.charAt(0).toUpperCase();
  setText("studentName", userName);
  setText("avatar", initial);
}

document.addEventListener("DOMContentLoaded", () => {
  if (!token) {
    window.location.replace("login.html");
    return;
  }
  initTopbar();
  fetchEnrolledCourses();
});

async function fetchEnrolledCourses() {
  const tbody = document.getElementById("enrolledCoursesBody");
  const subEl = document.getElementById("enrolledCourseSub");

  try {
    const res = await fetch(`${API_BASE}/enrollment/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      fetchFromGrades();
      return;
    }

    const data = await res.json();

    if (data.Success && data.Enrollments) {
      const courses = data.Enrollments;
      if (subEl)
        subEl.textContent = `${courses.length} course${courses.length !== 1 ? "s" : ""} enrolled`;

      if (!courses.length) {
        tbody.innerHTML = `<tr><td colspan="6" class="table-empty">No enrolled courses yet.</td></tr>`;
        return;
      }

      tbody.innerHTML = courses
        .map(
          (c) => `
        <tr>
          <td><strong>${c.course_code}</strong></td>
          <td>${c.course_title || c.title}</td>
          <td>${c.units || "—"}</td>
          <td>${c.term || "—"}</td>
          <td>${c.semester || "—"}</td>
          <td>
            ${
              c.instructor_name
                ? `<button class="btn-view-instructor"
                  onclick="openInstructorModal('${escapeStr(c.instructor_name)}', '${escapeStr(c.course_code)}')">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6" cy="4" r="2.5" stroke="currentColor" stroke-width="1.2"/><path d="M1 12c0-2.5 2.2-4.5 5-4.5s5 2 5 4.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
                  ${c.instructor_name}
                </button>`
                : '<span style="color:var(--muted);font-style:italic;font-size:0.82rem">Unassigned</span>'
            }
          </td>
        </tr>
      `,
        )
        .join("");
    }
  } catch (err) {
    console.error("fetchEnrolledCourses error:", err);
    fetchFromGrades();
  }
}

// Fallback
async function fetchFromGrades() {
  const tbody = document.getElementById("enrolledCoursesBody");
  const subEl = document.getElementById("enrolledCourseSub");

  try {
    const res = await fetch(`${API_BASE}/grades/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    if (data.Success && data.Grades) {
      const courses = data.Grades;
      if (subEl)
        subEl.textContent = `${courses.length} course${courses.length !== 1 ? "s" : ""} enrolled`;

      if (!courses.length) {
        tbody.innerHTML = `<tr><td colspan="6" class="table-empty">No enrolled courses yet.</td></tr>`;
        return;
      }

      tbody.innerHTML = courses
        .map(
          (c) => `
        <tr>
          <td><strong>${c.course_code}</strong></td>
          <td>${c.course_title || c.title || "—"}</td>
          <td>—</td><td>—</td><td>—</td>
          <td><span style="color:var(--muted);font-style:italic;font-size:0.82rem">—</span></td>
        </tr>
      `,
        )
        .join("");
    }
  } catch (err) {
    if (tbody)
      tbody.innerHTML = `<tr><td colspan="6" class="table-empty" style="color:var(--error)">Could not load courses.</td></tr>`;
  }
}

//Instructor Modal
function openInstructorModal(name, courseCode) {
  setText("instructorModalName", name);
  setText("instructorModalCourse", `Instructor for ${courseCode}`);
  document.getElementById("instructorModal").classList.add("open");
}

function closeInstructorModal() {
  document.getElementById("instructorModal").classList.remove("open");
}

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("instructorModal");
  if (modal)
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeInstructorModal();
    });
});

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function escapeStr(str) {
  return String(str || "")
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"');
}
