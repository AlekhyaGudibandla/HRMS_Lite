"use client";

import { useState, useEffect, useCallback } from "react";
import { Attendance } from "@/types";
import { getAttendance, markAttendance } from "@/services/api";
import { getErrorMessage } from "@/utils/errorHandler";

/**
 * Custom hook to manage attendance data for a selected employee.
 * Encapsulates marking attendance and fetching history.
 */
export function useAttendance(selectedEmployeeId: string) {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRecords = useCallback(async () => {
    if (!selectedEmployeeId) {
      setRecords([]);
      return;
    }
    try {
      setLoading(true);
      setError("");
      const data = await getAttendance(selectedEmployeeId);
      setRecords(data);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to fetch attendance."));
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [selectedEmployeeId]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const mark = async (data: { employeeId: string; date: string; status: "Present" | "Absent" }) => {
    const result = await markAttendance(data);
    await fetchRecords(); // refresh list
    return result;
  };

  return {
    records,
    loading,
    error,
    fetchRecords,
    mark,
  };
}
