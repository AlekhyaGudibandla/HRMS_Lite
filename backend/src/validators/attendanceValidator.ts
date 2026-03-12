import { body, ValidationChain } from "express-validator";

/**
 * Validation rules for marking attendance.
 * Used as Express middleware before the controller.
 */
export const validateAttendance: ValidationChain[] = [
  body("employeeId")
    .trim()
    .notEmpty()
    .withMessage("Employee ID is required"),
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date"),
  body("status")
    .trim()
    .isIn(["Present", "Absent"])
    .withMessage("Status must be either Present or Absent"),
];
