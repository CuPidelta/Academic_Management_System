const express = require("express");
const router = express.Router();
const instructorCtrl = require("../controllers/instructorController");
const { verifyToken } = require("../middleware/authMiddleware");
const { hasPermission } = require("../permission/authPermission");

// GET /instructor/my-courses — instructor's assigned courses
router.get(
  "/my-courses",
  verifyToken,
  hasPermission("view_assigned_courses"),
  instructorCtrl.getMyCourses,
);

// GET /instructor/course-students/:course_id — students enrolled in a course
router.get(
  "/course-students/:course_id",
  verifyToken,
  hasPermission("view_enrolled_students"),
  instructorCtrl.getCourseStudents,
);

// POST /instructor/submit-grade — assign or update a grade
router.post(
  "/submit-grade",
  verifyToken,
  hasPermission("update_grades"),
  instructorCtrl.submitGrade,
);

module.exports = router;
