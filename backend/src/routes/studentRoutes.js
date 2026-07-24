
// const router = express.Router();
// const studentController = require("../controllers/studentController");

// const { verifyToken } = require("../middleware/authMiddleware");

// const { hasPermission } = require("../permission/authPermission");

// // CREATE STUDENT (Admin Only)
// router.post(
//   "/",
//   verifyToken,
//   hasPermission("create_student"),
//   studentController.createStudent,
// );

// // UPDATE STUDENT (Admin or Staff)
// router.put(
//   "/:id",
//   verifyToken,
//   hasPermission("edit_student"),
//   studentController.updateStudent,
// );

// // DELETE/DEACTIVATE STUDENT (Admin Only)
// router.delete(
//   "/:id",
//   verifyToken, // Updated
//   hasPermission("delete_student"),
//   studentController.deactivateStudent,
// );

// // GET ALL STUDENTS (Admin or Staff)
// router.get(
//   "/",
//   verifyToken, // Updated
//   hasPermission("view_all_students"),
//   studentController.getAllStudents,
// );

// module.exports = router;
