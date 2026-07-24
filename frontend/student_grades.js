const API_BASE = "http://localhost:3000";
const token = localStorage.getItem("token");
const userName = localStorage.getItem("userName") || "Student";

function logout() {
  localStorage.clear();
  window.location.replace("login.html");
}

function initTopbar() {
  setText("studentName", userName);
  setText("avatar", userName.charAt(0).toUpperCase());
}

document.addEventListener("DOMContentLoaded", () => {
  if (!token) {
    window.location.replace("login.html");
    return;
  }
  initTopbar();
  fetchMyGrades();
});

async function fetchMyGrades() {
  const tbody = document.getElementById("gradesTableBody");
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="4" class="table-empty">Loading records…</td></tr>`;

  try {
    const res = await fetch(`${API_BASE}/grades/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) {
      logout();
      return;
    }
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

      setText("totalCount", grades.length);
      setText("gradedCount", graded.length);
      setText("pendingCount", pending.length);

      if (!grades.length) {
        tbody.innerHTML = `<tr><td colspan="4" class="table-empty">No enrollment records found.</td></tr>`;
        return;
      }

      tbody.innerHTML = grades
        .map((g) => {
          const val = parseFloat(g.grade_value);

          const hasValidGrade =
            !isNaN(val) && val > 0 && g.grade_value !== "Pending";

          const isPassing = hasValidGrade && val <= 3.0;

          let badgeCls = "grade-badge grade-none";
          let displayValue = "Pending";

          if (hasValidGrade) {
            badgeCls = isPassing
              ? "grade-badge grade-pass"
              : "grade-badge grade-fail";
            displayValue = val.toFixed(2);
          }

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
            <td style="text-align:center"><span class="${badgeCls}">${displayValue}</span></td>
            <td>${remarks}</td>
          </tr>`;
        })
        .join("");
    } else {
      resetStats();
      tbody.innerHTML = `<tr><td colspan="4" class="table-empty">No grades recorded yet.</td></tr>`;
    }
  } catch (err) {
    console.error("fetchMyGrades error:", err);
    resetStats();
    tbody.innerHTML = `<tr><td colspan="4" class="table-empty" style="color:red">Failed to load academic records.</td></tr>`;
  }
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function resetStats() {
  setText("totalCount", 0);
  setText("gradedCount", 0);
  setText("pendingCount", 0);
}
