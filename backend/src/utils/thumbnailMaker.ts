import sharp from "sharp";

export const convertBufferToWebP = async (buffer: Buffer): Promise<Buffer> => {
  const metadata = await sharp(buffer).metadata();

  if (metadata.format === "webp") {
    return buffer;
  }

  return sharp(buffer).webp({ quality: 100 }).toBuffer();
};

export const convertBufferToThumbnail = async (
  buffer: Buffer,
  width = 400,
  height = 276,
): Promise<Buffer> => {
  return sharp(buffer)
    .resize({ width, height })
    .webp({ quality: 100 })
    .toBuffer();
};
