const express = require("express");
const router = express.Router();
const gradeCtrl = require("../controllers/gradeController");
const { verifyToken } = require("../middleware/authMiddleware");
const { hasPermission } = require("../permission/authPermission");

// GET /grades/my — student views own grades
router.get(
  "/my",
  verifyToken,
  hasPermission("view_own_grades"),
  gradeCtrl.getMyGrades,
);

// GET /grades/all — admin/registrar views all grades
router.get(
  "/all",
  verifyToken,
  hasPermission("view_all_reports"),
  gradeCtrl.getAllGrades,
);

module.exports = router;
