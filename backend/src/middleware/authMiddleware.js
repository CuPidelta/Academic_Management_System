const Jwt = require("jsonwebtoken");
const SecretKey = process.env.JWT_SECRET;

// Core Token Verification
const verifyToken = (req, res, next) => {
  const AuthHeader = req.headers["authorization"];
  const Token = AuthHeader && AuthHeader.split(" ")[1];

  if (!Token) {
    return res.status(401).json({
      Success: false,
      Message: "Access Denied: No Token Provided",
    });
  }

  Jwt.verify(Token, SecretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        Success: false,
        Message: "Session Expired or Invalid Token",
      });
    }

    req.user = {
      id: decoded.id || decoded.user_id,
      role: decoded.role ? decoded.role.toLowerCase().trim() : "",
    };

    next();
  });
};

//  Role: Admin Only
const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      Success: false,
      Message: "Permission Denied: Admins Only",
    });
  }
};

// Role: Instructor Only (For Assigning Grades)
const isInstructor = (req, res, next) => {
  if (req.user && req.user.role === "instructor") {
    next();
  } else {
    res.status(403).json({
      Success: false,
      Message: "Permission Denied: Instructors Only",
    });
  }
};

// Role: Student Only (For Viewing Own Grades)
const isStudent = (req, res, next) => {
  if (req.user && req.user.role === "student") {
    next();
  } else {
    res.status(403).json({
      Success: false,
      Message: "Permission Denied: Students Only",
    });
  }
};

// Role: Admin OR Registrar (For Management)
const isAdminOrRegistrar = (req, res, next) => {
  const allowedRoles = ["admin", "registrar"];
  if (req.user && allowedRoles.includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({
      Success: false,
      Message: "Permission Denied: Admin or Registrar access required",
    });
  }
};

const canViewCourses = (req, res, next) => {
  const allowedRoles = ["admin", "registrar", "instructor"];
  if (req.user && allowedRoles.includes(req.user.role)) {
    next();
  } else {
    res.status(403).json({
      Success: false,
      Message: "Permission Denied: Unauthorized to view course catalog",
    });
  }
};

module.exports = {
  verifyToken,
  authorizeAdmin,
  isInstructor,
  isStudent,
  isAdminOrRegistrar,
  canViewCourses,
};
