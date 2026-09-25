import { WAREHOUSE_COORDS } from "./contacts";
import { SITE_NAME, SITE_URL } from "./site";

type MetaTag =
  { title: string } | { name: string; content: string } | { property: string; content: string };

type SeoInput = {
  title: string;
  description: string;
  /** Путь без домена, например «/catalog». */
  path: string;
  keywords?: string;
};

export function buildSeo({ title, description, path, keywords }: SeoInput): {
  meta: MetaTag[];
  links: Array<{ rel: string; href: string }>;
} {
  const url = `${SITE_URL}${path}`;

  const meta: MetaTag[] = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:site_name", content: SITE_NAME },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];

  if (keywords) {
    meta.push({ name: "keywords", content: keywords });
  }

  return {
    meta,
    links: [{ rel: "canonical", href: url }],
  };
}

/** JSON-LD для встраивания через <script type="application/ld+json">. */
export function jsonLd(data: Record<string, unknown>): { __html: string } {
  return { __html: JSON.stringify(data) };
}

export const ORGANIZATION_LD: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  legalName: "ООО «Ромедов»",
  url: SITE_URL,
  telephone: "+375339175773",
  email: "info@romedov.by",
  address: {
    "@type": "PostalAddress",
    addressCountry: "BY",
    addressLocality: "Борисов",
    streetAddress: "ул. Нормандия-Неман, 167В",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: WAREHOUSE_COORDS.lat,
    longitude: WAREHOUSE_COORDS.lng,
  },
};
