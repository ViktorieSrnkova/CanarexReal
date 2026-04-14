import prisma from "../../lib/db";

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
