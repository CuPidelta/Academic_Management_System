const API_BASE = "http://localhost:3000";
const token = localStorage.getItem("token");
const userRole = localStorage.getItem("role")?.toLowerCase();

// AUTH 
function logout() {
  localStorage.clear();
  window.location.replace("login.html");
}

// INIT 
document.addEventListener("DOMContentLoaded", () => {
  if (!token || userRole !== "instructor") {
    window.location.replace("login.html");
    return;
  }
  initializeInstructorDashboard();
});

// BOOTSTRAP 
async function initializeInstructorDashboard() {
  try {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) {
      logout();
      return;
    }

    const data = await res.json();

    if (data.Success) {
      const instructor = data.User;
      const firstName = instructor.full_name?.split(" ")[0] || "Instructor";
      const initial =
        instructor.full_name?.trim().charAt(0).toUpperCase() || "I";

      // Topbar
      setText("welcomeName", `Prof. ${firstName}`);
      setText("userName", instructor.full_name);
      setText("instructorAvatar", initial);

      // Now fetch courses (JWT identifies the instructor server-side)
      fetchAssignedCourses();
    } else {
      logout();
    }
  } catch (err) {
    console.error("Initialization error:", err);
  }
}

// FETCH ASSIGNED COURSES
async function fetchAssignedCourses() {
  const tbody = document.getElementById("assignedCoursesBody");
  const subtitleEl = document.getElementById("courseSubtitle");

  if (tbody)
    tbody.innerHTML = `<tr><td colspan="4" class="table-empty">Loading…</td></tr>`;

  try {
    const res = await fetch(`${API_BASE}/instructor/my-courses`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) {
      logout();
      return;
    }

    const data = await res.json();

    if (data.Success) {
      const courses = data.Courses || [];

      
      const totalUnits = courses.reduce(
        (sum, c) => sum + (parseInt(c.units) || 0),
        0,
      );
      setText("courseCount", courses.length);
      setText("unitCount", totalUnits);
      fetchTotalStudents(courses);

     
      if (subtitleEl)
        subtitleEl.textContent = `${courses.length} course${courses.length !== 1 ? "s" : ""} assigned to your account`;

    
      if (!courses.length) {
        if (tbody)
          tbody.innerHTML = `<tr><td colspan="4" class="table-empty">No courses assigned to your account yet.</td></tr>`;
        return;
      }

      if (tbody) {
        tbody.innerHTML = courses
          .map(
            (c) => `
          <tr>
            <td>${c.course_code}</td>
            <td>${c.title}</td>
            <td>${c.units} Units</td>
            <td>
              <button class="btn-manage" onclick="viewClassList(${c.course_id}, '${c.course_code}')">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <rect x="1" y="2" width="11" height="9" rx="1.2" stroke="currentColor" stroke-width="1.2"/>
                  <path d="M3.5 5h6M3.5 7.5h4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                </svg>
                Manage Grades
              </button>
            </td>
          </tr>
        `,
          )
          .join("");
      }
    } else {
      if (tbody)
        tbody.innerHTML = `<tr><td colspan="4" class="table-empty" style="color:var(--error)">${data.Message || "Failed to load courses."}</td></tr>`;
    }
  } catch (err) {
    console.error("fetchAssignedCourses error:", err);
    if (tbody)
      tbody.innerHTML = `<tr><td colspan="4" class="table-empty" style="color:var(--error)">Error connecting to course API.</td></tr>`;
  }
}

// NAVIGATE TO GRADES PAGE 
function viewClassList(courseId, courseCode) {
  window.location.href = `grades.html?course_id=${courseId}&code=${courseCode}`;
}

// HELPER
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

async function fetchTotalStudents(courses) {
  if (!courses.length) {
    setText("studentCount", 0);
    return;
  }

  try {
    // Fetch class list for every course in parallel
    const results = await Promise.all(
      courses.map((c) =>
        fetch(`${API_BASE}/instructor/course-students/${c.course_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((r) => r.json())
          .catch(() => ({ Students: [] })),
      ),
    );

    // Sum unique students (a student could be in multiple courses)
    const uniqueIds = new Set();
    results.forEach((data) => {
      (data.Students || []).forEach((s) =>
        uniqueIds.add(s.student_id || s.user_id),
      );
    });

    setText("studentCount", uniqueIds.size);
  } catch (err) {
    console.error("fetchTotalStudents error:", err);
    setText("studentCount", "—");
  }
}
