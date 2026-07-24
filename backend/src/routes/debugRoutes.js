const express = require("express");
const router = express.Router();
const Db = require("../config/mysql_db");

router.get("/db-check", async (req, res) => {
  try {
    const [results] = await Db.query("SELECT 1 + 1 AS result");
    res.json({
      Success: true,
      Message: "Database connection is working!",
      TestResult: results[0].result,
    });
  } catch (err) {
    res.status(500).json({
      Success: false,
      ErrorName: err.name,
      ErrorCode: err.code,
      ErrorMessage: err.message,
    });
  }
});

module.exports = router;
