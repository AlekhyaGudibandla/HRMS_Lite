import { Router } from "express";
import { validateAttendance } from "../validators";
import {
  markAttendance,
  getAttendance,
  getSummary,
  sendReport,
} from "../controllers/attendanceController";

const router = Router();

// POST  /api/attendance             → Mark attendance
router.post("/", validateAttendance, markAttendance);

// GET   /api/attendance/summary     → Get attendance summary
router.get("/summary", getSummary);

// POST  /api/attendance/send-report → Manually trigger daily email report
router.post("/send-report", sendReport);

// GET   /api/attendance/:employeeId → Get attendance history
router.get("/:employeeId", getAttendance);

export default router;
