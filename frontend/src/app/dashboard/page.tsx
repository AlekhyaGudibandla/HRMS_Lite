"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from "recharts";
import { 
  CheckCircle2
} from "lucide-react";
import { useDashboard, useEmployees } from "@/hooks";
import { Badge } from "@/components/ui";
import PageHeader from "@/components/PageHeader";
import DashboardStats from "@/components/DashboardStats";
import AttendanceChart from "@/components/AttendanceChart";
import RecentActivity from "@/components/RecentActivity";

export default function DashboardPage() {
  const router = useRouter();
  const { summary, chart, activities, loading, error, refresh } = useDashboard();
  const { employees } = useEmployees();
  
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split("T")[0]);

  const handleEmployeeChange = (empId: string) => {
    setSelectedEmployee(empId);
    refresh({ 
      employeeId: empId === "all" ? undefined : empId,
      startDate: filterDate || undefined,
    });
  };

  const handleDateChange = (date: string) => {
    setFilterDate(date);
    refresh({ 
      employeeId: selectedEmployee === "all" ? undefined : selectedEmployee,
      startDate: date || undefined,
    });
  };

  const handleChartClick = (data: any) => {
    if (data && data.name) {
      router.push(`/attendance?status=${data.name}`);
    }
  };

  const HeaderAction = (
    <div className="flex items-center gap-2">
      <Badge variant="success" className="animate-pulse flex items-center gap-1">
        <div className="w-1 h-1 rounded-full bg-white" />
        Live Updates
      </Badge>
    </div>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <PageHeader 
        title="Dashboard" 
        subtitle="Welcome back. Here is your workforce overview."
        action={HeaderAction}
      />

      {error && (
        <div className="p-4 bg-danger/5 border border-danger/10 text-danger text-xs font-bold rounded-xl animate-in fade-in slide-in-from-top-2">
          {error}
        </div>
      )}

      <DashboardStats 
        summary={summary} 
        loading={loading} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AttendanceChart 
            chart={chart}
            loading={loading}
            employees={employees}
            selectedEmployee={selectedEmployee}
            filterDate={filterDate}
            onEmployeeChange={handleEmployeeChange}
            onDateChange={handleDateChange}
            onChartClick={handleChartClick}
          />
        </div>
        <div className="lg:col-span-1">
          <RecentActivity activities={activities} />
        </div>
      </div>
    </div>
  );
}
