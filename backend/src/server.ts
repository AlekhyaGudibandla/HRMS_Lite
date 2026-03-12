import "dotenv/config";
import express from "express";
import cors from "cors";
import employeeRoutes from "./routes/employeeRoutes";
import attendanceRoutes from "./routes/attendanceRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import errorHandler from "./middleware/errorHandler";

const app = express();

// --------------- Middleware ---------------
app.use(cors());
app.use(express.json());

// --------------- Routes ------------------
app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Health check
app.get("/", (_req, res) => {
  res.json({ message: "HRMS Lite API is running 🚀" });
});

// --------------- Error Handler -----------
app.use(errorHandler);

import { initAttendanceScheduler } from "./services/attendanceScheduler";

// --------------- Start Server ------------
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  initAttendanceScheduler();
});
