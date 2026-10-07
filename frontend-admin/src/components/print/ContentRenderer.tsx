import React from "react";
import type { JSONContent } from "@tiptap/react";

import type { EditorData } from "../../types/editor";
import { TiptapRenderer } from "./TiptapRenderer";
import EditorRenderer from "./EditorRendered";

type Props = {
  data?: string | EditorData | JSONContent;
};

const isEditorJSContent = (
  data: EditorData | JSONContent,
): data is EditorData => {
  return "blocks" in data;
};

const ContentRendererWrapper: React.FC<Props> = ({ data }) => {
  if (!data) return null;

  let parsed: EditorData | JSONContent;

  if (typeof data === "string") {
    try {
      parsed = JSON.parse(data) as EditorData | JSONContent;
    } catch {
      return null;
    }
  } else {
    parsed = data;
  }

  if (isEditorJSContent(parsed)) {
    return <EditorRenderer data={parsed} />;
  }

  return <TiptapRenderer content={parsed} />;
};

export default ContentRendererWrapper;
