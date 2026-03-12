import cron from "node-cron";
import { getSummary } from "./attendanceService";
import { sendAttendanceEmail, verifyEmailConnection } from "./emailService";

/**
 * Send attendance emails to all employees (used by both scheduler and manual trigger).
 */
export const sendDailyReports = async () => {
  console.log("📧 Sending attendance reports to all employees...");
  const summary = await getSummary();
  const results: { employee: string; email: string; status: string }[] = [];

  for (const emp of summary) {
    if (emp.email) {
      const result = await sendAttendanceEmail(
        emp.email,
        emp.fullName,
        emp.monthlyAttendanceRate,
        emp.totalPresentDays
      );
      results.push({
        employee: emp.fullName,
        email: emp.email,
        status: result.success ? `✅ Sent (${result.messageId})` : `❌ Failed: ${result.reason}`,
      });
    } else {
      results.push({
        employee: emp.fullName,
        email: "N/A",
        status: "⚠️ No email address",
      });
    }
  }

  console.log("📧 Email report complete:", results);
  return results;
};

/**
 * Schedule automatic daily emails at 6:00 PM.
 */
export const initAttendanceScheduler = async () => {
  // Verify SMTP connection on startup
  const connected = await verifyEmailConnection();
  if (!connected) {
    console.warn("⚠️ Scheduler is active but emails won't send until SMTP is configured.");
  }

  // Run every day at 6 PM server time
  cron.schedule("0 18 * * *", async () => {
    console.log("🕒 [CRON] Running daily attendance email job...");
    try {
      await sendDailyReports();
    } catch (error) {
      console.error("❌ [CRON] Scheduler failed:", error);
    }
  });

  console.log("🚀 Attendance Scheduler initialized (Daily at 6:00 PM server time)");
};
