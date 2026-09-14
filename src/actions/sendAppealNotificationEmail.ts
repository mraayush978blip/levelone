'use server';

import nodemailer from 'nodemailer';

export interface AppealNotificationPayload {
  studentName: string;
  studentEmail: string;
  rollNumber?: string;
  phaseNumber?: number;
  phaseTitle?: string;
  reason: string;
}

export async function sendAppealNotificationEmail(payload: AppealNotificationPayload) {
  const { studentName, studentEmail, rollNumber, phaseNumber, phaseTitle, reason } = payload;

  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('[AppealEmail] SMTP credentials missing, skipping appeal notification email.');
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
    const adminEmail = 'aayush@levelonedev.tech';

    const mailOptions = {
      from: `"LevelOne Alerts" <${sender}>`,
      to: adminEmail,
      replyTo: studentEmail,
      subject: `🚨 [New Appeal] Student Revoke Appeal: ${studentName || studentEmail}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 32px 24px; background-color: #0b0d13; color: #f3f4f6; border-radius: 16px; border: 1px solid #1f293d;">
          <!-- Badge -->
          <div style="margin-bottom: 20px;">
            <span style="display: inline-block; padding: 6px 14px; background-color: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.35); color: #f87171; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;">
              ⚠️ Revoke Appeal Request
            </span>
          </div>

          <h2 style="color: #ffffff; font-size: 22px; font-weight: 800; margin: 0 0 8px 0; letter-spacing: -0.02em;">
            A student has submitted an appeal
          </h2>
          <p style="color: #94a3b8; font-size: 14px; margin: 0 0 24px 0; line-height: 1.5;">
            An appeal has been lodged to restore access to the cohort after missing a deadline. Please review the details below:
          </p>

          <!-- Student Details Box -->
          <div style="background-color: #121826; border-radius: 12px; padding: 20px; border-left: 4px solid #ef4444; margin-bottom: 20px;">
            <div style="font-size: 11px; font-weight: 800; color: #f87171; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;">
              Student Information
            </div>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #e2e8f0;">
              <tr>
                <td style="padding: 4px 0; color: #94a3b8; width: 110px;">Name:</td>
                <td style="padding: 4px 0; font-weight: 600;">${studentName || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #94a3b8;">Email:</td>
                <td style="padding: 4px 0;"><a href="mailto:${studentEmail}" style="color: #60a5fa; text-decoration: none;">${studentEmail}</a></td>
              </tr>
              ${rollNumber ? `
              <tr>
                <td style="padding: 4px 0; color: #94a3b8;">Student ID:</td>
                <td style="padding: 4px 0;"><code style="background: #1e293d; padding: 2px 6px; border-radius: 4px; color: #38bdf8;">${rollNumber}</code></td>
              </tr>
              ` : ''}
              ${phaseNumber || phaseTitle ? `
              <tr>
                <td style="padding: 4px 0; color: #94a3b8;">Missed Phase:</td>
                <td style="padding: 4px 0; color: #fbbf24; font-weight: 600;">Phase ${phaseNumber ?? '?'}: ${phaseTitle || 'Missed Milestone'}</td>
              </tr>
              ` : ''}
            </table>
          </div>

          <!-- Reason Box -->
          <div style="background-color: #0f172a; border-radius: 12px; padding: 20px; border: 1px solid #1e293b; margin-bottom: 28px;">
            <div style="font-size: 11px; font-weight: 800; color: #60a5fa; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">
              Student's Appeal Reason
            </div>
            <p style="margin: 0; font-size: 14px; color: #e2e8f0; line-height: 1.6; white-space: pre-wrap; font-style: italic;">
              "${reason}"
            </p>
          </div>

          <!-- Admin Action CTA -->
          <div style="text-align: center; margin-bottom: 28px;">
            <a href="${appUrl}/admin/appeals" 
               style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 14px rgba(239, 68, 68, 0.4);">
              Open Appeals Dashboard →
            </a>
          </div>

          <hr style="margin: 24px 0 16px; border: 0; border-top: 1px solid #1f293d;" />

          <p style="font-size: 12px; color: #64748b; text-align: center; margin: 0; line-height: 1.5;">
            This is an automated alert from LevelOne Learning Platform.<br />
            Replies to this email will be directed to <a href="mailto:${studentEmail}" style="color: #60a5fa; text-decoration: none;">${studentEmail}</a>.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[AppealEmail] Alert sent to ${adminEmail} for appeal by ${studentEmail}`);
    return { success: true };
  } catch (error: any) {
    console.error(`[AppealEmail] Failed to send email to admin:`, error);
    return { success: false, error: error.message };
  }
}
