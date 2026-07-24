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
    console.error("LOGIN ERROR:", err); // TEMP: full error to Vercel logs
    res.status(500).json({
      Success: false,
      Message: "Database error",
      Debug: err.message, // TEMP: remove this line once fixed
    });
  }
};
