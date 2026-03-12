"use client";

import { useState } from "react";
import { getErrorMessage } from "@/utils/errorHandler";
import { Employee } from "@/types";
import { UserPlus, User, Mail, Briefcase, Hash } from "lucide-react";
import { Card, CardContent } from "@/components/ui";

interface EmployeeFormProps {
  onSubmit: (data: Omit<Employee, "_id" | "createdAt" | "updatedAt">) => Promise<Employee>;
}

const INITIAL_FORM = {
  employeeId: "",
  fullName: "",
  email: "",
  department: "",
};

export default function EmployeeForm({ onSubmit }: EmployeeFormProps) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.employeeId || !form.fullName || !form.email || !form.department) {
      setError("Please complete all required fields.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(form);
      setSuccess(`Employee "${form.fullName}" added successfully!`);
      setForm(INITIAL_FORM);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to add employee."));
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(""), 4000);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
            <UserPlus className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-text-primary tracking-tight">Add New Employee</h2>
            <p className="text-[10px] text-text-muted uppercase tracking-wider font-medium">Onboard a team member</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5 font-bold uppercase tracking-widest text-[9px] text-text-muted">
              <label className="pl-1">Employee ID</label>
              <div className="relative">
                <input
                  type="text"
                  name="employeeId"
                  value={form.employeeId}
                  onChange={handleChange}
                  placeholder="EMP-001"
                  className="input-field pl-9"
                />
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-1.5 font-bold uppercase tracking-widest text-[9px] text-text-muted">
              <label className="pl-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="input-field pl-9"
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-1.5 font-bold uppercase tracking-widest text-[9px] text-text-muted">
              <label className="pl-1">Work Email</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@company.com"
                  className="input-field pl-9"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-1.5 font-bold uppercase tracking-widest text-[9px] text-text-muted">
              <label className="pl-1">Department</label>
              <div className="relative">
                <input
                  type="text"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="Engineering"
                  className="input-field pl-9"
                />
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-2">
            <div className="flex-1">
              {error && <p className="text-xs text-danger font-medium animate-in slide-in-from-left-2">{error}</p>}
              {success && <p className="text-xs text-success font-medium animate-in slide-in-from-left-2">{success}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white text-xs font-bold py-2.5 px-6 rounded-lg hover:bg-neutral-800 transition-all disabled:opacity-50"
            >
              {loading ? "Adding..." : "Confirm Onboarding"}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
