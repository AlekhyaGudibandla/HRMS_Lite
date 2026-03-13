"use client";

import React from "react";
import { Users, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui";

interface DashboardStatsProps {
  summary: {
    totalEmployees: number;
    presentToday: number;
    absentToday: number;
  };
  loading: boolean;
}

export default function DashboardStats({ summary, loading }: DashboardStatsProps) {
  const cards = [
    {
      title: "Total Employees",
      value: summary?.totalEmployees ?? 0,
      icon: <Users className="w-5 h-5 text-black" />,
      footer: "Direct staff members",
      color: "text-text-primary"
    },
    {
      title: "Present Today",
      value: summary?.presentToday ?? 0,
      icon: <CheckCircle2 className="w-5 h-5 text-black" />,
      footer: "On duty now",
      color: "text-text-primary"
    },
    {
      title: "Absent Today",
      value: summary?.absentToday ?? 0,
      icon: <XCircle className="w-5 h-5 text-neutral-400" />,
      footer: "Not present",
      color: "text-text-muted"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, i) => (
        <Card key={i} className="hover:border-primary/20 transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{card.title}</span>
              <div className="w-10 h-10 rounded-xl bg-surface-lighter flex items-center justify-center">
                {card.icon}
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-text-primary tracking-tight">
                {loading ? (
                  <div className="h-8 w-12 bg-surface-lighter animate-pulse rounded" />
                ) : (
                  card.value
                )}
              </h3>
            </div>
            <div className="text-[10px] text-text-muted mt-4 flex items-center gap-1.5 font-medium uppercase tracking-wider">
              <Clock className="w-3 h-3" /> {card.footer}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
