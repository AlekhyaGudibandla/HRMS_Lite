"use client";

import { useEffect, useState } from "react";
import { getEmployees } from "@/services/api";
import { Employee } from "@/types";
import { useAttendance } from "@/hooks";
import AttendanceForm from "@/components/AttendanceForm";
import AttendanceSummaryTable from "@/components/AttendanceSummaryTable";
import { Card, CardHeader, CardContent, Badge } from "@/components/ui";
import { Calendar, History, Search, UserCheck } from "lucide-react";

export default function AttendancePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const { records, loading, mark } = useAttendance(selectedEmployee);

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
    <div className="max-w-7xl mx-auto pt-12 space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Attendance Management</h1>
        <p className="text-sm text-text-muted">Record presence and analyze workforce consistency.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form and Summary */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader title="Mark Attendance" subtitle="Select an employee and status for a specific date" />
            <CardContent>
              <AttendanceForm onSubmit={mark} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Attendance Summary" subtitle="Calculated based on total records" />
            <CardContent className="px-0">
              <AttendanceSummaryTable />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: History */}
        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col">
            <CardHeader title="History Lookup" subtitle="" />
            <CardContent className="space-y-6 flex-1">
              <div className="space-y-4">
                <div className="relative">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5 block">Select Employee</label>
                  <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="select-field w-full appearance-none pl-9"
                  >
                    <option value="">Choose an employee...</option>
                    {employees.map((emp) => (
                      <option key={emp.employeeId} value={emp.employeeId}>
                        {emp.fullName}
                      </option>
                    ))}
                  </select>
                  <History className="absolute left-3 bottom-3 w-4 h-4 text-text-muted" />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {!selectedEmployee ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 opacity-50">
                    <Search className="w-12 h-12 text-text-muted" />
                    <p className="text-xs text-text-muted">Select an employee to view their recent activity log.</p>
                  </div>
                ) : loading ? (
                  <div className="flex items-center justify-center p-12">
                     <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : records.length === 0 ? (
                  <div className="p-8 text-center text-xs text-text-muted italic">
                    No results found for this search.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {records.map((r) => (
                      <div key={r._id} className="flex items-center justify-between p-3 rounded-lg bg-surface-lighter/50 border border-transparent hover:border-border transition-all">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-text-primary">{r.date}</p>
                        </div>
                        <Badge variant={r.status === "Present" ? "success" : "danger"}>
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
