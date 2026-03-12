"use client";

import { useState, useEffect, useCallback } from "react";
import { Employee } from "@/types";
import { getEmployees, createEmployee, deleteEmployee } from "@/services/api";
import { getErrorMessage } from "@/utils/errorHandler";

/**
 * Custom hook to manage employee data.
 * Encapsulates fetching, creating, and deleting employees.
 */
export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to fetch employees."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const addEmployee = async (data: Omit<Employee, "_id" | "createdAt" | "updatedAt">) => {
    const employee = await createEmployee(data);
    await fetchEmployees(); // refresh list
    return employee;
  };

  const removeEmployee = async (employeeId: string) => {
    await deleteEmployee(employeeId);
    await fetchEmployees(); // refresh list
  };

  return {
    employees,
    loading,
    error,
    fetchEmployees,
    addEmployee,
    removeEmployee,
  };
}
