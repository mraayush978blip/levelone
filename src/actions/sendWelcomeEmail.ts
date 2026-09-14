'use server';

import nodemailer from 'nodemailer';

export async function sendWelcomeEmail(payload: {
  studentEmail: string;
  studentName: string;
  rollNumber?: string;
}) {
  const { studentEmail, studentName, rollNumber } = payload;

  if (!studentEmail) {
    return { success: false, error: 'Missing student email' };
  }

  // Debug Environment Variables
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('[WelcomeEmail] SMTP configuration missing, skipping welcome email.');
    return { success: false, error: 'SMTP configuration missing' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_PORT === '465',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://levelonedev.tech';
    const sender = process.env.SENDER_EMAIL || process.env.EMAIL_USER;

    const mailOptions = {
      from: `"LevelOne Dev" <${sender}>`,
      to: studentEmail,
      subject: `🚀 Welcome to LevelOne Web Development Cohort, ${studentName || 'Shinobi'}!`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background-color: #0b0d13; color: #f3f4f6; border-radius: 16px; border: 1px solid #1f293d;">
          <!-- Header Logo / Icon -->
          <div style="text-align: center; margin-bottom: 28px;">
            <div style="display: inline-block; width: 48px; height: 48px; line-height: 48px; border-radius: 12px; background-color: #2563eb; color: #ffffff; font-size: 24px; font-weight: bold; margin-bottom: 12px; box-shadow: 0 0 25px rgba(37,99,235,0.5);">
              &gt;_
            </div>
            <h1 style="color: #60a5fa; margin: 4px 0; font-size: 26px; font-weight: 900; letter-spacing: -0.03em;">
              Welcome to LevelOne!
            </h1>
            <p style="color: #94a3b8; font-size: 14px; margin: 0;">
              Your Full-Stack Web Development Engineering Journey Begins Now
            </p>
          </div>

          <p style="font-size: 16px; color: #e2e8f0; line-height: 1.6;">
            Hi <strong>${studentName || 'Developer'}</strong>,
          </p>

          <p style="font-size: 15px; color: #cbd5e1; line-height: 1.6;">
            Congratulations on enrolling! Your payment has been confirmed and your account is fully activated.
          </p>

          <!-- Student Credentials Box -->
          <div style="margin: 24px 0; padding: 20px; background-color: #121826; border-radius: 12px; border-left: 4px solid #3b82f6;">
            <div style="font-size: 11px; font-weight: 800; color: #60a5fa; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">
              Student Enrolment Details
            </div>
            <div style="font-size: 14px; color: #e2e8f0; margin-bottom: 6px;">
              👤 <strong>Name:</strong> ${studentName}
            </div>
            <div style="font-size: 14px; color: #e2e8f0; margin-bottom: 6px;">
              📧 <strong>Email:</strong> ${studentEmail}
            </div>
            ${rollNumber ? `
            <div style="font-size: 14px; color: #e2e8f0;">
              🆔 <strong>Student ID:</strong> <code style="background: #1e293b; padding: 2px 6px; border-radius: 4px; color: #38bdf8;">${rollNumber}</code>
            </div>
            ` : ''}
          </div>

          <!-- Key Platform Guidelines -->
          <div style="margin: 24px 0; padding: 20px; background-color: #0f172a; border-radius: 12px; border: 1px solid #1e293b;">
            <h3 style="margin: 0 0 12px; font-size: 15px; color: #f8fafc; font-weight: 700;">
              ⚡ How the Cohort Works:
            </h3>
            <ul style="margin: 0; padding-left: 20px; color: #94a3b8; font-size: 14px; line-height: 1.8;">
              <li><strong>Phase 1 Unlocked:</strong> Start with Phase 1 lessons and assignments immediately.</li>
              <li><strong>Progress-Driven:</strong> Each phase unlocks sequentially as you complete previous milestones.</li>
              <li><strong>20-Day Pacing:</strong> You have 20 days per phase to complete your challenges and submissions.</li>
              <li><strong>Top 3 Internships:</strong> Top 3 performers in the final cohort leaderboard compete for guaranteed internships!</li>
              <li><strong>Top 10 Refunds:</strong> Top 10 performers get an 80% course fee refund.</li>
            </ul>
          </div>

          <!-- Login CTA -->
          <div style="margin: 32px 0 24px; text-align: center;">
            <a href="${appUrl}/login" 
               style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);">
              Go to Student Dashboard →
            </a>
          </div>

          <hr style="margin: 32px 0 16px; border: 0; border-top: 1px solid #1f293d;" />

          <p style="font-size: 12px; color: #64748b; text-align: center; margin: 0; line-height: 1.5;">
            Need help or have questions? Reach out to us at <a href="mailto:aayush@levelonedev.tech" style="color: #60a5fa; text-decoration: none;">aayush@levelonedev.tech</a> or on the portal.<br />
            © 2026 LevelOne Web Development Cohort. All rights reserved.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[WelcomeEmail] Successfully sent welcome email to ${studentEmail}`);
    return { success: true };
  } catch (error: any) {
    console.error(`[WelcomeEmail] Failed to send email to ${studentEmail}:`, error);
    return { success: false, error: error.message };
  }
}
