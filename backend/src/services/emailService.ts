import nodemailer from "nodemailer";

/**
 * Gmail SMTP Transporter.
 * 
 * Requirements:
 * 1. A Gmail account with 2-Step Verification enabled.
 * 2. A Gmail App Password (not your regular password).
 * 
 * Set these in your .env file:
 *   SMTP_USER=your_gmail@gmail.com
 *   SMTP_PASS=your_16_char_app_password
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/** Verify connection on startup */
export const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log("✅ Gmail SMTP connection verified successfully.");
    return true;
  } catch (error: any) {
    console.error("❌ Gmail SMTP connection failed:", error.message);
    console.warn("   → Make sure SMTP_USER and SMTP_PASS are set in .env");
    console.warn("   → SMTP_PASS must be a Gmail App Password (not your regular password)");
    return false;
  }
};

/** Send attendance rate email to a single employee */
export const sendAttendanceEmail = async (
  email: string,
  name: string,
  rate: number,
  presentDays: number
) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("⚠️ SMTP credentials not configured. Skipping email for:", email);
    return { success: false, reason: "SMTP not configured" };
  }

  const monthName = new Date().toLocaleString("default", { month: "long", year: "numeric" });
  const rateColor = rate > 80 ? "#10b981" : rate > 50 ? "#f59e0b" : "#ef4444";

  const mailOptions = {
    from: `"HRMS Lite" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `📊 Your Attendance Report — ${monthName}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #111; max-width: 520px; margin: auto; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
        <!-- Header -->
        <div style="background: #111; color: #fff; padding: 28px 32px;">
          <h1 style="margin: 0; font-size: 18px; font-weight: 800; letter-spacing: -0.025em;">HRMS Lite</h1>
          <p style="margin: 6px 0 0; font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 0.1em;">Monthly Attendance Report</p>
        </div>
        
        <!-- Body -->
        <div style="padding: 32px;">
          <p style="font-size: 15px; margin: 0 0 20px;">Hi <strong>${name}</strong>,</p>
          <p style="font-size: 14px; color: #555; margin: 0 0 24px; line-height: 1.6;">
            Here's your attendance summary for <strong>${monthName}</strong>:
          </p>

          <!-- Rate Card -->
          <div style="background: #fafafa; border: 1px solid #f0f0f0; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <p style="margin: 0 0 8px; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 700;">Current Monthly Rate</p>
            <h2 style="margin: 0; font-size: 52px; font-weight: 900; color: ${rateColor};">${rate}%</h2>
            <p style="margin: 12px 0 0; font-size: 13px; color: #666;">
              <strong>${presentDays}</strong> days present this month
            </p>
          </div>

          <p style="font-size: 12px; color: #999; line-height: 1.5;">
            This rate is calculated based on Monday–Friday working days from the 1st of the month to today.
          </p>
        </div>

        <!-- Footer -->
        <div style="background: #fafafa; border-top: 1px solid #f0f0f0; padding: 16px 32px;">
          <p style="margin: 0; font-size: 11px; color: #bbb; text-align: center;">
            HRMS Lite — Human Resource Management System
          </p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${email} (messageId: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error(`❌ Failed to send email to ${email}:`, error.message);
    return { success: false, reason: error.message };
  }
};
