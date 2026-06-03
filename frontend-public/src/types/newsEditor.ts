export type ParagraphBlock = {
  id: string;
  type: "paragraph";
  data: {
    text: string;
    alignment: "left";
  };
};

export type HeaderBlock = {
  id: string;
  type: "header";
  data: {
    text: string;
    level: number;
    alignment?: string;
  };
};

export type ListItem = {
  content: string;
  meta?: Record<string, unknown>;
  items: ListItem[];
};

export type ListBlock = {
  id: string;
  type: "list";
  data: {
    style: "ordered" | "unordered";
    items: ListItem[];
  };
};

export type ImageBlock = {
  id: string;
  type: "image";
  data: {
    caption?: string;
    file: {
      id: number;
      url: string;
    };
  };
  tunes?: {
    imageTunePlus?: {
      width?: number;
      ratio?: number | null;
      align?: "left" | "center" | "right";
      rounded?: number;
    };
  };
};

export type EditorBlock = ParagraphBlock | HeaderBlock | ListBlock | ImageBlock;

export type NewsEditorData = {
  time: number;
  version: string;
  blocks: EditorBlock[];
};
