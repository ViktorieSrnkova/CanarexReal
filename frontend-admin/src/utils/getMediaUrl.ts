export function getMediaUrl(storageKey: string): string {
  const baseUrl = import.meta.env.VITE_MEDIA_URL;

  if (!baseUrl) {
    throw new Error("VITE_MEDIA_URL is not configured");
  }

  return `${baseUrl.replace(/\/$/, "")}/${storageKey}`;
}
