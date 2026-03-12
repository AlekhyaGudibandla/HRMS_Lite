import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for merging tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Card Component
 */
export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("bg-white border border-border rounded-xl shadow-sm overflow-hidden", className)}>
    {children}
  </div>
);

export const CardHeader = ({ title, subtitle, className }: { title: string; subtitle?: string; className?: string }) => (
  <div className={cn("p-6 pb-2", className)}>
    <h3 className="text-lg font-bold text-text-primary tracking-tight">{title}</h3>
    {subtitle && <p className="text-sm text-text-muted mt-0.5">{subtitle}</p>}
  </div>
);

export const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("p-6", className)}>{children}</div>
);

/**
 * Badge Component
 */
export const Badge = ({ children, variant = "default", className }: { children: React.ReactNode; variant?: "default" | "success" | "danger" | "warning"; className?: string }) => {
  const variants = {
    default: "bg-surface-lighter text-text-primary",
    success: "bg-success/10 text-success border border-success/20",
    danger: "bg-danger/10 text-danger border border-danger/20",
    warning: "bg-warning/10 text-warning border border-warning/20",
  };
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider", variants[variant], className)}>
      {children}
    </span>
  );
};
