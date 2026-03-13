"use client";

import { useEffect, useState } from "react";
import { getEmployees } from "@/services/api";
import { Employee } from "@/types";
import { useAttendance, useAttendanceSummary } from "@/hooks";
import AttendanceForm from "@/components/AttendanceForm";
import AttendanceSummaryTable from "@/components/AttendanceSummaryTable";
import { Card, CardHeader, CardContent, Badge } from "@/components/ui";
import { History, Search } from "lucide-react";
import PageHeader from "@/components/PageHeader";

export default function AttendancePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const { records, loading: historyLoading, mark } = useAttendance(selectedEmployee);
  const { summary, loading: summaryLoading, error: summaryError, refresh: refreshSummary } = useAttendanceSummary();

  const handleMarkSuccess = async (data: { employeeId: string; date: string; status: "Present" | "Absent" }) => {
    const result = await mark(data);
    if (result) {
      await refreshSummary();
    }
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <PageHeader 
        title="Attendance Management" 
        subtitle="Record presence and analyze workforce consistency."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Form and Summary */}
        <div className="lg:col-span-2 space-y-8 w-full overflow-hidden">
          <Card className="fade-in duration-500">
            <CardHeader title="Mark Attendance" subtitle="Select an employee and status for a specific date" />
            <CardContent>
              <AttendanceForm onSubmit={handleMarkSuccess} />
            </CardContent>
          </Card>

          <Card className="slide-up duration-500 overflow-hidden">
            <CardHeader title="Attendance Summary" subtitle="Calculated based on total records" />
            <div className="overflow-x-auto custom-scrollbar">
              <CardContent className="px-0 min-w-[600px] sm:min-w-0">
                <AttendanceSummaryTable 
                   summary={summary} 
                   loading={summaryLoading} 
                   error={summaryError} 
                />
              </CardContent>
            </div>
          </Card>
        </div>

        {/* Right Column: History */}
        <div className="lg:col-span-1 h-full">
          <Card className="h-full flex flex-col fade-in lg:duration-700">
            <CardHeader title="History Lookup" subtitle="Quick activity retrieval" />
            <CardContent className="space-y-6 flex-1 flex flex-col overflow-hidden">
              <div className="space-y-4">
                <div className="relative">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1.5 block">Select Staff Member</label>
                  <div className="relative">
                    <select
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                      className="select-field w-full appearance-none pl-10"
                    >
                      <option value="">Choose an employee...</option>
                      {employees.map((emp) => (
                        <option key={emp.employeeId} value={emp.employeeId}>
                          {emp.fullName}
                        </option>
                      ))}
                    </select>
                    <History className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto min-h-[300px] sm:min-h-0 custom-scrollbar pr-1">
                {!selectedEmployee ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 opacity-50">
                    <div className="w-16 h-16 rounded-full bg-surface-lighter flex items-center justify-center">
                      <Search className="w-8 h-8 text-text-muted" />
                    </div>
                    <p className="text-xs text-text-muted font-bold uppercase tracking-widest">Select an employee to see activity log</p>
                  </div>
                ) : historyLoading ? (
                  <div className="flex items-center justify-center p-12">
                     <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : records.length === 0 ? (
                  <div className="p-8 text-center text-xs text-text-muted font-bold italic uppercase tracking-widest opacity-40">
                    No results found
                  </div>
                ) : (
                  <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {records.map((r) => (
                      <div key={r._id} className="flex items-center justify-between p-4 rounded-xl bg-surface-lighter/40 border border-transparent hover:border-border transition-all duration-300 group">
                        <div className="min-w-0">
                          <p className="text-xs font-black text-text-primary tracking-tight">{r.date}</p>
                          <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider mt-0.5">Log Record</p>
                        </div>
                        <Badge variant={r.status === "Present" ? "success" : "danger"} className="group-hover:scale-105 transition-transform">
                          {r.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
