"use client";

import React from "react";
import { UserPlus, UserMinus, Clock, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent, cn } from "@/components/ui";

interface RecentActivityProps {
  activities: any[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const router = useRouter();

  return (
    <Card className="h-full flex flex-col">
      <CardHeader title="Recent Activity" subtitle="Real-time events from your system" />
      <CardContent className="px-3 flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="flex-1 space-y-1 overflow-y-auto pr-1 custom-scrollbar">
            {activities?.length > 0 ? (
              activities.map((activity: any) => {
                const isAdded = activity.type.includes("ADDED");
                const isDeleted = activity.type.includes("DELETED");
                
                return (
                  <div 
                    key={activity.id} 
                    className="flex items-start gap-3.5 p-3.5 rounded-xl hover:bg-surface-lighter transition-all duration-300 group"
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-transform group-hover:scale-105",
                      isAdded ? "bg-black text-white" :
                      isDeleted ? "bg-danger/10 text-danger" :
                      "bg-surface-lighter text-text-muted"
                    )}>
                      {isAdded ? <UserPlus className="w-4 h-4" /> :
                       isDeleted ? <UserMinus className="w-4 h-4" /> :
                       <Clock className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-text-primary leading-snug break-words">
                        {activity.description}
                      </p>
                      <p className="text-[10px] text-text-muted mt-1.5 uppercase tracking-widest font-black">
                        {new Date(activity.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: true 
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center opacity-50">
                <Clock className="w-10 h-10 text-text-muted mb-3" />
                <p className="text-xs text-text-muted font-bold uppercase tracking-widest">No activity log</p>
              </div>
            )}
          </div>
          
          <div className="pt-6 pb-2">
            <button 
              onClick={() => router.push('/employees')}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-dashed border-border hover:border-black/30 hover:bg-surface-lighter transition-all group"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-text-muted group-hover:text-text-primary">View Full Reporting</span>
              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-primary group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
