import axios from "axios";
import { Employee, Attendance, DashboardStats, AttendanceSummary } from "@/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001",
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Employee API ───────────────────────────────────────────

export const getEmployees = async (): Promise<Employee[]> => {
  const { data } = await api.get("/api/employees");
  return data;
};

export const createEmployee = async (
  employee: Omit<Employee, "_id" | "createdAt" | "updatedAt">
): Promise<Employee> => {
  const { data } = await api.post("/api/employees", employee);
  return data;
};

export const deleteEmployee = async (employeeId: string): Promise<void> => {
  await api.delete(`/api/employees/${employeeId}`);
};

// ─── Attendance API ─────────────────────────────────────────

export const markAttendance = async (
  attendance: Omit<Attendance, "_id" | "createdAt" | "updatedAt">
): Promise<Attendance> => {
  const { data } = await api.post("/api/attendance", attendance);
  return data;
};

export const getAttendance = async (
  employeeId: string
): Promise<Attendance[]> => {
  const { data } = await api.get(`/api/attendance/${employeeId}`);
  return data;
};

// ─── Dashboard API ───────────────────────────────────────────

export const getDashboardStats = async (filters: {
  employeeId?: string;
  startDate?: string;
  endDate?: string;
} = {}): Promise<any> => {
  const { data } = await api.get("/api/dashboard/stats", { params: filters });
  return data;
};

// ─── Reports API ─────────────────────────────────────────────

export const getAttendanceSummary = async (date?: string): Promise<AttendanceSummary[]> => {
  const { data } = await api.get("/api/attendance/summary", { params: { date } });
  return data;
};

export default api;
