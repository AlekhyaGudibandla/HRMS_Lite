"use client";

import { useEmployees } from "@/hooks";
import EmployeeForm from "@/components/EmployeeForm";
import EmployeeTable from "@/components/EmployeeTable";
import PageHeader from "@/components/PageHeader";

export default function EmployeesPage() {
  const { employees, loading, addEmployee, removeEmployee } = useEmployees();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <PageHeader 
        title="Employees" 
        subtitle="Manage your workforce and view employee details."
      />

      <div className="fade-in duration-500">
        <EmployeeForm onSubmit={addEmployee} />
      </div>

      <div className="slide-up duration-500">
        <EmployeeTable
          employees={employees}
          loading={loading}
          onDelete={removeEmployee}
        />
      </div>
    </div>
  );
}
