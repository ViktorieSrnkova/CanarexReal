export async function convertToWebP(file: File): Promise<File> {
  const img = document.createElement("img");
  const objectUrl = URL.createObjectURL(file);
  img.src = objectUrl;
  await img.decode();

  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);

  const blob: Blob = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b!), "image/webp", 0.8),
  );

  URL.revokeObjectURL(objectUrl);

  return new File([blob], file.name.replace(/\.\w+$/, ".webp"), {
    type: "image/webp",
  });
}
