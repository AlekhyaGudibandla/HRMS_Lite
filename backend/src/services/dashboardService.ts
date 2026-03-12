import prisma from "../config/prisma";

/**
 * Service for fetching dashboard statistics and activities using Prisma.
 */
export const getStats = async (filters: {
  employeeId?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const { employeeId, startDate, endDate } = filters;
  
  // Today's Date at 00:00:00 UTC
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  // Summary counts for today (always needed for top cards)
  const [totalEmployees, presentToday, absentToday] = await Promise.all([
    prisma.employee.count(),
    prisma.attendance.count({ 
      where: { 
        date: today,
        status: "Present" 
      } 
    }),
    prisma.attendance.count({ 
      where: { 
        date: today,
        status: "Absent" 
      } 
    }),
  ]);

  // Chart data filtering logic
  let dateFilter: any = {};
  if (startDate && endDate) {
    const s = new Date(startDate);
    const e = new Date(endDate);
    dateFilter = {
      date: {
        gte: new Date(Date.UTC(s.getUTCFullYear(), s.getUTCMonth(), s.getUTCDate())),
        lte: new Date(Date.UTC(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate())),
      },
    };
  } else if (startDate) {
    const s = new Date(startDate);
    dateFilter = { 
      date: new Date(Date.UTC(s.getUTCFullYear(), s.getUTCMonth(), s.getUTCDate()))
    };
  } else {
    dateFilter = { date: today };
  }

  let chartData: any = { present: 0, absent: 0 };
  if (employeeId) {
    const [present, absent] = await Promise.all([
      prisma.attendance.count({
        where: { employeeId, status: "Present" }
      }),
      prisma.attendance.count({
        where: { employeeId, status: "Absent" }
      }),
    ]);
    chartData = { present, absent };
  } else {
    const [present, absent] = await Promise.all([
      prisma.attendance.count({
        where: { ...dateFilter, status: "Present" }
      }),
      prisma.attendance.count({
        where: { ...dateFilter, status: "Absent" }
      }),
    ]);
    chartData = { present, absent };
  }

  // Recent Activities
  const recentActivities = await prisma.activity.findMany({
    orderBy: { timestamp: "desc" },
    take: 10,
  });

  return {
    summary: {
      totalEmployees,
      presentToday,
      absentToday,
    },
    chart: chartData,
    activities: recentActivities,
  };
};
