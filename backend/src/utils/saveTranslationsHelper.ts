import prisma from "../lib/db";

export async function saveTranslations(params: {
  aktualitaId: number;
  translationsObj: Record<
    string,
    { title?: string; text?: string; alt?: string }
  >;
  langIdMap: Record<string, number>;
}) {
  for (const [langCode, t] of Object.entries(params.translationsObj)) {
    if (!t.title && !t.text && !t.alt) continue;
    const jazyky_id = params.langIdMap[langCode];
    if (!jazyky_id) continue;
    await prisma.aktuality_preklady.create({
      data: {
        titulek: t.title ?? "",
        text: t.text ?? "",
        jazyky_id,
        aktuality_id: params.aktualitaId,
      },
    });
  }
}

export async function replaceTranslations(params: {
  listingId: number;
  translationsObj: Record<
    string,
    { title?: string; description?: any; details?: any }
  >;
  langIdMap: Record<string, number>;
}) {
  await prisma.inzeraty_preklady.deleteMany({
    where: { inzeraty_id: params.listingId },
  });
  for (const [langCode, t] of Object.entries(params.translationsObj)) {
    if (!t.title && !t.description && !t.details) continue;
    const jazyky_id = params.langIdMap[langCode];
    if (!jazyky_id) continue;
    await prisma.inzeraty_preklady.create({
      data: {
        titulek: t.title ?? "",
        popis: JSON.stringify(t.description),
        detaily: JSON.stringify(t.details),
        jazyky_id,
        inzeraty_id: params.listingId,
      },
    });
  }
}
