export type ContactPhone = {
  display: string;
  href: string;
  /** Подпись на странице контактов и в футере */
  label?: string;
};

/** Основной номер — шапка, кнопки «Позвонить», мессенджеры. */
const PRIMARY_PHONE: ContactPhone = {
  display: "+375 33 917 57 73",
  href: "tel:+375339175773",
};

/** Три линии в футере и на /contacts (порядок: администрация → маркетинг → транспорт). */
export const PHONES: ContactPhone[] = [
  {
    label: "Администрация",
    display: "+375 33 911 84 84",
    href: "tel:+375339118484",
  },
  {
    label: "Магазин",
    display: "+375 33 917 57 73",
    href: "tel:+375339175773",
  },
  {
    label: "Транспорт",
    display: "+375 33 917 57 73",
    href: "tel:+375339175773",
  },
];

export const PHONE_DISPLAY = PRIMARY_PHONE.display;
export const PHONE_HREF = PRIMARY_PHONE.href;

export const EMAIL = "info@romedov.by";
export const EMAIL_HREF = `mailto:${EMAIL}`;
export const TELEGRAM_HREF = "https://t.me/+375339175773";
export const VIBER_HREF = "viber://chat?number=%2B375339175773";

export const ADDRESS_LEGAL =
  "Республика Беларусь, 220047, г. Минск, ул. Герасименко, д. 1А, кв. 168";
export const ADDRESS_PRODUCTION = "г. Борисов, ул. Нормандия-Неман, 167В";
/** Склад / самовывоз (WGS-84). */
export const WAREHOUSE_COORDS = {
  lat: 54.260141,
  lng: 28.511449,
} as const;
export const ACCESS_NOTE = "Проезд на территорию осуществляется с ул. Яроша";

/** Яндекс.Карты: ll и pt — долгота, широта. */
export function yandexMapsHref(
  coords: { lat: number; lng: number } = WAREHOUSE_COORDS,
): string {
  const { lat, lng } = coords;
  return `https://yandex.ru/maps/?ll=${lng}%2C${lat}&z=17&pt=${lng},${lat},pm2rdm`;
}

export function yandexMapEmbedSrc(
  coords: { lat: number; lng: number } = WAREHOUSE_COORDS,
): string {
  const { lat, lng } = coords;
  return `https://yandex.ru/map-widget/v1/?ll=${lng}%2C${lat}&z=17&pt=${lng},${lat},pm2rdm`;
}
export const WORK_HOURS = "Пн–Пт 8:30–17:30, Сб 9:00–14:00";
export const UNP = "192 688 077";
