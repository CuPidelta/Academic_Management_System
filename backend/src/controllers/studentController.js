const Db = require("../config/mysql_db");
const Bcrypt = require("bcryptjs");

exports.createStudent = async (req, res) => {
  const { custom_id, full_name, email, password, year_level, program } =
    req.body;

  if (!custom_id || !full_name || !email || !password) {
    return res
      .status(400)
      .json({ Success: false, Message: "Missing required fields" });
  }

  const connection = await Db.getConnection();
  try {
    await connection.beginTransaction();

    // Check if email already exists in users table
    const [existing] = await connection.query(
      "SELECT user_id FROM users WHERE email = ?",
      [email],
    );
    if (existing.length > 0) {
      await connection.rollback();
      return res
        .status(400)
        .json({ Success: false, Message: "Email is already registered" });
    }

    const hashedPassword = await Bcrypt.hash(password, 10);

    // 1. Insert into users table (Role 4 = Student)
    const [userResult] = await connection.query(
      "INSERT INTO users (full_name, email, password_hash, role_id) VALUES (?, ?, ?, 4)",
      [full_name, email.toLowerCase().trim(), hashedPassword],
    );

    const newUserId = userResult.insertId;

    // Insert into students table
    await connection.query(
      "INSERT INTO students (user_id, custom_id, full_name, email, year_level, program) VALUES (?, ?, ?, ?, ?, ?)",
      [
        newUserId,
        custom_id,
        full_name,
        email.toLowerCase().trim(),
        year_level || "1st Year",
        program || "General",
      ],
    );

    await connection.commit();
    res
      .status(201)
      .json({ Success: true, Message: "Student created successfully!" });
  } catch (error) {
    await connection.rollback();
    console.error("Create Student Error:", error);
    res.status(500).json({
      Success: false,
      Message:
        error.code === "ER_DUP_ENTRY"
          ? "Student ID already exists"
          : "Internal Server Error",
    });
  } finally {
    connection.release();
  }
};


exports.getAllStudents = async (req, res) => {
  try {
    const sql = `
      SELECT student_id, custom_id, full_name, email, year_level, program 
      FROM students 
      WHERE deleted_at IS NULL 
      ORDER BY full_name ASC`;
    const [results] = await Db.query(sql);
    res.json({ Success: true, Students: results });
  } catch (err) {
    res
      .status(500)
      .json({ Success: false, Message: "Could not fetch students" });
  }
};


exports.updateStudent = async (req, res) => {
  const { custom_id, full_name, email, password, year_level, program } =
    req.body;
  const { id } = req.params;

  const connection = await Db.getConnection();
  try {
    await connection.beginTransaction();

    // Check if student exists
    const [students] = await connection.query(
      "SELECT user_id FROM students WHERE student_id = ?",
      [id],
    );
    if (students.length === 0) {
      await connection.rollback();
      return res
        .status(404)
        .json({ Success: false, Message: "Student not found" });
    }

    const userId = students[0].user_id;

    // Update Users Table
    let userSql = "UPDATE users SET full_name = ?, email = ? WHERE user_id = ?";
    let userParams = [full_name, email.toLowerCase().trim(), userId];

    if (password && password.trim() !== "") {
      const hashedPassword = await Bcrypt.hash(password, 10);
      userSql =
        "UPDATE users SET full_name = ?, email = ?, password_hash = ? WHERE user_id = ?";
      userParams = [
        full_name,
        email.toLowerCase().trim(),
        hashedPassword,
        userId,
      ];
    }
    await connection.query(userSql, userParams);

    // Update Students Table
    const studentSql = `
      UPDATE students 
      SET custom_id = ?, full_name = ?, email = ?, year_level = ?, program = ? 
      WHERE student_id = ?`;
    await connection.query(studentSql, [
      custom_id,
      full_name,
      email.toLowerCase().trim(),
      year_level,
      program,
      id,
    ]);

    await connection.commit();
    res.json({ Success: true, Message: "Student updated successfully!" });
  } catch (error) {
    await connection.rollback();
    console.error("Update Error:", error);
    res.status(500).json({
      Success: false,
      Message:
        error.code === "ER_DUP_ENTRY"
          ? "Email or Custom ID already taken"
          : error.message,
    });
  } finally {
    connection.release();
  }
};

exports.deactivateStudent = async (req, res) => {
  const { id } = req.params;
  const connection = await Db.getConnection();

  try {
    await connection.beginTransaction();

    const [students] = await connection.query(
      "SELECT user_id FROM students WHERE student_id = ?",
      [id],
    );
    if (students.length === 0) {
      await connection.rollback();
      return res
        .status(404)
        .json({ Success: false, Message: "Student not found" });
    }

    const userId = students[0].user_id;

    // Soft delete from both tables
    await connection.query(
      "UPDATE users SET deleted_at = NOW() WHERE user_id = ?",
      [userId],
    );
    await connection.query(
      "UPDATE students SET deleted_at = NOW() WHERE student_id = ?",
      [id],
    );

    await connection.commit();
    res.json({ Success: true, Message: "Student deactivated successfully" });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ Success: false, Message: "Deactivation failed" });
  } finally {
    connection.release();
  }
};
