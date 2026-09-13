import nodemailer from "nodemailer";

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

export function getMailerConfig(): MailerConfig {
  const smtpHost = process.env["SMTP_HOST"] ?? "";

  if (!smtpHost) {
    throw new Error(
      "Не настроена отправка на почту: укажите SMTP_HOST (и SMTP_USER/SMTP_PASS при необходимости) в .env",
    );
  }

  return {
    emailTo: process.env["EMAIL_TO"] ?? "info@romedov.by",
    emailFrom: process.env["EMAIL_FROM"] ?? "noreply@romedov.by",
    smtpHost,
    smtpPort: Number(process.env["SMTP_PORT"] ?? "587"),
    smtpSecure: process.env["SMTP_SECURE"] === "true",
    smtpUser: process.env["SMTP_USER"] ?? "",
    smtpPass: process.env["SMTP_PASS"] ?? "",
    telegramBotToken: process.env["TELEGRAM_BOT_TOKEN"] ?? "",
    telegramChatId: process.env["TELEGRAM_CHAT_ID"] ?? "",
  };
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

  try {
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
  } catch (error) {
    console.error("[telegram] sendMessage threw:", error);
  }
}
