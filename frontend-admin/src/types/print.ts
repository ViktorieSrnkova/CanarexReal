export type PictogramDTO = {
  id: number;
  translations: {
    jazyky_id: number;
    name: string | null;
  }[];
  iconSvg: string | null;
};
export const languageIds: Record<string, number> = {
  en: 1,
  cs: 2,
  sk: 3,
};
