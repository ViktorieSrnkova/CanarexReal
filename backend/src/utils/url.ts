export function extractImageId(url?: string) {
  if (!url) return null;
  const match = url.match(/\/api\/files\/images\/(\d+)/);
  return match ? Number(match[1]) : null;
}
