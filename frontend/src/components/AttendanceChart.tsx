"use client";

import React, { useMemo } from "react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from "recharts";
import { Users, Calendar, Filter } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui";

interface AttendanceChartProps {
  chart: {
    present: number;
    absent: number;
  };
  loading: boolean;
  employees: any[];
  selectedEmployee: string;
  filterDate: string;
  onEmployeeChange: (id: string) => void;
  onDateChange: (date: string) => void;
  onChartClick: (data: any) => void;
}

export default function AttendanceChart({
  chart,
  loading,
  employees,
  selectedEmployee,
  filterDate,
  onEmployeeChange,
  onDateChange,
  onChartClick
}: AttendanceChartProps) {
  const chartData = useMemo(() => {
    if (!chart) return [];
    return [
      { name: "Present", value: chart.present, color: "#10b981" },
      { name: "Absent", value: chart.absent, color: "#ef4444" },
    ];
  }, [chart]);

  return (
    <Card className="h-full">
      <CardHeader 
        title="Attendance Overview" 
        subtitle="Daily presence breakdown and detailed insights"
      />
      <CardContent>
        {/* Chart Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-8">
          <div className="relative w-full sm:w-auto">
            <select 
              value={selectedEmployee}
              onChange={(e) => onEmployeeChange(e.target.value)}
              className="select-field pl-9 appearance-none w-full"
            >
              <option value="all">All Employees</option>
              {employees?.map(emp => (
                <option key={emp.employeeId} value={emp.employeeId}>{emp.fullName}</option>
              ))}
            </select>
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          </div>
          <div className="relative w-full sm:w-auto">
            <input 
              type="date"
              value={filterDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="input-field pl-9 pr-3 w-full"
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
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                  onClick={onChartClick}
                  className="cursor-pointer focus:outline-none"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      className="hover:opacity-80 transition-opacity duration-300"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    padding: '12px 16px'
                  }}
                  itemStyle={{ fontSize: '13px', fontWeight: '700' }}
                  cursor={{ fill: 'transparent' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: '600' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-text-muted text-sm space-y-3 opacity-60">
              <div className="w-16 h-16 rounded-full bg-surface-lighter flex items-center justify-center">
                <Filter className="w-8 h-8 opacity-20" />
              </div>
              <p className="font-bold tracking-tight">No records found for this selection</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
