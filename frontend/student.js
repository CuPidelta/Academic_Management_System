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
  if (!token || userRole !== "student") {
    console.warn("Access denied. Redirecting…");
    localStorage.clear();
    window.location.replace("login.html");
    return;
  }

  loadStudentProfile();
});
// --- PROFILE ---
async function loadStudentProfile() {
  try {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 401) {
      logout();
      return;
    }

    const data = await res.json();

    if (data.Success && data.User) {
      const user = data.User;
      const firstName = user.full_name?.split(" ")[0] || "Student";
      const initial = user.full_name?.trim().charAt(0).toUpperCase() || "?";

      setText("welcomeName", firstName);
      setText("studentName", user.full_name);
      setText("avatar", initial);

      setText("profileName", user.full_name);
      setText("profileAvatar", initial);
      setText("studentEmail", user.email);
      setText("yearLevel", user.year_level || "Not Set");
      setText("program", user.program || "Not Set");

      fetchMyGrades();
    } else {
      console.error("Profile error:", data.Message);
      logout();
    }
  } catch (err) {
    console.error("Profile load error:", err);
    logout();
  }
}

async function fetchMyGrades() {
  const tbody = document.getElementById("gradesTableBody");
  if (tbody) {
    tbody.innerHTML = `<tr><td colspan="4" class="table-empty">Loading academic records…</td></tr>`;
  }

  try {
    const res = await fetch(`${API_BASE}/grades/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    if (data.Success && data.Grades) {
      const grades = data.Grades;

      const graded = grades.filter((g) => {
        const val = parseFloat(g.grade_value);
        return !isNaN(val) && val > 0 && g.grade_value !== "Pending";
      });

      const pending = grades.filter((g) => {
        const val = parseFloat(g.grade_value);
        return isNaN(val) || val <= 0 || g.grade_value === "Pending";
      });

      setText("enrolledCount", grades.length);
      setText("gradedCount", graded.length);
      setText("pendingCount", pending.length);

      if (!grades.length) {
        if (tbody)
          tbody.innerHTML = `<tr><td colspan="4" class="table-empty">No enrollment records found.</td></tr>`;
        return;
      }

      if (tbody) {
        tbody.innerHTML = grades
          .map((g) => {
            const val = parseFloat(g.grade_value);

            const hasValidGrade =
              !isNaN(val) && val > 0 && g.grade_value !== "Pending";

            const isPassing = hasValidGrade && val <= 3.0;

            const badgeClass = !hasValidGrade
              ? "grade-badge grade-none"
              : isPassing
                ? "grade-badge grade-pass"
                : "grade-badge grade-fail";

            const displayGrade = hasValidGrade ? val.toFixed(2) : "N/A";

            const remarks =
              g.remarks && g.remarks !== "--"
                ? g.remarks
                : hasValidGrade
                  ? "Completed"
                  : "In Progress";

            return `
            <tr>
              <td>${g.course_code}</td>
              <td>${g.course_title || g.title || "—"}</td>
              <td><span class="${badgeClass}">${displayGrade}</span></td>
              <td>${remarks}</td>
            </tr>`;
          })
          .join("");
      }
    } else {
      if (tbody)
        tbody.innerHTML = `<tr><td colspan="4" class="table-empty">No grades recorded yet.</td></tr>`;
      resetStats();
    }
  } catch (err) {
    console.error("Grades fetch error:", err);
    if (tbody)
      tbody.innerHTML = `<tr><td colspan="4" class="table-empty" style="color:var(--error)">Failed to load academic records.</td></tr>`;
    resetStats();
  }
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function resetStats() {
  setText("enrolledCount", 0);
  setText("gradedCount", 0);
  setText("pendingCount", 0);
}
