"use client";

import { useEmployees } from "@/hooks";
import EmployeeForm from "@/components/EmployeeForm";
import EmployeeTable from "@/components/EmployeeTable";

export default function EmployeesPage() {
  const { employees, loading, addEmployee, removeEmployee } = useEmployees();

  return (
    <div className="max-w-7xl mx-auto pt-12 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">Employees</h1>
        <p className="text-text-secondary mt-2">
          Manage your workforce and view employee details.
        </p>
        <div className="h-1 w-20 bg-primary mt-4 rounded-full" />
      </div>

      {/* Form */}
      <div className="mb-8">
        <EmployeeForm onSubmit={addEmployee} />
      </div>

      {/* Table */}
      <EmployeeTable
        employees={employees}
        loading={loading}
        onDelete={removeEmployee}
      />
    </div>
  );
}
