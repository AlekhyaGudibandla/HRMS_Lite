"use client";
import { useAttendanceSummary } from "@/hooks/useAttendanceSummary";
import { cn } from "@/components/ui";

interface AttendanceSummaryTableProps {
  summary?: any[];
  loading?: boolean;
  error?: string;
}

export default function AttendanceSummaryTable({ 
  summary: externalSummary, 
  loading: externalLoading, 
  error: externalError 
}: AttendanceSummaryTableProps) {
  const internalHook = useAttendanceSummary();
  
  const summary = externalSummary !== undefined ? externalSummary : internalHook.summary;
  const loading = externalLoading !== undefined ? externalLoading : internalHook.loading;
  const error = externalError !== undefined ? externalError : internalHook.error;

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
      <div className="overflow-x-auto rounded-xl border border-border bg-white shadow-sm custom-scrollbar">
        <div className="min-w-[600px] w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-lighter/30">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted">Staff Information</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted">Total Presence</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted">Monthly Engagement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {summary.map((row) => {
                const percentage = row.monthlyAttendanceRate || 0;
                const presentDays = row.totalPresentDays || 0;
                
                const barColor = percentage > 80 ? "bg-black" : percentage > 50 ? "bg-neutral-600" : "bg-neutral-300";

                return (
                  <tr key={row.employeeId} className="hover:bg-surface-lighter/40 transition-all duration-200 group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center text-[10px] font-black transition-transform group-hover:scale-105">
                          {row.fullName?.substring(0, 2).toUpperCase() || "??"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-text-primary tracking-tight truncate">{row.fullName || "Unknown"}</p>
                          <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-0.5">{row.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2.5">
                         <div className="px-2.5 py-1 rounded-lg bg-surface-lighter border border-border/50">
                           <span className="text-sm font-black text-text-primary">{presentDays}</span>
                         </div>
                         <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Logs</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 min-w-[200px]">
                      <div className="max-w-[180px] space-y-2.5">
                         <div className="flex items-center justify-between">
                           <span className={cn("text-xs font-black tracking-tighter", 
                             percentage > 80 ? "text-success" : percentage > 50 ? "text-warning" : "text-danger"
                           )}>{percentage}%</span>
                           <span className="text-[9px] text-text-muted uppercase font-black tracking-tighter">Current Period</span>
                         </div>
                         <div className="h-1.5 w-full bg-surface-lighter rounded-full overflow-hidden p-[1px] border border-border/10">
                           <div 
                             className={cn("h-full rounded-full transition-all duration-1000 ease-out", barColor)} 
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
    </div>
  );
}
