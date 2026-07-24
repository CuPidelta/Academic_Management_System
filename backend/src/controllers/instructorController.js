const Db = require("../config/mysql_db");

// Get courses assigned to the logged-in instructor
exports.getMyCourses = async (req, res) => {
  const instructorId = req.user.id;

  try {
    const [rows] = await Db.query(
      `SELECT course_id, course_code, title, units
       FROM courses
       WHERE instructor_id = ?
         AND deleted_at IS NULL
       ORDER BY course_code ASC`,
      [instructorId],
    );

    res.json({ Success: true, Courses: rows });
  } catch (err) {
    console.error("getMyCourses Error:", err.message);
    res.status(500).json({ Success: false, Message: "Database error." });
  }
};

// Get students enrolled in a specific course (for grading)
exports.getCourseStudents = async (req, res) => {
  const { course_id } = req.params;

  try {
    const [rows] = await Db.query(
      `SELECT
         e.enrollment_id,
         s.student_id,
         s.custom_id,
         u.full_name,
         g.grade_value,
         g.remarks
       FROM enrollments e
       JOIN students s ON e.student_id = s.student_id
       JOIN users u    ON s.user_id    = u.user_id
       LEFT JOIN grades g ON e.enrollment_id = g.enrollment_id
       WHERE e.course_id = ?
         AND e.status != 'Dropped'
         AND u.deleted_at IS NULL
       ORDER BY u.full_name ASC`,
      [course_id],
    );

    res.json({ Success: true, Students: rows });
  } catch (err) {
    console.error("getCourseStudents Error:", err.message);
    res.status(500).json({ Success: false, Message: "Database error." });
  }
};

//  Assign or update a grade (upsert)
exports.submitGrade = async (req, res) => {
  const { enrollment_id, grade_value, remarks } = req.body;

  if (!enrollment_id || grade_value === undefined) {
    return res.status(400).json({
      Success: false,
      Message: "enrollment_id and grade_value are required.",
    });
  }

  try {
    // Verify enrollment exists
    const [exists] = await Db.query(
      "SELECT enrollment_id FROM enrollments WHERE enrollment_id = ?",
      [enrollment_id],
    );

    if (!exists.length) {
      return res.status(404).json({
        Success: false,
        Message: "Enrollment record not found.",
      });
    }

    await Db.query(
      `INSERT INTO grades (enrollment_id, grade_value, remarks)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE
         grade_value = VALUES(grade_value),
         remarks     = VALUES(remarks),
         updated_at  = NOW()`,
      [enrollment_id, grade_value, remarks || "No remarks"],
    );

    res.json({ Success: true, Message: "Grade saved successfully!" });
  } catch (err) {
    console.error("submitGrade Error:", err.message);
    res.status(500).json({ Success: false, Message: "Error saving grade." });
  }
};
