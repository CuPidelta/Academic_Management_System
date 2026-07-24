const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

const { verifyToken } = require("../middleware/authMiddleware");
const { hasPermission } = require("../permission/authPermission");

// PUBLIC ROUTES
router.post("/register", authController.register);
router.post("/login", authController.login);

//PROTECTED ROUTES
router.get(
  "/profile",
  verifyToken,
  hasPermission("view_own_profile"),
  authController.getProfile,
);

// USER MANAGEMENT ROUTES

router.get(
  "/users",
  verifyToken,
  hasPermission("view_all_students"),
  authController.getAllUsers,
);

router.get(
  "/users/:id",
  verifyToken,
  hasPermission("view_all_students"),
  authController.getUserById,
);

router.put(
  "/users/:id",
  verifyToken,
  hasPermission("edit_student"),
  authController.updateUser,
);

router.delete(
  "/users/:id",
  verifyToken,
  hasPermission("manage_users"),
  authController.deleteUser,
);

module.exports = router;
