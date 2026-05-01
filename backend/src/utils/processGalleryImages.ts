import type { Prisma } from "@prisma/client/extension";
import { convertBufferToWebP } from "./thumbnailMaker.js";

type Alts = { lang: number; text: string };

type NewImageMeta = {
  tempId: string;
  order: number;
  alts: Alts[];
};

type GalleryFiles =
  | Express.Multer.File[]
  | Record<string, Express.Multer.File[]>;

type PreparedGalleryImage = {
  order: number;
  alts: Alts[];
  data: Uint8Array;
};

const getFile = (files: GalleryFiles, key: string) => {
  if (Array.isArray(files)) {
    return files.find((file) => file.fieldname === key);
  }

  return files[key]?.[0];
};

export async function prepareGalleryImages(params: {
  files: GalleryFiles;
  newImagesMeta: NewImageMeta[];
}) {
  const { files, newImagesMeta } = params;
  const preparedImages: PreparedGalleryImage[] = [];

  for (const meta of newImagesMeta) {
    const file = getFile(files, meta.tempId);
    if (!file) continue;

    const webp = await convertBufferToWebP(file.buffer);

    preparedImages.push({
      order: meta.order,
      alts: meta.alts ?? [],
      data: new Uint8Array(webp),
    });
  }

  return preparedImages;
}

export async function processGalleryImages(params: {
  tx: Prisma.TransactionClient;
  preparedImages: PreparedGalleryImage[];
  listingId: number;
}) {
  const { tx, preparedImages, listingId } = params;

  const createdImages: { id: number; order: number }[] = [];

  for (const image of preparedImages) {
    const img = await tx.obrazky.create({
      data: {
        data: image.data,
        inzeraty_id: listingId,
        poradi: image.order,
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

    for (const alt of image.alts ?? []) {
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
      order: image.order,
    });
  }

  return createdImages;
}
