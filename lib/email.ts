import { Resend } from "resend";
import nodemailer from "nodemailer";
import { getEmailConfig } from "@/lib/server/email-config";

export interface SendEmailPayload {
  name: string;
  email: string;
  message: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

function buildHtmlTemplate(name: string, email: string, message: string, isTest: boolean = false): string {
  const dateStr = new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" });
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f17; color: #f8fafc; margin: 0; padding: 24px; }
          .container { max-width: 600px; margin: 0 auto; background: #111827; border: 1px solid #1f2937; border-radius: 16px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 24px 32px; color: #ffffff; }
          .header h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.5px; }
          .header p { margin: 6px 0 0 0; font-size: 13px; opacity: 0.9; }
          .body { padding: 32px; }
          .info-block { background: #1a2234; border: 1px solid #2d3748; border-radius: 12px; padding: 16px 20px; margin-bottom: 24px; }
          .info-row { display: flex; margin-bottom: 8px; font-size: 14px; }
          .info-row:last-child { margin-bottom: 0; }
          .label { color: #94a3b8; font-weight: 500; width: 100px; shrink: 0; }
          .val { color: #f8fafc; font-weight: 600; }
          .val a { color: #f97316; text-decoration: none; }
          .message-box { background: #0f172a; border-left: 4px solid #f97316; padding: 20px; border-radius: 0 12px 12px 0; color: #e2e8f0; font-size: 15px; line-height: 1.6; white-space: pre-wrap; }
          .footer { padding: 20px 32px; border-top: 1px solid #1f2937; text-align: center; font-size: 12px; color: #64748b; }
          .button { display: inline-block; background: #f97316; color: #ffffff !important; font-weight: 600; font-size: 14px; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 24px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${isTest ? "Portfolio Email System — Test Verification" : "New Portfolio Message Received"}</h1>
            <p>${isTest ? "Verification test message from your Admin Panel" : "Direct inquiry via your portfolio contact form"}</p>
          </div>
          <div class="body">
            <div class="info-block">
              <div class="info-row">
                <span class="label">Sender:</span>
                <span class="val">${name}</span>
              </div>
              <div class="info-row">
                <span class="label">Email:</span>
                <span class="val"><a href="mailto:${email}">${email}</a></span>
              </div>
              <div class="info-row">
                <span class="label">Date/Time:</span>
                <span class="val">${dateStr} (Dhaka Time)</span>
              </div>
            </div>

            <div style="font-size: 13px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
              ${isTest ? "System Test Information" : "Project Requirements & Message"}
            </div>
            <div class="message-box">${message}</div>

            <div style="text-align: center;">
              <a href="mailto:${email}?subject=Re: Your Inquiry" class="button">Reply directly to ${name}</a>
            </div>
          </div>
          <div class="footer">
            Delivered securely to your portfolio inbox &bull; Engineered with Next.js
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function sendContactEmail(payload: SendEmailPayload): Promise<SendEmailResult> {
  const config = await getEmailConfig();
  const { name, email, message } = payload;
  const rawTo = config.toEmail || "abuhuraira.connects@gmail.com";
  // Ensure Resend validation passes for abuhuraira.connects@gmail.com
  const toEmail = rawTo.replace("abuhurairaconnects@gmail.com", "abuhuraira.connects@gmail.com");

  // 1. Try Resend if configured
  if (config.resendApiKey && (config.provider === "resend" || config.provider === "none")) {
    try {
      const resend = new Resend(config.resendApiKey);
      const data = await resend.emails.send({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: [toEmail],
        replyTo: email,
        subject: `New inquiry from ${name} (Portfolio)`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: buildHtmlTemplate(name, email, message, false),
      });

      if (data.error) {
        console.warn("[Email Delivery] Resend reported error:", data.error.message);
        // If Resend failed, don't crash, attempt fallback or return result
        return { success: false, error: data.error.message };
      }

      return { success: true, messageId: data.data?.id };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Resend dispatch failed";
      console.warn("[Email Delivery] Resend exception:", msg);
      return { success: false, error: msg };
    }
  }

  // 2. Try SMTP / Nodemailer if configured
  if (config.smtpUser && config.smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: config.smtpHost || "smtp.gmail.com",
        port: config.smtpPort || 465,
        secure: config.smtpPort === 465,
        auth: {
          user: config.smtpUser,
          pass: config.smtpPass,
        },
      });

      const info = await transporter.sendMail({
        from: `"Portfolio Contact" <${config.smtpUser}>`,
        to: toEmail,
        replyTo: email,
        subject: `New inquiry from ${name} (Portfolio)`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: buildHtmlTemplate(name, email, message, false),
      });

      return { success: true, messageId: info.messageId };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "SMTP dispatch failed";
      console.warn("[Email Delivery] SMTP exception:", msg);
      return { success: false, error: msg };
    }
  }

  // 3. Fallback when no email key is configured yet:
  console.warn("[Warning] No email API key (Resend or Gmail SMTP) configured. Logged to console and saved to Admin Inbox.");
  console.info(`[Contact Message] From: ${name} <${email}>\n${message}`);

  return {
    success: true,
    messageId: "stored-in-inbox-" + Date.now(),
  };
}

export async function sendTestEmail(targetEmail?: string): Promise<SendEmailResult> {
  const config = await getEmailConfig();
  const toEmail = targetEmail || config.toEmail || "abuhurairaconnects@gmail.com";

  if (!config.resendApiKey && !(config.smtpUser && config.smtpPass)) {
    return {
      success: false,
      error: "No email service configured. Please provide a Resend API Key or Gmail App Password first.",
    };
  }

  const testPayload: SendEmailPayload = {
    name: "System Diagnostic",
    email: toEmail,
    message: "Congratulations! Your portfolio email notification system is configured properly and working 100%. Any future messages submitted on your website will be delivered directly to this email address.",
  };

  return sendContactEmail(testPayload);
}
