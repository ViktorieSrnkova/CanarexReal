const API_URL = import.meta.env.ADMIN_URL;

export function toFullImageUrl(url?: string | null): string {
  if (!url) return "";

  if (url.startsWith("http")) return url;

  if (url.startsWith("blob:")) return "";

  return `${API_URL}${url}`;
}
