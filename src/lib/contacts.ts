export type ContactPhone = {
  display: string;
  href: string;
};

/** Первый номер — основной: он выводится в шапке и кнопках звонка. */
const PRIMARY_PHONE: ContactPhone = {
  display: "+375 33 911 84 84",
  href: "tel:+375339118484",
};

export const PHONES: ContactPhone[] = [
  PRIMARY_PHONE,
  { display: "+375 33 399 57 73", href: "tel:+375333995773" },
  { display: "+375 33 917 57 73", href: "tel:+375339175773" },
];

export const PHONE_DISPLAY = PRIMARY_PHONE.display;
export const PHONE_HREF = PRIMARY_PHONE.href;

export const EMAIL = "info@romedov.by";
export const EMAIL_HREF = `mailto:${EMAIL}`;
export const TELEGRAM_HREF = "https://t.me/+375339118484";
export const VIBER_HREF = "viber://chat?number=%2B375339118484";

export const ADDRESS_LEGAL =
  "Республика Беларусь, 220047, г. Минск, ул. Герасименко, д. 1А, кв. 168";
export const ADDRESS_PRODUCTION = "г. Борисов, ул. Нормандия-Неман, 167В";
export const ACCESS_NOTE = "Проезд на территорию осуществляется с ул. Яроша";
export const WORK_HOURS = "Пн–Пт 8:30–17:30, Сб 9:00–14:00";
export const UNP = "192 688 077";
