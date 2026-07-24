const db = require("../config/mysql_db");

// Enroll Student in Course
exports.enrollStudent = async (req, res) => {
  const { student_id, course_id, term, semester } = req.body;

  // Validate required fields
  if (!student_id || !course_id) {
    return res.status(400).json({
      Success: false,
      Message: "student_id and course_id are required.",
    });
  }

  try {
    // Prevent duplicate enrollment (same student, course, term, and semester)
    const [existing] = await db.query(
      "SELECT * FROM enrollments WHERE student_id = ? AND course_id = ? AND term = ? AND semester = ?",
      [student_id, course_id, term || null, semester || null],
    );

    if (existing && existing.length > 0) {
      return res.status(400).json({
        Success: false,
        Message:
          "Student is already enrolled in this course for this term and semester.",
      });
    }

    const sql = `
      INSERT INTO enrollments (student_id, course_id, status, term, semester)
      VALUES (?, ?, 'Enrolled', ?, ?)
    `;
    await db.query(sql, [
      student_id,
      course_id,
      term || null,
      semester || null,
    ]);

    res.status(201).json({ Success: true, Message: "Enrollment successful!" });
  } catch (err) {
    console.error("Enrollment Error:", err.message);
    res.status(500).json({
      Success: false,
      Message: "Enrollment failed: " + err.message,
    });
  }
};

// Drop Course
exports.dropCourse = async (req, res) => {
  const { id } = req.params;

  if (!id || id === "null") {
    return res.status(400).json({
      Success: false,
      Message: "Invalid enrollment ID.",
    });
  }

  try {
    const [result] = await db.query(
      "UPDATE enrollments SET status = 'Dropped', dropped_at = NOW() WHERE enrollment_id = ? AND status != 'Dropped'",
      [id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        Success: false,
        Message: "Enrollment not found or already dropped.",
      });
    }

    res.json({ Success: true, Message: "Course dropped successfully." });
  } catch (err) {
    console.error("Drop Error:", err.message);
    res.status(500).json({
      Success: false,
      Message: "Error dropping course.",
    });
  }
};

// View My Enrollments (Student) — used by student_courses.html
exports.getMyEnrollments = async (req, res) => {
  const userId = req.user.id; // from JWT

  try {
    const sql = `
      SELECT
        e.enrollment_id,
        e.status,
        e.term,
        e.semester,
        c.course_id,
        c.course_code,
        c.title        AS course_title,
        c.units,
        IFNULL(u.full_name, 'Unassigned') AS instructor_name
      FROM enrollments e
      JOIN students s   ON e.student_id = s.student_id
      JOIN courses c    ON e.course_id  = c.course_id
      LEFT JOIN users u ON c.instructor_id = u.user_id
      WHERE s.user_id = ?
        AND e.status != 'Dropped'
      ORDER BY c.course_code ASC
    `;

    const [rows] = await db.query(sql, [userId]);

    res.json({
      Success: true,
      Count: rows.length,
      Enrollments: rows,
    });
  } catch (err) {
    console.error("getMyEnrollments Error:", err.message);
    res.status(500).json({
      Success: false,
      Message: "Database Error: " + err.message,
    });
  }
};

// View All Enrollments
exports.getAllEnrollments = async (req, res) => {
  try {
    const sql = `
      SELECT
        e.enrollment_id,
        e.student_id,
        e.course_id,
        e.status,
        e.term,
        e.semester,
        u.full_name   AS student_name,
        s.custom_id,
        c.course_code,
        c.title       AS course_title
      FROM enrollments e
      -- FIX: join students using the FK that enrollment stores
      JOIN students s ON e.student_id = s.student_id
      -- then get the user name via students.user_id
      JOIN users u    ON s.user_id = u.user_id
      JOIN courses c  ON e.course_id = c.course_id
      WHERE e.status != 'Dropped'
      ORDER BY e.enrollment_id DESC
    `;

    const [rows] = await db.query(sql);

    res.json({
      Success: true,
      Count: rows.length,
      Enrollments: rows,
    });
  } catch (err) {
    console.error("getAllEnrollments Error:", err.message);
    res.status(500).json({
      Success: false,
      Message: "Database Error: " + err.message,
    });
  }
};
