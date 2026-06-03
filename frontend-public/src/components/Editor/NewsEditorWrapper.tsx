import React from "react";
import EditorRenderer from "./NewsEditorRenderer";
import type { NewsEditorData } from "../../types/newsEditor";

type Props = {
  data?: string | NewsEditorData;
};

const EditorRendererWrapper: React.FC<Props> = ({ data }) => {
  if (!data) return null;

  const parsed = typeof data === "string" ? JSON.parse(data) : data;

  return <EditorRenderer data={parsed} />;
};

export default EditorRendererWrapper;
