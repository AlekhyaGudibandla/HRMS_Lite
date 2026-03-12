/** Application-wide constants */

export const APP_NAME = "HRMS Lite";
export const APP_DESCRIPTION = "HR Management";

/** Navigation items for the sidebar */
export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "Employees", href: "/employees", icon: "employees" },
  { label: "Attendance", href: "/attendance", icon: "attendance" },
] as const;

/** Attendance status options */
export const ATTENDANCE_STATUS = {
  PRESENT: "Present" as const,
  ABSENT: "Absent" as const,
};

export const STATUS_OPTIONS = [
  { value: ATTENDANCE_STATUS.PRESENT, label: "✅ Present" },
  { value: ATTENDANCE_STATUS.ABSENT, label: "❌ Absent" },
];

/** Department suggestions (can be extended later) */
export const DEPARTMENTS = [
  "Engineering",
  "Design",
  "Marketing",
  "Product",
  "Sales",
  "Human Resources",
  "Finance",
  "Operations",
];
