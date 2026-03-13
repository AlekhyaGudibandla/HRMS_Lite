import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import * as employeeService from "../services/employeeService";
import { sendSuccess, sendError } from "../utils";
import { logActivity } from "../services/activityService";
import { sendWelcomeEmail } from "../services/emailService";

/**
 * Employee Controller — Handles HTTP requests and logs activities.
 */

export const createEmployee = async (
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

    const { employeeId, fullName, email, department } = req.body;

    const existing = await employeeService.findByEmployeeId(employeeId);
    if (existing) {
      sendError(res, `Employee with ID "${employeeId}" already exists`, 409);
      return;
    }

    const employee = await employeeService.create({ employeeId, fullName, email, department });
    
    // Log Activity
    await logActivity("EMPLOYEE_ADDED", `Added new employee: ${fullName} (${employeeId})`);
    
    // Send Welcome Email (async, don't block response)
    sendWelcomeEmail(email, fullName, employeeId, department).catch(err => 
      console.error(`Failed to send welcome email to ${email}:`, err.message)
    );
    
    sendSuccess(res, employee, 201);
  } catch (error) {
    next(error);
  }
};

export const getAllEmployees = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const employees = await employeeService.findAll();
    sendSuccess(res, employees);
  } catch (error) {
    next(error);
  }
};

export const deleteEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const employeeId = req.params.employeeId as string;
    
    // Get info for logging before deletion
    const employee = await employeeService.findByEmployeeId(employeeId);
    const fullName = employee ? employee.fullName : employeeId;

    const deleted = await employeeService.remove(employeeId);
    if (!deleted) {
      sendError(res, `Employee with ID "${employeeId}" not found`, 404);
      return;
    }

    // Log Activity
    await logActivity("EMPLOYEE_DELETED", `Deleted employee: ${fullName} (${employeeId})`);

    sendSuccess(res, { message: "Employee deleted successfully" });
  } catch (error) {
    next(error);
  }
};
