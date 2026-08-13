import React from "react";

import EditorRenderer from "./EditorRendered";
import type { EditorData } from "../../types/print";

type Props = {
  data?: string | EditorData;
};

const EditorRendererWrapper: React.FC<Props> = ({ data }) => {
  if (!data) return null;

  const parsed: EditorData = typeof data === "string" ? JSON.parse(data) : data;

  return <EditorRenderer data={parsed} />;
};

export default EditorRendererWrapper;
