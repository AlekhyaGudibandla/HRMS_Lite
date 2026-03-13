import nodemailer from "nodemailer";
import { CONFIG } from "../config";

/**
 * Gmail SMTP Transporter with hardened production settings.
 * Using Port 587 (STARTTLS) which is more reliable in cloud environments than Port 465.
 */
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use STARTTLS
  auth: {
    user: CONFIG.SMTP_USER,
    pass: CONFIG.SMTP_PASS,
  },
  // Increase timeout for slow cloud network environments
  connectionTimeout: 10000, 
  greetingTimeout: 10000,
  // Force IPv4 at the connection level as well
  // @ts-ignore - 'family' is a valid property but sometimes missing in older @types/nodemailer
  family: 4,
} as nodemailer.TransportOptions);

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
  if (!CONFIG.SMTP_USER || !CONFIG.SMTP_PASS) {
    console.warn("⚠️ SMTP credentials not configured. Skipping email for:", email);
    return { success: false, reason: "SMTP not configured" };
  }

  const monthName = new Date().toLocaleString("default", { month: "long", year: "numeric" });
  const rateColor = rate > 80 ? "#10b981" : rate > 50 ? "#f59e0b" : "#ef4444";

  const mailOptions = {
    from: `"HRMS Lite" <${CONFIG.SMTP_USER}>`,
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
    console.log(`✅ Attendance email sent to ${email} (messageId: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error(`❌ Failed to send attendance email to ${email}:`, error.message);
    if (error.code === 'EAUTH') {
      console.error("   → SMTP Authentication Error: Please check if App Password is correct and has no spaces.");
    }
    return { success: false, reason: error.message };
  }
};

/** Send welcome email to a newly onboarded employee */
export const sendWelcomeEmail = async (
  email: string,
  name: string,
  employeeId: string,
  department: string
) => {
  if (!CONFIG.SMTP_USER || !CONFIG.SMTP_PASS) {
    console.warn("⚠️ SMTP credentials not configured. Skipping welcome email for:", email);
    return { success: false, reason: "SMTP not configured" };
  }

  const mailOptions = {
    from: `"HRMS Lite" <${CONFIG.SMTP_USER}>`,
    to: email,
    subject: `👋 Welcome to the Team, ${name}!`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #111; max-width: 520px; margin: auto; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
        <!-- Header -->
        <div style="background: #111; color: #fff; padding: 32px;">
          <h1 style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.025em;">HRMS Lite</h1>
          <div style="margin-top: 24px; width: 40px; h-1px; background: #333;"></div>
        </div>
        
        <!-- Body -->
        <div style="padding: 40px 32px;">
          <h2 style="margin: 0 0 16px; font-size: 24px; font-weight: 900; letter-spacing: -0.015em;">Welcome aboard, ${name}!</h2>
          <p style="font-size: 15px; color: #555; margin: 0 0 24px; line-height: 1.6;">
            We're thrilled to have you join us. Your profile has been successfully created in the <strong>HRMS Lite</strong> platform.
          </p>

          <!-- Profile Details Card -->
          <div style="background: #fafafa; border: 1px solid #f0f0f0; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
            <p style="margin: 0 0 20px; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 700;">Your Onboarding Details</p>
            
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <div>
                <span style="font-size: 10px; color: #aaa; text-transform: uppercase; display: block; margin-bottom: 2px;">Employee ID</span>
                <span style="font-size: 14px; font-weight: 700; color: #111;">${employeeId}</span>
              </div>
              <div>
                <span style="font-size: 10px; color: #aaa; text-transform: uppercase; display: block; margin-bottom: 2px;">Department</span>
                <span style="font-size: 14px; font-weight: 700; color: #111;">${department}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #fafafa; border-top: 1px solid #f0f0f0; padding: 16px 32px;">
          <p style="margin: 0; font-size: 11px; color: #bbb; text-align: center;">
            This is an automated onboarding message from HRMS Lite.
          </p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${email} (messageId: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error(`❌ Failed to send welcome email to ${email}:`, error.message);
    return { success: false, reason: error.message };
  }
};
