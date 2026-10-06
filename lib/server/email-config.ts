import fs from "fs/promises";
import path from "path";
import { getPortfolioData } from "@/lib/server/portfolio";

export interface EmailConfig {
  provider: "resend" | "smtp" | "none";
  toEmail: string;
  resendApiKey?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;
}

const CONFIG_FILE_PATH = path.join(process.cwd(), "data", "admin-config.json");

export async function getEmailConfig(): Promise<EmailConfig> {
  const portfolio = getPortfolioData();
  const defaultToEmail = portfolio.person.email || "abuhurairaconnects@gmail.com";

  let adminJson: Record<string, any> = {};
  try {
    const raw = await fs.readFile(CONFIG_FILE_PATH, "utf-8");
    adminJson = JSON.parse(raw);
  } catch {
    adminJson = {};
  }

  // Priority: 1. admin-config.json, 2. process.env
  const resendKey = adminJson.resendApiKey || process.env.RESEND_API_KEY || "";
  const smtpUser = adminJson.smtpUser || process.env.SMTP_USER || "";
  const smtpPass = adminJson.smtpPass || process.env.SMTP_PASS || "";
  const smtpHost = adminJson.smtpHost || process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = Number(adminJson.smtpPort || process.env.SMTP_PORT || 465);
  const toEmail = adminJson.notificationEmail || process.env.CONTACT_TO_EMAIL || defaultToEmail;

  let provider: "resend" | "smtp" | "none" = "none";
  if (adminJson.provider) {
    provider = adminJson.provider;
  } else if (resendKey) {
    provider = "resend";
  } else if (smtpUser && smtpPass) {
    provider = "smtp";
  }

  return {
    provider,
    toEmail,
    resendApiKey: resendKey,
    smtpHost,
    smtpPort,
    smtpUser,
    smtpPass,
  };
}

export async function saveEmailConfig(updated: Partial<EmailConfig>): Promise<void> {
  let existing: Record<string, any> = {};
  try {
    const raw = await fs.readFile(CONFIG_FILE_PATH, "utf-8");
    existing = JSON.parse(raw);
  } catch {
    existing = {};
  }

  if (updated.provider !== undefined) existing.provider = updated.provider;
  if (updated.toEmail !== undefined) existing.notificationEmail = updated.toEmail;
  if (updated.resendApiKey !== undefined) existing.resendApiKey = updated.resendApiKey;
  if (updated.smtpHost !== undefined) existing.smtpHost = updated.smtpHost;
  if (updated.smtpPort !== undefined) existing.smtpPort = updated.smtpPort;
  if (updated.smtpUser !== undefined) existing.smtpUser = updated.smtpUser;
  if (updated.smtpPass !== undefined) existing.smtpPass = updated.smtpPass;

  await fs.mkdir(path.dirname(CONFIG_FILE_PATH), { recursive: true });
  await fs.writeFile(CONFIG_FILE_PATH, JSON.stringify(existing, null, 2), "utf-8");
}
