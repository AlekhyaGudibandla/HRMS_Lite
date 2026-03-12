import { EmployeeRow, EmployeeResponse, AttendanceRow, AttendanceResponse } from "../types";

/**
 * Maps a raw employees DB row (snake_case) to an API response (camelCase).
 */
export const toEmployeeResponse = (row: EmployeeRow): EmployeeResponse => ({
  employeeId: row.employee_id,
  fullName: row.full_name,
  email: row.email,
  department: row.department,
  createdAt: row.created_at,
});

/**
 * Maps a raw attendance DB row (snake_case) to an API response (camelCase).
 */
export const toAttendanceResponse = (row: AttendanceRow): AttendanceResponse => ({
  _id: row.id,
  employeeId: row.employee_id,
  date: row.date,
  status: row.status,
  createdAt: row.created_at,
});
