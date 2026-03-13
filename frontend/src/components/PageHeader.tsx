"use client";

import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs sm:text-sm text-text-muted">{subtitle}</p>}
      </div>
      {action && (
        <div className="mt-4 sm:mt-0">
          {action}
        </div>
      )}
    </div>
  );
}
