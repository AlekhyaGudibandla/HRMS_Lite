export interface EmployeeRow {
  id: number;
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
  created_at: string;
  updated_at: string;
}

export interface AttendanceRow {
  id: number;
  employee_id: string;
  date: string;
  status: "Present" | "Absent";
  created_at: string;
  updated_at: string;
}

export interface EmployeeResponse {
  employeeId: string;
  fullName: string;
  email: string;
  department: string;
  createdAt: string;
  totalPresentDays?: number;
}

export interface AttendanceResponse {
  _id: number;
  employeeId: string;
  date: string;
  status: "Present" | "Absent";
  createdAt: string;
}

export interface ActivityResponse {
  id: number;
  type: string;
  description: string;
  timestamp: string;
}
