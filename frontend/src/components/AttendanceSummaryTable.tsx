"use client";
import { useAttendanceSummary } from "@/hooks/useAttendanceSummary";
import { cn } from "@/components/ui";

export default function AttendanceSummaryTable() {
  const { summary, loading, error } = useAttendanceSummary();

  if (loading && summary.length === 0) return (
    <div className="p-12 flex flex-col items-center justify-center space-y-4 text-text-muted">
       <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
       <p className="text-xs font-medium uppercase tracking-widest">Updating workforce statistics...</p>
    </div>
  );

  if (error) return (
    <div className="p-12 text-center text-danger">
      <p className="text-sm font-bold">{error}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-surface-lighter/30">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Employee</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Total Present</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Monthly Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {summary.map((row) => {
              const percentage = row.monthlyAttendanceRate || 0;
              const presentDays = row.totalPresentDays || 0;
              
              const barColor = percentage > 80 ? "bg-success" : percentage > 50 ? "bg-warning" : "bg-danger";

              return (
                <tr key={row.employeeId} className="hover:bg-surface-lighter/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center text-[10px] font-bold">
                        {row.fullName?.substring(0, 2).toUpperCase() || "??"}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text-primary">{row.fullName || "Unknown"}</p>
                        <p className="text-[10px] text-text-muted font-medium uppercase">{row.employeeId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <span className="text-sm font-bold text-text-primary">{presentDays}</span>
                       <span className="text-xs text-text-muted">days</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right md:text-left">
                    <div className="w-full max-w-[160px] space-y-2">
                       <div className="flex items-center justify-between">
                         <span className="text-xs font-bold text-text-primary">{percentage}%</span>
                         <span className="text-[9px] text-text-muted uppercase font-bold tracking-tighter">Current Month</span>
                       </div>
                       <div className="h-1 w-full bg-surface-lighter rounded-full overflow-hidden">
                         <div 
                           className={cn("h-full rounded-full transition-all duration-1000", barColor)} 
                           style={{ width: `${Math.min(percentage, 100)}%` }}
                         />
                       </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
