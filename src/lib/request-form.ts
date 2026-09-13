export const REQUEST_MAX_FILE_BYTES = 10 * 1024 * 1024;

export const REQUEST_ALLOWED_EXTENSIONS = [
  "pdf",
  "dxf",
  "dwg",
  "zip",
  "rar",
  "7z",
  "png",
  "jpg",
  "jpeg",
  "stp",
  "step",
] as const;

export const REQUEST_ACCEPT = REQUEST_ALLOWED_EXTENSIONS.map((ext) => `.${ext}`).join(",");

export function isAllowedRequestFile(file: File): boolean {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return (REQUEST_ALLOWED_EXTENSIONS as readonly string[]).includes(ext);
}

export function formatRequestFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}
