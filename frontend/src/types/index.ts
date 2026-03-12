export interface Employee {
  _id?: string;
  employeeId: string;
  fullName: string;
  email: string;
  department: string;
  createdAt?: string;
  updatedAt?: string;
  totalPresentDays?: number;
}

export interface Attendance {
  _id?: string;
  employeeId: string;
  date: string;
  status: "Present" | "Absent";
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardStats {
  summary: {
    totalEmployees: number;
    presentToday: number;
    absentToday: number;
  };
  chart: {
    present: number;
    absent: number;
  };
  activities: any[];
}

export interface AttendanceSummary {
  employeeId: string;
  fullName: string;
  email?: string;
  monthlyAttendanceRate: number;
  totalPresentDays: number;
}
