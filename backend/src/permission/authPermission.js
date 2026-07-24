const permissions = {
  admin: [
    "manage_users",
    "create_student",
    "edit_student",
    "delete_student",
    "view_all_students",
    "manage_courses",
    "view_courses",
    "delete_course",
    "assign_instructor",
    "manage_enrollments",
    "drop_course",
    "update_grades",
    "view_all_reports",
    "view_own_profile",
    "access_student_dashboard",
  ],
  registrar: [
    "create_student",
    "edit_student",
    "view_all_students",
    "manage_courses",
    "view_courses",
    "manage_enrollments",
    "drop_course",
    "view_enrolled_courses",
    "view_all_reports",
    "view_own_profile",
  ],
  instructor: [
    "view_courses",
    "view_assigned_courses",
    "view_enrolled_students",
    "update_grades",
    "view_grades",
    "view_own_profile",
  ],
  student: [
    "view_own_profile",
    "access_student_dashboard",
    "view_enrolled_courses",
    "view_own_grades",
  ],
};

exports.hasPermission = (action) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        Success: false,
        Message: "Authentication required. Please log in.",
      });
    }

    const userRole = req.user.role.toLowerCase().trim();
    const allowedActions = permissions[userRole] || [];

    if (allowedActions.includes(action)) {
      next();
    } else {
      console.warn(`[Security Alert] Denied: ${userRole} attempted ${action}`);
      return res.status(403).json({
        Success: false,
        Message: `Access Denied: Your role (${userRole}) lacks the '${action}' permission.`,
      });
    }
  };
};

exports.isRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ Success: false, Message: "Auth required" });

    const userRole = req.user.role.toLowerCase().trim();
    const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase().trim());

    if (!normalizedAllowed.includes(userRole)) {
      return res.status(403).json({
        Success: false,
        Message: `Unauthorized: Restricted to ${allowedRoles.join(" or ")}.`,
      });
    }
    next();
  };
};

exports.isOwnerOrAdmin = (idParamName = "id") => {
  return (req, res, next) => {
    const userId = req.user.id;
    const targetId = req.params[idParamName];
    const userRole = req.user.role.toLowerCase().trim();

    if (
      userRole === "admin" ||
      (userId && targetId && userId.toString() === targetId.toString())
    ) {
      next();
    } else {
      res.status(403).json({
        Success: false,
        Message: "Access Denied: You cannot modify another user's record.",
      });
    }
  };
};
