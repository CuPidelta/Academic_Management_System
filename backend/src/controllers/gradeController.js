const Db = require("../config/mysql_db");

// Assign or Update Grade (Instructor Only)
exports.upsertGrade = async (req, res) => {
  const { enrollment_id, grade_value, remarks } = req.body;

  if (!enrollment_id || grade_value === undefined) {
    return res.status(400).json({
      Success: false,
      Message: "Enrollment ID and Grade are required.",
    });
  }

  // Ensure enrollment exists before grading
  const checkSql =
    "SELECT enrollment_id FROM enrollments WHERE enrollment_id = ?";

  const sql = `
    INSERT INTO grades (enrollment_id, grade_value, remarks) 
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE 
    grade_value = VALUES(grade_value), 
    remarks = VALUES(remarks),
    updated_at = NOW()`;

  try {
    const [exists] = await Db.query(checkSql, [enrollment_id]);
    if (exists.length === 0) {
      return res
        .status(404)
        .json({ Success: false, Message: "Enrollment record not found." });
    }

    await Db.query(sql, [enrollment_id, grade_value, remarks || "No remarks"]);
    res.json({ Success: true, Message: "Grade saved successfully!" });
  } catch (err) {
    console.error("Upsert Grade Error:", err);
    res.status(500).json({ Success: false, Message: "Error saving grade." });
  }
};

// View All Grades (Admin/Registrar)
exports.getAllGrades = async (req, res) => {
  const sql = `
    SELECT 
      g.grade_id, 
      s.custom_id,
      u.full_name AS student_name, 
      c.course_code, 
      c.title AS course_title, 
      g.grade_value, 
      g.remarks, 
      g.updated_at
    FROM enrollments e
    JOIN students s ON e.student_id = s.student_id
    JOIN users u ON s.user_id = u.user_id
    JOIN courses c ON e.course_id = c.course_id
    LEFT JOIN grades g ON e.enrollment_id = g.enrollment_id
    WHERE u.deleted_at IS NULL
    ORDER BY u.full_name ASC, c.course_code ASC`;

  try {
    const [rows] = await Db.query(sql);
    res.json({ Success: true, Grades: rows });
  } catch (err) {
    console.error("Get All Grades Error:", err);
    res.status(500).json({ Success: false, Message: "Database error." });
  }
};

// View Own Grades (Student)
exports.getMyGrades = async (req, res) => {
  const userId = req.user.id; // From JWT middleware

  const sql = `
    SELECT 
      c.course_code, 
      c.title AS course_title, 
      IFNULL(g.grade_value, 'Pending') AS grade_value, 
      IFNULL(g.remarks, '--') AS remarks
    FROM enrollments e
    JOIN students s ON e.student_id = s.student_id
    JOIN courses c ON e.course_id = c.course_id
    LEFT JOIN grades g ON e.enrollment_id = g.enrollment_id
    WHERE s.user_id = ?`;

  try {
    const [rows] = await Db.query(sql, [userId]);

    console.log(`Success: Found ${rows.length} records for User ID ${userId}`);

    res.json({ Success: true, Grades: rows });
  } catch (err) {
    console.error("Get My Grades Error:", err);
    res
      .status(500)
      .json({ Success: false, Message: "Error fetching your grades." });
  }
};
