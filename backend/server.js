require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./src/routes/authRoutes");
const courseRoutes = require("./src/routes/courseRoutes");
const enrollmentRoutes = require("./src/routes/enrollmentRoutes");
const gradeRoutes = require("./src/routes/gradeRoutes");
const instructorRoutes = require("./src/routes/instructorRoutes");
const debugRoutes = require("./src/routes/debugRoutes");

app.use("/auth", authRoutes);
app.use("/courses", courseRoutes);
app.use("/enrollment", enrollmentRoutes);
app.use("/grades", gradeRoutes);
app.use("/instructor", instructorRoutes);
app.use("/debug", debugRoutes);

// Only listen locally — Vercel handles this in production
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`AMS Server running on port ${PORT}`);
  });
}

module.exports = app;
