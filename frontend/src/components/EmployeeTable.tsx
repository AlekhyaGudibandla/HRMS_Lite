"use client";

import { useState, useMemo } from "react";
import { Employee } from "@/types";
import { Card, Badge, cn } from "@/components/ui";
import { Search, Trash2, Mail, Briefcase, Hash, CalendarCheck } from "lucide-react";

interface EmployeeTableProps {
  employees: Employee[];
  loading: boolean;
  onDelete: (employeeId: string) => Promise<void>;
}

export default function EmployeeTable({
  employees,
  loading,
  onDelete,
}: EmployeeTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredEmployees = useMemo(() => {
    if (!searchTerm) return employees;
    const lower = searchTerm.toLowerCase();
    return employees.filter(
      (emp) =>
        emp.fullName.toLowerCase().includes(lower) ||
        emp.employeeId.toLowerCase().includes(lower) ||
        emp.department.toLowerCase().includes(lower) ||
        emp.email.toLowerCase().includes(lower)
    );
  }, [employees, searchTerm]);

  const handleDelete = async (employeeId: string) => {
    if (!confirm(`Are you sure you want to delete employee "${employeeId}"?`)) {
      return;
    }

    setDeletingId(employeeId);
    try {
      await onDelete(employeeId);
    } catch (error) {
      console.error("Failed to delete employee:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 text-sm py-3 pl-11 pr-4"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <div className="min-w-[800px] w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface-lighter/30">
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted"><Hash className="w-3 h-3 inline mr-1" /> ID</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted">Staff Member</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted"><Briefcase className="w-3 h-3 inline mr-1" /> Department</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted"><CalendarCheck className="w-3 h-3 inline mr-1" /> Presence</th>
                  <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-widest text-text-muted">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-xs text-text-muted italic uppercase font-black tracking-widest opacity-40">
                      No matching colleagues found
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp) => (
                    <tr key={emp.employeeId} className="hover:bg-surface-lighter/40 transition-all duration-200 group translate-y-0 hover:-translate-y-0.5">
                      <td className="px-6 py-5">
                        <span className="text-[10px] font-black font-mono text-text-muted bg-surface-lighter px-2 py-1 rounded-md">{emp.employeeId}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center text-xs font-black transition-transform group-hover:scale-110">
                            {emp.fullName.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-black text-text-primary tracking-tight truncate">{emp.fullName}</p>
                            <div className="flex items-center gap-1.5 text-[10px] text-text-muted font-bold uppercase tracking-wider mt-0.5">
                              <Mail className="w-2.5 h-2.5" /> {emp.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <Badge variant="default" className="text-[9px] font-black uppercase">{emp.department}</Badge>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2.5">
                          <div className="px-2.5 py-1 rounded-lg bg-success/5 border border-success/10">
                            <span className="text-sm font-black text-success">{emp.totalPresentDays ?? 0}</span>
                          </div>
                          <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Days Logged</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => handleDelete(emp.employeeId)}
                          disabled={deletingId === emp.employeeId}
                          className="p-2.5 text-text-muted hover:text-danger hover:bg-danger/10 rounded-xl transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                          title="Delete employee"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
}
