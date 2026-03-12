import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import * as employeeService from "../services/employeeService";
import * as attendanceService from "../services/attendanceService";
import { sendSuccess, sendError } from "../utils";
import { logActivity } from "../services/activityService";
import { sendDailyReports } from "../services/attendanceScheduler";

/**
 * Attendance Controller — Handles HTTP requests and logs activities.
 */

export const markAttendance = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { employeeId, date, status } = req.body;

    // Verify employee exists
    const employee = await employeeService.findByEmployeeId(employeeId);
    if (!employee) {
      sendError(res, `Employee with ID "${employeeId}" not found`, 404);
      return;
    }

    const attendance = await attendanceService.upsert({ employeeId, date, status });
    
    // Log Activity
    await logActivity("ATTENDANCE_MARKED", `Marked ${employee.fullName} as ${status} for ${date}`);
    
    sendSuccess(res, attendance, 201);
  } catch (error) {
    next(error);
  }
};

export const getAttendance = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const employeeId = req.params.employeeId as string;
    const records = await attendanceService.findByEmployeeId(employeeId);
    sendSuccess(res, records);
  } catch (error) {
    next(error);
  }
};

export const getSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { date } = req.query;
    const summary = await attendanceService.getSummary(date as string);
    sendSuccess(res, summary);
  } catch (error) {
    next(error);
  }
};

/** POST /api/attendance/send-report — Manually trigger attendance emails */
export const sendReport = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const results = await sendDailyReports();
    sendSuccess(res, { message: "Email report triggered", results }, 200);
  } catch (error) {
    next(error);
  }
};
