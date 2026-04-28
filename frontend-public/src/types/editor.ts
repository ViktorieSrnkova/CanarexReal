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
