/**
 * Настройки заявок и заказов (почта + Telegram). Без .env.
 * Заполните telegram_* и smtp_* для npm run dev.
 * При сборке значения копируются в dist/api/config.json для submit.php на Hoster.by.
 */
export const LEAD_DELIVERY = {
  email_to: "info@romedov.by",
  email_from: "noreply@romedov.by",
  telegram_bot_token: "",
  telegram_chat_id: "",
  smtp_host: "",
  smtp_port: 587,
  smtp_secure: false,
  smtp_user: "",
  smtp_pass: "",
} as const;

export type LeadDeliveryConfig = {
  email_to: string;
  email_from: string;
  telegram_bot_token: string;
  telegram_chat_id: string;
  smtp_host: string;
  smtp_port: number;
  smtp_secure: boolean;
  smtp_user: string;
  smtp_pass: string;
};

export function leadDeliveryConfigToApi(): LeadDeliveryConfig {
  return {
    email_to: LEAD_DELIVERY.email_to,
    email_from: LEAD_DELIVERY.email_from,
    telegram_bot_token: LEAD_DELIVERY.telegram_bot_token,
    telegram_chat_id: LEAD_DELIVERY.telegram_chat_id,
    smtp_host: LEAD_DELIVERY.smtp_host,
    smtp_port: LEAD_DELIVERY.smtp_port,
    smtp_secure: LEAD_DELIVERY.smtp_secure,
    smtp_user: LEAD_DELIVERY.smtp_user,
    smtp_pass: LEAD_DELIVERY.smtp_pass,
  };
}
