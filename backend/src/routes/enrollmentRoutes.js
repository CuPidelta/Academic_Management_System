const express = require("express");
const router = express.Router();
const enrollCtrl = require("../controllers/enrollmentController");
const { verifyToken } = require("../middleware/authMiddleware");
const { hasPermission } = require("../permission/authPermission");

// POST /enrollment/enroll
router.post(
  "/enroll",
  verifyToken,
  hasPermission("manage_enrollments"),
  enrollCtrl.enrollStudent,
);

// DELETE /enrollment/drop/:id
router.delete(
  "/drop/:id",
  verifyToken,
  hasPermission("manage_enrollments"),
  enrollCtrl.dropCourse,
);

// GET /enrollment/all
router.get(
  "/all",
  verifyToken,
  hasPermission("manage_enrollments"),
  enrollCtrl.getAllEnrollments,
);

// GET /enrollment/my
router.get(
  "/my",
  verifyToken,
  hasPermission("view_enrolled_courses"),
  enrollCtrl.getMyEnrollments,
);

module.exports = router;
