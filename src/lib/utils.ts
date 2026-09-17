import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Путь из public/ или полный URL — для <img src> с любой страницы сайта. */
export function resolvePublicAssetUrl(path: string): string {
  const trimmed = path.trim();
  if (!trimmed) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return trimmed.startsWith("/") ? trimmed : `/${trimmed.replace(/^\/+/, "")}`;
}
