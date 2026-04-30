import type { Prisma } from "@prisma/client/extension";
import { convertBufferToWebP } from "./thumbnailMaker";
type alts = { lang: number; text: string };
export async function processGalleryImages(params: {
  tx: Prisma.TransactionClient;
  files: Express.Multer.File[] | Record<string, Express.Multer.File[]>;
  newImagesMeta: {
    tempId: string;
    order: number;
    alts: { lang: number; text: string }[];
  }[];
  listingId: number;
}) {
  const { tx, files, newImagesMeta, listingId } = params;

  const createdImages: { id: number; order: number }[] = [];
  const getFile = (
    files: Express.Multer.File[] | Record<string, Express.Multer.File[]>,
    key: string,
  ) => {
    if (Array.isArray(files)) {
      return files.find((f) => f.fieldname === key);
    }

    return files[key]?.[0];
  };
  for (const meta of newImagesMeta) {
    const file = getFile(files, meta.tempId);
    if (!file) continue;

    const webp = await convertBufferToWebP(file.buffer);

    const img = await tx.obrazky.create({
      data: {
        data: new Uint8Array(webp),
        inzeraty_id: listingId,
        poradi: meta.order,
        url: "",
        is_temp: false,
      },
    });

    await tx.obrazky.update({
      where: { id: img.id },
      data: {
        url: `/api/files/images/${img.id}`,
      },
    });

    for (const alt of meta.alts ?? []) {
      await tx.obrazky_preklady.upsert({
        where: {
          jazyky_id_obrazky_id: {
            jazyky_id: alt.lang,
            obrazky_id: img.id,
          },
        },
        update: { alt_text: alt.text },
        create: {
          jazyky_id: alt.lang,
          obrazky_id: img.id,
          alt_text: alt.text,
        },
      });
    }

    createdImages.push({
      id: img.id,
      order: meta.order,
    });
  }

  return createdImages;
}
