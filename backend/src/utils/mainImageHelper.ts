import prisma from "../lib/db.js";
import type { NewsTranslationInput } from "./parseTranslationsHelper.js";

export async function attachMainImage(params: {
  imageId: number;
  aktualitaId: number;
}) {
  await prisma.obrazky.update({
    where: {
      id: params.imageId,
    },
    data: {
      aktuality_id: params.aktualitaId,
      docasne: false,
      poradi: 0,
    },
  });
}

export async function saveMainImageAlts(params: {
  imageId: number;
  translationsObj: Record<string, NewsTranslationInput>;
  langIdMap: Record<string, number>;
}) {
  for (const [langCode, translation] of Object.entries(
    params.translationsObj,
  )) {
    const jazyky_id = params.langIdMap[langCode];

    if (!jazyky_id) continue;

    await prisma.obrazky_preklady.upsert({
      where: {
        jazyky_id_obrazky_id: {
          jazyky_id,
          obrazky_id: params.imageId,
        },
      },
      update: {
        alt_text: translation.alt ?? null,
      },
      create: {
        alt_text: translation.alt ?? null,
        jazyky_id,
        obrazky_id: params.imageId,
      },
    });
  }
}
