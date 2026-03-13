import { CONFIG } from "./config";
import express from "express";
import cors from "cors";
import employeeRoutes from "./routes/employeeRoutes";
import attendanceRoutes from "./routes/attendanceRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import errorHandler from "./middleware/errorHandler";
import { verifyEmailConnection } from "./services/emailService";
import { initAttendanceScheduler } from "./services/attendanceScheduler";

const app = express();

// --------------- Middleware ---------------
app.use(cors());
app.use(express.json());

// --------------- Routes ------------------
app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Health check
app.get("/", (_req: express.Request, res: express.Response) => {
  res.json({ 
    status: "healthy",
    message: "HRMS Lite API is running 🚀",
    env: CONFIG.NODE_ENV
  });
});

// --------------- Error Handler -----------
app.use(errorHandler);

// --------------- Start Server ------------
const PORT = CONFIG.PORT;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT} (${CONFIG.NODE_ENV})`);
  
  // Verify SMTP on startup
  await verifyEmailConnection();
  
  // Initialize Scheduler
  initAttendanceScheduler();
});
