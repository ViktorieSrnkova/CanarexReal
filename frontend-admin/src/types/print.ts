export interface PrintImage {
  id: number;
  poradi: number;
}

type ListItem = {
  content: string;
  meta?: Record<string, unknown>;
  items: ListItem[];
};

type ListBlock = {
  id: string;
  type: "list";
  data: {
    style: "ordered" | "unordered";
    meta?: Record<string, unknown>;
    items: ListItem[];
  };
};

type ParagraphBlock = {
  id: string;
  type: "paragraph";
  data: {
    text: string;
    alignment: "left";
  };
};

export type EditorData = {
  time?: number;
  version?: string;
  blocks: (ListBlock | ParagraphBlock)[];
};

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
