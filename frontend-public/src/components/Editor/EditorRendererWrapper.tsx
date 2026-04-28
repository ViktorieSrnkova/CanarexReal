import React from "react";
import EditorRenderer from "./EditorjsRender";
import type { EditorData } from "../../types/editor";

type Props = {
  data?: string | EditorData;
};

const EditorRendererWrapper: React.FC<Props> = ({ data }) => {
  if (!data) return null;

  const parsed: EditorData = typeof data === "string" ? JSON.parse(data) : data;

  return <EditorRenderer data={parsed} />;
};

export default EditorRendererWrapper;
