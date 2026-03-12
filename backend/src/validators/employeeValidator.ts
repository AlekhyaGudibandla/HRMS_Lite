import { body, ValidationChain } from "express-validator";

/**
 * Validation rules for creating an employee.
 * Used as Express middleware before the controller.
 */
export const validateEmployee: ValidationChain[] = [
  body("employeeId")
    .trim()
    .notEmpty()
    .withMessage("Employee ID is required"),
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address"),
  body("department")
    .trim()
    .notEmpty()
    .withMessage("Department is required"),
];
