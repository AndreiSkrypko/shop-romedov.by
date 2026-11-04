/** ID контейнера Google Ads (gtag). */
export const GOOGLE_ADS_ID = "AW-18487539442";

/** «Звонки (загруженные)» / звонок с сайта — из настройки тега в Google Рекламе. */
export const GOOGLE_ADS_PHONE_CONVERSION = `${GOOGLE_ADS_ID}/EjFxCLfc17EdEPLtxe9E`;

/** Основной номер в E.164 — должен совпадать с тем, что на сайте (tel:+375339175773). */
export const GOOGLE_ADS_PHONE_E164 = "+375339175773";

/** Inline-инициализация gtag в <head> (базовый тег + отслеживание звонков с сайта). */
export function googleAdsGtagInlineScript(): string {
  return [
    "window.dataLayer=window.dataLayer||[];",
    "function gtag(){dataLayer.push(arguments);}",
    "gtag('js',new Date());",
    `gtag('config','${GOOGLE_ADS_ID}');`,
    `gtag('config','${GOOGLE_ADS_PHONE_CONVERSION}',{'phone_conversion_number':'${GOOGLE_ADS_PHONE_E164}'});`,
  ].join("");
}

export function trackGoogleAdsPhoneClick(): void {
  if (typeof window === "undefined") return;
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.("event", "conversion", { send_to: GOOGLE_ADS_PHONE_CONVERSION });
}
