export type EditorContent = {
  time?: number;
  blocks: EditorBlock[];
  version?: string;
};

export type EditorBlock = {
  type: string;
  data: {
    file?: {
      url?: string;
      id?: number;
    };
    imageId?: number;
    url?: string;
    [key: string]: unknown;
  };
};
