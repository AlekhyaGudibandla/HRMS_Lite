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

      <div className="flex flex-col sm:flex-row items-end gap-3">
        <div className="w-full sm:max-w-[280px] space-y-2">
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">Status</label>
          <div className="flex gap-1.5 p-1 bg-surface-lighter rounded-xl border border-border/40 h-[44px]">
            <button
              type="button"
              onClick={() => setStatus("Present")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 rounded-lg text-xs font-semibold transition-all",
                status === "Present" 
                  ? "bg-white text-black shadow-sm border border-border" 
                  : "bg-transparent text-text-muted/90 hover:text-text-primary hover:bg-white/50"
              )}
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Present
            </button>
            <button
              type="button"
              onClick={() => setStatus("Absent")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 rounded-lg text-xs font-semibold transition-all",
                status === "Absent" 
                  ? "bg-white text-black shadow-sm border border-border" 
                  : "bg-transparent text-text-muted/90 hover:text-text-primary hover:bg-white/50"
              )}
            >
              <AlertCircle className="w-3.5 h-3.5" /> Absent
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto min-w-[200px] h-[44px] bg-neutral-900 text-white rounded-xl text-sm font-semibold hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98] border border-black/5 shadow-sm"
        >
          {submitting ? "..." : "Mark Attendance"}
        </button>
      </div>

      {msg && (
        <div className={cn(
          "p-2 text-xs font-semibold animate-in fade-in slide-in-from-top-1 duration-500 flex items-center justify-center gap-2",
          msg.type === "success" 
            ? "text-black" 
            : "text-danger"
        )}>
          {msg.type === "success" ? <CheckCircle2 className="w-3.5 h-3.5 opacity-50" /> : <AlertCircle className="w-3.5 h-3.5 opacity-50" />}
          {msg.text}
        </div>
      )}
    </form>
  );
}
