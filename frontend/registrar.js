const API_BASE = "http://localhost:3000";
const token = localStorage.getItem("token");
const userRole = localStorage.getItem("role")?.toLowerCase();
const userName = localStorage.getItem("userName") || "Registrar";

function logout() {
  localStorage.clear();
  window.location.replace("login.html");
}

function initTopbar(name) {
  const nameEl = document.getElementById("navUserName");
  const avatarEl = document.getElementById("adminAvatar");
  const displayName = name || userName;
  if (nameEl) nameEl.textContent = displayName;
  if (avatarEl) avatarEl.textContent = displayName.charAt(0).toUpperCase();
}


document.addEventListener("DOMContentLoaded", () => {
  if (!token || userRole !== "registrar") {
    window.location.replace("login.html");
    return;
  }

  initTopbar();
  loadRegistrarProfile();
  fetchStudentData();

  // Close view modal on overlay click
  const modal = document.getElementById("viewStudentModal");
  if (modal)
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeViewModal();
    });
});

// Called by the Refresh button
function loadStudentTable() {
  fetchStudentData();
}

//PROFILE 
async function loadRegistrarProfile() {
  try {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    if (data.Success) {
      initTopbar(data.User.full_name);
    }
  } catch (err) {
    console.error("Profile Error:", err);
  }
}

//  FETCH DATA
let allStudents = [];

async function fetchStudentData() {
  const tbody = document.getElementById("studentTableBody");
  const studentCountEl = document.getElementById("studentCount");
  const courseCountEl = document.getElementById("courseCount");
  const enrollCountEl = document.getElementById("enrollmentCount");
  const tableCountEl = document.getElementById("studentTableCount");

  if (tbody)
    tbody.innerHTML = `<tr><td colspan="4" class="table-empty">Loading…</td></tr>`;

  try {
    //  Fetch users
    const userRes = await fetch(`${API_BASE}/auth/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const userData = await userRes.json();

    //  Fetch course and enrollment counts from existing endpoints
    let courseCount = 0;
    let enrollmentCount = 0;
    try {
      const [coursesRes, enrollRes] = await Promise.all([
        fetch(`${API_BASE}/courses/all`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/enrollment/all`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const [coursesData, enrollData] = await Promise.all([
        coursesRes.json(),
        enrollRes.json(),
      ]);
      if (coursesData.Success) courseCount = (coursesData.Courses || []).length;
      if (enrollData.Success)
        enrollmentCount = (enrollData.Enrollments || []).length;
    } catch (e) {
      console.warn("Could not fetch course/enrollment stats:", e.message);
    }

    if (userData.Success) {
      const students = userData.Users.filter((u) => u.role === "student");
      allStudents = students; 

      // Update stat cards
      if (studentCountEl) studentCountEl.textContent = students.length;
      if (courseCountEl) courseCountEl.textContent = courseCount;
      if (enrollCountEl) enrollCountEl.textContent = enrollmentCount;

      // Update table subtitle
      if (tableCountEl)
        tableCountEl.textContent = `${students.length} student${students.length !== 1 ? "s" : ""} registered`;

      // Render table
      if (!students.length) {
        if (tbody)
          tbody.innerHTML = `<tr><td colspan="4" class="table-empty">No students found.</td></tr>`;
        return;
      }

      if (tbody) {
        tbody.innerHTML = students
          .map(
            (s) => `
          <tr>
            <td>${s.custom_id || "N/A"}</td>
            <td>${s.full_name}</td>
            <td>${s.program || "<span style='color:var(--muted);font-style:italic'>Unassigned</span>"}</td>
            <td>
              <button class="btn-enroll" onclick="openEnrollment(${s.user_id})">Enroll</button>
              <button class="btn-view"   onclick="viewRecord(${s.user_id})">View</button>
            </td>
          </tr>
        `,
          )
          .join("");
      }
    } else {
      if (tbody)
        tbody.innerHTML = `<tr><td colspan="4" class="table-empty" style="color:var(--error)">${userData.Message || "Failed to load students."}</td></tr>`;
    }
  } catch (err) {
    console.error("fetchStudentData error:", err);
    if (tbody)
      tbody.innerHTML = `<tr><td colspan="4" class="table-empty" style="color:var(--error)">Connection failed. Check server status.</td></tr>`;
  }
}

// ACTIONS 
function openEnrollment(studentId) {
  window.location.href = `enrollment.html?studentId=${studentId}`;
}

function viewRecord(studentId) {
 
  const student = allStudents.find((s) => s.user_id === studentId);
  if (!student) return;

  window.currentViewId = studentId;
  document.getElementById("viewModalName").textContent = student.full_name;
  document.getElementById("viewModalId").textContent =
    student.custom_id || "N/A";
  document.getElementById("viewModalEmail").textContent =
    student.email || "N/A";
  document.getElementById("viewModalProgram").textContent =
    student.program || "N/A";
  document.getElementById("viewModalYear").textContent =
    student.year_level || "N/A";
  document.getElementById("viewStudentModal").classList.add("open");
}

function closeViewModal() {
  document.getElementById("viewStudentModal").classList.remove("open");
}
