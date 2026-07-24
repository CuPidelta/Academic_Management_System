const express = require("express");
const router = express.Router();
const courseCtrl = require("../controllers/courseController");
const { verifyToken } = require("../middleware/authMiddleware");
const { hasPermission } = require("../permission/authPermission");

// GET /courses/all
router.get(
  "/all",
  verifyToken,
  hasPermission("view_courses"),
  courseCtrl.getAllCourses,
);

// POST /courses/create
router.post(
  "/create",
  verifyToken,
  hasPermission("manage_courses"),
  courseCtrl.createCourse,
);

// PUT /courses/:id
router.put(
  "/:id",
  verifyToken,
  hasPermission("manage_courses"),
  courseCtrl.updateCourse,
);

// DELETE /courses/:id
router.delete(
  "/:id",
  verifyToken,
  hasPermission("manage_courses"),
  courseCtrl.deleteCourse,
);

module.exports = router;
