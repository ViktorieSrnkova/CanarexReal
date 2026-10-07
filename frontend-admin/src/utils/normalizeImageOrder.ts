export const normalizeImageOrder = <T extends { mimeType: string }>(
  images: T[],
): T[] => {
  const reordered = [...images];

  if (reordered[0]?.mimeType.startsWith("video/")) {
    const video = reordered.shift();

    if (video) {
      reordered.splice(1, 0, video);
    }
  }

  return reordered;
};
