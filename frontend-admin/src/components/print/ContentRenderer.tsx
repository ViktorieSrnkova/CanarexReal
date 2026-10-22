import React from "react";
import type { JSONContent } from "@tiptap/react";

import { TiptapRenderer } from "./TiptapRenderer";

type Props = {
  data?: string | JSONContent;
};

const ContentRendererWrapper: React.FC<Props> = ({ data }) => {
  if (!data) return null;

  let parsed: JSONContent;

  if (typeof data === "string") {
    try {
      parsed = JSON.parse(data) as JSONContent;
    } catch {
      return null;
    }
  } else {
    parsed = data;
  }

  return <TiptapRenderer content={parsed} />;
};

export default ContentRendererWrapper;
