export const LANGS = [
  { id: 2, label: "CZ" },
  { id: 1, label: "EN" },
  { id: 3, label: "SK" },
];
export type newImage = {
  id: number;
  order: number;
  alts: { lang: number; text: string }[];
};
export type existingImage = {
  id: number;
  order: number;
  alts: { lang: number; text: string }[];
};

export type GallerySavePayload = {
  listingId: number;
  existingImages: existingImage[];
  newImages: newImage[];
  removedImageIds: number[];
};
export type LocalImage =
  | {
      kind: "existing";
      id: number;
      url: string;
      order: number;
      mimeType: string;
      alts: { lang: number; text: string }[];
    }
  | {
      kind: "new";
      tempId: string;
      id?: number;
      file: File;
      url: string;
      order: number;
      mimeType: string;
      alts: { lang: number; text: string }[];
    };
