import prisma from "../../lib/db";
import { extractImageId } from "./url";

export async function processEditorImages(params: {
  translationsObj: Record<
    string,
    { title?: string; text?: string; alt?: string }
  >;
  aktualitaId: number;
  langIdMap: Record<string, number>;
}) {
  const { translationsObj, aktualitaId, langIdMap } = params;

  for (const [langCode, t] of Object.entries(translationsObj) as [
    string,
    { text?: string; alt?: string },
  ][]) {
    const jazyky_id = langIdMap[langCode];
    if (!jazyky_id || !t?.text) continue;

    let parsed;
    try {
      parsed = JSON.parse(t.text);
    } catch {
      continue;
    }

    for (const block of parsed.blocks || []) {
      if (block.type !== "image") continue;

      const imageId =
        block.data?.file?.id ?? extractImageId(block.data?.file?.url);

      if (!imageId) continue;

      const caption = block.data?.caption || null;

      await prisma.obrazky.update({
        where: { id: imageId },
        data: {
          is_temp: false,
          aktuality_id: aktualitaId,
        },
      });

      await prisma.obrazky_preklady.upsert({
        where: {
          jazyky_id_obrazky_id: {
            jazyky_id,
            obrazky_id: imageId,
          },
        },
        update: {
          caption,
          alt_text: t.alt ?? null,
        },
        create: {
          caption,
          alt_text: t.alt ?? null,
          jazyky_id,
          obrazky_id: imageId,
        },
      });
    }
  }
}
