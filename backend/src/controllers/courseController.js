const db = require("../config/mysql_db");

// GET ALL COURSES
exports.getAllCourses = async (req, res) => {
  try {
    const sql = `
      SELECT 
        c.course_id, 
        c.course_code, 
        c.title, 
        c.units, 
        c.instructor_id,
        u.full_name AS instructor_name 
      FROM courses c
      LEFT JOIN users u ON c.instructor_id = u.user_id
      WHERE c.deleted_at IS NULL
    `;
    const [rows] = await db.query(sql);
    res.status(200).json({ Success: true, Courses: rows });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ Success: false, Message: "Failed to retrieve courses." });
  }
};

//  CREATE COURSE
exports.createCourse = async (req, res) => {
  const { course_code, title, units, instructor_id } = req.body;
  try {
    const sql =
      "INSERT INTO courses (course_code, title, units, instructor_id) VALUES (?, ?, ?, ?)";
    await db.query(sql, [course_code, title, units, instructor_id || null]);
    res
      .status(201)
      .json({ Success: true, Message: "Course created successfully!" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({ Success: false, Message: "Course code already exists." });
    }
    res
      .status(500)
      .json({ Success: false, Message: "Database error: " + err.message });
  }
};

// UPDATE COURSE
exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  const { course_code, title, units, instructor_id } = req.body;
  try {
    const [course] = await db.query(
      "SELECT * FROM courses WHERE course_id = ?",
      [id],
    );
    if (course.length === 0) {
      return res
        .status(404)
        .json({ Success: false, Message: "Course not found." });
    }
    const sql =
      "UPDATE courses SET course_code = ?, title = ?, units = ?, instructor_id = ? WHERE course_id = ?";
    await db.query(sql, [course_code, title, units, instructor_id || null, id]);
    res.json({ Success: true, Message: "Course updated successfully!" });
  } catch (err) {
    res.status(500).json({ Success: false, Message: "Server Error." });
  }
};

// DELETE COURSE (THE MISSING LINK)
// This function must exist because your routes file calls it!
exports.deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
   
    const sql = "UPDATE courses SET deleted_at = NOW() WHERE course_id = ?";
    const [result] = await db.query(sql, [id]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ Success: false, Message: "Course not found." });
    }

    res.json({ Success: true, Message: "Course deactivated successfully." });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ Success: false, Message: "Failed to delete course." });
  }
};
