'use server';

import nodemailer from 'nodemailer';

export async function sendPhaseUnlockEmail(payload: {
  studentEmail: string;
  studentName: string;
  unlockedPhase: {
    phase_number: number;
    title: string;
    description?: string;
    end_date?: string;
  };
}) {
  const { studentEmail, studentName, unlockedPhase } = payload;

  if (!studentEmail || !unlockedPhase) {
    return { success: false, error: 'Missing required parameters' };
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://l1webdev.vercel.app';
  const deadlineText = unlockedPhase.end_date
    ? new Date(unlockedPhase.end_date).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Check portal';

  const mailOptions = {
    from: `"Levelone Platform" <${process.env.SENDER_EMAIL || process.env.EMAIL_USER}>`,
    to: studentEmail,
    subject: `🚀 Phase ${unlockedPhase.phase_number} Unlocked: ${unlockedPhase.title}!`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background-color: #0b0d13; color: #f3f4f6; border-radius: 16px; border: 1px solid #1f293d;">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="font-size: 32px;">⚡</span>
          <h1 style="color: #60a5fa; margin: 8px 0 4px; font-size: 24px; font-weight: 800; letter-spacing: -0.03em;">New Phase Unlocked!</h1>
          <p style="color: #94a3b8; font-size: 14px; margin: 0;">You've conquered the previous challenge ahead of time.</p>
        </div>

        <p style="font-size: 15px; color: #e2e8f0; line-height: 1.6;">Hi <strong>${studentName || 'Learner'}</strong>,</p>

        <p style="font-size: 15px; color: #cbd5e1; line-height: 1.6;">
          Fantastic job! Having completed your previous assignment, your next mission is now live and available immediately:
        </p>

        <div style="margin: 24px 0; padding: 20px; background-color: #121826; border-radius: 12px; border-left: 4px solid #3b82f6;">
          <div style="font-size: 11px; font-weight: 800; color: #60a5fa; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px;">Phase ${unlockedPhase.phase_number}</div>
          <div style="font-size: 18px; font-weight: 700; color: #ffffff; margin-bottom: 8px;">${unlockedPhase.title}</div>
          ${
            unlockedPhase.description
              ? `<p style="font-size: 14px; color: #94a3b8; margin: 0 0 12px; line-height: 1.5;">${unlockedPhase.description}</p>`
              : ''
          }
          <div style="font-size: 12px; color: #e2e8f0; font-weight: 600;">
            ⏳ Deadline: <span style="color: #fbbf24;">${deadlineText}</span>
          </div>
        </div>

        <p style="font-size: 14px; color: #94a3b8; line-height: 1.6;">
          You don't have to wait. Dive in now, watch the video tutorials, and keep your streak alive!
        </p>

        <div style="margin: 32px 0 24px; text-align: center;">
          <a href="${appUrl}/student" 
             style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);">
            Enter Phase ${unlockedPhase.phase_number} →
          </a>
        </div>

        <hr style="margin: 32px 0 16px; border: 0; border-top: 1px solid #1f293d;" />

        <p style="font-size: 11px; color: #64748b; text-align: center; margin: 0;">
          Levelone Learning Architecture • Automated Progression Notification
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error: any) {
    console.error(`[sendPhaseUnlockEmail] Failed to send email to ${studentEmail}:`, error);
    return { success: false, error: error.message };
  }
}
