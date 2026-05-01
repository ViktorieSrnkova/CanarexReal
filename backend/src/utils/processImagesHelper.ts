import type { Prisma } from "@prisma/client";
import {
  convertBufferToThumbnail,
  convertBufferToWebP,
} from "./thumbnailMaker";

export async function processAdImages(params: {
  tx: Prisma.TransactionClient;
  files: Express.Multer.File[];
  translationsObj: Record<string, { alt?: string }>;
  inzeratId: number;
  langIdMap: Record<string, number>;
}) {
  const { tx, files, translationsObj, inzeratId, langIdMap } = params;

  if (!files?.length) return;
  const createdImages: { id: number; order: number }[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file) continue;
    const bufferNode = await convertBufferToWebP(file.buffer);
    const buffer = new Uint8Array(bufferNode);

    const image = await tx.obrazky.create({
      data: {
        data: buffer,
        is_temp: false,
        inzeraty_id: inzeratId,
        url: "",
        poradi: i + 1,
      },
    });

    await tx.obrazky.update({
      where: { id: image.id },
      data: { url: `/api/files/images/${image.id}` },
    });

    createdImages.push({ id: image.id, order: i });
  }
  const first = files[0];

  if (first) {
    const thumbBufferNode = await convertBufferToThumbnail(first.buffer);
    const thumbBuffer = new Uint8Array(thumbBufferNode);

    const thumb = await tx.obrazky.create({
      data: {
        data: thumbBuffer,
        is_temp: false,
        inzeraty_id: inzeratId,
        url: "",
        poradi: 0,
      },
    });

    await tx.obrazky.update({
      where: { id: thumb.id },
      data: { url: `/api/files/images/${thumb.id}` },
    });

    createdImages.push({ id: thumb.id, order: -1 });
  }

  const thumb = createdImages.find((i) => i.order === -1);
  if (!thumb) return;

  for (const [langCode, t] of Object.entries(translationsObj)) {
    const jazyky_id = langIdMap[langCode];

    if (!jazyky_id || !t?.alt) continue;

    await tx.obrazky_preklady.create({
      data: {
        alt_text: t.alt,
        jazyky_id,
        obrazky_id: thumb.id,
      },
    });
  }
}
