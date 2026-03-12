"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardStats } from "@/types";
import { getDashboardStats } from "@/services/api";
import { getErrorMessage } from "@/utils/errorHandler";

/**
 * Custom hook to fetch dashboard statistics.
 */
export function useDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async (filters: {
    employeeId?: string;
    startDate?: string;
    endDate?: string;
  } = {}) => {
    try {
      setLoading(true);
      setError("");
      const result = await getDashboardStats(filters);
      setData(result);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to fetch dashboard stats."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    summary: data?.summary || { totalEmployees: 0, presentToday: 0, absentToday: 0 },
    chart: data?.chart || { present: 0, absent: 0 },
    activities: data?.activities || [],
    loading,
    error,
    refresh: fetchStats,
  };
}
