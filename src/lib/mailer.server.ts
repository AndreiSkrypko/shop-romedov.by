import nodemailer from "nodemailer";

import type { ApiLeadConfig } from "./api-config.server";

export type MailerConfig = {
  emailTo: string;
  emailFrom: string;
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser: string;
  smtpPass: string;
  telegramBotToken: string;
  telegramChatId: string;
};

export function mailerFromApiConfig(api: ApiLeadConfig): MailerConfig {
  return {
    emailTo: api.email_to,
    emailFrom: api.email_from,
    smtpHost: api.smtp_host,
    smtpPort: api.smtp_port,
    smtpSecure: api.smtp_secure,
    smtpUser: api.smtp_user,
    smtpPass: api.smtp_pass,
    telegramBotToken: api.telegram_bot_token,
    telegramChatId: api.telegram_chat_id,
  };
}

export function isSmtpConfigured(config: MailerConfig): boolean {
  return config.smtpHost.trim().length > 0;
}

export function isTelegramConfigured(config: MailerConfig): boolean {
  return config.telegramBotToken.trim().length > 0 && config.telegramChatId.trim().length > 0;
}

const DEV = process.env["NODE_ENV"] !== "production";

/** Почта и дубль в Telegram. На Hoster.by почта — через submit.php + mail(). */
export async function deliverLeadText(
  config: MailerConfig,
  options: { subject: string; text: string; replyTo?: string },
): Promise<void> {
  if (!isTelegramConfigured(config)) {
    throw new Error(
      "Укажите telegram_bot_token и telegram_chat_id в src/lib/lead-delivery.config.ts или public/api/config.php.",
    );
  }

  if (isSmtpConfigured(config)) {
    await sendMail(config, options);
  } else if (DEV) {
    console.info(`[romedov] Письмо (SMTP не задан, dev):\n${options.subject}\n${options.text}`);
  } else {
    throw new Error(
      "Укажите smtp_host в src/lib/lead-delivery.config.ts для отправки почты в dev-сервере.",
    );
  }

  await sendTelegramMessage(config, options.text);
}

export async function sendMail(
  config: MailerConfig,
  options: { subject: string; text: string; replyTo?: string },
): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpSecure,
    ...(config.smtpUser ? { auth: { user: config.smtpUser, pass: config.smtpPass } } : {}),
  });

  await transporter.sendMail({
    from: config.emailFrom,
    to: config.emailTo,
    subject: options.subject,
    text: options.text,
    ...(options.replyTo ? { replyTo: options.replyTo } : {}),
  });
}

/** Дубль в Telegram: сбой бота не должен ломать уже принятую заявку. */
export async function sendTelegramMessage(config: MailerConfig, text: string): Promise<void> {
  if (!config.telegramBotToken || !config.telegramChatId) return;

  const response = await fetch(
    `https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: config.telegramChatId, text }),
    },
  );

  if (!response.ok) {
    console.error("[telegram] sendMessage failed:", await response.text());
  }
}
