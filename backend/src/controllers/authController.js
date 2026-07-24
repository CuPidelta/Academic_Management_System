const Db = require("../config/mysql_db");
const Bcrypt = require("bcryptjs");
const Jwt = require("jsonwebtoken");

// Helper function to remove null student fields for non-student roles
const formatUserResponse = (user) => {
  if (user.role !== "student") {
    const { student_id, custom_id, year_level, program, ...cleanUser } = user;
    return cleanUser;
  }
  return user;
};

// REGISTER
exports.register = async (req, res) => {
  const {
    full_name,
    email,
    password,
    role_name,
    custom_id,
    year_level,
    program,
  } = req.body;

  if (!full_name || !email || !password || !role_name) {
    return res
      .status(400)
      .json({ Success: false, Message: "All fields are required." });
  }

  const connection = await Db.getConnection();
  try {
    await connection.beginTransaction();
    const hashedPassword = await Bcrypt.hash(password, 10);
    const sanitizedEmail = email.toLowerCase().trim();

    const [roleRes] = await connection.query(
      "SELECT role_id FROM roles WHERE LOWER(role_name) = LOWER(?)",
      [role_name],
    );

    if (!roleRes.length) throw new Error("Invalid Role provided.");
    const roleId = roleRes[0].role_id;

    const [userRes] = await connection.query(
      "INSERT INTO users (full_name, email, password_hash, role_id) VALUES (?, ?, ?, ?)",
      [full_name, sanitizedEmail, hashedPassword, roleId],
    );

    const newUserId = userRes.insertId;

    if (role_name.toLowerCase() === "student") {
      await connection.query(
        "INSERT INTO students (user_id, custom_id, full_name, email, year_level, program) VALUES (?, ?, ?, ?, ?, ?)",
        [newUserId, custom_id, full_name, sanitizedEmail, year_level, program],
      );
    }

    await connection.commit();
    res
      .status(201)
      .json({ Success: true, Message: "Account created successfully!" });
  } catch (err) {
    await connection.rollback();
    res.status(400).json({
      Success: false,
      Message:
        err.code === "ER_DUP_ENTRY"
          ? "Email or Custom ID already exists."
          : err.message,
    });
  } finally {
    connection.release();
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const sql = `
    SELECT u.user_id AS id, u.full_name, u.email, u.password_hash, LOWER(r.role_name) AS role 
    FROM users u 
    JOIN roles r ON u.role_id = r.role_id 
    WHERE u.email = ? AND u.deleted_at IS NULL`;

  try {
    const [results] = await Db.query(sql, [email.toLowerCase().trim()]);
    if (results.length === 0)
      return res
        .status(401)
        .json({ Success: false, Message: "Invalid credentials" });

    const user = results[0];
    const isMatch = await Bcrypt.compare(password, user.password_hash);
    if (!isMatch)
      return res
        .status(401)
        .json({ Success: false, Message: "Invalid credentials" });

    const token = Jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" },
    );
    res.json({
      Success: true,
      Token: token,
      User: { id: user.id, full_name: user.full_name, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ Success: false, Message: "Database error" });
  }
};

// GET ALL USERS (Updated with Clean-up)
exports.getAllUsers = async (req, res) => {
  const sql = `
    SELECT u.user_id, u.full_name, u.email, LOWER(r.role_name) AS role, 
           s.student_id, s.custom_id, s.year_level, s.program
    FROM users u
    JOIN roles r ON u.role_id = r.role_id
    LEFT JOIN students s ON u.user_id = s.user_id
    WHERE u.deleted_at IS NULL
    ORDER BY u.user_id DESC`;

  try {
    const [results] = await Db.query(sql);
    const cleanedUsers = results.map(formatUserResponse); // Cleans each user
    res.json({ Success: true, Users: cleanedUsers });
  } catch (err) {
    res
      .status(500)
      .json({ Success: false, Message: "Database error: " + err.message });
  }
};

// GET USER BY ID (Updated with Clean-up)
exports.getUserById = async (req, res) => {
  const sql = `
    SELECT u.user_id, u.full_name, u.email, LOWER(r.role_name) AS role, 
           s.custom_id, s.year_level, s.program
    FROM users u
    JOIN roles r ON u.role_id = r.role_id
    LEFT JOIN students s ON u.user_id = s.user_id
    WHERE u.user_id = ? AND u.deleted_at IS NULL`;

  try {
    const [results] = await Db.query(sql, [req.params.id]);
    if (results.length === 0)
      return res
        .status(404)
        .json({ Success: false, Message: "User not found" });

    res.json({ Success: true, User: formatUserResponse(results[0]) });
  } catch (err) {
    res.status(500).json({ Success: false, Message: "Database error" });
  }
};

//UPDATE USER
exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const {
    full_name,
    email,
    password,
    role_name,
    custom_id,
    year_level,
    program,
  } = req.body;
  const connection = await Db.getConnection();
  try {
    await connection.beginTransaction();
    const sanitizedEmail = email.toLowerCase().trim();
    let userSql =
      "UPDATE users SET full_name = ?, email = ? WHERE user_id = ? AND deleted_at IS NULL";
    let userParams = [full_name, sanitizedEmail, userId];

    if (password && password.trim() !== "") {
      const hashed = await Bcrypt.hash(password, 10);
      userSql =
        "UPDATE users SET full_name = ?, email = ?, password_hash = ? WHERE user_id = ? AND deleted_at IS NULL";
      userParams = [full_name, sanitizedEmail, hashed, userId];
    }

    const [updateResult] = await connection.query(userSql, userParams);

    if (updateResult.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({
        Success: false,
        Message: "User not found or already deactivated.",
      });
    }

    if (role_name && role_name.toLowerCase() === "student") {
      const studentSql =
        "UPDATE students SET custom_id = ?, full_name = ?, email = ?, year_level = ?, program = ? WHERE user_id = ?";
      await connection.query(studentSql, [
        custom_id,
        full_name,
        sanitizedEmail,
        year_level,
        program,
        userId,
      ]);
    }
    await connection.commit();
    res.json({ Success: true, Message: "User updated successfully" });
  } catch (err) {
    await connection.rollback();
    res
      .status(500)
      .json({ Success: false, Message: "Update failed: " + err.message });
  } finally {
    connection.release();
  }
};

// DELETE
exports.deleteUser = async (req, res) => {
  try {
    const [result] = await Db.query(
      "UPDATE users SET deleted_at = NOW() WHERE user_id = ? AND deleted_at IS NULL",
      [req.params.id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        Success: false,
        Message: "User not found or already deactivated.",
      });
    }

    res.json({ Success: true, Message: "User deactivated successfully." });
  } catch (err) {
    console.error("deleteUser error:", err.message);
    res.status(500).json({ Success: false, Message: "Database error" });
  }
};

// GET PROFILE (Updated with Clean-up)
exports.getProfile = async (req, res) => {
  const sql = `
    SELECT u.user_id AS id, u.full_name, u.email, LOWER(r.role_name) AS role,
           s.custom_id, s.year_level, s.program
    FROM users u 
    JOIN roles r ON u.role_id = r.role_id 
    LEFT JOIN students s ON u.user_id = s.user_id
    WHERE u.user_id = ? AND u.deleted_at IS NULL`;

  try {
    const [results] = await Db.query(sql, [req.user.id]);
    if (results.length === 0)
      return res
        .status(404)
        .json({ Success: false, Message: "User not found" });

    res.json({ Success: true, User: formatUserResponse(results[0]) });
  } catch (err) {
    res.status(500).json({ Success: false, Message: "Database error" });
  }
};
