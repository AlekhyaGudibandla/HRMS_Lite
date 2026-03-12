import prisma from "../config/prisma";
import { AttendanceResponse } from "../types";

/**
 * Service layer for Attendance business logic using Prisma.
 */

/** Upsert attendance — inserts or updates if a record for the same date exists. */
export const upsert = async (data: {
  employeeId: string;
  date: string;
  status: "Present" | "Absent";
}) => {
  const d = new Date(data.date);
  const attendanceDate = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  
  return await prisma.attendance.upsert({
    where: {
      employeeId_date: {
        employeeId: data.employeeId,
        date: attendanceDate,
      },
    },
    update: {
      status: data.status,
      updatedAt: new Date(),
    },
    create: {
      employeeId: data.employeeId,
      date: attendanceDate,
      status: data.status,
    },
  });
};

/** Fetch all attendance records for a given employee. */
export const findByEmployeeId = async (employeeId: string): Promise<AttendanceResponse[]> => {
  const records = await prisma.attendance.findMany({
    where: { employeeId },
    orderBy: { date: "desc" },
  });

  return records.map(r => ({
    _id: r.id,
    employeeId: r.employeeId,
    date: r.date.toISOString().split("T")[0],
    status: r.status as "Present" | "Absent",
    createdAt: r.createdAt?.toISOString() || "",
  }));
};

/**
 * Utility to count working days (Mon-Fri) from 1st of the month to TODAY
 * to provide a "Current Month Progress" rate.
 */
function getWorkingDaysSoFar(year: number, month: number): number {
  const start = new Date(Date.UTC(year, month, 1));
  const today = new Date();
  const end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

  let count = 0;
  const cur = new Date(start);
  while (cur <= end) {
    const day = cur.getUTCDay();
    if (day !== 0 && day !== 6) count++; // 0=Sun, 6=Sat
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return count;
}

/** Fetch attendance summary for all employees. */
export const getSummary = async (date?: string) => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();

  const startOfMonth = new Date(Date.UTC(year, month, 1));
  const endOfMonth = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59));

  const employees = await prisma.employee.findMany({
    include: {
      attendance: {
        where: {
          date: {
            gte: startOfMonth,
            lte: endOfMonth,
          }
        },
      },
      _count: {
        select: {
          attendance: {
            where: { status: "Present" }
          }, // cumulative
        },
      },
    },
    orderBy: { fullName: "asc" },
  });

  const workingDays = getWorkingDaysSoFar(year, month);

  return employees.map((emp) => {
    // Current month stats
    const monthPresent = emp.attendance.filter(a => a.status === "Present").length;
    
    // Percentage based on Mon-Fri working days so far
    const monthlyRate = workingDays > 0 ? Math.round((monthPresent / workingDays) * 100) : 0;

    return {
      employeeId: emp.employeeId,
      fullName: emp.fullName,
      email: emp.email,
      monthlyAttendanceRate: monthlyRate,
      totalPresentDays: emp._count.attendance || 0,
    };
  });
};

/** Get attendance by date for all employees */
export const getAttendanceByDate = async (date: string) => {
  const attendanceDate = new Date(date);
  return await prisma.attendance.findMany({
    where: { date: attendanceDate },
    include: { employee: true }
  });
};
