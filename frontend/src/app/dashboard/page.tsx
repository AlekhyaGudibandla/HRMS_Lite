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
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  UserPlus, 
  UserMinus, 
  Calendar,
  Filter,
  ChevronRight
} from "lucide-react";
import { useDashboard, useEmployees } from "@/hooks";
import { Card, CardHeader, CardContent, Badge, cn } from "@/components/ui";

export default function DashboardPage() {
  const router = useRouter();
  const { summary, chart, activities, loading, error, refresh } = useDashboard();
  const { employees } = useEmployees();
  
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split("T")[0]);

  const chartData = useMemo(() => {
    if (!chart) return [];
    return [
      { name: "Present", value: chart.present, color: "#10b981" },
      { name: "Absent", value: chart.absent, color: "#ef4444" },
    ];
  }, [chart]);

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

  const dashboardCards = [
    {
      title: "Total Employees",
      value: summary?.totalEmployees ?? 0,
      icon: <Users className="w-5 h-5" />,
      footer: "Direct staff members"
    },
    {
      title: "Present Today",
      value: summary?.presentToday ?? 0,
      icon: <CheckCircle2 className="w-5 h-5 text-success" />,
      footer: "On duty now"
    },
    {
      title: "Absent Today",
      value: summary?.absentToday ?? 0,
      icon: <XCircle className="w-5 h-5 text-danger" />,
      footer: "Not present"
    },
  ];

  const handleChartClick = (data: any) => {
    if (data && data.name) {
      router.push(`/attendance?status=${data.name}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pt-12 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Dashboard</h1>
          <p className="text-sm text-text-muted">Welcome back. Here is your workforce overview.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" className="animate-pulse">Live Updates</Badge>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-danger/5 border border-danger/10 text-danger text-sm rounded-xl">
          {error}
        </div>
      )}

      {/* Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dashboardCards.map((card, i) => (
          <Card key={i} className="hover:border-primary/20 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">{card.title}</span>
                <div className="w-8 h-8 rounded-lg bg-surface-lighter flex items-center justify-center">
                  {card.icon}
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold text-text-primary tracking-tight">
                  {loading ? "..." : card.value}
                </h3>
              </div>
              <p className="text-[10px] text-text-muted mt-2 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {card.footer}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Column */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader 
              title="Attendance Overview" 
              subtitle="Daily presence breakdown and detailed insights"
            />
            <CardContent>
              {/* Chart Filters */}
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <div className="relative">
                  <select 
                    value={selectedEmployee}
                    onChange={(e) => handleEmployeeChange(e.target.value)}
                    className="select-field pl-9 appearance-none"
                  >
                    <option value="all">All Employees</option>
                    {employees?.map(emp => (
                      <option key={emp.employeeId} value={emp.employeeId}>{emp.fullName}</option>
                    ))}
                  </select>
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                </div>
                <div className="relative">
                  <input 
                    type="date"
                    value={filterDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="input-field pl-9 pr-3 min-w-[160px]"
                  />
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                </div>
              </div>

              {/* Donut Chart */}
              <div className="h-[300px] w-full relative">
                {loading ? (
                   <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                     <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
                   </div>
                ) : chartData.length > 0 && (chartData[0].value > 0 || chartData[1].value > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={100}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                        onClick={handleChartClick}
                        className="cursor-pointer"
                        animationBegin={0}
                        animationDuration={800}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                        itemStyle={{ fontSize: '12px', fontWeight: '600' }}
                      />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-text-muted text-sm space-y-2">
                    <Filter className="w-10 h-10 opacity-20" />
                    <p>No records found for this selection</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column: Recent Activity */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader title="Recent Activity" subtitle="Real-time events from your system" />
            <CardContent className="px-2">
              <div className="space-y-1">
                {activities?.length > 0 ? activities.map((activity: any) => (
                  <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl hover:bg-surface-light transition-colors group">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                      activity.type.includes("ADDED") ? "bg-black text-white" :
                      activity.type.includes("DELETED") ? "bg-danger/10 text-danger" :
                      "bg-surface-lighter text-text-muted"
                    )}>
                      {activity.type.includes("ADDED") ? <UserPlus className="w-4 h-4" /> :
                       activity.type.includes("DELETED") ? <UserMinus className="w-4 h-4" /> :
                       <Clock className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary leading-snug">{activity.description}</p>
                      <p className="text-[10px] text-text-muted mt-1 uppercase tracking-wider font-bold">
                        {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                )) : (
                  <div className="p-8 text-center text-text-muted text-sm italic">
                    No recent activity to show
                  </div>
                )}
              </div>
              <button 
                onClick={() => router.push('/employees')}
                className="w-full mt-4 flex items-center justify-between p-3 rounded-lg border border-dashed border-border hover:border-black/20 hover:bg-surface-lighter transition-all group text-sm font-medium text-text-muted hover:text-text-primary"
              >
                <span>View all reports</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
