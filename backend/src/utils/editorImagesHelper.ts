import prisma from "../lib/db.js";
import type { NewsTranslationInput } from "./parseTranslationsHelper.js";

export async function attachEditorImages(params: {
  mediaIds: number[];
  aktualitaId: number;
}) {
  if (params.mediaIds.length === 0) return;

  await prisma.obrazky.updateMany({
    where: {
      id: {
        in: params.mediaIds,
      },
      docasne: true,
    },
    data: {
      aktuality_id: params.aktualitaId,
      docasne: false,
      poradi: null,
    },
  });
}
export function parseMediaIds(value: string | undefined): number[] {
  if (!value) return [];

  const parsed: unknown = JSON.parse(value);

  if (!Array.isArray(parsed)) {
    throw new Error("Invalid editorMediaIds format");
  }

  return parsed.filter(
    (id): id is number =>
      typeof id === "number" && Number.isInteger(id) && id > 0,
  );
}

type JsonObject = {
  [key: string]: unknown;
};

export function extractEditorMediaIds(value: unknown): number[] {
  const ids = new Set<number>();

  const visit = (node: unknown): void => {
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }

    if (typeof node !== "object" || node === null) {
      return;
    }

    const object = node as JsonObject;

    if (object.type === "image") {
      const attrs = object.attrs;

      if (typeof attrs === "object" && attrs !== null) {
        const mediaId = (attrs as JsonObject).mediaId;

        if (
          typeof mediaId === "number" &&
          Number.isInteger(mediaId) &&
          mediaId > 0
        ) {
          ids.add(mediaId);
        }
      }
    }

    Object.values(object).forEach(visit);
  };

  visit(value);

  return [...ids];
}

export function extractAllEditorMediaIds(
  translationsObj: Record<string, NewsTranslationInput>,
): number[] {
  const ids = new Set<number>();

  for (const translation of Object.values(translationsObj)) {
    const translationIds = extractEditorMediaIds(translation.text);

    translationIds.forEach((id) => ids.add(id));
  }

  return [...ids];
}
