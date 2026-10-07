import { Prisma } from "@prisma/client";
import prisma from "../lib/db.js";
import type { NewsTranslationInput } from "./parseTranslationsHelper.js";

export async function saveTranslations(params: {
  aktualitaId: number;
  translationsObj: Record<string, NewsTranslationInput>;
  langIdMap: Record<string, number>;
}) {
  for (const [langCode, t] of Object.entries(params.translationsObj)) {
    const jazyky_id = params.langIdMap[langCode];

    if (!jazyky_id) continue;

    if (!t.title && !t.text && !t.alt) continue;

    await prisma.aktuality_preklady.create({
      data: {
        titulek: t.title ?? "",
        text: t.text ?? Prisma.JsonNull,
        jazyky_id,
        aktuality_id: params.aktualitaId,
      },
    });
  }
}

export async function replaceTranslations(params: {
  tx: Prisma.TransactionClient;
  listingId: number;
  translationsObj: Record<
    string,
    { title?: string; description?: any; details?: any }
  >;
  langIdMap: Record<string, number>;
}) {
  await params.tx.inzeraty_preklady.deleteMany({
    where: { inzeraty_id: params.listingId },
  });
  for (const [langCode, t] of Object.entries(params.translationsObj)) {
    if (!t.title && !t.description && !t.details) continue;
    const jazyky_id = params.langIdMap[langCode];
    if (!jazyky_id) continue;
    await params.tx.inzeraty_preklady.create({
      data: {
        titulek: t.title ?? "",
        popis: t.description,
        detaily: t.details,
        jazyky_id,
        inzeraty_id: params.listingId,
      },
    });
  }
}
