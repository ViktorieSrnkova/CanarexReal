import sharp from "sharp";

export const convertBufferToWebP = async (buffer: Buffer): Promise<Buffer> => {
  return sharp(buffer).webp({ quality: 80 }).toBuffer();
};

export const convertBufferToThumbnail = async (
  buffer: Buffer,
  width = 315,
  height = 218,
): Promise<Buffer> => {
  return sharp(buffer)
    .resize({ width, height })
    .webp({ quality: 80 })
    .toBuffer();
};
