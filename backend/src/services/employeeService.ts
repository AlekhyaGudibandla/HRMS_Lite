import prisma from "../config/prisma";
import { EmployeeResponse } from "../types";

/**
 * Service layer for Employee business logic using Prisma.
 */

/** Check if an employee with the given ID already exists. */
export const findByEmployeeId = async (employeeId: string) => {
  return await prisma.employee.findUnique({
    where: { employeeId },
  });
};

/** Insert a new employee and return response. */
export const create = async (data: {
  employeeId: string;
  fullName: string;
  email: string;
  department: string;
}) => {
  const employee = await prisma.employee.create({
    data,
  });
  return employee;
};

/** Fetch all employees with their total present days count. */
export const findAll = async (): Promise<EmployeeResponse[]> => {
  const employees = await prisma.employee.findMany({
    include: {
      _count: {
        select: {
          attendance: {
            where: { status: "Present" },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return employees.map((emp) => ({
    employeeId: emp.employeeId,
    fullName: emp.fullName,
    email: emp.email,
    department: emp.department,
    createdAt: emp.createdAt?.toISOString() || "",
    totalPresentDays: emp._count.attendance,
  }));
};

/** Delete an employee by employeeId. */
export const remove = async (employeeId: string): Promise<boolean> => {
  try {
    await prisma.employee.delete({
      where: { employeeId },
    });
    return true;
  } catch (error) {
    return false;
  }
};
