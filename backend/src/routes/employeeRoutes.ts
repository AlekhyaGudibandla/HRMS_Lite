import { Router } from "express";
import { validateEmployee } from "../validators";
import { createEmployee, getAllEmployees, deleteEmployee } from "../controllers/employeeController";

const router = Router();

// POST   /api/employees      → Create a new employee
router.post("/", validateEmployee, createEmployee);

// GET    /api/employees      → Get all employees
router.get("/", getAllEmployees);

// DELETE /api/employees/:id  → Delete an employee by employeeId
router.delete("/:employeeId", deleteEmployee);

export default router;
