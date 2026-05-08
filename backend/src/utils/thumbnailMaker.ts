import sharp from "sharp";

export const convertBufferToWebP = async (buffer: Buffer): Promise<Buffer> => {
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
