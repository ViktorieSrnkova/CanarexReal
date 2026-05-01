import prisma from "../lib/db.js";
import {
  convertBufferToThumbnail,
  convertBufferToWebP,
} from "./thumbnailMaker.js";

export async function processMainImage(params: {
  file?: Express.Multer.File | undefined;
  translationsObj: Record<string, { alt?: string }>;
  aktualitaId: number;
  langIdMap: Record<string, number>;
}) {
  const { file, translationsObj, aktualitaId, langIdMap } = params;

  if (!file) return;

  const mainBufferNode = await convertBufferToWebP(file.buffer);
  const thumbBufferNode = await convertBufferToThumbnail(file.buffer);

  const mainBuffer = new Uint8Array(mainBufferNode);
  const thumbBuffer = new Uint8Array(thumbBufferNode);

  const fullImage = await prisma.obrazky.create({
    data: {
      data: mainBuffer,
      is_temp: false,
      aktuality_id: aktualitaId,
      url: "",
      poradi: 1,
    },
  });

  const thumbImage = await prisma.obrazky.create({
    data: {
      data: thumbBuffer,
      is_temp: false,
      aktuality_id: aktualitaId,
      url: "",
      poradi: 0,
    },
  });

  await prisma.obrazky.update({
    where: { id: fullImage.id },
    data: { url: `/api/files/images/${fullImage.id}` },
  });

  await prisma.obrazky.update({
    where: { id: thumbImage.id },
    data: { url: `/api/files/images/${thumbImage.id}` },
  });

  for (const [langCode, t] of Object.entries(translationsObj) as [
    string,
    { alt?: string },
  ][]) {
    const jazyky_id = langIdMap[langCode];
    if (!jazyky_id || !t?.alt) continue;

    await prisma.obrazky_preklady.createMany({
      data: [
        { alt_text: t.alt, jazyky_id, obrazky_id: fullImage.id },
        { alt_text: t.alt, jazyky_id, obrazky_id: thumbImage.id },
      ],
    });
  }
}
