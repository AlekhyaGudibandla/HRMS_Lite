"use client";

import { useState, useEffect } from "react";
import { getAttendanceSummary } from "@/services/api";

export function useAttendanceSummary() {
  const [summary, setSummary] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSummary = async (date?: string) => {
    try {
      setLoading(true);
      const data = await getAttendanceSummary(date);
      setSummary(data);
    } catch (err) {
      setError("Failed to fetch summary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return { summary, loading, error, refresh: fetchSummary };
}
