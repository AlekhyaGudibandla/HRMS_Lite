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

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-lighter/30">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted"><Hash className="w-3 h-3 inline mr-1" /> ID</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Employee</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted"><Briefcase className="w-3 h-3 inline mr-1" /> Dept</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted"><CalendarCheck className="w-3 h-3 inline mr-1" /> Present Days</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-text-muted italic">
                    No matching colleagues found
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.employeeId} className="hover:bg-surface-lighter/30 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono font-bold text-text-muted">{emp.employeeId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center text-[10px] font-bold">
                          {emp.fullName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-text-primary">{emp.fullName}</p>
                          <div className="flex items-center gap-1 text-[10px] text-text-muted font-medium">
                            <Mail className="w-2.5 h-2.5" /> {emp.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="default" className="text-[9px]">{emp.department}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-text-primary">{emp.totalPresentDays ?? 0}</span>
                        <span className="text-[10px] text-text-muted font-medium uppercase tracking-tighter">Recorded days</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(emp.employeeId)}
                        disabled={deletingId === emp.employeeId}
                        className="p-2 text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
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
      </Card>
    </div>
  );
}
