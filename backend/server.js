require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const savedJobsRoutes = require("./routes/savedJobsRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const interviewAiRoutes = require("./routes/interviewAiRoutes");
const interviewQuestionRoutes = require("./routes/interviewQuestionRoutes");
const interviewSessionRoutes = require("./routes/interviewSessionRoutes");
const resumeAiRoutes = require("./routes/resumeAiRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const app = express();
// Middleware to handle CORS
app.use(
  cors({
    origin: "*",
    method: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/saved-jobs", savedJobsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/ai", interviewAiRoutes);
app.use("/api/questions", interviewQuestionRoutes);
app.use("/api/sessions", interviewSessionRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/resume-ai", resumeAiRoutes);

// Server upload folder
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {}));

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
};

startServer();
