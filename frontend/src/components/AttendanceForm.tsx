"use client";

import { useState } from "react";
import { useEmployees } from "@/hooks";
import { User, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/components/ui";

interface AttendanceFormProps {
  onSubmit: (data: { employeeId: string; date: string; status: "Present" | "Absent" }) => Promise<any>;
}

export default function AttendanceForm({ onSubmit }: AttendanceFormProps) {
  const { employees, loading: employeesLoading } = useEmployees();
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState<"Present" | "Absent">("Present");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId) return;

    setSubmitting(true);
    setMsg(null);
    try {
      await onSubmit({ employeeId, date, status });
      setMsg({ type: "success", text: "Attendance marked successfully!" });
      setEmployeeId("");
    } catch (error) {
      setMsg({ type: "error", text: "Failed to mark attendance." });
    } finally {
      setSubmitting(false);
      setTimeout(() => setMsg(null), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">Employee</label>
          <div className="relative">
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="select-field w-full pl-9 appearance-none"
              required
              disabled={employeesLoading}
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.employeeId} value={emp.employeeId}>
                  {emp.fullName}
                </option>
              ))}
            </select>
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">Date</label>
          <div className="relative">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-field w-full pl-9"
              required
            />
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">Status</label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setStatus("Present")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-bold transition-all border",
              status === "Present" 
                ? "bg-black text-white border-black" 
                : "bg-white text-text-secondary border-border hover:border-text-muted"
            )}
          >
            <CheckCircle2 className="w-4 h-4" /> Present
          </button>
          <button
            type="button"
            onClick={() => setStatus("Absent")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-bold transition-all border",
              status === "Absent" 
                ? "bg-black text-white border-black" 
                : "bg-white text-text-secondary border-border hover:border-text-muted"
            )}
          >
            <AlertCircle className="w-4 h-4" /> Absent
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 bg-black text-white rounded-xl text-sm font-bold hover:bg-neutral-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {submitting ? "Processing..." : "Mark Attendance"}
      </button>

      {msg && (
        <div className={cn(
          "p-3 rounded-lg text-xs font-medium animate-in slide-in-from-top-2 duration-300",
          msg.type === "success" ? "bg-success/10 text-success border border-success/20" : "bg-danger/10 text-danger border border-danger/20"
        )}>
          {msg.text}
        </div>
      )}
    </form>
  );
}
