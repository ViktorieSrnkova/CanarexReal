import React, { useState } from "react";
import ContentRenderer from "../Editor/ContentRenderer";
import { useT } from "../../i18n";
import "../../styles/listing/expendableDescription.css";
import Button from "../General/Button";
import type { JSONContent } from "@tiptap/core";

type Props = {
  content: string | JSONContent;
};

export const ExpandableDescription: React.FC<Props> = ({ content }) => {
  const t = useT();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="description-wrapper expandable-desc">
      <h3>{t("listing.description")}</h3>

      <div className={expanded ? "det-content expanded" : "det-content"}>
        <ContentRenderer data={content} />
      </div>
      <div
        className="det-btn-group"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <Button variant="subtle" className="det-toggle-btn">
          {expanded && <div className="arrow arrow-up"></div>}
          {expanded ? t("listing.expanded") : t("listing.collapsed")}
          {!expanded && <div className="arrow arrow-down"></div>}
        </Button>
      </div>
    </div>
  );
};
